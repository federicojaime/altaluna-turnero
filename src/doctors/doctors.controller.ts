import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { Doctor } from './entities/doctor.entity';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los médicos con datos personales' })
  @ApiResponse({ status: 200, description: 'Lista de médicos', type: [Doctor] })
  findAll(): Promise<Doctor[]> {
    return this.doctorsService.findAll();
  }

  @Get('with-names')
  @ApiOperation({ summary: 'Obtener médicos con nombres completos' })
  @ApiResponse({ status: 200, description: 'Lista de médicos con nombres' })
  findAllWithNames(): Promise<any[]> {
    return this.doctorsService.findAllWithNames();
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener médicos activos' })
  @ApiResponse({ status: 200, description: 'Lista de médicos activos', type: [Doctor] })
  findActive(): Promise<Doctor[]> {
    return this.doctorsService.findActive();
  }

  @Get('count')
  @ApiOperation({ summary: 'Contar total de médicos' })
  @ApiResponse({ status: 200, description: 'Cantidad de médicos' })
  count(): Promise<{ total: number }> {
    return this.doctorsService.count().then(total => ({ total }));
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar médicos por matrícula, nombre o apellido' })
  @ApiQuery({ name: 'q', description: 'Término de búsqueda' })
  @ApiResponse({ status: 200, description: 'Médicos encontrados', type: [Doctor] })
  search(@Query('q') query: string): Promise<Doctor[]> {
    return this.doctorsService.search(query);
  }

  @Get('by-clinic/:clinicaId')
  @ApiOperation({ summary: 'Obtener médicos por clínica' })
  @ApiParam({ name: 'clinicaId', description: 'ID de la clínica' })
  @ApiResponse({ status: 200, description: 'Médicos de la clínica', type: [Doctor] })
  findByClinic(@Param('clinicaId', ParseIntPipe) clinicaId: number): Promise<Doctor[]> {
    return this.doctorsService.findByClinic(clinicaId);
  }

  @Get(':matricula')
  @ApiOperation({ summary: 'Obtener médico por matrícula' })
  @ApiParam({ name: 'matricula', description: 'Matrícula del médico' })
  @ApiResponse({ status: 200, description: 'Médico encontrado', type: Doctor })
  @ApiResponse({ status: 404, description: 'Médico no encontrado' })
  findOne(@Param('matricula', ParseIntPipe) matricula: number): Promise<Doctor> {
    return this.doctorsService.findOne(matricula);
  }
}
