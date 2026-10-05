import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './modules/auth.module.js'; 
import { UsersModule } from './modules/users.module.js'; 
import {AdminVehiclesModule} from './modules/admin-vehicles.module.js';
import { CustomerVehiclesModule } from './modules/customer-vehicles.module.js';
import { BookingModule } from './modules/booking.module.js';
import { ServiceCenterModule } from './modules/service-center.module.js'; 
import { InventoryModule } from './modules/inventory.module.js'; 
import { ServiceModule } from './modules/service.module.js'; 
import { ReviewModule } from './modules/review.module.js'; 
import { RemindersModule } from './modules/reminders.module.js'; 
import { InvoicesModule } from './modules/invoices.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AdminVehiclesModule,
    CustomerVehiclesModule,
    BookingModule, 
    ServiceCenterModule,
    ServiceModule, 
    InventoryModule, 
    ReviewModule,
    RemindersModule, 
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}