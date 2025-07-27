import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Clinic } from '../../clinics/entities/clinic.entity';

@Entity('horarios_medicos')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'matricula', type: 'int', nullable: false })
  matricula: number;

  @Column({ name: 'clinica_id', type: 'int', nullable: false })
  clinicaId: number;

  @Column({ name: 'dia_semana', type: 'tinyint', nullable: false })
  diaSemana: number; // 0=Domingo, 1=Lunes, ..., 6=Sábado

  @Column({ name: 'hora_inicio', type: 'time', nullable: false })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time', nullable: false })
  horaFin: string;

  @Column({ name: 'duracion_turno', type: 'int', default: 30 })
  duracionTurno: number; // minutos

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones (SIN BIDIRECCIONAL)
  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'matricula', referencedColumnName: 'matricula' })
  doctor: Doctor;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: 'clinica_id' })
  clinic: Clinic;

  // Helper methods
  get diaSemanaTexto(): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[this.diaSemana] || 'Día inválido';
  }
}
