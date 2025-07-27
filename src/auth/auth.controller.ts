import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthResponse } from './interfaces/jwt-payload.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Login con matrícula SIN dígito verificador y contraseña. Si es primera vez, usar DNI como contraseña.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          matricula: '112345',
          persona: 1126,
          nombre: 'TOMAS',
          apellido: 'ARJONA'
        },
        expires_in: '24h',
        needsPasswordSetup: false
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas, matrícula inexistente o no rematriculada' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('setup-password')
  @ApiOperation({ 
    summary: 'Configurar contraseña (primera vez)',
    description: 'Después del primer login con DNI, configurar una contraseña permanente.'
  })
  @ApiResponse({ status: 201, description: 'Contraseña configurada exitosamente' })
  async setupPassword(@Body() body: { matricula: string; password: string }) {
    return this.authService.setupPassword(body.matricula, body.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.matricula);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  @ApiResponse({ status: 200, description: 'Token refrescado' })
  async refresh(@CurrentUser() user: any) {
    return this.authService.refreshToken(user.matricula);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cambiar contraseña' })
  @ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente' })
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.matricula, changePasswordDto);
  }

  @Public()
  @Get('test-digito/:matricula')
  @ApiOperation({ 
    summary: 'Testing - Calcular dígito verificador',
    description: 'Calcula el dígito verificador para una matrícula'
  })
  async testDigito(@Param('matricula') matricula: string) {
    return this.authService.testDigitoVerificador(matricula);
  }

  @Public()
  @Post('generate-hash-contra')
  @ApiOperation({ 
    summary: 'Generar hash con "contra" para testing',
    description: 'Genera hash usando md5(password + "contra")'
  })
  async generateHashContra(@Body() body: { password: string }) {
    const hash = await this.authService.generatePasswordHashWithContra(body.password);
    return {
      password: body.password,
      hash: hash,
      formula: 'md5(password + "contra")',
    };
  }

  @Public()
  @Post('generate-hash-normal')
  @ApiOperation({ 
    summary: 'Generar hash normal para testing',
    description: 'Genera hash usando md5(password)'
  })
  async generateHashNormal(@Body() body: { password: string }) {
    const hash = await this.authService.generatePasswordHashNormal(body.password);
    return {
      password: body.password,
      hash: hash,
      formula: 'md5(password)',
    };
  }

  @Get('test-protected')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Endpoint de prueba protegido' })
  async testProtected(@CurrentUser() user: any) {
    return {
      message: 'Acceso autorizado',
      user: user,
      timestamp: new Date().toISOString(),
    };
  }
}
