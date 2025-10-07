// src/app/book/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
// import { reviews } from "../../data/reviews";
import { Book, CartItem, Review } from "../../types";
import Image from "next/image";

export default function BookDetailPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [bookReviews, setBookReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        // ✅ Fetch book from DB using env variable
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const res = await fetch(`${apiBaseUrl}/api/books/${id}`);
        if (!res.ok) throw new Error("Book not found");
        const data = await res.json();
        setBook(data);

        // ✅ Fetch reviews from MongoDB
        const resReviews = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/${id}`
        );
        if (!resReviews.ok) throw new Error("Failed to fetch reviews");
        const reviewData = await resReviews.json();
        setBookReviews(reviewData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;

    const cartItem: CartItem = {
      id: `${book.id}-${Date.now()}`,
      bookId: book.id,
      quantity,
      addedAt: new Date().toISOString(),
    };

    const storedCart = localStorage.getItem("cart");
    const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

    const existingItemIndex = cart.findIndex((item) => item.bookId === book.id);
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    router.push("/cart");
  };

  // ⭐ helper for rendering stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i}>⭐</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i}>⭐½</span>);
      } else {
        stars.push(<span key={i}>☆</span>);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // UI states
  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <Link
          href="/"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Back to Home
        </Link>
      </div>
    );
  }
  if (!book) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book Image */}
        <div className="relative h-96 md:h-[600px] w-full shadow-lg rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
          <Image
            src={book.image}
            alt={book.title}
            width={608}
            height={600}
            className="object-cover h-full w-full"
          />
        </div>

        {/* Book Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            {book.title}
          </h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

          <div className="flex items-center mb-4">
            {renderStars(book.rating)}
            <span className="text-md text-gray-500 ml-2">
              ({book.reviewCount} reviews)
            </span>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {book.description}
          </p>

          <div className="mb-4">
            {book.genre.map((g) => (
              <span
                key={g}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="text-3xl font-bold text-blue-600 mb-6">
            ${book.price.toFixed(2)}
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <label htmlFor="quantity" className="font-semibold">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold"
          >
            Add to Cart
          </button>

          <Link
            href="/"
            className="text-blue-500 hover:underline mt-6 text-center"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Customer Reviews
        </h2>

        {bookReviews.length > 0 ? (
          <div className="space-y-6">
            {bookReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatDate(review.timestamp)}
                    </span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {review.title}
                </h3>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                <span className="text-sm font-medium text-gray-600">
                  by {review.author}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No reviews yet. Be the first to review this book!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
