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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true }) // ya nullable: false jaisa bhi ho
customerId: string;

  @Column({ type: 'varchar', unique: true })
  registrationNumber: string;

  @Column({ type: 'varchar' })
  make: string;

  @Column({ type: 'varchar' })
  model: string;

  @Column({ type: 'varchar', nullable: true })
  variant?: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar' })
  fuelType: string;

  @Column({ type: 'int' })
  currentMileage: number;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne('User', (user: User) => user.vehicles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @OneToMany(() => Booking, (booking) => booking.vehicle)
  bookings: Booking[];
}