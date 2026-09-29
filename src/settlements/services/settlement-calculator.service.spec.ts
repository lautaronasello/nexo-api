import { Test, TestingModule } from '@nestjs/testing';
import { SettlementCalculatorService } from './settlement-calculator.service';
import { PaymentMethod } from '@prisma/client';

describe('SettlementCalculatorService', () => {
  let service: SettlementCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettlementCalculatorService],
    }).compile();

    service = module.get<SettlementCalculatorService>(
      SettlementCalculatorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('DÉBITO calculation (0.8% fee + 21% IVA, 24 hours accreditation)', () => {
    it('should correctly calculate net amount and payout date for DEBIT', () => {
      const gross = 10000;
      const result = service.calculate({
        amountGross: gross,
        paymentMethod: PaymentMethod.DEBIT,
      });

      // Fee: 10000 * 0.008 = 80
      // Tax: 80 * 0.21 = 16.8
      // Total deductions: 96.8
      // Net: 10000 - 96.8 = 9903.20
      expect(result.feeApplied).toBe(80.0);
      expect(result.taxApplied).toBe(16.8);
      expect(result.amountNet).toBe(9903.2);

      const delayHours =
        (result.scheduledPayoutDate.getTime() - Date.now()) / (1000 * 60 * 60);
      expect(Math.round(delayHours)).toBe(24);
    });
  });

  describe('CRÉDITO 1 PAGO calculation (1.8% fee + 21% IVA, 48 hours accreditation)', () => {
    it('should correctly calculate net amount and payout date for CREDIT_1', () => {
      const gross = 10000;
      const result = service.calculate({
        amountGross: gross,
        paymentMethod: PaymentMethod.CREDIT_1,
      });

      // Fee: 10000 * 0.018 = 180
      // Tax: 180 * 0.21 = 37.8
      // Total deductions: 217.8
      // Net: 10000 - 217.8 = 9782.20
      expect(result.feeApplied).toBe(180.0);
      expect(result.taxApplied).toBe(37.8);
      expect(result.amountNet).toBe(9782.2);

      const delayHours =
        (result.scheduledPayoutDate.getTime() - Date.now()) / (1000 * 60 * 60);
      expect(Math.round(delayHours)).toBe(48);
    });
  });

  describe('CRÉDITO 3 CUOTAS calculation (6.5% fee standard vs 8.5% with penalty)', () => {
    it('should calculate 10 business days delay for standard CREDIT_3', () => {
      const gross = 10000;
      const result = service.calculate({
        amountGross: gross,
        paymentMethod: PaymentMethod.CREDIT_3,
      });

      // Fee: 10000 * 0.065 = 650
      // Tax: 650 * 0.21 = 136.5
      // Total deductions: 786.5
      // Net: 10000 - 786.5 = 9213.5
      expect(result.feeApplied).toBe(650.0);
      expect(result.taxApplied).toBe(136.5);
      expect(result.amountNet).toBe(9213.5);
      expect(result.payoutDelayHoursOrDays).toBe('10 Business Days');
    });

    it('should calculate 8.5% fee and immediate payout when immediateWithPenalty is true', () => {
      const gross = 10000;
      const result = service.calculate({
        amountGross: gross,
        paymentMethod: PaymentMethod.CREDIT_3,
        immediateWithPenalty: true,
      });

      // Fee: 10000 * 0.085 = 850
      // Tax: 850 * 0.21 = 178.5
      // Total deductions: 1028.5
      // Net: 10000 - 1028.5 = 8971.5
      expect(result.feeApplied).toBe(850.0);
      expect(result.taxApplied).toBe(178.5);
      expect(result.amountNet).toBe(8971.5);
      expect(result.payoutDelayHoursOrDays).toBe('Immediate (With 2% Penalty)');
    });
  });

  describe('QR calculation (0.6% fee + 21% IVA, Immediate accreditation)', () => {
    it('should correctly calculate net amount and immediate payout for QR', () => {
      const gross = 10000;
      const result = service.calculate({
        amountGross: gross,
        paymentMethod: PaymentMethod.QR,
      });

      // Fee: 10000 * 0.006 = 60
      // Tax: 60 * 0.21 = 12.6
      // Total deductions: 72.6
      // Net: 10000 - 72.6 = 9927.40
      expect(result.feeApplied).toBe(60.0);
      expect(result.taxApplied).toBe(12.6);
      expect(result.amountNet).toBe(9927.4);
      expect(result.payoutDelayHoursOrDays).toBe('Immediate (0 Hours)');
    });
  });
});
