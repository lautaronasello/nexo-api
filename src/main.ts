import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global pipes & validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('NEXO Merchant API')
    .setDescription(
      'Transaction Processing & Settlement Engine for Merchants and Sports Complexes',
    )
    .setVersion('1.0')
    .addTag('Merchants', 'Merchant management and account balances')
    .addTag('Transactions', 'Transaction ingestion and settlement queueing')
    .addTag(
      'Settlements',
      'Settlement calculation breakdown and execution audit',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 NEXO Merchant API running on http://localhost:${port}`);
  logger.log(
    `📚 Swagger documentation available at http://localhost:${port}/docs`,
  );
}

bootstrap();
