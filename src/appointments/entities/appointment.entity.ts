import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Specialty } from '../../specialties/entities/specialty.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { MedicalRecord } from '../../medical-history/entities/medical-record.entity';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';

@Entity('turnos')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'matricula', type: 'int', nullable: false })
  matricula: number;

  @Column({ name: 'clinica_id', type: 'int', nullable: false })
  clinicaId: number;

  @Column({ name: 'paciente_id', type: 'int', nullable: false })
  pacienteId: number;

  @Column({ name: 'especialidad_id', type: 'int', nullable: true })
  especialidadId: number | null;

  @Column({ type: 'date', nullable: false })
  fecha: Date;

  @Column({ name: 'hora_inicio', type: 'time', nullable: false })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time', nullable: false })
  horaFin: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.AGENDADO
  })
  estado: AppointmentStatus;

  @Column({ type: 'varchar', length: 200, nullable: true })
  motivo: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio: number | null;

  @Column({ type: 'boolean', default: false })
  pagado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones (SIN BIDIRECCIONAL)
  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'matricula', referencedColumnName: 'matricula' })
  doctor: Doctor;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: 'clinica_id' })
  clinic: Clinic;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'paciente_id' })
  patient: Patient;

  @ManyToOne(() => Specialty)
  @JoinColumn({ name: 'especialidad_id', referencedColumnName: 'especialidad' })
  specialty: Specialty;

  @OneToMany(() => Payment, payment => payment.appointment)
  payments: Payment[];

  @OneToMany(() => MedicalRecord, record => record.appointment)
  medicalRecords: MedicalRecord[];

  // Helper methods
  get fechaCompleta(): string {
    return `${this.fecha.toISOString().split('T')[0]} ${this.horaInicio}`;
  }

  get duracionMinutos(): number {
    const inicio = new Date(`2000-01-01 ${this.horaInicio}`);
    const fin = new Date(`2000-01-01 ${this.horaFin}`);
    return (fin.getTime() - inicio.getTime()) / (1000 * 60);
  }

  get puedeSerCancelado(): boolean {
    const ahora = new Date();
    const fechaTurno = new Date(`${this.fecha.toISOString().split('T')[0]}T${this.horaInicio}`);
    return fechaTurno > ahora && this.estado === AppointmentStatus.AGENDADO;
  }
}
