import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Disable ETag generation to avoid 304 caching issues on API endpoints.
   * Auth endpoints (e.g. /me) should not be cached.
   */
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.disable('etag');

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 API running at: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
