import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Person } from '../../persons/entities/person.entity';

@Entity('tmp_matriculados')
export class Doctor {
  @PrimaryColumn({ name: 'matricula', type: 'int' })
  matricula: number;

  @Column({ name: 'persona', type: 'int', nullable: true })
  persona: number | null;

  @Column({ name: 'situacion', type: 'int', nullable: true })
  situacion: number | null;

  @Column({ name: 'colegio', type: 'int', nullable: true })
  colegio: number | null;

  @Column({ name: 'lugar_pago', type: 'int', nullable: true })
  lugarPago: number | null;

  @Column({ name: 'libro', type: 'int', nullable: true })
  libro: number | null;

  @Column({ name: 'folio', type: 'int', nullable: true })
  folio: number | null;

  @Column({ name: 'universidad', type: 'int', nullable: true })
  universidad: number | null;

  @Column({ name: 'nro_jubilado', type: 'varchar', length: 40, nullable: true })
  nroJubilado: string | null;

  @Column({ name: 'fecha_matricula', type: 'varchar', length: 40, nullable: true })
  fechaMatricula: string | null;

  // CAMPO CLAVE PARA AUTH
  @Column({ name: 'rematriculado', type: 'varchar', length: 4, nullable: true })
  rematriculado: string | null;

  // Relación con Person
  @OneToOne(() => Person)
  @JoinColumn({ name: 'matricula', referencedColumnName: 'matricula' })
  personData: Person;

  // Métodos helper
  get info(): string {
    return `Matrícula ${this.matricula} - Persona ${this.persona}`;
  }

  get estaActivo(): boolean {
    return this.situacion === 1;
  }

  get estaRematriculado(): boolean {
    return this.rematriculado === 'S';
  }

  get nombreCompleto(): string {
    return this.personData ? this.personData.nombreCompleto : `Matrícula ${this.matricula}`;
  }
}
