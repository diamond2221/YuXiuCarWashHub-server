// models/Employee.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './Store';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  // employee_id: number;
  id: number;

  @ManyToOne(() => Store, store => store.employees)
  @JoinColumn()
  store: Store;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  position: string;
}
