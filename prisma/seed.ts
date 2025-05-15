import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Get all unique userIds from existing bookings
  const bookings = await prisma.booking.findMany({
    select: {
      userId: true,
    },
  });

  const uniqueUserIds = [...new Set(bookings.map(booking => booking.userId))];
  console.log(`Found ${uniqueUserIds.length} unique user IDs in existing bookings`);

  // Create a user for each unique userId
  for (const userId of uniqueUserIds) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: userId, // Use the same ID to maintain the relationship
          email: `user-${userId.substring(0, 8)}@example.com`, // Generate a dummy email
          name: `User ${userId.substring(0, 8)}`,
          password: 'password123', // Set a default password
        },
      });
      console.log(`Created user for ID: ${userId}`);
    } else {
      console.log(`User with ID ${userId} already exists`);
    }
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
