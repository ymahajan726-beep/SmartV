import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  modelName: string;

  @IsString()
  @IsNotEmpty()
  vehicleNumber: string;

  @IsString()
  @IsNotEmpty()
  fuelType: string;

  @IsNumber()
  @IsOptional()
  mileage?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}