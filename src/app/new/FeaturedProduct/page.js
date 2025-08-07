"use client";

import React, { useEffect, useState } from "react";
import "../FeaturedProduct/page.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { LiaShoppingBagSolid } from "react-icons/lia";
import Link from "next/link";

import clsx from "clsx";
import { toast } from "react-toastify";




export default function FeaturePro() {
  const [products, setProducts] = useState([]);

  const [wishlistedItems, setWishlistedItems] = useState({});
  const [clickedButtons, setClickedButtons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/totalProduct"
        );
        const data = await res.json();

        // Debug: log all subcategory titles
        console.log("All subcategories:", (data.AllProduct || []).map(p => p.subCategory?.title));

        const filteredProducts = (data.AllProduct || []).filter(
          (product) => {
            const title = product.subCategory?.title?.toLowerCase();
            return title === "Shirts" && title === "T-Shirt";
          }
        );

        setProducts(filteredProducts.length ? filteredProducts : data.AllProduct || []);
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

        const cartRes = await fetch("https://e-com-customizer.onrender.com/api/v1/fetchAllCartItems", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        const cartData = await cartRes.json();

        const cartItems = cartData.cartItems || [];


        // 🧠 Check if item already in cart
        const existingItem = cartItems.find((productsitem) => {
          const cartProductId = productsitem.productId || productsitem._id;
          const match = String(cartProductId) === String(item._id);
          console.log(`Comparing cartProductId: ${cartProductId} with item._id: ${item._id} → Match: ${match}`);
          return match;
        });

        if (existingItem) {
          console.log("✅ Item already in cart, updating quantity...");

          // ✅ Update quantity of existing item
          const updateRes = await fetch(
            `https://e-com-customizer.onrender.com/api/v1/updateCartQuantity/${item._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                quantity: existingItem.quantity + 1,
              }),
            }
          );

          if (updateRes.ok) {
            toast.success("Quantity updated in cart");
          } else {
            toast.error("Failed to update quantity");
          }

        } else {
          console.log("🆕 Item not in cart, adding as new...");

          // ✅ Add new item
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

          if (res.ok) {
            toast.success("Item added to cart");
            setclicked(prev => !prev);
          } else {
            toast.error("Failed to add item to cart");
          }
        }
      } catch (error) {
        console.error("❌ Error adding to cart:", error);
       
      }
    } else {
      // ✅ Guest logic using localStorage
      let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      const existingItemIndex = guestCart.findIndex(
        (p) => String(p._id) === String(item._id)
      );

      if (existingItemIndex !== -1) {
        // ✅ Already in guest cart → update quantity
        console.log("🛒 (Guest) Item already in cart, updating quantity");
        guestCart[existingItemIndex].quantity =
          (guestCart[existingItemIndex].quantity || 1) + 1;

        localStorage.setItem("guest_cart", JSON.stringify(guestCart));
        toast.success("Quantity updated in cart");
      } else {
        // ✅ New guest item → add and increment count
        console.log("🆕 (Guest) New item, adding to cart");
        guestCart.push({ ...item, quantity: 1 });
        localStorage.setItem("guest_cart", JSON.stringify(guestCart));
        toast.success("Item added to cart");
        setCartCount((prev) => prev + 1);
      }
    }
  };

  const AddToWishlist = async (item) => {
    const token = localStorage.getItem("user_token");

    setWishlistedItems((prev) => ({
      ...prev,
      [item._id]: !prev[item._id],
    }));

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

        if (res.ok) {
          toast.success("Item added to Wishlist successfully");
        } else {
          toast.error("Failed to add item to Wishlist");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.warning("Something went wrong!");
      }
    } else {
      let guestWishlist =
        JSON.parse(localStorage.getItem("guest_wishlist")) || [];

      const alreadyExists = guestWishlist.find((p) => p._id === item._id);

      if (!alreadyExists) {
        guestWishlist.push(item);
        localStorage.setItem("guest_wishlist", JSON.stringify(guestWishlist));
        toast.success("Item added to local wishlist");
      } else {
        toast.success("Item already in local wishlist");
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
          {products.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded shadow-sm overflow-hidden group"
            >
              <div className="p-4 h-[380px]">
                <Link href={`/PDP_page/${item?._id}`}>
                  <div className="p-1.5 hover: relative border border-gray-300">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-52 object-contain mb-4"
                    />
                  </div>
                </Link>
                <h3 className="text-[17px] font-semibold mt-4">
                  {item.title}
                </h3>
                <p className="text-lg font-bold mt-1 text-gray-800">
                  {item.discountedPrice &&
                    item.discountedPrice < item.price ? (
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
                  onClick={() => {
                    addToCart(item);
                    setClickedButtons((prev) => ({
                      ...prev,
                      [item._id]: true,
                    }));
                    setTimeout(() => {
                      setClickedButtons((prev) => ({
                        ...prev,
                        [item._id]: false,
                      }));
                    }, 1000);
                  }}
                  className={clsx(
                    "flex-1 cursor-pointer hover:scale-110 font-bold text-sm py-[17px] px-4 flex items-center justify-center gap-2 transition",
                    clickedButtons[item._id]
                      ? "bg-green-600 text-white"
                      : "bg-[#3559C7] text-white hover:bg-blue-800"
                  )}
                >
                  <LiaShoppingBagSolid />
                  Add to Cart
                </button>

                <button
                  onClick={() => AddToWishlist(item)}
                  className="ml-2 border cursor-pointer border-gray-300 w-14 h-14 flex items-center justify-center hover:bg-gray-100"
                >
                  {wishlistedItems[item._id] ? (
                    <FaHeart size={18} color="red" />
                  ) : (
                    <FaRegHeart size={18} color="gray" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
