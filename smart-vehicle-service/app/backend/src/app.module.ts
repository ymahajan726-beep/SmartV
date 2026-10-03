import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './modules/auth.module.js'; // Sahi path ke sath update kiya gaya hai
import { UsersModule } from './modules/users.module.js'; // Sahi path ke sath update kiya gaya hai
import {AdminVehiclesModule} from './modules/admin-vehicles.module.js';
import { CustomerVehiclesModule } from './modules/customer-vehicles.module.js';
import { BookingModule } from './modules/booking.module.js';
import { ServiceCenterModule } from './modules/service-center.module.js'; // Sahi path ke sath update kiya gaya hai
import { InventoryModule } from './modules/inventory.module.js'; // Sahi path ke sath update kiya gaya hai
import { ServiceModule } from './modules/service.module.js'; // Sahi path ke sath update kiya gaya hai
import { ReviewModule } from './modules/review.module.js'; // Sahi path ke sath update kiya gaya hai
import { RemindersModule } from './modules/reminders.module.js'; // Sahi path ke sath update kiya gaya hai
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