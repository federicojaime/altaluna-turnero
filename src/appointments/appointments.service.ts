import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Verificar conflictos de horario
    await this.checkTimeConflicts(createAppointmentDto);

    const appointment = this.appointmentsRepository.create(createAppointmentDto);
    return await this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      relations: ['doctor', 'clinic', 'patient', 'specialty'],
      order: { fecha: 'DESC', horaInicio: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['doctor', 'clinic', 'patient', 'specialty', 'payments', 'medicalRecords'],
    });

    if (!appointment) {
      throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    }

    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // Si se cambia fecha/hora, verificar conflictos
    if (updateAppointmentDto.fecha || updateAppointmentDto.horaInicio || updateAppointmentDto.horaFin) {
      const checkDto = {
        ...appointment,
        ...updateAppointmentDto,
      };
      await this.checkTimeConflicts(checkDto, id);
    }

    Object.assign(appointment, updateAppointmentDto);
    return await this.appointmentsRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    appointment.estado = AppointmentStatus.CANCELADO;
    await this.appointmentsRepository.save(appointment);
  }

  async findByDoctor(matricula: number): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      where: { matricula },
      relations: ['clinic', 'patient', 'specialty'],
      order: { fecha: 'ASC', horaInicio: 'ASC' },
    });
  }

  async findByPatient(pacienteId: number): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      where: { pacienteId },
      relations: ['doctor', 'clinic', 'specialty'],
      order: { fecha: 'DESC' },
    });
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      where: {
        fecha: Between(new Date(startDate), new Date(endDate)),
      },
      relations: ['doctor', 'clinic', 'patient', 'specialty'],
      order: { fecha: 'ASC', horaInicio: 'ASC' },
    });
  }

  async findByClinic(clinicaId: number): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      where: { clinicaId },
      relations: ['doctor', 'patient', 'specialty'],
      order: { fecha: 'ASC', horaInicio: 'ASC' },
    });
  }

  async checkAvailability(matricula: number, fecha: string, horaInicio: string, horaFin: string): Promise<boolean> {
    const conflicts = await this.appointmentsRepository.find({
      where: {
        matricula,
        fecha: new Date(fecha),
      },
    });

    return !conflicts.some(appointment => 
      this.timesOverlap(horaInicio, horaFin, appointment.horaInicio, appointment.horaFin)
    );
  }

  private async checkTimeConflicts(appointmentDto: any, excludeId?: number): Promise<void> {
    const conflicts = await this.appointmentsRepository.find({
      where: {
        matricula: appointmentDto.matricula,
        fecha: new Date(appointmentDto.fecha),
      },
    });

    const hasConflict = conflicts
      .filter(app => excludeId ? app.id !== excludeId : true)
      .some(appointment => 
        this.timesOverlap(
          appointmentDto.horaInicio, 
          appointmentDto.horaFin, 
          appointment.horaInicio, 
          appointment.horaFin
        )
      );

    if (hasConflict) {
      throw new BadRequestException(
        `Conflicto de horario: Ya existe un turno en ese horario para el médico`
      );
    }
  }

  private timesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    return start1 < end2 && start2 < end1;
  }

  async confirmAppointment(id: number): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.estado = AppointmentStatus.CONFIRMADO;
    return await this.appointmentsRepository.save(appointment);
  }

  async completeAppointment(id: number): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.estado = AppointmentStatus.COMPLETADO;
    return await this.appointmentsRepository.save(appointment);
  }
}
