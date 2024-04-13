// models/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { Order } from './Order';
import { UserVehicle } from './UserVehicle';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  // user_id: number;
  id: number;

  @Column({ type: 'varchar', length: 255 })
  openId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'avatar_url' })
  avatarUrl: string;

  @OneToMany(() => Order, order => order.user)
  @JoinColumn()
  orders: Order[];

  @OneToMany(() => UserVehicle, vehicle => vehicle.user)
  @JoinColumn()
  vehicles: UserVehicle[];
}
