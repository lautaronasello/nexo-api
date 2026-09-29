import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SettlementsService } from './settlements.service';
import { CalculateSettlementDto } from './dto/calculate-settlement.dto';

@ApiTags('Settlements')
@Controller('settlements')
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Post('calculate-preview')
  @ApiOperation({
    summary:
      'Preview settlement breakdown for given gross amount & payment method',
  })
  @ApiResponse({ status: 200, description: 'Calculation breakdown preview.' })
  calculatePreview(@Body() dto: CalculateSettlementDto) {
    return this.settlementsService.calculatePreview(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get settlement details by ID' })
  @ApiResponse({ status: 200, description: 'Settlement details found.' })
  @ApiResponse({ status: 404, description: 'Settlement not found.' })
  findOne(@Param('id') id: string) {
    return this.settlementsService.findById(id);
  }

  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'List settlements for a specific merchant' })
  @ApiResponse({ status: 200, description: 'List of settlements retrieved.' })
  findByMerchantId(@Param('merchantId') merchantId: string) {
    return this.settlementsService.findByMerchantId(merchantId);
  }
}
