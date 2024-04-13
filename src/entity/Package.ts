// models/Package.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Store } from './Store';
import { Order } from './Order';
import { ServiceItem } from './ServiceItem';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn()
  // package_id: number;
  id: number;

  @ManyToOne(() => Store, store => store.packages)
  @JoinColumn()
  store: Store;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => Order, order => order.package)
  @JoinColumn()
  orders: Order[];

  @OneToMany(() => ServiceItem, serviceItem => serviceItem.package)
  @JoinColumn()
  serviceItems: ServiceItem[];
}
