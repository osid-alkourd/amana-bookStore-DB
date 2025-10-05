import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // Load environment variables

import dbConnect from "../src/libs/mongoose";
import Review from "../src/models/Review"; // make sure this model exists
import { reviews } from "../src/app/data/reviews"; // import reviews data

async function seedReviews() {
  try {
    console.log("Connecting to database...");
    await dbConnect();

    console.log("Clearing existing reviews...");
    await Review.deleteMany({});

    console.log("Inserting new reviews...");
    await Review.insertMany(reviews);

    console.log(`✅ Successfully inserted ${reviews.length} reviews!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding reviews:", error);
    process.exit(1);
  }
}

seedReviews();
