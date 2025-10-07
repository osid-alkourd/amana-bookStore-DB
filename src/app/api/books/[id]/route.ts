import { NextResponse } from "next/server";
import dbConnect from "@/libs/mongoose";
import Book from "@/models/Book";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> } // ✅ mark params as Promise
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    const book = await Book.findOne({ id }).lean(); // find by your custom field
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}
