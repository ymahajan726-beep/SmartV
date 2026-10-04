import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("Connecting to database...");

    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: "admin@autocare.com",
      },
    });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email: admin@autocare.com");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "admin@autocare.com",
        phone: "9999999999",
        passwordHash: hashedPassword,
        role: Role.ADMIN,
        isActive: true,
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("ID:", admin.id);
    console.log("Email: admin@autocare.com");
    console.log("Password: admin123");
    console.log("Role:", admin.role);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();