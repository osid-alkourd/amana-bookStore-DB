import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // ✅ load env first

console.log("DEBUG:", process.env.MONGODB_URI); // should print your URI

import dbConnect from "../src/libs/mongoose";
import Book from "../src/models/Book";
import { books } from "../src/app/data/books";

async function seed() {
  try {
    await dbConnect();
    await Book.deleteMany({});
    await Book.insertMany(books);
    console.log(`✅ Inserted ${books.length} books`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seed();
