// models/ServiceType.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { ServiceItem } from './ServiceItem';

@Entity('service_types')
export class ServiceType {
  @PrimaryGeneratedColumn()
  // service_type_id: number;
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => ServiceItem, serviceItem => serviceItem.serviceType)
  @JoinColumn()
  serviceItems: ServiceItem[];
}
