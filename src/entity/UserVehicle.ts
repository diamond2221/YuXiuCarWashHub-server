// models/UserVehicle.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('user_vehicles')
export class UserVehicle {
  @PrimaryGeneratedColumn()
  // vehicle_id: number;
  id: number;

  @ManyToOne(() => User, user => user.vehicles)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 20 })
  license_plate: string;

  @Column({ type: 'varchar', length: 255 })
  brand: string;

  @Column({ type: 'varchar', length: 255 })
  model: string;

  @Column({ type: 'varchar', length: 50 })
  color: string;
}
