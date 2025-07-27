import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('tmp_especialidades')
export class Specialty {
  @PrimaryColumn({ name: 'especialidad', type: 'int' })
  especialidad: number;

  @Column({ type: 'varchar', length: 45, nullable: false })
  denominacion: string;

  @Column({ name: 'denominacion_diploma', type: 'int', nullable: true })
  denominacionDiploma: number | null;

  @Column({ name: 'colacion_nro_orden', type: 'int', nullable: true })
  colacionNroOrden: number | null;

  @Column({ name: 'colacion_orden', type: 'int', nullable: true })
  colacionOrden: number | null;

  @Column({ type: 'varchar', length: 1, nullable: true })
  antecedentes: string | null;

  @Column({ name: 'antecedentes_denominacion', type: 'varchar', length: 30, nullable: true })
  antecedentesDenominacion: string | null;

  @Column({ name: 'tipo_especialidad', type: 'varchar', length: 1, nullable: true })
  tipoEspecialidad: string | null;

  // Relaciones
  @OneToMany(() => Appointment, appointment => appointment.specialty)
  appointments: Appointment[];

  // Helper methods
  get esActiva(): boolean {
    return this.tipoEspecialidad === '1' || this.tipoEspecialidad === 'A';
  }
}
