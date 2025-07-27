import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('🚀 Iniciando servidor...');
  
  const app = await NestFactory.create(AppModule);
  
  // ⚠️ PREFIJO PRIMERO
  app.setGlobalPrefix('api/v1');
  console.log('✅ Prefijo global configurado: api/v1');
  
  // ✅ SWAGGER DESPUÉS - CON SERVER CORRECTO
  console.log('📚 Configurando Swagger...');
  const config = new DocumentBuilder()
    .setTitle('Altaluna Turnero API')
    .setDescription('API para gestión de turnos médicos')
    .setVersion('1.0')
    .addServer('http://localhost:3000/api/v1', 'Servidor de desarrollo')
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
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  console.log('✅ Swagger configurado en /docs');
  
  // ✅ CORS BÁSICO
  app.enableCors();
  
  const port = 3000;
  await app.listen(port);
  
  console.log('🎉 ===============================================');
  console.log(`🏥 API: http://localhost:${port}/api/v1`);
  console.log(`📚 SWAGGER: http://localhost:${port}/docs`);
  console.log(`🔑 LOGIN: http://localhost:${port}/api/v1/auth/login`);
  console.log('🎉 ===============================================');
}

bootstrap().catch(err => {
  console.error('💥 Error al iniciar:', err);
});
