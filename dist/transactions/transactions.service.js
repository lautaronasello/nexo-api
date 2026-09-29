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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TransactionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const settlement_calculator_service_1 = require("../settlements/services/settlement-calculator.service");
const queue_module_1 = require("../queues/queue.module");
let TransactionsService = TransactionsService_1 = class TransactionsService {
    constructor(prisma, settlementCalculator, settlementQueue) {
        this.prisma = prisma;
        this.settlementCalculator = settlementCalculator;
        this.settlementQueue = settlementQueue;
        this.logger = new common_1.Logger(TransactionsService_1.name);
    }
    async create(dto) {
        const { merchantId, amountGross, paymentMethod, idempotencyKey, immediateWithPenalty, } = dto;
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException(`Merchant with ID "${merchantId}" not found.`);
        }
        const existingTx = await this.prisma.transaction.findUnique({
            where: { idempotencyKey },
        });
        if (existingTx) {
            throw new common_1.ConflictException(`Transaction with idempotency key "${idempotencyKey}" already processed.`);
        }
        const calculation = this.settlementCalculator.calculate({
            amountGross,
            paymentMethod,
            immediateWithPenalty,
        });
        const result = await this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    merchantId,
                    amountGross: calculation.amountGross,
                    paymentMethod,
                    status: client_1.TransactionStatus.PENDING,
                    idempotencyKey,
                },
            });
            const settlement = await tx.settlement.create({
                data: {
                    transactionId: transaction.id,
                    merchantId,
                    amountNet: calculation.amountNet,
                    feeApplied: calculation.feeApplied,
                    taxApplied: calculation.taxApplied,
                    scheduledPayoutDate: calculation.scheduledPayoutDate,
                    status: client_1.SettlementStatus.PENDING,
                },
            });
            await tx.merchant.update({
                where: { id: merchantId },
                data: {
                    pendingBalance: { increment: calculation.amountGross },
                },
            });
            return { transaction, settlement };
        });
        const now = Date.now();
        const scheduledTime = calculation.scheduledPayoutDate.getTime();
        const delay = Math.max(0, scheduledTime - now);
        const job = await this.settlementQueue.add('process-settlement', {
            settlementId: result.settlement.id,
            transactionId: result.transaction.id,
            merchantId,
        }, {
            delay,
            jobId: result.settlement.id,
            removeOnComplete: true,
            removeOnFail: false,
        });
        this.logger.log(`Dispatched settlement Job [ID: ${job.id}] with delay of ${delay}ms for Settlement ${result.settlement.id}`);
        return {
            message: 'Transaction successfully created and settlement scheduled.',
            transaction: result.transaction,
            settlement: result.settlement,
            breakdown: {
                feePercentage: calculation.feePercentage,
                taxRate: calculation.taxRate,
                payoutDelay: calculation.payoutDelayHoursOrDays,
                scheduledPayoutDate: calculation.scheduledPayoutDate,
                queueDelayMs: delay,
            },
        };
    }
    async findOne(id) {
        const tx = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                settlement: true,
                merchant: true,
            },
        });
        if (!tx) {
            throw new common_1.NotFoundException(`Transaction with ID "${id}" not found.`);
        }
        return tx;
    }
    async findByMerchantId(merchantId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException(`Merchant with ID "${merchantId}" not found.`);
        }
        return this.prisma.transaction.findMany({
            where: { merchantId },
            include: {
                settlement: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = TransactionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)(queue_module_1.SETTLEMENT_QUEUE)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        settlement_calculator_service_1.SettlementCalculatorService,
        bullmq_2.Queue])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map