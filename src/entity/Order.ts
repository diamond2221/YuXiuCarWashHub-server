// models/Order.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Store } from './Store';
import { Package } from './Package';
import { PaymentRecord } from './PaymentRecord';
import { Review } from './Review';
import { User } from './User';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  // order_id: number;
  id: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @ManyToOne(() => Store, store => store.orders)
  store: Store;

  @ManyToOne(() => Package, _package => _package.orders)
  package: Package;

  @Column({ type: 'datetime' })
  appointment_time: Date;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @OneToMany(() => PaymentRecord, payment => payment.order)
  @JoinColumn()
  payments: PaymentRecord[];

  @OneToMany(() => Review, review => review.order)
  @JoinColumn()
  reviews: Review;
}
