import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: "*" })
  app.setGlobalPrefix('api/v1/');
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  const config = new DocumentBuilder()
    .setTitle('Afitsant')
    .setDescription('Afitsant API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false
  });
  const swagger = "api/v1/docs"
  SwaggerModule.setup(swagger, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });


  const configService = app.get(ConfigService);
  const port = Number(configService.get<number>('PORT', { infer: true }));
  await app.listen(port, () => console.log(`Server is running on port ${port} url:http://localhost:${port}/${swagger}`));
}
bootstrap();
