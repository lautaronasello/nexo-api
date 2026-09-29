import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
export interface SettlementJobData {
    settlementId: string;
    transactionId: string;
    merchantId: string;
}
export declare class SettlementProcessor extends WorkerHost {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    process(job: Job<SettlementJobData>): Promise<void>;
}
