import "reflect-metadata";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "smart_vehicle_service",
  synchronize: false,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully for seeding...");

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // 1. Fetch all column names from the "users" table dynamically
    const columnsResult = await queryRunner.manager.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'users';`
    );
    const columns = columnsResult.map((row: any) => row.column_name);
    console.log("Detected columns in 'users' table:", columns);

    // 2. Check if admin already exists
    const emailCol = columns.includes("email") ? "email" : columns.find((c: string) => c.toLowerCase().includes("mail"));
    const existingAdmin = await queryRunner.manager.query(
      `SELECT * FROM "users" WHERE ${emailCol} = $1 LIMIT 1;`,
      ["admin@autocare.com"]
    );

    if (existingAdmin && existingAdmin.length > 0) {
      console.log("Admin user already exists in database!");
      await queryRunner.release();
      await AppDataSource.destroy();
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    // 3. Map correct column names dynamically including phone and role
    const nameCol = columns.includes("name") ? "name" : columns.includes("fullName") ? "fullName" : null;
    const passCol = columns.includes("passwordHash") ? "passwordHash" : columns.includes("password") ? "password" : "passwordHash";
    const roleCol = columns.includes("role") ? "role" : null;
    const phoneCol = columns.includes("phone") ? "phone" : null;

    let fields = [emailCol, passCol];
    let values: any = ["admin@autocare.com", hashedPassword];
    let placeholders = ["$1", "$2"];
    let paramIndex = 3;

    if (nameCol) {
      fields.push(nameCol);
      values.push("Super Admin");
      placeholders.push(`$${paramIndex++}`);
    }
    if (phoneCol) {
      fields.push(phoneCol);
      values.push("9999999999"); // Mandatory phone field default value
      placeholders.push(`$${paramIndex++}`);
    }
    if (roleCol) {
      fields.push(roleCol);
      values.push("ADMIN");
      placeholders.push(`$${paramIndex++}`);
    }

    if (columns.includes("createdAt")) {
      fields.push(`"createdAt"`);
      placeholders.push("NOW()");
    }
    if (columns.includes("updatedAt")) {
      fields.push(`"updatedAt"`);
      placeholders.push("NOW()");
    }

    const fieldNames = fields.map(f => f && f.startsWith('"') ? f : `"${f}"`).join(", ");
    const placeholderStr = placeholders.join(", ");

    const insertQuery = `INSERT INTO "users" (${fieldNames}) VALUES (${placeholderStr});`;
    console.log("Executing insert query...");

    await queryRunner.manager.query(insertQuery, values);

    console.log("✅ Admin user seeded successfully!");
    console.log("Email: admin@autocare.com");
    console.log("Password: admin123");

    await queryRunner.release();
    await AppDataSource.destroy();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();