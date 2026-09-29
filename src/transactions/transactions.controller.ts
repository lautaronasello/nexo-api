import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Register transaction and schedule settlement' })
  @ApiResponse({
    status: 201,
    description: 'Transaction registered and settlement job queued.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or invalid amount.',
  })
  @ApiResponse({ status: 404, description: 'Merchant not found.' })
  @ApiResponse({ status: 409, description: 'Duplicate idempotency key.' })
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction details by ID' })
  @ApiResponse({ status: 200, description: 'Transaction details.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'List all transactions for a specific merchant' })
  @ApiResponse({ status: 200, description: 'List of merchant transactions.' })
  findByMerchantId(@Param('merchantId') merchantId: string) {
    return this.transactionsService.findByMerchantId(merchantId);
  }
}
