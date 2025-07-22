"use client";

import { useEffect, useState } from "react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("user_token");

        const res = await fetch(
          "https://ecomm-backend-7g4k.onrender.com/api/v1/fetchAllWishlistItem",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log(data)
        setWishlist(data.wishlistItem || []);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("user_token");

      await fetch(
        `https://ecomm-backend-7g4k.onrender.com/api/v1/removeFromWishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  if (loading) return <p className="text-center py-10 text-lg">Loading your wishlist...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg shadow hover:shadow-md transition overflow-hidden bg-white flex flex-col"
            >
              <img
                src={item.thumbnail[0]}
                alt={item.title}
                className="w-full h-48 object-contain bg-gray-100 p-4"
              />
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-primary text-xl font-semibold mb-2">₹{item.price}</p>
                </div>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="mt-auto text-sm font-medium text-red-600 hover:text-red-800 hover:underline"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
