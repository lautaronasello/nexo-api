import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { SettlementCalculatorService } from '../settlements/services/settlement-calculator.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { SettlementJobData } from '../settlements/processors/settlement.processor';
export declare class TransactionsService {
    private readonly prisma;
    private readonly settlementCalculator;
    private readonly settlementQueue;
    private readonly logger;
    constructor(prisma: PrismaService, settlementCalculator: SettlementCalculatorService, settlementQueue: Queue<SettlementJobData>);
    create(dto: CreateTransactionDto): Promise<{
        message: string;
        transaction: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amountGross: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            merchantId: string;
            idempotencyKey: string;
            status: import(".prisma/client").$Enums.TransactionStatus;
        };
        settlement: {
            id: string;
            createdAt: Date;
            merchantId: string;
            transactionId: string;
            amountNet: import("@prisma/client/runtime/library").Decimal;
            feeApplied: import("@prisma/client/runtime/library").Decimal;
            taxApplied: import("@prisma/client/runtime/library").Decimal;
            scheduledPayoutDate: Date;
            status: import(".prisma/client").$Enums.SettlementStatus;
        };
        breakdown: {
            feePercentage: number;
            taxRate: number;
            payoutDelay: string;
            scheduledPayoutDate: Date;
            queueDelayMs: number;
        };
    }>;
    findOne(id: string): Promise<{
        merchant: {
            businessName: string;
            cuit: string;
            email: string;
            id: string;
            availableBalance: import("@prisma/client/runtime/library").Decimal;
            pendingBalance: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
            updatedAt: Date;
        };
        settlement: {
            id: string;
            createdAt: Date;
            merchantId: string;
            transactionId: string;
            amountNet: import("@prisma/client/runtime/library").Decimal;
            feeApplied: import("@prisma/client/runtime/library").Decimal;
            taxApplied: import("@prisma/client/runtime/library").Decimal;
            scheduledPayoutDate: Date;
            status: import(".prisma/client").$Enums.SettlementStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amountGross: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        merchantId: string;
        idempotencyKey: string;
        status: import(".prisma/client").$Enums.TransactionStatus;
    }>;
    findByMerchantId(merchantId: string): Promise<({
        settlement: {
            id: string;
            createdAt: Date;
            merchantId: string;
            transactionId: string;
            amountNet: import("@prisma/client/runtime/library").Decimal;
            feeApplied: import("@prisma/client/runtime/library").Decimal;
            taxApplied: import("@prisma/client/runtime/library").Decimal;
            scheduledPayoutDate: Date;
            status: import(".prisma/client").$Enums.SettlementStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amountGross: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        merchantId: string;
        idempotencyKey: string;
        status: import(".prisma/client").$Enums.TransactionStatus;
    })[]>;
}
