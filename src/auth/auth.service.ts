import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Person } from '../persons/entities/person.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthResponse, JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(Person)
    private personsRepository: Repository<Person>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Calcular dígito verificador de matrícula
   * Algoritmo estándar: suma de dígitos * posición, módulo 11
   */
  private calcularDigitoVerificador(matricula: string): string {
    let suma = 0;
    for (let i = 0; i < matricula.length; i++) {
      suma += parseInt(matricula[i]) * (i + 1);
    }
    const digito = suma % 11;
    return digito === 10 ? '0' : digito.toString();
  }

  /**
   * Generar matrícula completa (con dígito verificador)
   */
  private generarMatriculaCompleta(matriculaSinDigito: string): string {
    const digito = this.calcularDigitoVerificador(matriculaSinDigito);
    return matriculaSinDigito + digito;
  }

  /**
   * Hash normal: md5(password)
   */
  private hashPasswordNormal(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  /**
   * Hash con "contra": md5(password + "contra")
   */
  private hashPasswordWithContra(password: string): string {
    return crypto.createHash('md5').update(password + "contra").digest('hex');
  }

  /**
   * Buscar usuario en tabla usuarios usando matrícula SIN dígito
   * (tu PHP usa view_usuarios WHERE matric = :matric)
   */
  private async checkUserExists(matriculaSinDigito: string): Promise<any> {
    // Buscar en usuarios donde mat_id coincida con matrícula sin dígito
    const user = await this.usersRepository.findOne({
      where: { matId: matriculaSinDigito },
    });
    return user;
  }

  /**
   * Verificar matrícula rematriculada usando matrícula COMPLETA
   * (tu PHP usa view_matrsinverificador WHERE matr = :matr)
   */
  private async checkMatriculaRematriculada(matriculaSinDigito: string): Promise<any> {
    const matriculaCompleta = this.generarMatriculaCompleta(matriculaSinDigito);
    
    // Buscar en tmp_matriculados con matrícula completa
    const doctor = await this.doctorsRepository.findOne({
      where: { 
        matricula: parseInt(matriculaCompleta),
        rematriculado: 'S'
      },
    });
    return doctor;
  }

  /**
   * Verificar primera vez: matrícula + DNI
   */
  private async checkPrimeraVez(matriculaSinDigito: string, dni: string): Promise<any> {
    const matriculaCompleta = this.generarMatriculaCompleta(matriculaSinDigito);
    
    // Buscar persona con esa matrícula y DNI
    const person = await this.personsRepository.findOne({
      where: { 
        matricula: parseInt(matriculaCompleta),
        nroDocumento: parseInt(dni)
      },
    });

    if (person) {
      // Verificar que esté rematriculado
      const doctor = await this.doctorsRepository.findOne({
        where: { 
          matricula: parseInt(matriculaCompleta),
          rematriculado: 'S'
        },
      });
      return doctor ? { person, doctor } : null;
    }
    return null;
  }

  /**
   * Verificar si está asistido (tabla user_asistido)
   * Por ahora retorna false, puedes implementar la tabla después
   */
  private async checkAsistido(matriculaCompleta: string): Promise<boolean> {
    // TODO: Implementar verificación en tabla user_asistido
    // SELECT mat_id, user_cmpc, devuelta FROM user_asistido WHERE mat_id=:matID AND devuelta=0
    return false;
  }

  async validateUser(matriculaSinDigito: string, password: string): Promise<any> {
    try {
      console.log(`[AUTH] Validando matrícula sin dígito: ${matriculaSinDigito}`);
      
      // 1. Verificar si existe en usuarios (ya tiene cuenta)
      const existingUser = await this.checkUserExists(matriculaSinDigito);

      if (existingUser) {
        console.log('[AUTH] Usuario existe - login normal');
        
        // Verificar que esté rematriculado
        const doctorRematriculado = await this.checkMatriculaRematriculada(matriculaSinDigito);
        if (!doctorRematriculado) {
          throw new UnauthorizedException('Matrícula inexistente o no rematriculada');
        }

        const matriculaCompleta = this.generarMatriculaCompleta(matriculaSinDigito);
        
        // Verificar si está asistido
        const estaAsistido = await this.checkAsistido(matriculaCompleta);
        
        let hashToCheck: string;
        if (estaAsistido) {
          // Está asistido: md5(password)
          hashToCheck = this.hashPasswordNormal(password);
          console.log('[AUTH] Usuario asistido - usando hash normal');
        } else {
          // Normal: md5(password + "contra")
          hashToCheck = this.hashPasswordWithContra(password);
          console.log('[AUTH] Usuario normal - usando hash con contra');
        }

        console.log(`[AUTH] Hash calculado: ${hashToCheck}`);
        console.log(`[AUTH] Hash almacenado: ${existingUser.usuClave}`);
        
        if (hashToCheck === existingUser.usuClave) {
          // Contraseña correcta - obtener datos completos
          const person = await this.personsRepository.findOne({
            where: { matricula: parseInt(matriculaCompleta) },
          });

          return {
            ...existingUser,
            personData: person,
            doctor: doctorRematriculado,
            isFirstTime: false,
            matriculaSinDigito,
            matriculaCompleta,
          };
        } else {
          console.log('[AUTH] Contraseña incorrecta');
          return null;
        }

      } else {
        console.log('[AUTH] Primera vez - verificando DNI');
        
        // Primera vez: usar DNI como contraseña
        const primeraVez = await this.checkPrimeraVez(matriculaSinDigito, password);
        
        if (primeraVez) {
          console.log('[AUTH] Primera vez exitosa');
          const matriculaCompleta = this.generarMatriculaCompleta(matriculaSinDigito);
          
          return {
            matId: matriculaSinDigito,
            personData: primeraVez.person,
            doctor: primeraVez.doctor,
            isFirstTime: true,
            needsPasswordSetup: true,
            matriculaSinDigito,
            matriculaCompleta,
          };
        } else {
          console.log('[AUTH] DNI incorrecto o no rematriculado');
          return null;
        }
      }

    } catch (error) {
      console.error('Error en validateUser:', error);
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.matricula, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas, matrícula inexistente o no rematriculada');
    }

    // Si es primera vez, devolver token especial
    if (user.isFirstTime) {
      const payload: JwtPayload = {
        sub: loginDto.matricula,
        matricula: loginDto.matricula,
        persona: user.personData?.persona || 0,
      };

      const access_token = this.jwtService.sign(payload, { expiresIn: '30m' });

      return {
        access_token,
        user: {
          matricula: loginDto.matricula,
          persona: user.personData?.persona || 0,
          nombre: user.personData?.nombre,
          apellido: user.personData?.apellido,
        },
        expires_in: '30m',
        needsPasswordSetup: true,
        message: 'Primera vez - configurar contraseña',
      };
    }

    // Login normal
    const payload: JwtPayload = {
      sub: loginDto.matricula,
      matricula: loginDto.matricula,
      persona: user.personData?.persona || 0,
    };

    const access_token = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';

    return {
      access_token,
      user: {
        matricula: loginDto.matricula,
        persona: user.personData?.persona || 0,
        nombre: user.personData?.nombre,
        apellido: user.personData?.apellido,
      },
      expires_in: expiresIn,
    };
  }

  async setupPassword(matriculaSinDigito: string, newPassword: string): Promise<AuthResponse> {
    // Verificar que la matrícula existe y está rematriculada
    const doctor = await this.checkMatriculaRematriculada(matriculaSinDigito);
    if (!doctor) {
      throw new BadRequestException('Matrícula no encontrada o no rematriculada');
    }

    // Verificar que NO existe ya un usuario
    const existingUser = await this.checkUserExists(matriculaSinDigito);
    if (existingUser) {
      throw new ConflictException('El usuario ya tiene contraseña configurada');
    }

    // Crear hash con "contra"
    const hashedPassword = this.hashPasswordWithContra(newPassword);

    // Crear el usuario (usar matrícula SIN dígito en mat_id)
    const newUser = this.usersRepository.create({
      usuClave: hashedPassword,
      matId: matriculaSinDigito,
      tipoUser: 0,
    });

    await this.usersRepository.save(newUser);

    // Obtener datos de la persona
    const matriculaCompleta = this.generarMatriculaCompleta(matriculaSinDigito);
    const person = await this.personsRepository.findOne({
      where: { matricula: parseInt(matriculaCompleta) },
    });

    // Generar token normal
    const payload: JwtPayload = {
      sub: matriculaSinDigito,
      matricula: matriculaSinDigito,
      persona: person?.persona || 0,
    };

    const access_token = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';

    return {
      access_token,
      user: {
        matricula: matriculaSinDigito,
        persona: person?.persona || 0,
        nombre: person?.nombre,
        apellido: person?.apellido,
      },
      expires_in: expiresIn,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    return this.setupPassword(registerDto.matricula, registerDto.password);
  }

  async changePassword(matricula: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
      throw new BadRequestException('Las nuevas contraseñas no coinciden');
    }

    const user = await this.usersRepository.findOne({
      where: { matId: matricula },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const currentPasswordHash = this.hashPasswordWithContra(changePasswordDto.currentPassword);
    if (currentPasswordHash !== user.usuClave) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    // Hash de la nueva contraseña
    const newPasswordHash = this.hashPasswordWithContra(changePasswordDto.newPassword);
    user.usuClave = newPasswordHash;
    await this.usersRepository.save(user);

    return { message: 'Contraseña cambiada exitosamente' };
  }

  async validateUserByMatricula(matricula: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { matId: matricula },
    });

    if (!user) return null;

    const matriculaCompleta = this.generarMatriculaCompleta(matricula);
    
    const person = await this.personsRepository.findOne({
      where: { matricula: parseInt(matriculaCompleta) },
    });

    const doctor = await this.doctorsRepository.findOne({
      where: { matricula: parseInt(matriculaCompleta) },
    });

    return {
      ...user,
      personData: person,
      doctor,
    };
  }

  async getProfile(matricula: string): Promise<any> {
    const user = await this.validateUserByMatricula(matricula);
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const matriculaCompleta = this.generarMatriculaCompleta(matricula);

    return {
      matricula,
      matriculaCompleta,
      persona: user.personData?.persona,
      nombre: user.personData?.nombre,
      apellido: user.personData?.apellido,
      sexo: user.personData?.sexo,
      nroDocumento: user.personData?.nroDocumento,
      tipoUser: user.tipoUser,
      situacion: user.doctor?.situacion,
      colegio: user.doctor?.colegio,
      rematriculado: user.doctor?.rematriculado,
    };
  }

  async refreshToken(matricula: string): Promise<{ access_token: string }> {
    const user = await this.validateUserByMatricula(matricula);
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const payload: JwtPayload = {
      sub: matricula,
      matricula,
      persona: user.personData?.persona || 0,
    };

    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  // Métodos helper para testing
  async generatePasswordHashWithContra(password: string): Promise<string> {
    return this.hashPasswordWithContra(password);
  }

  async generatePasswordHashNormal(password: string): Promise<string> {
    return this.hashPasswordNormal(password);
  }

  async testDigitoVerificador(matricula: string): Promise<any> {
    const digito = this.calcularDigitoVerificador(matricula);
    const matriculaCompleta = this.generarMatriculaCompleta(matricula);
    
    return {
      matriculaSinDigito: matricula,
      digitoVerificador: digito,
      matriculaCompleta,
    };
  }
}
