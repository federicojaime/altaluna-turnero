import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    description: 'Matrícula del médico', 
    example: '12345',
    type: 'string' 
  })
  @IsString()
  @IsNotEmpty()
  matricula: string;

  @ApiProperty({ 
    description: 'Contraseña', 
    example: 'password123',
    minLength: 6 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
