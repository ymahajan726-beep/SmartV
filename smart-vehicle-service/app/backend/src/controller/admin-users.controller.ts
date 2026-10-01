import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminUsersService } from '../services/admin-users.service';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN) // Strictly isolated for admin
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  // Dashboard Stats Endpoint for Admin Dashboard counts
  @Get('stats')
  getAdminStats() {
    return this.adminUsersService.getDashboardStats();
  }

  @Post('users')
  createStaff(@Body() dto: any) {
    return this.adminUsersService.createStaff(dto);
  }

  @Get('users/directory/customers')
  getCustomerDirectory() {
    return this.adminUsersService.findAllCustomers();
  }

  @Get('users/directory/staff')
  getStaffDirectory() {
    return this.adminUsersService.findAllStaff();
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.adminUsersService.findUserById(id);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.adminUsersService.updateUser(id, dto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminUsersService.deleteUser(id);
  }
}