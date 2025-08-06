"use client"
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [searchResults, setsearchResults] = useState([])
  const [cartCount, setCartCount] = useState(0);
  const [clicked, setclicked] = useState(false)

  const [loading, setLoading] = useState(true);


  const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;
  const Id = typeof window !== "undefined" ? localStorage.getItem("user_Id") : null;



  useEffect(() => {


    const fetchCartCount = async () => {
      try {
        if (!token) return;

        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/AllCartItems/${Id}`, // Replace ":id" with actual user id if needed
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok && data?.cartItems) {
          const total = data.cartItems.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(total)
          console.log(total)
        } else {
          console.warn("Could not fetch cart items:", data.message);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };
    fetchCartCount();
  }, [clicked]);




  useEffect(() => {
    const storedUser = localStorage.getItem("user_token")
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, searchResults, setsearchResults, cartCount, setCartCount , setclicked

     }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);