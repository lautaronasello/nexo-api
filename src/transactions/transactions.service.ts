import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TransactionStatus, SettlementStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SettlementCalculatorService } from '../settlements/services/settlement-calculator.service';
import { SETTLEMENT_QUEUE } from '../queues/queue.module';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { SettlementJobData } from '../settlements/processors/settlement.processor';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly settlementCalculator: SettlementCalculatorService,
    @InjectQueue(SETTLEMENT_QUEUE)
    private readonly settlementQueue: Queue<SettlementJobData>,
  ) {}

  async create(dto: CreateTransactionDto) {
    const {
      merchantId,
      amountGross,
      paymentMethod,
      idempotencyKey,
      immediateWithPenalty,
    } = dto;

    // 1. Verify merchant exists
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new NotFoundException(
        `Merchant with ID "${merchantId}" not found.`,
      );
    }

    // 2. Check idempotency key uniqueness
    const existingTx = await this.prisma.transaction.findUnique({
      where: { idempotencyKey },
    });

    if (existingTx) {
      throw new ConflictException(
        `Transaction with idempotency key "${idempotencyKey}" already processed.`,
      );
    }

    // 3. Calculate settlement deterministic details
    const calculation = this.settlementCalculator.calculate({
      amountGross,
      paymentMethod,
      immediateWithPenalty,
    });

    // 4. Atomic database transaction: Save Transaction, Settlement, and update Merchant pending balance
    const result = await this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          merchantId,
          amountGross: calculation.amountGross,
          paymentMethod,
          status: TransactionStatus.PENDING,
          idempotencyKey,
        },
      });

      const settlement = await tx.settlement.create({
        data: {
          transactionId: transaction.id,
          merchantId,
          amountNet: calculation.amountNet,
          feeApplied: calculation.feeApplied,
          taxApplied: calculation.taxApplied,
          scheduledPayoutDate: calculation.scheduledPayoutDate,
          status: SettlementStatus.PENDING,
        },
      });

      await tx.merchant.update({
        where: { id: merchantId },
        data: {
          pendingBalance: { increment: calculation.amountGross },
        },
      });

      return { transaction, settlement };
    });

    // 5. Calculate queue delay in milliseconds
    const now = Date.now();
    const scheduledTime = calculation.scheduledPayoutDate.getTime();
    const delay = Math.max(0, scheduledTime - now);

    // 6. Dispatch BullMQ Job for async settlement execution
    const job = await this.settlementQueue.add(
      'process-settlement',
      {
        settlementId: result.settlement.id,
        transactionId: result.transaction.id,
        merchantId,
      },
      {
        delay,
        jobId: result.settlement.id, // Enforce queue job uniqueness
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    this.logger.log(
      `Dispatched settlement Job [ID: ${job.id}] with delay of ${delay}ms for Settlement ${result.settlement.id}`,
    );

    return {
      message: 'Transaction successfully created and settlement scheduled.',
      transaction: result.transaction,
      settlement: result.settlement,
      breakdown: {
        feePercentage: calculation.feePercentage,
        taxRate: calculation.taxRate,
        payoutDelay: calculation.payoutDelayHoursOrDays,
        scheduledPayoutDate: calculation.scheduledPayoutDate,
        queueDelayMs: delay,
      },
    };
  }

  async findOne(id: string) {
    const tx = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        settlement: true,
        merchant: true,
      },
    });

    if (!tx) {
      throw new NotFoundException(`Transaction with ID "${id}" not found.`);
    }

    return tx;
  }

  async findByMerchantId(merchantId: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new NotFoundException(
        `Merchant with ID "${merchantId}" not found.`,
      );
    }

    return this.prisma.transaction.findMany({
      where: { merchantId },
      include: {
        settlement: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
