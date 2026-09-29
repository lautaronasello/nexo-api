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
exports.MerchantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const merchants_service_1 = require("./merchants.service");
const create_merchant_dto_1 = require("./dto/create-merchant.dto");
let MerchantsController = class MerchantsController {
    constructor(merchantsService) {
        this.merchantsService = merchantsService;
    }
    create(dto) {
        return this.merchantsService.create(dto);
    }
    findAll() {
        return this.merchantsService.findAll();
    }
    findOne(id) {
        return this.merchantsService.findOne(id);
    }
};
exports.MerchantsController = MerchantsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new merchant' }),
    (0, swagger_1.ApiResponse)({ status: 21, description: 'Merchant successfully created.' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - CUIT or Email already in use.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_merchant_dto_1.CreateMerchantDto]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all registered merchants' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of merchants.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get merchant profile and account balances by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchant details.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "findOne", null);
exports.MerchantsController = MerchantsController = __decorate([
    (0, swagger_1.ApiTags)('Merchants'),
    (0, common_1.Controller)('merchants'),
    __metadata("design:paramtypes", [merchants_service_1.MerchantsService])
], MerchantsController);
//# sourceMappingURL=merchants.controller.js.map