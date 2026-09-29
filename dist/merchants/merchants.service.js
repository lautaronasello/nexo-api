"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MerchantsService = class MerchantsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.merchant.findFirst({
            where: {
                OR: [{ cuit: dto.cuit }, { email: dto.email }],
            },
        });
        if (existing) {
            throw new common_1.ConflictException('A merchant with this CUIT or Email already exists.');
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
    async findOne(id) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { transactions: true, settlements: true },
                },
            },
        });
        if (!merchant) {
            throw new common_1.NotFoundException(`Merchant with ID "${id}" not found.`);
        }
        return merchant;
    }
};
exports.MerchantsService = MerchantsService;
exports.MerchantsService = MerchantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MerchantsService);
//# sourceMappingURL=merchants.service.js.map