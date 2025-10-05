import { NextResponse } from "next/server";
import dbConnect from "../../../../libs/mongoose";
import Book from "../../../../models/Book";


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const book = await Book.findOne({ id: params.id }); // find by your custom `id` field
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}