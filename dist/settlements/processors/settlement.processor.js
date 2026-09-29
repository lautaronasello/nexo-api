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
var SettlementProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const queue_module_1 = require("../../queues/queue.module");
const client_1 = require("@prisma/client");
let SettlementProcessor = SettlementProcessor_1 = class SettlementProcessor extends bullmq_1.WorkerHost {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.logger = new common_1.Logger(SettlementProcessor_1.name);
    }
    async process(job) {
        const { settlementId, transactionId, merchantId } = job.data;
        this.logger.log(`Processing settlement job [${job.id}] for Settlement ID: ${settlementId}, Transaction ID: ${transactionId}`);
        try {
            await this.prisma.$transaction(async (tx) => {
                const settlement = await tx.settlement.findUnique({
                    where: { id: settlementId },
                    include: { transaction: true },
                });
                if (!settlement) {
                    throw new Error(`Settlement with ID ${settlementId} not found.`);
                }
                if (settlement.status === client_1.SettlementStatus.COMPLETED) {
                    this.logger.warn(`Settlement ${settlementId} is already COMPLETED. Skipping.`);
                    return;
                }
                const amountGross = settlement.transaction.amountGross;
                const amountNet = settlement.amountNet;
                await tx.transaction.update({
                    where: { id: transactionId },
                    data: { status: client_1.TransactionStatus.SETTLED },
                });
                await tx.settlement.update({
                    where: { id: settlementId },
                    data: { status: client_1.SettlementStatus.COMPLETED },
                });
                await tx.merchant.update({
                    where: { id: merchantId },
                    data: {
                        pendingBalance: { decrement: amountGross },
                        availableBalance: { increment: amountNet },
                    },
                });
            });
            this.logger.log(`Successfully settled Settlement ID: ${settlementId}. Merchant ${merchantId} available balance updated.`);
        }
        catch (error) {
            this.logger.error(`Failed to execute settlement transaction for Settlement ID: ${settlementId}`, error instanceof Error ? error.stack : error);
            throw error;
        }
    }
};
exports.SettlementProcessor = SettlementProcessor;
exports.SettlementProcessor = SettlementProcessor = SettlementProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(queue_module_1.SETTLEMENT_QUEUE),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettlementProcessor);
//# sourceMappingURL=settlement.processor.js.map