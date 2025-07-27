import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  // Debug de variables de entorno al inicio
  console.log('🔍 ENV DEBUG - Variables de entorno cargadas:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('DATABASE_HOST:', process.env.DATABASE_HOST);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DATABASE_USERNAME:', process.env.DATABASE_USERNAME);
  console.log('DATABASE_NAME:', process.env.DATABASE_NAME);
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Configuración global
  app.setGlobalPrefix('api/v1');
  
  // CORS
  const corsOrigins = configService.get('CORS_ORIGINS')?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
  
  // Pipes globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  // Filtros globales
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Interceptores globales
  app.useGlobalInterceptors(new TransformInterceptor());
  
  // Swagger Documentation (solo si está habilitado)
  if (configService.get('SWAGGER_ENABLED') !== 'false') {
    const config = new DocumentBuilder()
      .setTitle('Altaluna Turnero API')
      .setDescription('Sistema de gestión de turnos para Altaluna')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Ingrese el token JWT',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Auth', 'Endpoints de autenticación')
      .addTag('Users', 'Gestión de usuarios')
      .addTag('Doctors', 'Gestión de médicos')
      .addTag('Clinics', 'Gestión de clínicas')
      .addTag('Patients', 'Gestión de pacientes')
      .addTag('Appointments', 'Gestión de turnos')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }
  
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  
  console.log('�� ===============================================');
  console.log(`🏥 Altaluna Turnero API ejecutándose en: http://localhost:${port}`);
  if (configService.get('SWAGGER_ENABLED') !== 'false') {
    console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
  }
  console.log(`🌍 Entorno: ${configService.get('NODE_ENV')}`);
  console.log(`🗄️  Base de datos: ${configService.get('DATABASE_HOST') || configService.get('DB_HOST')}`);
  console.log('🚀 ===============================================');
}

bootstrap();
