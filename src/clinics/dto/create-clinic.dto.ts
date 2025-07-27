import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClinicDto {
  @ApiProperty({ description: 'Nombre de la clínica', example: 'Clínica Central' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Dirección', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ description: 'Teléfono', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ description: 'Email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Código postal', required: false })
  @IsOptional()
  @IsString()
  codigoPostal?: string;

  @ApiProperty({ description: 'Ciudad', required: false })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiProperty({ description: 'Provincia', required: false })
  @IsOptional()
  @IsString()
  provincia?: string;

  @ApiProperty({ description: 'CUIT', required: false })
  @IsOptional()
  @IsString()
  cuit?: string;

  @ApiProperty({ description: 'Clínica activa', default: true })
  @IsOptional()
  @IsBoolean()
  activa?: number;
}
