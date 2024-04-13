// models/Review.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './Order';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  // review_id: number;
  id: number;

  @ManyToOne(() => Order, order => order.reviews)
  @JoinColumn()
  order: Order;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;
}
