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
exports.SettlementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const settlement_calculator_service_1 = require("./services/settlement-calculator.service");
let SettlementsService = class SettlementsService {
    constructor(prisma, calculator) {
        this.prisma = prisma;
        this.calculator = calculator;
    }
    calculatePreview(dto) {
        return this.calculator.calculate(dto);
    }
    async findById(id) {
        const settlement = await this.prisma.settlement.findUnique({
            where: { id },
            include: {
                transaction: true,
                merchant: true,
            },
        });
        if (!settlement) {
            throw new common_1.NotFoundException(`Settlement with ID "${id}" not found.`);
        }
        return settlement;
    }
    async findByMerchantId(merchantId) {
        const merchantExists = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        if (!merchantExists) {
            throw new common_1.NotFoundException(`Merchant with ID "${merchantId}" not found.`);
        }
        return this.prisma.settlement.findMany({
            where: { merchantId },
            include: {
                transaction: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.SettlementsService = SettlementsService;
exports.SettlementsService = SettlementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        settlement_calculator_service_1.SettlementCalculatorService])
], SettlementsService);
//# sourceMappingURL=settlements.service.js.map