import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async findAll(): Promise<Doctor[]> {
    return await this.doctorsRepository.find({
      relations: ['personData'],
      order: { matricula: 'ASC' },
    });
  }

  async findOne(matricula: number): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({
      where: { matricula },
      relations: ['personData'],
    });

    if (!doctor) {
      throw new NotFoundException(`Médico con matrícula ${matricula} no encontrado`);
    }

    return doctor;
  }

  async findByClinic(clinicaId: number): Promise<Doctor[]> {
    return await this.doctorsRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.personData', 'person')
      .innerJoin('medico_clinica', 'mc', 'mc.matricula = doctor.matricula')
      .where('mc.clinica_id = :clinicaId AND mc.activo = true', { clinicaId })
      .orderBy('doctor.matricula', 'ASC')
      .getMany();
  }

  async search(query: string): Promise<Doctor[]> {
    return await this.doctorsRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.personData', 'person')
      .where(
        'doctor.matricula LIKE :query OR person.nombre LIKE :query OR person.apellido LIKE :query',
        { query: `%${query}%` }
      )
      .orderBy('doctor.matricula', 'ASC')
      .getMany();
  }

  async findActive(): Promise<Doctor[]> {
    return await this.doctorsRepository.find({
      where: { situacion: 1 },
      relations: ['personData'],
      order: { matricula: 'ASC' },
    });
  }

  async count(): Promise<number> {
    return await this.doctorsRepository.count();
  }

  // Método para obtener médicos con nombres completos
  async findAllWithNames(): Promise<any[]> {
    return await this.doctorsRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.personData', 'person')
      .select([
        'doctor.matricula',
        'doctor.situacion',
        'doctor.colegio',
        'person.nombre',
        'person.apellido',
        'person.nroDocumento',
      ])
      .where('doctor.situacion = 1')
      .orderBy('person.apellido', 'ASC')
      .getMany();
  }
}
