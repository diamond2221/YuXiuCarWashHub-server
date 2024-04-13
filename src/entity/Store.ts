// models/Store.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { Package } from './Package';
import { Order } from './Order';
import { CarwashLocation } from './CarwashLocation';
import { Employee } from './Employee';
import { Coupon } from './Coupon';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  // store_id: number;
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  business_hours: string;

  @OneToMany(() => Package, _package => _package.store)
  @JoinColumn()
  packages: Package[];

  @OneToMany(() => Order, order => order.store)
  @JoinColumn()
  orders: Order[];

  @OneToMany(() => Employee, employee => employee.store)
  @JoinColumn()
  employees: Employee[];

  @OneToMany(() => Coupon, coupon => coupon.store)
  @JoinColumn()
  coupons: Coupon[];

  @OneToMany(() => CarwashLocation, location => location.store)
  locations: CarwashLocation[]; // 这里的属性名应该与 CarwashLocation 实体的关联属性名匹配
}
