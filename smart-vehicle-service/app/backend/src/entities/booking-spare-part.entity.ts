import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Booking } from './booking.entity.js';
import type { SparePart } from './spare-part.entity.js';

@Entity({ name: 'booking_spare_parts' })
export class BookingSparePart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  bookingId: string;

  @Column({ type: 'uuid' })
  sparePartId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ManyToOne('Booking', (booking: Booking) => booking.bookingSpareParts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ManyToOne('SparePart', (sparePart: SparePart) => sparePart.bookingSpareParts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sparePartId' })
  sparePart: SparePart;
}