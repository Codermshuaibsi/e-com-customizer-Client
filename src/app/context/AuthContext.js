"use client"
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [searchResults, setsearchResults] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [clicked, setclicked] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;
  const Id = typeof window !== "undefined" ? localStorage.getItem("user_Id") : null;

  const updateCartCount = async () => {
    if (!token) {
      // Update cart count for guest users
      const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      console.log(guestCart)
      setCartCount(guestCart.length);
    } else {
      // Update cart count for logged-in users
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/fetchAllCartItems", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data?.cartItems) {
          console.log(data.cartItems);
          
          const totalQuantity = data.cartItems.length;

          setCartCount(totalQuantity);
        } else {
          console.warn("Could not fetch cart items:", data.message);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    }
  };

  useEffect(() => {
    updateCartCount(); // Initialize cart count on load
  }, [clicked, cartCount]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_token");
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        searchResults,
        setsearchResults,
        cartCount,
        setCartCount,
        setclicked,
        updateCartCount, // Expose the updateCartCount function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);