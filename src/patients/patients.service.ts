import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    // Verificar si ya existe un paciente con ese DNI
    const existingPatient = await this.patientsRepository.findOne({
      where: { dni: createPatientDto.dni }
    });

    if (existingPatient) {
      throw new BadRequestException(`Ya existe un paciente con DNI ${createPatientDto.dni}`);
    }

    const patient = this.patientsRepository.create(createPatientDto);
    return await this.patientsRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return await this.patientsRepository.find({
      order: { apellido: 'ASC', nombre: 'ASC' },
      // SIN RELACIONES
    });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
      // SIN RELACIONES
    });

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    return patient;
  }

  async findByDni(dni: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { dni },
      // SIN RELACIONES
    });

    if (!patient) {
      throw new NotFoundException(`Paciente con DNI ${dni} no encontrado`);
    }

    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    
    // Si se quiere cambiar el DNI, verificar que no exista otro paciente con ese DNI
    if (updatePatientDto.dni && updatePatientDto.dni !== patient.dni) {
      const existingPatient = await this.patientsRepository.findOne({
        where: { dni: updatePatientDto.dni }
      });
      
      if (existingPatient) {
        throw new BadRequestException(`Ya existe un paciente con DNI ${updatePatientDto.dni}`);
      }
    }

    Object.assign(patient, updatePatientDto);
    return await this.patientsRepository.save(patient);
  }

  async remove(id: number): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientsRepository.remove(patient);
  }

  async search(query: string): Promise<Patient[]> {
    return await this.patientsRepository
      .createQueryBuilder('patient')
      .where('patient.nombre LIKE :query OR patient.apellido LIKE :query OR patient.dni LIKE :query', {
        query: `%${query}%`
      })
      .orderBy('patient.apellido', 'ASC')
      .getMany();
  }
}
