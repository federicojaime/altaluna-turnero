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
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { Clinic } from './entities/clinic.entity';

@ApiTags('Clinics')
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva clínica' })
  @ApiResponse({ status: 201, description: 'Clínica creada exitosamente', type: Clinic })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createClinicDto: CreateClinicDto): Promise<Clinic> {
    return this.clinicsService.create(createClinicDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las clínicas activas' })
  @ApiResponse({ status: 200, description: 'Lista de clínicas', type: [Clinic] })
  findAll(): Promise<Clinic[]> {
    return this.clinicsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener solo clínicas activas' })
  @ApiResponse({ status: 200, description: 'Lista de clínicas activas', type: [Clinic] })
  findActive(): Promise<Clinic[]> {
    return this.clinicsService.findActive();
  }

  @Get('by-city')
  @ApiOperation({ summary: 'Buscar clínicas por ciudad' })
  @ApiQuery({ name: 'ciudad', description: 'Nombre de la ciudad' })
  @ApiResponse({ status: 200, description: 'Clínicas en la ciudad especificada', type: [Clinic] })
  findByCity(@Query('ciudad') ciudad: string): Promise<Clinic[]> {
    return this.clinicsService.findByCity(ciudad);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener clínica por ID' })
  @ApiParam({ name: 'id', description: 'ID de la clínica' })
  @ApiResponse({ status: 200, description: 'Clínica encontrada', type: Clinic })
  @ApiResponse({ status: 404, description: 'Clínica no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Clinic> {
    return this.clinicsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar clínica' })
  @ApiParam({ name: 'id', description: 'ID de la clínica' })
  @ApiResponse({ status: 200, description: 'Clínica actualizada', type: Clinic })
  @ApiResponse({ status: 404, description: 'Clínica no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClinicDto: UpdateClinicDto,
  ): Promise<Clinic> {
    return this.clinicsService.update(id, updateClinicDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar clínica (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID de la clínica' })
  @ApiResponse({ status: 200, description: 'Clínica desactivada' })
  @ApiResponse({ status: 404, description: 'Clínica no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.clinicsService.remove(id);
  }
}
