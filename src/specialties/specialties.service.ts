import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from './entities/specialty.entity';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialty)
    private specialtiesRepository: Repository<Specialty>,
  ) {}

  async findAll(): Promise<Specialty[]> {
    return await this.specialtiesRepository.find({
      order: { denominacion: 'ASC' },
    });
  }

  async findOne(especialidad: number): Promise<Specialty> {
    const specialty = await this.specialtiesRepository.findOne({
      where: { especialidad },
      relations: ['appointments'],
    });

    if (!specialty) {
      throw new NotFoundException(`Especialidad con ID ${especialidad} no encontrada`);
    }

    return specialty;
  }

  async findActive(): Promise<Specialty[]> {
    return await this.specialtiesRepository.find({
      where: { tipoEspecialidad: '1' },
      order: { denominacion: 'ASC' },
    });
  }

  async search(query: string): Promise<Specialty[]> {
    return await this.specialtiesRepository
      .createQueryBuilder('specialty')
      .where('specialty.denominacion LIKE :query', {
        query: `%${query}%`
      })
      .orderBy('specialty.denominacion', 'ASC')
      .getMany();
  }
}
