import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('historia_clinica')
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'turno_id', type: 'int', nullable: false })
  turnoId: number;

  @Column({ type: 'text', nullable: true })
  diagnostico: string | null;

  @Column({ type: 'text', nullable: true })
  tratamiento: string | null;

  @Column({ type: 'text', nullable: true })
  medicamentos: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @Column({ name: 'proxima_cita', type: 'date', nullable: true })
  proximaCita: Date | null;

  @Column({ name: 'archivos_adjuntos', type: 'json', nullable: true })
  archivosAdjuntos: any | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Appointment, appointment => appointment.medicalRecords)
  @JoinColumn({ name: 'turno_id' })
  appointment: Appointment;
}
