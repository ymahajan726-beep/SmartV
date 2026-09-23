export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SERVICE_CENTER = 'SERVICE_CENTER',
  ADMIN = 'ADMIN',
}

export enum BookingStatus {
  BOOKED = 'BOOKED',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
}

export enum InvoiceItemType {
  SERVICE = 'SERVICE',
  SPARE_PART = 'SPARE_PART',
  LABOR = 'LABOR',
  OTHER = 'OTHER',
}