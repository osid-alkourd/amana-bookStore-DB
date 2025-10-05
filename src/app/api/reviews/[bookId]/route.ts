import { NextResponse } from "next/server";
import dbConnect from "@/libs/mongoose";
import Review from "@/models/Review";

export async function GET(
  request: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    await dbConnect();
    const { bookId } = params;

    // Find all reviews for a specific bookId
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
