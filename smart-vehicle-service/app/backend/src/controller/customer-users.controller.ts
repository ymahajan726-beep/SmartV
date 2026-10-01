import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { CustomerUsersService } from '../services/customer-users.service';
import { CustomerUpdateProfileDto } from '../dto/customer-update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('customer/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CUSTOMER) // Strictly isolated for customers
export class CustomerUsersController {
  constructor(private readonly customerUsersService: CustomerUsersService) {}

  @Get('profile')
  getProfile(@Req() req : any) {
    return this.customerUsersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  updateProfile(@Req() req:any, @Body() dto: CustomerUpdateProfileDto) {
    return this.customerUsersService.updateProfile(req.user.userId, dto);
  }
}