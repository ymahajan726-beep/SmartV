import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('vehicles')
export class VehicleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  modelName: string;

  @Column({ type: 'varchar', nullable: true })
  vehicleNumber: string;

  @Column({ type: 'varchar', nullable: true })
  fuelType: string;

  @Column({ type: 'float', default: 0 })
  mileage: number;

  @Column({ type: 'varchar', nullable: false })
  userId: string; // Specific user isolation ke liye zaroori hai

  @Column({ type: 'text', nullable: true })
  imageUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}