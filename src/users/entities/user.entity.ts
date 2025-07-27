import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Entity('usuarios')
export class User {
  @PrimaryColumn({ name: 'usu_clave', type: 'varchar', length: 255 })
  usuClave: string;

  @Column({ name: 'mat_id', type: 'varchar', length: 80, nullable: false })
  matId: string;

  @Column({ name: 'tipo_user', type: 'int', default: 0 })
  tipoUser: number;

  @Column({ name: 'reset_token', type: 'varchar', length: 255, nullable: true })
  resetToken: string | null;

  @Column({ name: 'reset_expiracion', type: 'datetime', nullable: true })
  resetExpiracion: Date | null;

  // Relación con Doctor (COMENTADA TEMPORALMENTE)
  // @ManyToOne(() => Doctor, doctor => doctor.users)
  // @JoinColumn({ name: 'mat_id', referencedColumnName: 'matricula' })
  // doctor: Doctor;
}
