"use client";
import { Shirt } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { LiaShoppingBagSolid } from "react-icons/lia";
import clsx from "clsx";
import { toast } from "react-toastify";




export default function PopularPro() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedButtons, setClickedButtons] = useState({});
  const [wishlistedItems, setWishlistedItems] = useState({});

  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/totalProduct"
        );
        const data = await res.json();


        const filteredProducts = (data.AllProduct || []).filter(
          (product) => product.subCategory?.title === "Shirts" || "T-Shirt"
        );

        // product.subCategory?.title === "Shirts"
        setProducts(filteredProducts);
        console.log(Products);
        // setProducts(data.AllProduct || []);
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
      // ✅ Logged-in Cart
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
        console.log("Server Cart:", data);
        if (res.ok) {
          toast.success("Item added to cart successfully");
        }
      } catch (error) {
        console.error("Error adding to server cart:", error);
      }
    } else {
      // ✅ Guest Cart (localStorage)
      let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      console.log("guestCart", guestCart);

      // check if item already exists
      const already = guestCart.find((items) => items.id === item);

      if (!already) {
        // guestCart.push({ item, quantity: 1 });
        guestCart.push(item);
        localStorage.setItem("guest_cart", JSON.stringify(guestCart));
        toast.success("Item added to local cart");
      } else {
        toast.info("Item already in local cart");
      }
    }
  };

  async function AddToWishlist(item) {
    const token = localStorage.getItem("user_token");

    // ✅ Toggle heart icon
    setWishlistedItems((prev) => ({
      ...prev,
      [item._id]: !prev[item._id],
    }));

    if (token) {
      // ✅ Logged-in user: send API request
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
          toast.success("Item added to Wishlist successfully");
        } else {
          toast.error("Failed to add item to Wishlist");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.warning("Something went wrong!");
      }
    } else {
      // ✅ Guest wishlist: store in localStorage
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
  }

  return (
    <>
      <section>
        <div className="mb-6 mt-6">
          <p className=" sm:text-sm lg:text-2xl mb-2 xl:text-4xl font-bold pb-2 text-[#333333] text-center">
            OUR MOST POPULAR PRODUCTS
          </p>
          <p className="text-center px-6 sm:text-sm lg:text-lg xl:text-lg">
            Discover the latest trends and best-selling items loved by our customers. From stylish designs to unbeatable quality, these popular products are handpicked to elevate your wardrobe. Shop now and find your new favorites among our top-rated selections!
          </p>
        </div>
        <section className="bg-white py-10 px-4">
          <div className="max-w-[1330px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {products

              .slice(0, 4)
              .map((Shirt, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200  rounded shadow-sm overflow-hidden  group"
                >
                  <div className="p-4 h-[380px]">
                    <Link href={`/PDP_page/${Shirt?._id}`}>
                      <div className="p-1.5 hover: relative border border-gray-300">
                        <img
                          src={Shirt.thumbnail}
                          alt="Shirt"
                          className="w-full h-52 object-contain mb-4"
                        />

                      </div>
                    </Link>
                    <h3 className="text-[17px] font-semibold mt-4">
                      {Shirt.title}
                    </h3>
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
                      onClick={() => {
                        addToCart(Shirt);
                        setClickedButtons((prev) => ({ ...prev, [Shirt._id]: true }));
                        setTimeout(() => {
                          setClickedButtons((prev) => ({ ...prev, [Shirt._id]: false }));
                        }, 1000);
                      }}
                      className={clsx(
                        "flex-1 cursor-pointer hover:scale-110 font-bold text-sm py-[17px] px-4 flex items-center justify-center gap-2 transition",
                        clickedButtons[Shirt._id]
                          ? "bg-green-600 text-white"
                          : "bg-[#3559C7] text-white hover:bg-blue-800"
                      )}
                    >
                      <LiaShoppingBagSolid />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => AddToWishlist(Shirt)}
                      className="ml-2 border cursor-pointer border-gray-300 w-14 h-14 flex items-center justify-center hover:bg-gray-100"
                    >
                      {wishlistedItems[Shirt._id] ? (
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
      </section >
    </>
  );
}
