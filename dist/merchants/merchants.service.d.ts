import { PrismaService } from '../prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
export declare class MerchantsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMerchantDto): Promise<{
        businessName: string;
        cuit: string;
        email: string;
        id: string;
        availableBalance: import("@prisma/client/runtime/library").Decimal;
        pendingBalance: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        businessName: string;
        cuit: string;
        email: string;
        id: string;
        availableBalance: import("@prisma/client/runtime/library").Decimal;
        pendingBalance: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        _count: {
            transactions: number;
            settlements: number;
        };
    } & {
        businessName: string;
        cuit: string;
        email: string;
        id: string;
        availableBalance: import("@prisma/client/runtime/library").Decimal;
        pendingBalance: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
