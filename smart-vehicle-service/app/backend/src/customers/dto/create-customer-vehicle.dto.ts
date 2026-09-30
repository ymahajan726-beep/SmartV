
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCustomerVehicleDto {
  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsOptional()
  @IsString()
  variant?: string | null;

  @IsInt()
  @Min(1900)
  year: number;

  @IsString()
  @IsNotEmpty()
  fuelType: string;

  @IsInt()
  @Min(0)
  currentMileage: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;
}

