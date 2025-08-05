"use client";

import React, { useEffect, useState } from "react";
import "../FeaturedProduct/page.css";
import { FaRegHeart } from "react-icons/fa";
import { LiaShoppingBagSolid } from "react-icons/lia";
import Link from "next/link";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";



export default function FeaturePro() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/totalProduct");
        const data = await res.json();
        const filteredProducts = (data.AllProduct || []).filter(
          (product) => product.subCategory?.title === "Cap"
        );
        setProducts(filteredProducts || []);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (item) => {
    const token = localStorage.getItem("user_token");
    if (token) {
      try {
        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/addToCart/${item._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Item added to cart successfully");
        }
      } catch (error) {
        console.error("Error adding to server cart:", error);
      }
    } else {
      let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      const already = guestCart.find((items) => items._id === item._id);
      if (!already) {
        guestCart.push(item);
        localStorage.setItem("guest_cart", JSON.stringify(guestCart));
        alert("Item added to local cart");
      } else {
        alert("Item already in local cart");
      }
    }
  };

  const AddToWishlist = async (item) => {
    const token = localStorage.getItem("user_token");
    if (token) {
      try {
        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/addToWishlist/${item._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          alert("Item added to Wishlist successfully");
        } else {
          alert(data.message || "Failed to add item to Wishlist");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        alert("Something went wrong!");
      }
    } else {
      let guestWishlist = JSON.parse(localStorage.getItem("guest_wishlist")) || [];
      const alreadyExists = guestWishlist.find((p) => p._id === item._id);
      if (!alreadyExists) {
        guestWishlist.push(item);
        localStorage.setItem("guest_wishlist", JSON.stringify(guestWishlist));
        alert("Item added to local wishlist");
      } else {
        alert("Item already in local wishlist");
      }
    }
  };

  return (
    <section>
      <div className="mb-6 mt-6">
        <p className="sm:text-lg lg:text-xl xl:text-4xl p-2 font-bold text-[#333333] text-center">
          FEATURED PRODUCTS
        </p>
        <p className="text-center lg:text-lg xl:text-xl sm:text-sm  max-w-3xl mx-auto">
          Explore our top picks—crafted with precision and passion for the creators of style.
        </p>
      </div>
      <section className="bg-white py-10 px-4">
        <div className="max-w-[1330px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {products
            .sort(() => 0.5 - Math.random())
            .slice(0, 8)
            .map((hat, idx) => (
              <div key={idx} className="border border-gray-200 rounded shadow-sm overflow-hidden group">
                <div className="p-4 h-[380px]">
                  <Link href={`/PDP_page/${tshirt?._id}`}>
                    <div className="p-1.5 relative border border-gray-300">
                      <img
                        src={hat.thumbnail}
                        alt={hat.title || "Hat"}
                        className="w-full h-52 object-contain mb-4"
                      />
                      {hat.sale && (
                        <div className="absolute top-0 left-0 bg-[#539C27] text-white px-6 tracking-widest py-1 text-xs font-bold z-10">
                          SALE
                        </div>
                      )}
                    </div>
                  </Link>
                  <h3 className="text-[17px] font-semibold mt-4">{hat.title}</h3>
                  <p className="text-lg font-bold mt-1 text-gray-800">
                    {item.discountedPrice && item.discountedPrice < item.price ? (
                      <>
                        ₹{Number(item.discountedPrice).toFixed(2)}
                        <span className="line-through text-sm text-gray-500 ml-2">
                          ₹{Number(item.price).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <>₹{Number(item.price || 0).toFixed(2)}</>
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between px-4 pb-4">
                  <button
                    onClick={() => addToCart(hat)}
                    className="flex-1 bg-[#3559C7] text-white font-bold text-sm py-[17px] px-4 flex items-center justify-center gap-2 hover:bg-blue-800 transition"
                  >
                    <LiaShoppingBagSolid /> Add to Cart
                  </button>
                  <button
                    onClick={() => AddToWishlist(hat)}
                    className="ml-2 border border-gray-300 w-14 h-14 flex items-center justify-center hover:bg-gray-100"
                  >
                    <FaRegHeart size={18} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </section>
  );
}
