import { IsNumber, IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Matrícula del médico', example: 12345 })
  @IsNumber()
  matricula: number;

  @ApiProperty({ description: 'ID de la clínica', example: 1 })
  @IsNumber()
  clinicaId: number;

  @ApiProperty({ description: 'ID del paciente', example: 1 })
  @IsNumber()
  pacienteId: number;

  @ApiProperty({ description: 'ID de la especialidad', required: false })
  @IsOptional()
  @IsNumber()
  especialidadId?: number;

  @ApiProperty({ description: 'Fecha del turno', example: '2025-07-28' })
  @IsDateString()
  fecha: string;

  @ApiProperty({ description: 'Hora de inicio', example: '09:00' })
  @IsString()
  horaInicio: string;

  @ApiProperty({ description: 'Hora de fin', example: '09:30' })
  @IsString()
  horaFin: string;

  @ApiProperty({ description: 'Estado del turno', enum: AppointmentStatus, default: AppointmentStatus.AGENDADO })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  estado?: AppointmentStatus;

  @ApiProperty({ description: 'Motivo de la consulta', required: false })
  @IsOptional()
  @IsString()
  motivo?: string;

  @ApiProperty({ description: 'Observaciones', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({ description: 'Precio de la consulta', required: false })
  @IsOptional()
  @IsNumber()
  precio?: number;
}
