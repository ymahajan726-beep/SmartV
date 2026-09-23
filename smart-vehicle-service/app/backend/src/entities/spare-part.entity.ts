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
import type { ServiceCenter } from './service-center.entity.js';
import { BookingSparePart } from './booking-spare-part.entity.js';

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

  @ManyToOne('ServiceCenter', (serviceCenter: ServiceCenter) => serviceCenter.spareParts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceCenterId' })
  serviceCenter: ServiceCenter;

  @OneToMany(() => BookingSparePart, (bookingSparePart) => bookingSparePart.sparePart)
  bookingSpareParts: BookingSparePart[];
}