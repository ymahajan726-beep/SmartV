import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('customer/bookings')
  getCustomerBookings(@Req() req: any) {
    const userId = req.user.userId || req.user.id;
    return this.bookingService.findBookingsByUser(userId);
  }

  @Post('customer/bookings')
  createBooking(@Req() req: any, @Body() dto: any) {
    const userId = req.user.userId || req.user.id;
    return this.bookingService.createBooking(userId, dto);
  }

  @Patch('customer/bookings/:id')
  updateCustomerBooking(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    const userId = req.user.userId || req.user.id;
    return this.bookingService.updateBookingByCustomer(userId, id, dto);
  }

  @Delete('customer/bookings/:id')
  cancelBooking(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId || req.user.id;
    return this.bookingService.cancelBooking(userId, id);
  }

  @Get('admin/bookings')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.WORKSHOP)
  getAllBookingsForAdmin() {
    return this.bookingService.findAllBookingsForAdmin();
  }

  @Get('admin/bookings/archived')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.WORKSHOP)
  getArchivedBookingsForAdmin() {
    return this.bookingService.findArchivedBookingsForAdmin();
  }

  @Patch('admin/bookings/:id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.WORKSHOP)
  updateBookingStatusByAdmin(@Param('id') id: string, @Body() dto: { status: any }) {
    return this.bookingService.updateBookingStatusByAdmin(id, dto.status);
  }

  @Post('admin/bookings/:id/spare-parts')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.WORKSHOP)
  async addSparePart(
    @Param('id') bookingId: string,
    @Body() dto: { inventoryPartId: string; quantity: number },
  ) {
    return this.bookingService.addSparePartToBooking(bookingId, dto);
  }

  @Delete('admin/bookings/:id/archive')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.WORKSHOP)
  permanentDeleteArchive(@Param('id') id: string) {
    return this.bookingService.permanentDeleteArchivedBooking(id);
  }
}