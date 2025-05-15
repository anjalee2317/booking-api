import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation pipes globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties not defined in DTOs
    transform: true, // Transform payloads to DTO instances
  }));
  
  // Enable CORS
  app.enableCors();
  
  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Booking API')
    .setDescription('API documentation for the booking application')
    .setVersion('1.0')
    .addTag('bookings')
    .addTag('users')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Use port 3001 to avoid conflicts
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap();
