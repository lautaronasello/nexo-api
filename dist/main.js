"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('NEXO Merchant API')
        .setDescription('Transaction Processing & Settlement Engine for Merchants and Sports Complexes')
        .setVersion('1.0')
        .addTag('Merchants', 'Merchant management and account balances')
        .addTag('Transactions', 'Transaction ingestion and settlement queueing')
        .addTag('Settlements', 'Settlement calculation breakdown and execution audit')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`🚀 NEXO Merchant API running on http://localhost:${port}`);
    logger.log(`📚 Swagger documentation available at http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map