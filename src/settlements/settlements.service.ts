import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettlementCalculatorService } from './services/settlement-calculator.service';
import { CalculateSettlementDto } from './dto/calculate-settlement.dto';

@Injectable()
export class SettlementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calculator: SettlementCalculatorService,
  ) {}

  calculatePreview(dto: CalculateSettlementDto) {
    return this.calculator.calculate(dto);
  }

  async findById(id: string) {
    const settlement = await this.prisma.settlement.findUnique({
      where: { id },
      include: {
        transaction: true,
        merchant: true,
      },
    });

    if (!settlement) {
      throw new NotFoundException(`Settlement with ID "${id}" not found.`);
    }

    return settlement;
  }

  async findByMerchantId(merchantId: string) {
    const merchantExists = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchantExists) {
      throw new NotFoundException(
        `Merchant with ID "${merchantId}" not found.`,
      );
    }

    return this.prisma.settlement.findMany({
      where: { merchantId },
      include: {
        transaction: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
