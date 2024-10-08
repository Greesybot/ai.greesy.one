import cron from "node-cron";
import UserModel from "./app/schemas/User"; // Adjust path to your User model
import connectToDatabase from "./mongo"; 

interface UserSchema {
  email: string;
  avatar: string;
  credits: number;
  limits: {
    left: number;
    total: number;
  };
  premium: boolean;
  beta: string;
  ip: string;
  creation: string;
  apiKey: string;
}

// Function to calculate daily limit based on credits
const calculateDailyLimit = (credits: number): number => {
  return Math.floor(credits / 200);
};

export const startCronJob = () => {
  // Schedule the cron job to run daily at midnight (00:00)
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily user credits and limits update...");

    try {
      // Connect to MongoDB
      await connectToDatabase();

      // Fetch all users
      const users: UserSchema[] = await UserModel.find();

      // Update each user
      for (const user of users) {
        const { credits, limits } = user;

        // Calculate the daily limit based on credits
        const dailyLimit = calculateDailyLimit(credits);

        // Reset user's limits based on their credits
        user.limits.total = dailyLimit;
        user.limits.left = dailyLimit;

        // Save the updated user data to the database
        await user.save();
      }

      console.log("User limits and credits updated successfully.");
    } catch (error) {
      console.error("Error updating user limits and credits:", error);
    }
  });
};