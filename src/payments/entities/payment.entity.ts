import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

export enum PaymentMethod {
  EFECTIVO = 'efectivo',
  TARJETA = 'tarjeta',
  TRANSFERENCIA = 'transferencia',
  OBRA_SOCIAL = 'obra_social',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('pagos')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'turno_id', type: 'int', nullable: false })
  turnoId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  monto: number;

  @Column({
    name: 'metodo_pago',
    type: 'enum',
    enum: PaymentMethod,
    nullable: false
  })
  metodoPago: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  estado: PaymentStatus;

  @Column({ name: 'fecha_pago', type: 'timestamp', nullable: true })
  fechaPago: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  comprobante: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Appointment, appointment => appointment.payments)
  @JoinColumn({ name: 'turno_id' })
  appointment: Appointment;
}
