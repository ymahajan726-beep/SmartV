import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from './user.entity.js';
import { Booking } from './booking.entity.js';

@Entity({ name: 'vehicles' })
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number; // Integer ID

  @Column({ name: 'userId', nullable: true })
  userId: string;

  @Column({ name: 'customerId', nullable: true })
  customerId: string;

  @Column({ name: 'vehicleNumber' })
  vehicleNumber: string; // <-- Yeh 'registrationNumber' ki jagah 'vehicleNumber' hai

  @Column({ name: 'modelName' })
  modelName: string;

  @Column({ name: 'fuelType', nullable: true })
  fuelType: string;

  @Column({ name: 'mileage', type: 'float', nullable: true })
  mileage: number;

  @Column({ name: 'imageUrl', nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne('User', (user: User) => user.vehicles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @OneToMany(() => Booking, (booking) => booking.vehicle)
  bookings: Booking[];
}