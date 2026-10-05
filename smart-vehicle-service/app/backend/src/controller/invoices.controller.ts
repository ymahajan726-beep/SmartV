import { Controller, Get, Param, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { InvoicesService } from '../services/invoices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.WORKSHOP)
  findAllInvoices() {
    return this.invoicesService.findAllInvoices();
  }
  @Get('recent-paid')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.WORKSHOP)
  findRecentPaidInvoices() {
    return this.invoicesService.findRecentPaidInvoices();
  }

  @Get('customer/my-invoices')
  findCustomerInvoices(@Req() req: any) {
    const customerId = req.user.userId || req.user.id;
    return this.invoicesService.findInvoicesByCustomer(customerId);
  }

  @Get('booking/:bookingId')
  getInvoiceByBooking(@Param('bookingId') bookingId: string) {
    return this.invoicesService.generateOrGetInvoice(bookingId);
  }

  @Patch(':id/charges')
  updateCharges(
    @Param('id') id: string, 
    @Body() dto: { manualLabor: number; discount: number }
  ) {
    return this.invoicesService.updateManualCharges(id, dto.manualLabor, dto.discount);
  }

  @Patch(':id/payment')
  updatePayment(
    @Param('id') id: string, 
    @Body() dto: { paymentMethod: 'CASH' | 'ONLINE' }
  ) {
    return this.invoicesService.updatePaymentStatus(id, dto.paymentMethod || 'CASH');
  }
}