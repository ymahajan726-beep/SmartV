import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity.js';
import { Booking } from './booking.entity.js';
import { SparePart } from './spare-part.entity.js';
import { Review } from './review.entity.js';

@Entity({ name: 'service_centers' })
export class ServiceCenter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pincode: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ type: 'time' })
  openingTime: string;

  @Column({ type: 'time' })
  closingTime: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude?: number | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude?: number | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.serviceCenter)
  staffUsers: User[];

  @OneToMany(() => Booking, (booking) => booking.serviceCenter)
  bookings: Booking[];

  @OneToMany(() => SparePart, (sparePart) => sparePart.serviceCenter)
  spareParts: SparePart[];

  @OneToMany(() => Review, (review) => review.serviceCenter)
  reviews: Review[];
}