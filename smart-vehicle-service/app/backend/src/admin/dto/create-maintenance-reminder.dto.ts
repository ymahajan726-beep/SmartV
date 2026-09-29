import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateMaintenanceReminderDto {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  dueMileage?: number;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}