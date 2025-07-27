import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tmp_person')
export class Person {
  @PrimaryColumn({ name: 'matricula', type: 'int' })
  matricula: number;

  @Column({ name: 'persona', type: 'int', nullable: false })
  persona: number;

  @Column({ name: 'apellido', type: 'varchar', length: 160, nullable: false })
  apellido: string;

  @Column({ name: 'nombre', type: 'varchar', length: 160, nullable: false })
  nombre: string;

  @Column({ name: 'tipo_documento', type: 'int', nullable: true })
  tipoDocumento: number | null;

  @Column({ name: 'nro_documento', type: 'int', nullable: false })
  nroDocumento: number;

  @Column({ name: 'fec_nacimiento', type: 'char', length: 40, nullable: true })
  fecNacimiento: string | null;

  @Column({ name: 'lugar_nacimiento', type: 'int', nullable: true })
  lugarNacimiento: number | null;

  @Column({ name: 'nacionalidad', type: 'int', nullable: true })
  nacionalidad: number | null;

  @Column({ name: 'sexo', type: 'char', length: 4, nullable: false })
  sexo: string;

  @Column({ name: 'est_civil', type: 'int', nullable: false })
  estCivil: number;

  // SIN EL CAMPO orc_foto QUE NO EXISTE

  // Virtual field para nombre completo
  get nombreCompleto(): string {
    return `${this.apellido}, ${this.nombre}`;
  }
}
