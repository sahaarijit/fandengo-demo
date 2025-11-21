import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../shared/config/database';
import { seedDatabase } from '../shared/utils/seed';

dotenv.config();

async function main() {
  try {
    // Connect to database
    await connectDatabase();

    // Run seed
    await seedDatabase();

    // Disconnect
    await disconnectDatabase();

    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
