// models/ServiceItem.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceType } from './ServiceType';
import { Package } from './Package';

@Entity('service_items')
export class ServiceItem {
  @PrimaryGeneratedColumn()
  // service_item_id: number;
  id: number;

  @ManyToOne(() => ServiceType, serviceType => serviceType.serviceItems)
  @JoinColumn()
  serviceType: ServiceType;

  @ManyToOne(() => Package, _package => _package.serviceItems)
  @JoinColumn()
  package: Package;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
