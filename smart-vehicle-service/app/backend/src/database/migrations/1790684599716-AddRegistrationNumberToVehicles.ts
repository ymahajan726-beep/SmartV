import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRegistrationNumberToVehicles1790684599716
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "vehicles"
      ADD COLUMN IF NOT EXISTS "registrationNumber" character varying;
    `);

    await queryRunner.query(`
      UPDATE "vehicles"
      SET "registrationNumber" = CONCAT('TEMP-', "id")
      WHERE "registrationNumber" IS NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "vehicles"
      ALTER COLUMN "registrationNumber" SET NOT NULL;
    `);

    // The initial schema already creates this constraint. Guarding it lets
    // this migration run against both the initial schema and older tables.
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'UQ_vehicles_registrationNumber'
            AND conrelid = 'vehicles'::regclass
        ) THEN
          ALTER TABLE "vehicles"
          ADD CONSTRAINT "UQ_vehicles_registrationNumber"
          UNIQUE ("registrationNumber");
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "vehicles"
      DROP CONSTRAINT IF EXISTS "UQ_vehicles_registrationNumber";
    `);

    await queryRunner.query(`
      ALTER TABLE "vehicles"
      DROP COLUMN IF EXISTS "registrationNumber";
    `);
  }
}
