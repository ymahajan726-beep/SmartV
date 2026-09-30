import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatus, PaymentStatus } from '../../common/enums/app.enums.js';
import type { User } from './user.entity.js';
import type { Vehicle } from './vehicle.entity.js';
import type { Service } from './service.entity.js';
import type { ServiceCenter } from './service-center.entity.js';
import { BookingSparePart } from './booking-spare-part.entity.js';
import { Invoice } from './invoice.entity.js';
import { Review } from './review.entity.js';

@Entity({ name: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  bookingNumber: string;

  @Column({ type: 'uuid', nullable: true })
  customerId: string;

  @Column({ type: 'uuid' })
  vehicleId: string; // <-- Yahan 'number' se badal kar 'string' kar diya gaya hai

  @Column({ type: 'uuid', nullable: true })
  serviceId: string;

  @Column({ type: 'uuid', nullable: true })
  serviceCenterId: string;

  @Column({ type: 'date' })
  bookingDate: string;

  @Column({ type: 'time', nullable: true })
  bookingTime: string;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedAmount?: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalAmount?: number | null;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.BOOKED })
  status: BookingStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne('User', (user: User) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @ManyToOne('Vehicle', (vehicle: Vehicle) => vehicle.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @ManyToOne('Service', (service: Service) => service.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @ManyToOne('ServiceCenter', (serviceCenter: ServiceCenter) => serviceCenter.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceCenterId' })
  serviceCenter: ServiceCenter;

  @OneToMany(() => BookingSparePart, (bookingSparePart) => bookingSparePart.booking)
  bookingSpareParts: BookingSparePart[];

  @OneToMany(() => Invoice, (invoice) => invoice.booking)
  invoices: Invoice[];

  @OneToOne(() => Review, (review) => review.booking)
  review?: Review | null;
}