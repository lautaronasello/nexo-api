import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID of the target merchant',
    example: 'd3b07384-d113-46a6-a719-74d71510d540',
  })
  @IsUUID()
  @IsNotEmpty()
  merchantId: string;

  @ApiProperty({ description: 'Gross transaction amount', example: 15000.5 })
  @IsNumber()
  @IsPositive()
  amountGross: number;

  @ApiProperty({
    description: 'Payment method used',
    enum: PaymentMethod,
    example: PaymentMethod.DEBIT,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Unique idempotency key to prevent duplicate charges',
    example: 'tx_idemp_9988776655',
  })
  @IsString()
  @IsNotEmpty()
  idempotencyKey: string;

  @ApiPropertyOptional({
    description:
      'Optional flag for CREDIT_3 payout speed choice (immediate with 2% penalty)',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  immediateWithPenalty?: boolean;
}
