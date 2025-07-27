import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Matrícula del médico', example: '12345' })
  @IsString()
  @IsNotEmpty()
  matricula: string;

  @ApiProperty({ description: 'Contraseña', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Confirmar contraseña', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;

  @ApiProperty({ description: 'Token de reset (opcional)', required: false })
  @IsOptional()
  @IsString()
  resetToken?: string;
}
