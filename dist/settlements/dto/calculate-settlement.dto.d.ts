import { PaymentMethod } from '@prisma/client';
export declare class CalculateSettlementDto {
    amountGross: number;
    paymentMethod: PaymentMethod;
    immediateWithPenalty?: boolean;
}
