"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementCalculatorService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let SettlementCalculatorService = class SettlementCalculatorService {
    constructor() {
        this.IVA_RATE = 0.21;
    }
    calculate(input) {
        const { amountGross, paymentMethod, immediateWithPenalty = false } = input;
        if (amountGross <= 0) {
            throw new common_1.BadRequestException('Transaction gross amount must be strictly greater than zero.');
        }
        let feePercentage = 0;
        let scheduledPayoutDate = new Date();
        let payoutDelayHoursOrDays = '';
        switch (paymentMethod) {
            case client_1.PaymentMethod.DEBIT:
                feePercentage = 0.008;
                scheduledPayoutDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
                payoutDelayHoursOrDays = '24 Hours';
                break;
            case client_1.PaymentMethod.CREDIT_1:
                feePercentage = 0.018;
                scheduledPayoutDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
                payoutDelayHoursOrDays = '48 Hours';
                break;
            case client_1.PaymentMethod.CREDIT_3:
                if (immediateWithPenalty) {
                    feePercentage = 0.065 + 0.02;
                    scheduledPayoutDate = new Date();
                    payoutDelayHoursOrDays = 'Immediate (With 2% Penalty)';
                }
                else {
                    feePercentage = 0.065;
                    scheduledPayoutDate = this.addBusinessDays(new Date(), 10);
                    payoutDelayHoursOrDays = '10 Business Days';
                }
                break;
            case client_1.PaymentMethod.QR:
                feePercentage = 0.006;
                scheduledPayoutDate = new Date();
                payoutDelayHoursOrDays = 'Immediate (0 Hours)';
                break;
            default:
                throw new common_1.BadRequestException(`Unsupported payment method: ${paymentMethod}`);
        }
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
    addBusinessDays(startDate, businessDaysToAdd) {
        const date = new Date(startDate);
        let added = 0;
        while (added < businessDaysToAdd) {
            date.setDate(date.getDate() + 1);
            const dayOfWeek = date.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                added++;
            }
        }
        return date;
    }
    roundToTwoDecimals(value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }
};
exports.SettlementCalculatorService = SettlementCalculatorService;
exports.SettlementCalculatorService = SettlementCalculatorService = __decorate([
    (0, common_1.Injectable)()
], SettlementCalculatorService);
//# sourceMappingURL=settlement-calculator.service.js.map