import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend on port 3000
  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.0.101:3000'],
    credentials: true,
  });

  const preferredPort = Number(process.env.PORT) || 3001;

  for (let port = preferredPort; port < preferredPort + 10; port += 1) {
    try {
      await app.listen(port);
      return;
    } catch (error: any) {
      if (error?.code !== 'EADDRINUSE') {
        throw error;
      }
    }
  }

  throw new Error(`No available port found starting from ${preferredPort}`);
}
bootstrap();
