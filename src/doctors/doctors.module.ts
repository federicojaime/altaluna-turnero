import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { Doctor } from './entities/doctor.entity';
import { DoctorClinic } from './entities/doctor-clinic.entity';
import { Person } from '../persons/entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, DoctorClinic, Person])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
