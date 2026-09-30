import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Ensures vehicles created by earlier application versions match the current
 * Vehicle entity. Existing rows are retained and receive explicit placeholder
 * values only where the current entity requires a value that is missing.
 */
export class EnsureVehicleEntityColumns1790726400000
  implements MigrationInterface
{
  name = 'EnsureVehicleEntityColumns1790726400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "vehicles"
        ADD COLUMN IF NOT EXISTS "make" character varying,
        ADD COLUMN IF NOT EXISTS "model" character varying,
        ADD COLUMN IF NOT EXISTS "variant" character varying,
        ADD COLUMN IF NOT EXISTS "year" integer,
        ADD COLUMN IF NOT EXISTS "fuelType" character varying,
        ADD COLUMN IF NOT EXISTS "currentMileage" integer,
        ADD COLUMN IF NOT EXISTS "color" character varying,
        ADD COLUMN IF NOT EXISTS "imageUrl" character varying,
        ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE,
        ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE;
    `);

    await queryRunner.query(`
      UPDATE "vehicles"
      SET
        "make" = COALESCE("make", 'Unknown'),
        "model" = COALESCE("model", 'Unknown'),
        "year" = COALESCE("year", 0),
        "fuelType" = COALESCE("fuelType", 'Unknown'),
        "currentMileage" = COALESCE("currentMileage", 0),
        "color" = COALESCE("color", 'Unknown'),
        "createdAt" = COALESCE("createdAt", now()),
        "updatedAt" = COALESCE("updatedAt", now());
    `);

    await queryRunner.query(`
      ALTER TABLE "vehicles"
        ALTER COLUMN "make" SET NOT NULL,
        ALTER COLUMN "model" SET NOT NULL,
        ALTER COLUMN "year" SET NOT NULL,
        ALTER COLUMN "fuelType" SET NOT NULL,
        ALTER COLUMN "currentMileage" SET NOT NULL,
        ALTER COLUMN "color" SET NOT NULL,
        ALTER COLUMN "createdAt" SET DEFAULT now(),
        ALTER COLUMN "createdAt" SET NOT NULL,
        ALTER COLUMN "updatedAt" SET DEFAULT now(),
        ALTER COLUMN "updatedAt" SET NOT NULL;
    `);
  }

  public async down(): Promise<void> {
    // Keep the reconciled columns so rolling back cannot discard vehicle data.
  }
}
