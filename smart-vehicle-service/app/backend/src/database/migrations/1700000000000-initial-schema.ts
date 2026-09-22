import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TYPE "public"."users_role_enum" AS ENUM('CUSTOMER', 'SERVICE_CENTER', 'ADMIN');
      CREATE TYPE "public"."booking_status_enum" AS ENUM('BOOKED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED');
      CREATE TYPE "public"."payment_status_enum" AS ENUM('UNPAID', 'PAID');
      CREATE TYPE "public"."invoice_item_type_enum" AS ENUM('SERVICE', 'SPARE_PART', 'LABOR', 'OTHER');

      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'CUSTOMER',
        "serviceCenterId" uuid,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      );

      CREATE TABLE "service_centers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text NOT NULL,
        "address" character varying NOT NULL,
        "city" character varying NOT NULL,
        "state" character varying NOT NULL,
        "pincode" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "email" character varying NOT NULL,
        "openingTime" TIME NOT NULL,
        "closingTime" TIME NOT NULL,
        "latitude" numeric(9,6),
        "longitude" numeric(9,6),
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_service_centers" PRIMARY KEY ("id")
      );

      CREATE TABLE "vehicles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "customerId" uuid NOT NULL,
        "registrationNumber" character varying NOT NULL,
        "make" character varying NOT NULL,
        "model" character varying NOT NULL,
        "variant" character varying,
        "year" integer NOT NULL,
        "fuelType" character varying NOT NULL,
        "currentMileage" integer NOT NULL,
        "color" character varying NOT NULL,
        "imageUrl" character varying,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_vehicles" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_vehicles_registrationNumber" UNIQUE ("registrationNumber")
      );

      CREATE TABLE "services" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text NOT NULL,
        "basePrice" numeric(10,2) NOT NULL,
        "estimatedDuration" integer NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_services" PRIMARY KEY ("id")
      );

      CREATE TABLE "bookings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingNumber" character varying NOT NULL,
        "customerId" uuid NOT NULL,
        "vehicleId" uuid NOT NULL,
        "serviceId" uuid NOT NULL,
        "serviceCenterId" uuid NOT NULL,
        "bookingDate" date NOT NULL,
        "bookingTime" time NOT NULL,
        "notes" text,
        "estimatedAmount" numeric(10,2),
        "finalAmount" numeric(10,2),
        "status" "public"."booking_status_enum" NOT NULL DEFAULT 'BOOKED',
        "paymentStatus" "public"."payment_status_enum" NOT NULL DEFAULT 'UNPAID',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bookings" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_bookings_bookingNumber" UNIQUE ("bookingNumber")
      );

      CREATE TABLE "spare_parts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "partNumber" character varying NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "price" numeric(10,2) NOT NULL,
        "stockQuantity" integer NOT NULL DEFAULT 0,
        "minimumStockLevel" integer NOT NULL DEFAULT 0,
        "isActive" boolean NOT NULL DEFAULT true,
        "serviceCenterId" uuid NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_spare_parts" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_spare_parts_partNumber" UNIQUE ("partNumber")
      );

      CREATE TABLE "booking_spare_parts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingId" uuid NOT NULL,
        "sparePartId" uuid NOT NULL,
        "quantity" integer NOT NULL,
        "unitPrice" numeric(10,2) NOT NULL,
        "totalPrice" numeric(10,2) NOT NULL,
        CONSTRAINT "PK_booking_spare_parts" PRIMARY KEY ("id")
      );

      CREATE TABLE "invoices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "invoiceNumber" character varying NOT NULL,
        "bookingId" uuid NOT NULL,
        "customerId" uuid NOT NULL,
        "subtotal" numeric(10,2) NOT NULL,
        "taxAmount" numeric(10,2) NOT NULL DEFAULT 0,
        "discountAmount" numeric(10,2) NOT NULL DEFAULT 0,
        "totalAmount" numeric(10,2) NOT NULL,
        "paymentStatus" "public"."payment_status_enum" NOT NULL DEFAULT 'UNPAID',
        "issuedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_invoices" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_invoices_invoiceNumber" UNIQUE ("invoiceNumber")
      );

      CREATE TABLE "invoice_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "invoiceId" uuid NOT NULL,
        "description" text NOT NULL,
        "itemType" "public"."invoice_item_type_enum" NOT NULL DEFAULT 'SERVICE',
        "quantity" integer NOT NULL DEFAULT 1,
        "unitPrice" numeric(10,2) NOT NULL,
        "totalPrice" numeric(10,2) NOT NULL,
        CONSTRAINT "PK_invoice_items" PRIMARY KEY ("id")
      );

      CREATE TABLE "maintenance_reminders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "customerId" uuid NOT NULL,
        "vehicleId" uuid NOT NULL,
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "dueDate" date,
        "dueMileage" integer,
        "isCompleted" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_maintenance_reminders" PRIMARY KEY ("id")
      );

      CREATE TABLE "reviews" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingId" uuid NOT NULL,
        "customerId" uuid NOT NULL,
        "serviceCenterId" uuid NOT NULL,
        "rating" integer NOT NULL,
        "comment" text,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_reviews" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_reviews_bookingId" UNIQUE ("bookingId")
      );

      ALTER TABLE "users"
        ADD CONSTRAINT "FK_users_service_center" FOREIGN KEY ("serviceCenterId") REFERENCES "service_centers"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

      ALTER TABLE "vehicles"
        ADD CONSTRAINT "FK_vehicles_customer" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

      ALTER TABLE "bookings"
        ADD CONSTRAINT "FK_bookings_customer" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        ADD CONSTRAINT "FK_bookings_vehicle" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        ADD CONSTRAINT "FK_bookings_service" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        ADD CONSTRAINT "FK_bookings_service_center" FOREIGN KEY ("serviceCenterId") REFERENCES "service_centers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

      ALTER TABLE "spare_parts"
        ADD CONSTRAINT "FK_spare_parts_service_center" FOREIGN KEY ("serviceCenterId") REFERENCES "service_centers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

      ALTER TABLE "booking_spare_parts"
        ADD CONSTRAINT "FK_booking_spare_parts_booking" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        ADD CONSTRAINT "FK_booking_spare_parts_spare_part" FOREIGN KEY ("sparePartId") REFERENCES "spare_parts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

      ALTER TABLE "invoices"
        ADD CONSTRAINT "FK_invoices_booking" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        ADD CONSTRAINT "FK_invoices_customer" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

      ALTER TABLE "invoice_items"
        ADD CONSTRAINT "FK_invoice_items_invoice" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

      ALTER TABLE "maintenance_reminders"
        ADD CONSTRAINT "FK_maintenance_reminders_customer" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        ADD CONSTRAINT "FK_maintenance_reminders_vehicle" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

      ALTER TABLE "reviews"
        ADD CONSTRAINT "FK_reviews_booking" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        ADD CONSTRAINT "FK_reviews_customer" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        ADD CONSTRAINT "FK_reviews_service_center" FOREIGN KEY ("serviceCenterId") REFERENCES "service_centers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "reviews";
      DROP TABLE IF EXISTS "maintenance_reminders";
      DROP TABLE IF EXISTS "invoice_items";
      DROP TABLE IF EXISTS "invoices";
      DROP TABLE IF EXISTS "booking_spare_parts";
      DROP TABLE IF EXISTS "spare_parts";
      DROP TABLE IF EXISTS "bookings";
      DROP TABLE IF EXISTS "services";
      DROP TABLE IF EXISTS "vehicles";
      DROP TABLE IF EXISTS "service_centers";
      DROP TABLE IF EXISTS "users";
      DROP TYPE IF EXISTS "public"."invoice_item_type_enum";
      DROP TYPE IF EXISTS "public"."payment_status_enum";
      DROP TYPE IF EXISTS "public"."booking_status_enum";
      DROP TYPE IF EXISTS "public"."users_role_enum";
    `);
  }
}
