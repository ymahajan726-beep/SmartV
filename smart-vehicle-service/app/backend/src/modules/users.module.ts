import { Module } from '@nestjs/common';
import {AdminUsersController} from '../controller/admin-users.controller.js';
import { CustomerUsersController } from '../controller/customer-users.controller.js';
import { AdminUsersService } from '../services/admin-users.service.js';
import { CustomerUsersService } from '../services/customer-users.service.js';
import { AuthModule } from './auth.module.js'; 

@Module({
  imports: [AuthModule], 
  controllers: [AdminUsersController, CustomerUsersController],
  providers: [AdminUsersService, CustomerUsersService],
  exports: [AdminUsersService, CustomerUsersService],
})
export class UsersModule {}