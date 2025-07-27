import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SpecialtiesService } from './specialties.service';
import { Specialty } from './entities/specialty.entity';

@ApiTags('Specialties')
@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las especialidades' })
  @ApiResponse({ status: 200, description: 'Lista de especialidades', type: [Specialty] })
  findAll(): Promise<Specialty[]> {
    return this.specialtiesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener especialidades activas' })
  @ApiResponse({ status: 200, description: 'Lista de especialidades activas', type: [Specialty] })
  findActive(): Promise<Specialty[]> {
    return this.specialtiesService.findActive();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar especialidades por nombre' })
  @ApiQuery({ name: 'q', description: 'Término de búsqueda' })
  @ApiResponse({ status: 200, description: 'Especialidades encontradas', type: [Specialty] })
  search(@Query('q') query: string): Promise<Specialty[]> {
    return this.specialtiesService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener especialidad por ID' })
  @ApiParam({ name: 'id', description: 'ID de la especialidad' })
  @ApiResponse({ status: 200, description: 'Especialidad encontrada', type: Specialty })
  @ApiResponse({ status: 404, description: 'Especialidad no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Specialty> {
    return this.specialtiesService.findOne(id);
  }
}
