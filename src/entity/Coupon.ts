// models/Coupon.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './Store';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  // coupon_id: number;
  id: number;

  @ManyToOne(() => Store, store => store.coupons)
  @JoinColumn()
  store: Store;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount: number;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;
}
