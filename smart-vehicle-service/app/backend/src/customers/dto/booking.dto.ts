import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsOptional()
  @IsString()
  serviceCenterId?: string;

  @IsNotEmpty()
  @IsString()
  bookingDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}