import { Module } from '@nestjs/common';
import { SettlementsController } from './settlements.controller';
import { SettlementsService } from './settlements.service';
import { SettlementCalculatorService } from './services/settlement-calculator.service';
import { SettlementProcessor } from './processors/settlement.processor';
import { QueueModule } from '../queues/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [SettlementsController],
  providers: [
    SettlementsService,
    SettlementCalculatorService,
    SettlementProcessor,
  ],
  exports: [SettlementCalculatorService, SettlementsService],
})
export class SettlementsModule {}
