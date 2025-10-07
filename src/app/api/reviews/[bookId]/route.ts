import { NextResponse } from "next/server";
import dbConnect from "../../../../libs/mongoose";
import Review from "../../../../models/Review";

export async function GET(
  _request: Request,
  context: { params: Promise<{ bookId: string }> } // ✅ treat params as Promise
) {
  try {
    await dbConnect();

    // ✅ Safely await params (required by Next.js)
    const { bookId } = await context.params;

    const reviews = await Review.find({ bookId }).lean();

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
