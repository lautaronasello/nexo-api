import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { SettlementsModule } from '../settlements/settlements.module';
import { QueueModule } from '../queues/queue.module';

@Module({
  imports: [SettlementsModule, QueueModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
