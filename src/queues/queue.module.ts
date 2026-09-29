import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const SETTLEMENT_QUEUE = 'settlement-queue';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rawHost = configService.get<string>('REDIS_HOST', 'localhost');
        const host = rawHost.replace(/^https?:\/\//, '');
        const port = Number(configService.get<number>('REDIS_PORT', 6379));
        const password = configService.get<string>('REDIS_PASSWORD', '');
        const enableTls =
          configService.get<string>('REDIS_TLS') === 'true' ||
          host.includes('upstash.io');

        return {
          connection: {
            host,
            port,
            password: password || undefined,
            ...(enableTls ? { tls: {} } : {}),
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: SETTLEMENT_QUEUE,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
