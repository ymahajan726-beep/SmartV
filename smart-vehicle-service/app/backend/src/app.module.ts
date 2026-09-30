import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './admin/module/auth.module.js';
import { CustomerBookingsModule } from './customers/modules/customer-bookings.module.js';
import {
  Booking,
  BookingSparePart,
  Invoice,
  InvoiceItem,
  MaintenanceReminder,
  Review,
  Service,
  ServiceCenter,
  SparePart,
  User,
  Vehicle,
} from './admin/entities/index.js';
import { UsersModule } from './admin/module/users.module.js';
import { VehiclesModule } from './admin/module/vehicles.module.js';
import { ServicesModule } from './admin/module/services.module.js';
import { ServiceCentersModule } from './admin/module/service-centers.module.js';
import { BookingsModule } from './admin/module/bookings.module.js';
import { SparePartsModule } from './admin/module/spare-parts.module.js';
import { InvoicesModule } from './admin/module/invoices.module.js';
import { ReviewsModule } from './admin/module/reviews.module.js';
import { RemindersService } from './admin/service/reminders.service.js';
import { AdminDashboardModule } from './admin/module/admin-dashboard.module.js';
import { ServiceHistoryModule } from './admin/module/service-history.module.js';
import { ServiceStatusModule } from './admin/module/status.module.js';
import { RemindersModule } from './admin/module/reminders.module.js';

// Customer module ko alias name ke sath import kiya gaya hai
import { CustomerVehicleModule } from './customers/modules/customer-vehicle.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        entities: [
          User,
          Vehicle,
          Service,
          ServiceCenter,
          Booking,
          SparePart,
          BookingSparePart,
          Invoice,
          InvoiceItem,
          MaintenanceReminder,
          Review,
        ],
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'smart_vehicle_service'),
        autoLoadEntities: true,
        synchronize: false,
        logging: configService.get<string>('NODE_ENV') === 'development',
        migrations: ['dist/database/migrations/*.js'],
        migrationsTableName: 'migrations',
      }),
    }),
    UsersModule,
    AuthModule,
    VehiclesModule,
    CustomerVehicleModule, // <-- Yahan customer vehicle module register ho gaya hai
    ServicesModule,
    ServiceCentersModule,
    BookingsModule,
    SparePartsModule,
    InvoicesModule,
    ReviewsModule,
    RemindersModule,
    AdminDashboardModule,
    ServiceHistoryModule,
    ServiceStatusModule,
    CustomerBookingsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}