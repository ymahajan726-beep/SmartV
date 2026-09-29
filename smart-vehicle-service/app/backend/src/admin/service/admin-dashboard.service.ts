import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Booking, Invoice, Vehicle, ServiceCenter, SparePart } from '../entities/index.js';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(ServiceCenter)
    private serviceCenterRepository: Repository<ServiceCenter>,
    @InjectRepository(SparePart)
    private sparePartRepository: Repository<SparePart>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.userRepository.count();
    const totalBookings = await this.bookingRepository.count();
    const totalVehicles = await this.vehicleRepository.count();
    const totalServiceCenters = await this.serviceCenterRepository.count();
    const totalSpareParts = await this.sparePartRepository.count();

    // Total Revenue calculation from Invoices
    const invoices = await this.invoiceRepository.find();
    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);

    // Direct flat object return kar rahe hain taaki frontend ko access karne mein koi dikkat na ho
    return {
      totalUsers,
      totalBookings,
      totalVehicles,
      totalServiceCenters,
      totalSpareParts,
      totalRevenue: totalRevenue.toFixed(2),
      systemHealth: 'ONLINE',
    };
  }
}