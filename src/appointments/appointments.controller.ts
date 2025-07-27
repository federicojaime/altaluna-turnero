import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo turno' })
  @ApiResponse({ status: 201, description: 'Turno creado exitosamente', type: Appointment })
  @ApiResponse({ status: 400, description: 'Conflicto de horario o datos inválidos' })
  create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los turnos' })
  @ApiResponse({ status: 200, description: 'Lista de turnos', type: [Appointment] })
  findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get('by-doctor/:matricula')
  @ApiOperation({ summary: 'Obtener turnos por médico' })
  @ApiParam({ name: 'matricula', description: 'Matrícula del médico' })
  @ApiResponse({ status: 200, description: 'Turnos del médico', type: [Appointment] })
  findByDoctor(@Param('matricula', ParseIntPipe) matricula: number): Promise<Appointment[]> {
    return this.appointmentsService.findByDoctor(matricula);
  }

  @Get('by-patient/:pacienteId')
  @ApiOperation({ summary: 'Obtener turnos por paciente' })
  @ApiParam({ name: 'pacienteId', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Turnos del paciente', type: [Appointment] })
  findByPatient(@Param('pacienteId', ParseIntPipe) pacienteId: number): Promise<Appointment[]> {
    return this.appointmentsService.findByPatient(pacienteId);
  }

  @Get('by-clinic/:clinicaId')
  @ApiOperation({ summary: 'Obtener turnos por clínica' })
  @ApiParam({ name: 'clinicaId', description: 'ID de la clínica' })
  @ApiResponse({ status: 200, description: 'Turnos de la clínica', type: [Appointment] })
  findByClinic(@Param('clinicaId', ParseIntPipe) clinicaId: number): Promise<Appointment[]> {
    return this.appointmentsService.findByClinic(clinicaId);
  }

  @Get('by-date-range')
  @ApiOperation({ summary: 'Obtener turnos por rango de fechas' })
  @ApiQuery({ name: 'startDate', description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', description: 'Fecha fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Turnos en el rango de fechas', type: [Appointment] })
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Appointment[]> {
    return this.appointmentsService.findByDateRange(startDate, endDate);
  }

  @Get('availability')
  @ApiOperation({ summary: 'Verificar disponibilidad de horario' })
  @ApiQuery({ name: 'matricula', description: 'Matrícula del médico' })
  @ApiQuery({ name: 'fecha', description: 'Fecha (YYYY-MM-DD)' })
  @ApiQuery({ name: 'horaInicio', description: 'Hora inicio (HH:MM)' })
  @ApiQuery({ name: 'horaFin', description: 'Hora fin (HH:MM)' })
  @ApiResponse({ status: 200, description: 'Disponibilidad del horario' })
  checkAvailability(
    @Query('matricula', ParseIntPipe) matricula: number,
    @Query('fecha') fecha: string,
    @Query('horaInicio') horaInicio: string,
    @Query('horaFin') horaFin: string,
  ): Promise<{ available: boolean }> {
    return this.appointmentsService.checkAvailability(matricula, fecha, horaInicio, horaFin)
      .then(available => ({ available }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener turno por ID' })
  @ApiParam({ name: 'id', description: 'ID del turno' })
  @ApiResponse({ status: 200, description: 'Turno encontrado', type: Appointment })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Appointment> {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar turno' })
  @ApiParam({ name: 'id', description: 'ID del turno' })
  @ApiResponse({ status: 200, description: 'Turno actualizado', type: Appointment })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirmar turno' })
  @ApiParam({ name: 'id', description: 'ID del turno' })
  @ApiResponse({ status: 200, description: 'Turno confirmado', type: Appointment })
  confirmAppointment(@Param('id', ParseIntPipe) id: number): Promise<Appointment> {
    return this.appointmentsService.confirmAppointment(id);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Marcar turno como completado' })
  @ApiParam({ name: 'id', description: 'ID del turno' })
  @ApiResponse({ status: 200, description: 'Turno completado', type: Appointment })
  completeAppointment(@Param('id', ParseIntPipe) id: number): Promise<Appointment> {
    return this.appointmentsService.completeAppointment(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar turno' })
  @ApiParam({ name: 'id', description: 'ID del turno' })
  @ApiResponse({ status: 200, description: 'Turno cancelado' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.appointmentsService.remove(id);
  }
}
