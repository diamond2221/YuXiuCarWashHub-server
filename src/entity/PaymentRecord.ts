// models/PaymentRecord.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './Order';

@Entity('payment_records')
export class PaymentRecord {
  @PrimaryGeneratedColumn()
  // payment_id: number;
  id: number;

  @ManyToOne(() => Order, order => order.payments)
  @JoinColumn()
  order: Order;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 50 })
  payment_method: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transaction_id: string;

  @Column({ type: 'enum', enum: ['success', 'failed'], default: 'success' })
  status: string;
}
