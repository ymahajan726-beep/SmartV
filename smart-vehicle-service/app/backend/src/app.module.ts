import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
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
} from './entities/index.js';
import { UsersModule } from './users/users.module.js';
import { VehiclesModule } from './vehicles/vehicles.module.js';
import { ServicesModule } from './services/services.module.js';
import { ServiceCentersModule } from './service-centers/service-centers.module.js';

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
    ServicesModule,
    ServiceCentersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
