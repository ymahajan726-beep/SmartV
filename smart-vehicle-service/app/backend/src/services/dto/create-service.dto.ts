import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsInt()
  @Min(1)
  estimatedDuration: number;

  @IsOptional()
  isActive?: boolean;
}
