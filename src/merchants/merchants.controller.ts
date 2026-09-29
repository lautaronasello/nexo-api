import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';

@ApiTags('Merchants')
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new merchant' })
  @ApiResponse({ status: 21, description: 'Merchant successfully created.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - CUIT or Email already in use.',
  })
  create(@Body() dto: CreateMerchantDto) {
    return this.merchantsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all registered merchants' })
  @ApiResponse({ status: 200, description: 'List of merchants.' })
  findAll() {
    return this.merchantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get merchant profile and account balances by ID' })
  @ApiResponse({ status: 200, description: 'Merchant details.' })
  @ApiResponse({ status: 404, description: 'Merchant not found.' })
  findOne(@Param('id') id: string) {
    return this.merchantsService.findOne(id);
  }
}
