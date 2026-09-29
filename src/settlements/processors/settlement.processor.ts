import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { SETTLEMENT_QUEUE } from '../../queues/queue.module';
import { TransactionStatus, SettlementStatus } from '@prisma/client';

export interface SettlementJobData {
  settlementId: string;
  transactionId: string;
  merchantId: string;
}

@Processor(SETTLEMENT_QUEUE)
export class SettlementProcessor extends WorkerHost {
  private readonly logger = new Logger(SettlementProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<SettlementJobData>): Promise<void> {
    const { settlementId, transactionId, merchantId } = job.data;

    this.logger.log(
      `Processing settlement job [${job.id}] for Settlement ID: ${settlementId}, Transaction ID: ${transactionId}`,
    );

    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. Fetch settlement and verify status for idempotency
        const settlement = await tx.settlement.findUnique({
          where: { id: settlementId },
          include: { transaction: true },
        });

        if (!settlement) {
          throw new Error(`Settlement with ID ${settlementId} not found.`);
        }

        if (settlement.status === SettlementStatus.COMPLETED) {
          this.logger.warn(
            `Settlement ${settlementId} is already COMPLETED. Skipping.`,
          );
          return;
        }

        const amountGross = settlement.transaction.amountGross;
        const amountNet = settlement.amountNet;

        // 2. Update Transaction status to SETTLED
        await tx.transaction.update({
          where: { id: transactionId },
          data: { status: TransactionStatus.SETTLED },
        });

        // 3. Update Settlement status to COMPLETED
        await tx.settlement.update({
          where: { id: settlementId },
          data: { status: SettlementStatus.COMPLETED },
        });

        // 4. Update Merchant balances atomically
        await tx.merchant.update({
          where: { id: merchantId },
          data: {
            pendingBalance: { decrement: amountGross },
            availableBalance: { increment: amountNet },
          },
        });
      });

      this.logger.log(
        `Successfully settled Settlement ID: ${settlementId}. Merchant ${merchantId} available balance updated.`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to execute settlement transaction for Settlement ID: ${settlementId}`,
        error instanceof Error ? error.stack : error,
      );
      throw error;
    }
  }
}
