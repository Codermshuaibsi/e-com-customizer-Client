"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {

 const token = localStorage.getItem("user_token")?.replace(/^"|"$/g, "");
      if (token) {
      try {
       

        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/fetchAllWishlistItem",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log(data);
        setWishlist(data.wishlistItem || []);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setLoading(false);
      }
    }else {
      const guestWishlist = JSON.parse(localStorage.getItem("guest_wishlist")) || [];
        setWishlist(guestWishlist);
        setLoading(false);
      
    }
  }

    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    console.log("Removing item:", productId);
       const token = localStorage.getItem("user_token");
    if (token) {

    try {
     

    const res=  await fetch(
        `https://ecomm-backend-7g4k.onrender.com/api/v1/removeFromWishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("Remove response:", data);

      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }

  } else {
      // For guest users, remove from local storage
      const updatedWishlist = wishlist.filter((item) => item._id !== productId);
      setWishlist(updatedWishlist);
      localStorage.setItem("guest_wishlist", JSON.stringify(updatedWishlist));
    }
    
  };

  const handleMoveToCart = async (productId) => {
    // Add your move to cart logic here
    console.log("Moving to cart:", productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="bg-white shadow-sm mb-8 p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                <div>
                  <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            </div>
            
            {/* Grid Skeleton */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-10 bg-gray-300 rounded-lg"></div>
                    <div className="h-8 bg-gray-300 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white shadow-sm mb-8 p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                  </span>
                  {wishlist.length > 0 && <span className="text-sm">• All your favorite products</span>}
                </p>
              </div>
            </div>
            {wishlist.length > 0 && (
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Share Wishlist
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                  Add All to Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center max-w-2xl mx-auto">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 p-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-full">
                <svg className="w-full h-full text-red-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Discover amazing products and add them to your wishlist. Save your favorites and never lose track of what you love!
              </p>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
                  Start Shopping
                </button>
                <button className="w-full border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors">
                  Browse Categories
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200"
              >
                {/* Product Image */}
               <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6">
             <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-300"
                  /> 
                  {/* Heart Icon */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-lg hover:bg-red-50 transition-all duration-200 group border border-gray-200 hover:border-red-200"
                  >
                    <svg
                      className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  
                  {/* Quick View Button */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
 <Link href={`/PDP_page/${item._id}`}>       <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
    Quick View
  </button> </Link>
</div>

                </div>

                {/* Product Details */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2 leading-6 hover:text-blue-600 transition-colors cursor-pointer">
                    {item.title}
                  </h3>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{item.price?.toLocaleString()}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.originalPrice?.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Rating */}
                  {item.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                        <span>{item.rating}</span>
                        <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      {item.reviewCount && (
                        <span className="text-xs text-gray-500 font-medium">
                          ({item.reviewCount?.toLocaleString()} reviews)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleMoveToCart(item._id)}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg text-sm font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                      </svg>
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="w-full border-2 border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping Section */}
        {wishlist.length > 0 && (
          <div className="mt-16">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Continue Shopping
                </h2>
                <p className="text-gray-600">Discover more amazing products you might love</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Beauty'].map((category) => (
                  <button 
                    key={category}
                    className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl text-sm font-semibold text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}