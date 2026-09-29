import 'reflect-metadata';
import { DataSource } from 'typeorm';
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
 } from '../admin/entities';
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'smart_vehicle_service',
  entities: [User, Vehicle, Service, ServiceCenter, Booking, SparePart, BookingSparePart, Invoice, InvoiceItem, MaintenanceReminder, Review],
  migrations: ['dist/database/migrations/*.js'],
});
