import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from 'nestjs-pino';
import {json, urlencoded} from 'express';
import {ConfigService} from '@nestjs/config';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{});
  const config = app.get(ConfigService);
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const host = config.get('host.url');
  const port = config.get('host.port')
  const prefix = config.get('app.prefix')

  app.setGlobalPrefix(prefix);

  const swaggerConfig = new DocumentBuilder()
      .setTitle('Todo App Gateway')
      .setDescription('Gateway application to communicate with the blockchain')
      .setVersion('1.0')
      .addTag('Gateway Endpoints')
      .addBearerAuth()
      .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${prefix}/swagger`, app, document);

  await app.listen(3020, () => {
    logger.log(`Gateway running at ${host}:${port}/${prefix}`);
    logger.log(`Gateway running at ${host}:${port}/${prefix}/swagger`);
  });
}
bootstrap();
