import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceCenterDto } from './create-service-center.dto.js';

export class UpdateServiceCenterDto extends PartialType(CreateServiceCenterDto) {}
