import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SERVICE_CENTER = 'SERVICE_CENTER',
  ADMIN = 'ADMIN',
}

export enum BookingStatus {
  BOOKED = 'BOOKED',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
}

export enum InvoiceItemType {
  SERVICE = 'SERVICE',
  SPARE_PART = 'SPARE_PART',
  LABOR = 'LABOR',
  OTHER = 'OTHER',
}

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

  @OneToMany(() => MaintenanceReminder, (reminder) => reminder.customer)
  maintenanceReminders: MaintenanceReminder[];

  @OneToMany(() => Review, (review) => review.customer)
  reviews: Review[];
}

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

  @ManyToOne(() => User, (user) => user.vehicles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @OneToMany(() => Booking, (booking) => booking.vehicle)
  bookings: Booking[];

  @OneToMany(() => MaintenanceReminder, (reminder) => reminder.vehicle)
  maintenanceReminders: MaintenanceReminder[];
}

@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'int' })
  estimatedDuration: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];
}

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

@Entity({ name: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  bookingNumber: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'uuid' })
  vehicleId: string;

  @Column({ type: 'uuid' })
  serviceId: string;

  @Column({ type: 'uuid' })
  serviceCenterId: string;

  @Column({ type: 'date' })
  bookingDate: string;

  @Column({ type: 'time' })
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

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @ManyToOne(() => Service, (service) => service.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @ManyToOne(() => ServiceCenter, (serviceCenter) => serviceCenter.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceCenterId' })
  serviceCenter: ServiceCenter;

  @OneToMany(() => BookingSparePart, (bookingSparePart) => bookingSparePart.booking)
  bookingSpareParts: BookingSparePart[];

  @OneToMany(() => Invoice, (invoice) => invoice.booking)
  invoices: Invoice[];

  @OneToOne(() => Review, (review) => review.booking)
  review?: Review | null;
}

@Entity({ name: 'spare_parts' })
export class SparePart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  partNumber: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'int', default: 0 })
  minimumStockLevel: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'uuid' })
  serviceCenterId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => ServiceCenter, (serviceCenter) => serviceCenter.spareParts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceCenterId' })
  serviceCenter: ServiceCenter;

  @OneToMany(() => BookingSparePart, (bookingSparePart) => bookingSparePart.sparePart)
  bookingSpareParts: BookingSparePart[];
}

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

  @ManyToOne(() => Booking, (booking) => booking.bookingSpareParts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ManyToOne(() => SparePart, (sparePart) => sparePart.bookingSpareParts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sparePartId' })
  sparePart: SparePart;
}

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column({ type: 'uuid' })
  bookingId: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  issuedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Booking, (booking) => booking.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ManyToOne(() => User, (user) => user.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice)
  items: InvoiceItem[];
}

@Entity({ name: 'invoice_items' })
export class InvoiceItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  invoiceId: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: InvoiceItemType, default: InvoiceItemType.SERVICE })
  itemType: InvoiceItemType;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;
}

@Entity({ name: 'maintenance_reminders' })
export class MaintenanceReminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'uuid' })
  vehicleId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date', nullable: true })
  dueDate?: string | null;

  @Column({ type: 'int', nullable: true })
  dueMileage?: number | null;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.maintenanceReminders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.maintenanceReminders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;
}

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  bookingId: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'uuid' })
  serviceCenterId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => Booking, (booking) => booking.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @ManyToOne(() => ServiceCenter, (serviceCenter) => serviceCenter.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceCenterId' })
  serviceCenter: ServiceCenter;
}
