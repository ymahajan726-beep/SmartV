import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ForbiddenException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../service/users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Post('staff')
  async createStaff(@Body(new ValidationPipe()) dto: any) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) dto: any) {
    const user = await this.usersService.findById(id);
    
    // Security check: Super Admin role ya email ko modify hone se bachane ke liye
    if (user && (String(user.role) === 'SUPER_ADMIN' || user.email === 'admin@autocare.com')) {
      if (dto.role && dto.role !== 'ADMIN' && dto.role !== 'SUPER_ADMIN') {
        throw new ForbiddenException('Critical Security Error: Super Admin role cannot be downgraded!');
      }
    }

    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    
    if (user && (String(user.role) === 'SUPER_ADMIN' || user.email === 'admin@autocare.com')) {
      throw new ForbiddenException('Critical Security Error: Super Admin account cannot be deleted!');
    }

    await this.usersService.remove(id);
    return { success: true };
  }
}