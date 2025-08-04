'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';



const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('user_token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/fetchAllCartItems`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        setCartItems(data.cartItems || []);
      } else {
        setError(data.message || 'Failed to fetch cart items.');
      }
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) return <p className="p-4 text-gray-600">Loading cart items...</p>;
  if (error) return <p className="p-4 text-red-500">⚠️ {error}</p>;

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center">No items in your cart.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="flex items-center gap-4 border p-4 rounded-lg shadow-md"
              >
                <div className="w-20 h-20 flex-shrink-0">
                  <Image
                    src={
                      item.thumbnail?.[0]
                        ? item.thumbnail[0]
                        : '/placeholder.jpg'
                    }
                    alt={item.title || 'Product Image'}
                    width={80}
                    height={80}
                    className="rounded-md object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">Color: {item.color}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right font-bold text-green-700">
                  ₹{item.price * item.quantity}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <h3 className="text-xl font-bold">
              Total: ₹{totalAmount.toLocaleString()}
            </h3>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
