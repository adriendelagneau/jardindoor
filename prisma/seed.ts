import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

async function main() {
  const adminEmail = "admin@jardin-indoor.fr";
  const plainPassword = "YourSecurePassword123!";

  // Hash the password using bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  console.log("🌱 Seeding database...");

  // We find if the user exists first to handle the Account link properly
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { accounts: true }
  });

  if (existingUser) {
    console.log("👤 User already exists, updating password...");
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        role: "ADMIN",
        accounts: {
          updateMany: {
            where: { providerId: "credential" },
            data: { password: hashedPassword }
          }
        }
      }
    });
  } else {
    console.log("➕ Creating new admin user...");
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin Jardin",
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: true,
        accounts: {
          create: {
            providerId: "credential",
            accountId: adminEmail,
            password: hashedPassword,
          },
        },
      },
    });
  }

  console.log(`✅ Admin user ${adminEmail} is ready and hashed.`);
  console.log("🚀 Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
