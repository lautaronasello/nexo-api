import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CalculateSettlementDto {
  @ApiProperty({ description: 'Gross transaction amount', example: 10000.0 })
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

  @ApiPropertyOptional({
    description: 'Apply 2% penalty for immediate payout on CREDIT_3',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  immediateWithPenalty?: boolean;
}
