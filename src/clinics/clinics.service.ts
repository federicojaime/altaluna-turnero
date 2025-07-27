import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from './entities/clinic.entity';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
  ) {}

  async create(createClinicDto: CreateClinicDto): Promise<Clinic> {
    const clinic = this.clinicsRepository.create(createClinicDto);
    return await this.clinicsRepository.save(clinic);
  }

  async findAll(): Promise<Clinic[]> {
    return await this.clinicsRepository.find({
      where: { activa: 1 },
      order: { nombre: 'ASC' },
      // SIN RELACIONES
    });
  }

  async findOne(id: number): Promise<Clinic> {
    const clinic = await this.clinicsRepository.findOne({
      where: { id },
      // SIN RELACIONES
    });

    if (!clinic) {
      throw new NotFoundException(`Clínica con ID ${id} no encontrada`);
    }

    return clinic;
  }

  async update(id: number, updateClinicDto: UpdateClinicDto): Promise<Clinic> {
    const clinic = await this.findOne(id);
    Object.assign(clinic, updateClinicDto);
    return await this.clinicsRepository.save(clinic);
  }

  async remove(id: number): Promise<void> {
    const clinic = await this.findOne(id);
    clinic.activa = 0; // Soft delete
    await this.clinicsRepository.save(clinic);
  }

  async findByCity(ciudad: string): Promise<Clinic[]> {
    return await this.clinicsRepository.find({
      where: { ciudad, activa: 1 },
      order: { nombre: 'ASC' },
    });
  }

  async findActive(): Promise<Clinic[]> {
    return await this.clinicsRepository.find({
      where: { activa: 1 },
      order: { nombre: 'ASC' },
    });
  }
}
