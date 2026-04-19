import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({});

  const config = new DocumentBuilder()
    .setTitle('Invoice Builder API')
    .setDescription(
      'Invoice generation API with authentication, client management, and PDF export',
    )
    .setVersion('1.0.0')
    .addTag('Auth', 'User authentication and profile management')
    .addTag('Clients', 'Client/recipient management')
    .addTag('Invoices', 'Invoice creation and management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'jwt',
    )
    .addServer('http://localhost:3000', 'Development')
    .addServer('https://api.invoicebuilder.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
    customCss: '.topbar { display: none }',
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger API docs available at: http://localhost:${port}/api/docs`,
  );
}
void bootstrap();
