import { PaymentMethod } from '@prisma/client';
export interface SettlementCalculationInput {
    amountGross: number;
    paymentMethod: PaymentMethod;
    immediateWithPenalty?: boolean;
}
export interface SettlementCalculationResult {
    amountGross: number;
    amountNet: number;
    feeApplied: number;
    taxApplied: number;
    feePercentage: number;
    taxRate: number;
    scheduledPayoutDate: Date;
    payoutDelayHoursOrDays: string;
}
