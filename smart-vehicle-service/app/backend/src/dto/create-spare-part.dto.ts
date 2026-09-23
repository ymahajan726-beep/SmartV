import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsUUID, IsBoolean } from 'class-validator';

export class CreateSparePartDto {
  @IsString()
  @IsNotEmpty()
  partNumber: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minimumStockLevel?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  @IsNotEmpty()
  serviceCenterId: string;
}