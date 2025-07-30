"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { LiaShoppingBagSolid } from "react-icons/lia";

export default function PopularPro() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hats = [
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116991/101-0378-YEL-F01_750x_1_tweatg.png",
      sale: true,
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116991/101-0391-BLK-F01_750x_1_woo9r9.png",
      sale: false,
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0378-YA-BLK-F01_750x_1_sp0dgy.png",
      sale: false,
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0378-YEL-F01_750x_1_2_hqnoo3.png",
      sale: false,
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0378-YA-RED-F01_750x_1_jqz2si.png",
      sale: false,
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0378-YEL-F01_750x_1_1_zhc0mr.png",
      sale: false,
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0512-RUS_750x_1_r1ryco.png",
      sale: true,
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0512-WIN-F01_750x_1_u5i4af.png",
      sale: true,
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/totalProduct"
        );
        const data = await res.json();

        const filteredProducts = (data.AllProduct || []).filter(
          (product) => product.subCategory?.title === "T-Shirts"
        );
// product.subCategory?.title === "T-Shirts"
        setProducts(filteredProducts);
        console.log(data);
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
        if (!res.ok) {
          alert(data.message || "Item added to cart successfully");
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
        alert("Item added to local cart");
      } else {
        alert("Item already in local cart");
      }
    }
  };

  async function AddToWishlist(item) {
    console.log("AddToWishlist called with:", item);
    const token = localStorage.getItem("user_token");

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
          alert("Item added to Wishlist successfully");
        } else {
          alert(data.message || "Failed to add item to Wishlist");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        alert("Something went wrong!");
      }
    } else {
      // ✅ Guest wishlist: store in localStorage
      let guestWishlist =
        JSON.parse(localStorage.getItem("guest_wishlist")) || [];

      // Check if item already exists by _id
      const alreadyExists = guestWishlist.find((p) => p._id === item._id);

      if (!alreadyExists) {
        guestWishlist.push(item);
        localStorage.setItem("guest_wishlist", JSON.stringify(guestWishlist));
        alert("Item added to local wishlist");
      } else {
        alert("Item already in local wishlist");
      }
    }
  }

  return (
    <>
      <section>
        <div className="mb-6 mt-6">
          <p className="text-[56px] font-bold text-[#333333] text-center">
            OUR MOST POPULAR PRODUCTS
          </p>
          <p className="text-center text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            tincidunt leo et leo tincidun vel efficitur mi egestas curabitur.
          </p>
        </div>
        <section className="bg-white py-10 px-4">
          <div className="max-w-[1330px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {products
              .sort(() => 0.5 - Math.random())
              .slice(0, 8)
              .map((hat, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200  rounded shadow-sm overflow-hidden  group"
                >
                  <div className="p-4 h-[380px]">
                    <Link href={`/PDP_page/${hat?._id}`}>
                      <div className="p-1.5 relative border border-gray-300">
                        <img
                          src={hat.thumbnail}
                          alt="Hat"
                          className="w-full h-52 object-contain mb-4"
                        />
                        {hat.sale && (
                          <div className="absolute top-0 left-0 bg-[#539C27] text-white px-6 tracking-widest py-1 text-xs font-bold z-10">
                            SALE
                          </div>
                        )}
                      </div>
                    </Link>
                    <h3 className="text-[17px] font-semibold mt-4">
                      {hat.title}
                    </h3>
                    <p className="text-lg font-bold mt-1 text-gray-800">
                      {hat.isDiscounted ? (
                        <>
                          ₹{hat.discountedPrice.toFixed(2)}
                          <span className="line-through text-sm text-gray-500 ml-2">
                            ₹{hat.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <>₹{hat.price.toFixed(2)}</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-between px-4 pb-4">
                    <button
                      onClick={() => addToCart(hat)}
                      className="flex-1 bg-[#3559C7] text-white font-bold text-sm py-[17px] px-4 flex items-center justify-center gap-2 hover:bg-blue-800 transition"
                    >
                      <LiaShoppingBagSolid />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => AddToWishlist(hat)}
                      className="ml-2 border border-gray-300 w-14 h-14 flex items-center justify-center hover:bg-gray-100 "
                    >
                      <FaRegHeart size={18} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </section>
    </>
  );
}
