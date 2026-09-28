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
import type { User } from './user.entity.js'; // type-only import use karein
import { Booking } from './booking.entity.js';

@Entity({ name: 'vehicles' })
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ unique: true })
  registrationNumber: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column({ type: 'varchar', nullable: true })
  variant?: string | null;

  @Column({ type: 'int' })
  year: number;

  @Column()
  fuelType: string;

  @Column({ type: 'int' })
  currentMileage: number;

  @Column()
  color: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne('User', (user: User) => user.vehicles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @OneToMany(() => Booking, (booking) => booking.vehicle)
  bookings: Booking[];
}