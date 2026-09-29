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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settlements_service_1 = require("./settlements.service");
const calculate_settlement_dto_1 = require("./dto/calculate-settlement.dto");
let SettlementsController = class SettlementsController {
    constructor(settlementsService) {
        this.settlementsService = settlementsService;
    }
    calculatePreview(dto) {
        return this.settlementsService.calculatePreview(dto);
    }
    findOne(id) {
        return this.settlementsService.findById(id);
    }
    findByMerchantId(merchantId) {
        return this.settlementsService.findByMerchantId(merchantId);
    }
};
exports.SettlementsController = SettlementsController;
__decorate([
    (0, common_1.Post)('calculate-preview'),
    (0, swagger_1.ApiOperation)({
        summary: 'Preview settlement breakdown for given gross amount & payment method',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Calculation breakdown preview.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_settlement_dto_1.CalculateSettlementDto]),
    __metadata("design:returntype", void 0)
], SettlementsController.prototype, "calculatePreview", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get settlement details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settlement details found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Settlement not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettlementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('merchant/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'List settlements for a specific merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of settlements retrieved.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettlementsController.prototype, "findByMerchantId", null);
exports.SettlementsController = SettlementsController = __decorate([
    (0, swagger_1.ApiTags)('Settlements'),
    (0, common_1.Controller)('settlements'),
    __metadata("design:paramtypes", [settlements_service_1.SettlementsService])
], SettlementsController);
//# sourceMappingURL=settlements.controller.js.map