import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentMethod } from '@prisma/client';
import {
  SettlementCalculationInput,
  SettlementCalculationResult,
} from '../interfaces/settlement-calculation.interface';

@Injectable()
export class SettlementCalculatorService {
  private readonly IVA_RATE = 0.21; // 21% IVA on fee

  /**
   * Calculates financial settlement details deterministically according to payment method.
   */
  calculate(input: SettlementCalculationInput): SettlementCalculationResult {
    const { amountGross, paymentMethod, immediateWithPenalty = false } = input;

    if (amountGross <= 0) {
      throw new BadRequestException(
        'Transaction gross amount must be strictly greater than zero.',
      );
    }

    let feePercentage = 0;
    let scheduledPayoutDate = new Date();
    let payoutDelayHoursOrDays = '';

    switch (paymentMethod) {
      case PaymentMethod.DEBIT:
        feePercentage = 0.008; // 0.8%
        scheduledPayoutDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        payoutDelayHoursOrDays = '24 Hours';
        break;

      case PaymentMethod.CREDIT_1:
        feePercentage = 0.018; // 1.8%
        scheduledPayoutDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
        payoutDelayHoursOrDays = '48 Hours';
        break;

      case PaymentMethod.CREDIT_3:
        if (immediateWithPenalty) {
          // 6.5% + 2% penalty = 8.5% total fee, 0 hours accreditation
          feePercentage = 0.065 + 0.02; // 8.5%
          scheduledPayoutDate = new Date();
          payoutDelayHoursOrDays = 'Immediate (With 2% Penalty)';
        } else {
          feePercentage = 0.065; // 6.5%
          scheduledPayoutDate = this.addBusinessDays(new Date(), 10);
          payoutDelayHoursOrDays = '10 Business Days';
        }
        break;

      case PaymentMethod.QR:
        feePercentage = 0.006; // 0.6%
        scheduledPayoutDate = new Date(); // 0 hours
        payoutDelayHoursOrDays = 'Immediate (0 Hours)';
        break;

      default:
        throw new BadRequestException(
          `Unsupported payment method: ${paymentMethod}`,
        );
    }

    // Precise calculations
    const rawFee = amountGross * feePercentage;
    const feeApplied = this.roundToTwoDecimals(rawFee);

    const rawTax = feeApplied * this.IVA_RATE;
    const taxApplied = this.roundToTwoDecimals(rawTax);

    const totalDeductions = this.roundToTwoDecimals(feeApplied + taxApplied);
    const amountNet = this.roundToTwoDecimals(amountGross - totalDeductions);

    return {
      amountGross,
      amountNet,
      feeApplied,
      taxApplied,
      feePercentage,
      taxRate: this.IVA_RATE,
      scheduledPayoutDate,
      payoutDelayHoursOrDays,
    };
  }

  /**
   * Adds specified number of business days (skipping Saturdays and Sundays) to a starting Date.
   */
  private addBusinessDays(startDate: Date, businessDaysToAdd: number): Date {
    const date = new Date(startDate);
    let added = 0;

    while (added < businessDaysToAdd) {
      date.setDate(date.getDate() + 1);
      const dayOfWeek = date.getDay();
      // 0 = Sunday, 6 = Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        added++;
      }
    }

    return date;
  }

  /**
   * Rounds numeric value to 2 decimal places for financial safety.
   */
  private roundToTwoDecimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
