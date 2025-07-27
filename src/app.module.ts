import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Auth
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

// Imports de módulos
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { ClinicsModule } from './clinics/clinics.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { SchedulesModule } from './schedules/schedules.module';
import { PaymentsModule } from './payments/payments.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { MedicalHistoryModule } from './medical-history/medical-history.module';

@Module({
  imports: [
    // Configuración global - FORZAR LECTURA DE .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.production', '.env'],
      ignoreEnvFile: false,
      expandVariables: true,
    }),
    
    // Base de datos con debug
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Debug de variables de entorno
        console.log('🔍 DEBUG ENV VARIABLES:');
        console.log('NODE_ENV:', configService.get('NODE_ENV'));
        console.log('DATABASE_HOST:', configService.get('DATABASE_HOST'));
        console.log('DB_HOST:', configService.get('DB_HOST'));
        console.log('DATABASE_USERNAME:', configService.get('DATABASE_USERNAME'));
        console.log('DB_USER:', configService.get('DB_USER'));
        console.log('DATABASE_NAME:', configService.get('DATABASE_NAME'));
        console.log('DB_NAME:', configService.get('DB_NAME'));
        
        const config = {
          type: 'mysql' as const,
          host: configService.get('DATABASE_HOST') || configService.get('DB_HOST') || 'localhost',
          port: parseInt(configService.get('DATABASE_PORT') || configService.get('DB_PORT') || '3306'),
          username: configService.get('DATABASE_USERNAME') || configService.get('DB_USER') || 'root',
          password: configService.get('DATABASE_PASSWORD') || configService.get('DB_PASSWORD') || '',
          database: configService.get('DATABASE_NAME') || configService.get('DB_NAME') || 'test',
          entities: [__dirname + '/**/*.entity.{ts,js}'],
          synchronize: false, // NUNCA true en producción
          logging: configService.get('NODE_ENV') !== 'production',
          timezone: '+00:00',
          // Configuraciones de producción
          ssl: configService.get('NODE_ENV') === 'production' ? {
            rejectUnauthorized: false
          } : false,
          extra: {
            connectionLimit: parseInt(configService.get('DB_CONNECTION_LIMIT') || '10'),
            acquireTimeout: parseInt(configService.get('DB_ACQUIRE_TIMEOUT') || '60000'),
            timeout: parseInt(configService.get('DB_TIMEOUT') || '60000'),
          },
        };
        
        console.log('🔍 FINAL DB CONFIG:', {
          host: config.host,
          port: config.port,
          username: config.username,
          database: config.database,
          ssl: config.ssl,
        });
        
        return config;
      },
      inject: [ConfigService],
    }),
    
    // Auth (debe ir primero)
    AuthModule,
    
    // Módulos de la aplicación
    UsersModule,
    DoctorsModule,
    ClinicsModule,
    PatientsModule,
    AppointmentsModule,
    SchedulesModule,
    PaymentsModule,
    SpecialtiesModule,
    MedicalHistoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // JWT Guard global (protege todo por defecto)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
