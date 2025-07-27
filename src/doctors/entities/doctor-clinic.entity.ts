import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Doctor } from './doctor.entity';
import { Clinic } from '../../clinics/entities/clinic.entity';

@Entity('medico_clinica')
export class DoctorClinic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'matricula', type: 'int', nullable: false })
  matricula: number;

  @Column({ name: 'clinica_id', type: 'int', nullable: false })
  clinicaId: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ name: 'fecha_ingreso', type: 'date', nullable: true })
  fechaIngreso: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones (SIN BIDIRECCIONAL)
  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'matricula', referencedColumnName: 'matricula' })
  doctor: Doctor;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: 'clinica_id' })
  clinic: Clinic;
}
