// models/CarwashLocation.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './Store';

@Entity('carwash_locations')
export class CarwashLocation {
  @PrimaryGeneratedColumn()
  // location_id: number;
  id: number;

  @Column({ type: 'int', width: 11 })
  store_id: number;

  @ManyToOne(() => Store, store => store.locations)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'varchar', length: 255 })
  address: string;
}
