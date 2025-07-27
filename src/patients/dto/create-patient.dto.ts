import { IsNumber, IsString, IsOptional, IsEmail, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ description: 'DNI del paciente', example: 12345678 })
  @IsNumber()
  dni: number;

  @ApiProperty({ description: 'CUIL', required: false })
  @IsOptional()
  @IsNumber()
  cuil?: number;

  @ApiProperty({ description: 'Apellido', example: 'García' })
  @IsString()
  apellido: string;

  @ApiProperty({ description: 'Nombre', example: 'Juan' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Sexo', example: 'M' })
  @IsString()
  sexo: string;

  @ApiProperty({ description: 'Email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Teléfono', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ description: 'Fecha de nacimiento', required: false })
  @IsOptional()
  @IsDateString()
  fechac?: string;

  @ApiProperty({ description: 'Calle', required: false })
  @IsOptional()
  @IsString()
  calle?: string;

  @ApiProperty({ description: 'Número', required: false })
  @IsOptional()
  @IsNumber()
  numero?: number;

  @ApiProperty({ description: 'Ciudad', required: false })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiProperty({ description: 'Obra social ID', required: false })
  @IsOptional()
  @IsNumber()
  idobrasocial?: number;
}
