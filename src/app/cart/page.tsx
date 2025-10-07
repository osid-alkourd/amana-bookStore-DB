// src/app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CartItem from '../components/CartItem';
import { Book, CartItem as CartItemType } from '../types';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<{ book: Book; quantity: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin;

  useEffect(() => {
    const fetchCartBooks = async () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (!storedCart) {
          setCartItems([]);
          return;
        }

        const cart: CartItemType[] = JSON.parse(storedCart);

        // Fetch all books in parallel from MongoDB API
        const responses = await Promise.all(
          cart.map(item =>
            fetch(`${baseUrl}/api/books/${item.bookId}`).then(res =>
              res.ok ? res.json() : null
            )
          )
        );

        const validBooks = responses
          .map((book, i) =>
            book ? { book, quantity: cart[i].quantity } : null
          )
          .filter((item): item is { book: Book; quantity: number } => item !== null);

        setCartItems(validBooks);
      } catch (err) {
        console.error('❌ Failed to load cart items:', err);
        setError('Failed to load your cart. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartBooks();
  }, [baseUrl]);

  const updateQuantity = (bookId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map(item =>
      item.book.id === bookId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    // Update localStorage
    const cartForStorage = updatedItems.map(item => ({
      id: `${item.book.id}-${Date.now()}`,
      bookId: item.book.id,
      quantity: item.quantity,
      addedAt: new Date().toISOString(),
    }));
    localStorage.setItem('cart', JSON.stringify(cartForStorage));

    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const removeItem = (bookId: string) => {
    const updatedItems = cartItems.filter(item => item.book.id !== bookId);
    setCartItems(updatedItems);

    const cartForStorage = updatedItems.map(item => ({
      id: `${item.book.id}-${Date.now()}`,
      bookId: item.book.id,
      quantity: item.quantity,
      addedAt: new Date().toISOString(),
    }));
    localStorage.setItem('cart', JSON.stringify(cartForStorage));

    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0
  );

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h2 className="text-xl text-gray-600 mb-4">Your cart is empty</h2>
          <Link
            href="/"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md">
            {cartItems.map(item => (
              <CartItem
                key={item.book.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center text-xl font-bold mb-4 text-gray-800">
              <span>Total: ${totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 bg-gray-500 text-white text-center py-3 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="flex-1 bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
