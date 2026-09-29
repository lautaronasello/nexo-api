import { PrismaService } from '../prisma/prisma.service';
import { SettlementCalculatorService } from './services/settlement-calculator.service';
import { CalculateSettlementDto } from './dto/calculate-settlement.dto';
export declare class SettlementsService {
    private readonly prisma;
    private readonly calculator;
    constructor(prisma: PrismaService, calculator: SettlementCalculatorService);
    calculatePreview(dto: CalculateSettlementDto): import("./interfaces/settlement-calculation.interface").SettlementCalculationResult;
    findById(id: string): Promise<{
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
    } & {
        id: string;
        createdAt: Date;
        merchantId: string;
        transactionId: string;
        amountNet: import("@prisma/client/runtime/library").Decimal;
        feeApplied: import("@prisma/client/runtime/library").Decimal;
        taxApplied: import("@prisma/client/runtime/library").Decimal;
        scheduledPayoutDate: Date;
        status: import(".prisma/client").$Enums.SettlementStatus;
    }>;
    findByMerchantId(merchantId: string): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        merchantId: string;
        transactionId: string;
        amountNet: import("@prisma/client/runtime/library").Decimal;
        feeApplied: import("@prisma/client/runtime/library").Decimal;
        taxApplied: import("@prisma/client/runtime/library").Decimal;
        scheduledPayoutDate: Date;
        status: import(".prisma/client").$Enums.SettlementStatus;
    })[]>;
}
