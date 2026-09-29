import { PaymentMethod } from '@prisma/client';
export declare class CreateTransactionDto {
    merchantId: string;
    amountGross: number;
    paymentMethod: PaymentMethod;
    idempotencyKey: string;
    immediateWithPenalty?: boolean;
}
