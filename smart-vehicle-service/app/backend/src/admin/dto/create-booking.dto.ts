import { IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsUUID()
  vehicleId: string;

  @IsNotEmpty()
  @IsUUID()
  serviceId: string;

  @IsNotEmpty()
  @IsUUID()
  serviceCenterId: string;

  @IsNotEmpty()
  @IsString()
  bookingDate: string; // Format: YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  bookingTime: string; // Format: HH:mm:ss ya HH:mm

  @IsOptional()
  @IsString()
  notes?: string;
}