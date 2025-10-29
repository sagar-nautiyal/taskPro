import { connecToDB } from "../config/mongoose.js";
import { seedDatabase, clearDatabase, resetAndSeed } from "./dataSeed.js";

const runSeeder = async () => {
  try {
    const action = process.argv[2] || "seed";

    // Connect to database
    await connecToDB();

    switch (action) {
      case "seed":
        await seedDatabase();
        break;

      case "clear":
        await clearDatabase();
        break;

      case "reset":
        await resetAndSeed();
        break;

      default:
        break;
    }
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

runSeeder();
