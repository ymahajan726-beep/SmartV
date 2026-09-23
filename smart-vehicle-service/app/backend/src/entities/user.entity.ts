import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../common/enums/app.enums.js';
import { ServiceCenter } from './service-center.entity.js';
import { Vehicle } from './vehicle.entity.js';
import { Booking } from './booking.entity.js';
import { Invoice } from './invoice.entity.js';
import { MaintenanceReminder } from './maintenance-reminder.entity.js';
import { Review } from './review.entity.js';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ type: 'uuid', nullable: true })
  serviceCenterId: string | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => ServiceCenter, (serviceCenter) => serviceCenter.staffUsers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'serviceCenterId' })
  serviceCenter?: ServiceCenter | null;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.customer)
  vehicles: Vehicle[];

  @OneToMany(() => Booking, (booking) => booking.customer)
  bookings: Booking[];

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];

 // @OneToMany(() => MaintenanceReminder, (reminder) => reminder.customer)
 // maintenanceReminders: MaintenanceReminder[];

  @OneToMany(() => Review, (review) => review.customer)
  reviews: Review[];
}