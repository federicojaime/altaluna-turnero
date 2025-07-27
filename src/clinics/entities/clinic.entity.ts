import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DoctorClinic } from '../../doctors/entities/doctor-clinic.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity('clinicas')
export class Clinic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  direccion: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  email: string | null;

  @Column({ name: 'codigo_postal', type: 'varchar', length: 10, nullable: true })
  codigoPostal: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ciudad: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  provincia: string | null;

  @Column({ type: 'varchar', length: 15, nullable: true })
  cuit: string | null;

  @Column({ type: 'tinyint', default: 1 })
  activa: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => DoctorClinic, doctorClinic => doctorClinic.clinic)
  doctors: DoctorClinic[];

  @OneToMany(() => Appointment, appointment => appointment.clinic)
  appointments: Appointment[];

  @OneToMany(() => Schedule, schedule => schedule.clinic)
  schedules: Schedule[];
}
