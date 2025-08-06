"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext"

const FetchCartItems11 = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { setCartCount } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    const token = localStorage.getItem("user_token");
    console.log()
    if (token) {
      router.push("/order");
    } else {
      toast.warning("Please login to proceed to checkout.");
      router.push("/login");
    }
  };

  const fetchCartItems = async () => {
    const token = localStorage.getItem("user_token");

    if (token) {
      try {
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/fetchAllCartItems",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        console.log(data);
        if (data.success) {
          setCartItems(data.cartItems || []);
        } else {
          console.error("Cart fetch failed:", data.message);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      setCartItems(guestCart);
      setLoading(false);
    }
  };

  const removeFromCart = async (item) => {
    const token = localStorage.getItem("user_token");

    if (token) {
      try {
        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/removeFromCart/${item.productId || item._id
          }`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("Removed from cart:", data);

        if (res.ok) {
          toast.success("Item removed successfully.");
          setCartCount(prev => prev - 1)
          fetchCartItems();
        } else {
          toast.error("Failed to remove item.");
        }
      } catch (error) {
        console.error("Error removing item:", error);
      }
    } else {
      let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      guestCart = guestCart.filter((cartItem) => cartItem._id !== item._id);
      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      setCartItems(guestCart);
      toast.success("Item removed from cart.");
    }
  };

  const updateQuantity = async ({ id, item, newQuantity }) => {
    if (newQuantity < 1) return;

    setUpdating(true);

    const token = localStorage.getItem("user_token")?.replace(/^"|"$/g, "");

    if (token) {
      try {
        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/updateCartQuantity/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity: newQuantity }),
          }
        );

        if (res.ok) {
          const updatedItems = cartItems.map((cartItem) =>
            cartItem.productId === id
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          );
          setCartItems(updatedItems);
        } else {
          console.error("Failed to update quantity on server");
        }
      } catch (err) {
        console.error("Error updating quantity:", err);
      }
    } else {
      let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      guestCart = guestCart.map((cartItem) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      setCartItems(guestCart);
    }

    setUpdating(false);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const totalItems = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  const saveForLater = async (item) => {
    const token = localStorage.getItem("user_token");

    if (token) {
      try {
        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/addToWishlist/${item.productId || item._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );


        const data = await res.json();
        if (res.ok && data.success) {
          toast.success("Saved for later!");
          removeFromCart(item); // remove from cart after saving
          setCartCount(prev => prev)
        } else {
          toast.error(data.message || "Failed to save item.");
        }
      } catch (err) {
        console.error("Save for later failed:", err);
        toast.error("Something went wrong.");
      }
    } else {
      // For guest users - save to localStorage
      const guestSaved =
        JSON.parse(localStorage.getItem("guest_saved_items")) || [];
      guestSaved.push(item);
      localStorage.setItem("guest_saved_items", JSON.stringify(guestSaved));

      // Remove from cart
      let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      guestCart = guestCart.filter((cartItem) => cartItem._id !== item._id);
      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      setCartItems(guestCart);

      toast.success("Saved for later!");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13v0a2 2 0 002 2h9a2 2 0 002-2v0M7 13H5.4M17 21v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2"
              />
            </svg>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              My Cart
            </h1>
            {cartItems.length > 0 && (
              <span className="text-sm sm:text-base text-gray-500">
                ({totalItems} item{totalItems > 1 ? "s" : ""})
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13v0a2 2 0 002 2h9a2 2 0 002-2v0M7 13H5.4M17 21v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2"
                />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-6">Add items to it now</p>
            <Link
              href="/"
              className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-3 sm:p-4 border-b bg-blue-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                      From Saved Addresses
                    </h2>
                    <span className="text-xs sm:text-sm text-gray-600">
                      Deliver to: 110001
                    </span>
                  </div>
                </div>

                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div
                      key={item._id || item.productId}
                      className="p-4 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <Link
                          href={`/PDP_page/${item._id}`}
                          className="flex-shrink-0"
                        >
                          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto sm:mx-0 border rounded overflow-hidden">
                            <Image
                              src={
                                item.thumbnail?.[0] || "/placeholder-image.jpg"
                              }
                              alt={item.title || "Product image"}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                            {item.title || "Product Name"}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                            <span className="text-lg sm:text-2xl font-semibold text-gray-900">
                              ₹{(item.price || 0).toLocaleString()}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 line-through">
                              ₹{((item.price || 0) * 1.2).toLocaleString()}
                            </span>
                            <span className="text-xs sm:text-sm text-green-600 font-medium">
                              {item.discount}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center border rounded w-fit">
                              <button
                                onClick={() =>
                                  updateQuantity({
                                    id: item.productId, // ✅ cart item _id
                                    item,
                                    newQuantity: item.quantity - 1,
                                  })
                                }
                                className="px-2 sm:px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
                                disabled={updating || (item.quantity || 1) <= 1}
                              >
                                -
                              </button>
                              <span className="px-3 sm:px-4 py-1 border-x min-w-[50px] sm:min-w-[60px] text-center font-medium">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity({
                                    id: item.productId, // ✅ cart item _id
                                    item,
                                    newQuantity: item.quantity + 1,
                                  })
                                }
                                className="px-2 sm:px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
                                disabled={updating}
                              >
                                +
                              </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 sm:gap-4">
                              <button
                                onClick={() => saveForLater(item)}
                                className="text-xs cursor-pointer sm:text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1 transition-colors"
                              >
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                                Save for later
                              </button>

                              <button
                                onClick={() => removeFromCart(item)}
                                className="text-xs cursor-pointer sm:text-sm font-medium text-gray-700 hover:text-red-600 flex items-center gap-1 transition-colors"
                              >
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="text-xs sm:text-sm text-green-600 font-medium">
                            ✓ Delivery by Tomorrow | Free ₹40
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="p-3 sm:p-4 border-t bg-gray-50">
                  <Link
                    href="/"
                    className="text-blue-600 font-medium hover:text-blue-800 flex items-center gap-2 text-sm sm:text-base"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="xl:w-80 w-full">
              <div className="bg-white rounded-lg shadow-sm sticky top-4">
                <div className="p-3 sm:p-4 border-b">
                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                    Price Details
                  </h3>
                </div>

                <div className="p-3 sm:p-4 space-y-3">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">
                      Price ({totalItems} item{totalItems > 1 ? "s" : ""})
                    </span>
                    <span className="font-medium">
                      ₹{(totalAmount * 1.2).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-green-600 text-sm sm:text-base">
                    <span>Discount</span>
                    <span>-₹{(totalAmount * 0.2).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span className="text-green-600">Free</span>
                  </div>

                  <hr className="my-3" />

                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="text-xs sm:text-sm text-green-600 font-medium">
                    You will save ₹{(totalAmount * 0.2).toLocaleString()} on
                    this order
                  </div>
                </div>

                <div className="p-3 sm:p-4 border-t">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-sm transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchCartItems11;
