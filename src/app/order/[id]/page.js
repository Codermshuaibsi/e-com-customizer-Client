// app/order/page.jsx
'use client';

import { useEffect, useState } from "react";
import CheckoutForm from "../CheckoutForm/page"; // or adjust based on your structure

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("user_token");

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("user_token");

      if (token) {
        try {
          const res = await fetch("https://e-com-customizer.onrender.com/api/v1/fetchAllCartItems", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = await res.json();
          setCartItems(data.cartItems || []);
        } catch (error) {
          console.error("Error loading cart:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // ✅ Handle guest cart
        const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
        setCartItems(guestCart);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

const handleRemove = async (itemId) => {
  try {
    const res = await fetch(
      `https://e-com-customizer.onrender.com/api/v1/removeFromCart/${itemId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      setCartItems((prev) => prev.filter((item) => (item._id || item.productId) !== itemId));
    } else {
      console.error("Failed to remove item");
    }
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <p className="p-4">Loading your cart...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="mb-6 space-y-4">
            {cartItems.map((item) => (
              <li key={item._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>


                <div className="flex items-center gap-4">
                  <p className="font-bold text-green-700">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>

            ))}
          </ul>

          <div className="text-right font-semibold text-xl mb-4">Total: ₹{totalAmount}</div>

          <CheckoutForm cartItems={cartItems} totalamount={totalAmount} />
        </>
      )}
    </div>
  );
};

export default OrderPage;
