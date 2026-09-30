import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Reconcile databases created from older vehicle schemas with the current
 * Vehicle entity. Existing vehicle rows are preserved and receive safe
 * placeholder values for newly required fields.
 */
export class ReconcileVehicleColumns1790684600000
  implements MigrationInterface
{
  name = 'ReconcileVehicleColumns1790684600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "vehicles"
        ADD COLUMN IF NOT EXISTS "make" character varying NOT NULL DEFAULT 'Unknown',
        ADD COLUMN IF NOT EXISTS "model" character varying NOT NULL DEFAULT 'Unknown',
        ADD COLUMN IF NOT EXISTS "variant" character varying,
        ADD COLUMN IF NOT EXISTS "year" integer NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "fuelType" character varying NOT NULL DEFAULT 'Unknown',
        ADD COLUMN IF NOT EXISTS "currentMileage" integer NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "color" character varying NOT NULL DEFAULT 'Unknown',
        ADD COLUMN IF NOT EXISTS "imageUrl" character varying,
        ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Do not drop columns: they may have existed before this migration ran.
  }
}
