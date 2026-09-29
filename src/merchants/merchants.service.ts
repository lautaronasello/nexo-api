import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMerchantDto) {
    const existing = await this.prisma.merchant.findFirst({
      where: {
        OR: [{ cuit: dto.cuit }, { email: dto.email }],
      },
    });

    if (existing) {
      throw new ConflictException(
        'A merchant with this CUIT or Email already exists.',
      );
    }

    return this.prisma.merchant.create({
      data: {
        businessName: dto.businessName,
        cuit: dto.cuit,
        email: dto.email,
        availableBalance: 0,
        pendingBalance: 0,
      },
    });
  }

  async findAll() {
    return this.prisma.merchant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transactions: true, settlements: true },
        },
      },
    });

    if (!merchant) {
      throw new NotFoundException(`Merchant with ID "${id}" not found.`);
    }

    return merchant;
  }
}
