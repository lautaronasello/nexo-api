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
exports.CreateMerchantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateMerchantDto {
}
exports.CreateMerchantDto = CreateMerchantDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Business name of the merchant',
        example: 'Canchas La Redonda FC',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CUIT tax identifier (11 digits, hyphenated or numeric)',
        example: '30-71234567-8',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^(\d{2}-?\d{8}-?\d{1})$/, {
        message: 'CUIT format must be valid (e.g. 30-71234567-8 or 30712345678)',
    }),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "cuit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact email address',
        example: 'contacto@laredonda.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "email", void 0);
//# sourceMappingURL=create-merchant.dto.js.map