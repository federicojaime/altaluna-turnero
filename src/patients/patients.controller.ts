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
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nuevo paciente' })
  @ApiResponse({ status: 201, description: 'Paciente registrado exitosamente', type: Patient })
  @ApiResponse({ status: 400, description: 'DNI ya registrado o datos inválidos' })
  create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pacientes' })
  @ApiResponse({ status: 200, description: 'Lista de pacientes', type: [Patient] })
  findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar pacientes por nombre, apellido o DNI' })
  @ApiQuery({ name: 'q', description: 'Término de búsqueda' })
  @ApiResponse({ status: 200, description: 'Pacientes encontrados', type: [Patient] })
  search(@Query('q') query: string): Promise<Patient[]> {
    return this.patientsService.search(query);
  }

  @Get('by-dni/:dni')
  @ApiOperation({ summary: 'Buscar paciente por DNI' })
  @ApiParam({ name: 'dni', description: 'DNI del paciente' })
  @ApiResponse({ status: 200, description: 'Paciente encontrado', type: Patient })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  findByDni(@Param('dni', ParseIntPipe) dni: number): Promise<Patient> {
    return this.patientsService.findByDni(dni);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener paciente por ID' })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Paciente encontrado', type: Patient })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos del paciente' })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Paciente actualizado', type: Patient })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar paciente' })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Paciente eliminado' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.patientsService.remove(id);
  }
}
