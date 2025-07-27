import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('rec_paciente')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true, nullable: false })
  dni: number;

  @Column({ type: 'int', nullable: true })
  cuil: number | null;

  @Column({ type: 'text', nullable: false })
  apellido: string;

  @Column({ type: 'text', nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: false })
  sexo: string;

  @Column({ type: 'int', nullable: true })
  talla: number | null;

  @Column({ type: 'int', nullable: true })
  peso: number | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  latitud: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  longitud: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  calle: string | null;

  @Column({ type: 'int', nullable: true })
  numero: number | null;

  @Column({ type: 'int', nullable: true })
  piso: number | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  departamento: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  cpostal: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  barrio: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  monoblock: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  ciudad: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  municipio: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  provincia: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pais: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mensaf: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  origenf: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  fechaf: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  foto: string | null;

  @Column({ name: 'fechaConsulta', type: 'varchar', length: 20, nullable: true })
  fechaConsulta: string | null;

  @Column({ type: 'text', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 5, nullable: true })
  paistelef: string | null;

  @Column({ type: 'text', nullable: true })
  telefono: string | null;

  @Column({ type: 'int', nullable: true, default: null })
  idobrasocial: number | null;

  @Column({ type: 'text', nullable: true })
  nromatriculadoc: string | null;

  @Column({ type: 'int', nullable: true, default: null })
  tipoplan: number | null;

  @Column({ type: 'date', nullable: true })
  fechac: Date | null;

  @Column({ name: 'renaper_act', type: 'timestamp', nullable: true })
  renaperAct: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fecha: string | null;

  // Relaciones
  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments: Appointment[];

  // Virtual fields
  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }

  get edadAproximada(): number | null {
    if (!this.fechac) return null;
    const hoy = new Date();
    const nacimiento = new Date(this.fechac);
    return hoy.getFullYear() - nacimiento.getFullYear();
  }
}
