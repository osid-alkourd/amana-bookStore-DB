"use client";

import { useState, useEffect } from "react";
import BookGrid from "./components/BookGrid";
import { Book } from "./types";

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/books`);
        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        console.log("✅ Books fetched:", data.length);
        setBooks(data);
      } catch (error) {
        console.error("❌ Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleAddToCart = (bookId: string) => {
    console.log(`Added book ${bookId} to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center bg-blue-100 p-8 rounded-lg mb-12 shadow-md">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Welcome to the Amana Bookstore!
        </h1>
        <p className="text-lg text-gray-600">
          Your one-stop shop for the best books. Discover new worlds and
          adventures.
        </p>
      </section>

      {loading ? (
        <p className="text-center">Loading books...</p>
      ) : (
        <BookGrid books={books} onAddToCart={handleAddToCart} />
      )}
    </div>
  );
}
