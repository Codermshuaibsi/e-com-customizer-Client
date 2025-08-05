"use client";
import React, { useState, useEffect } from "react";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { FaRegHeart } from "react-icons/fa";
import Link from "next/link";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("featured");

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedColors, setSelectedColors] = useState([]);
  const [colors, setColor] = useState([]);


  useEffect(() => {

    const fetchColor = async () => {
      try {

        const res = await fetch('http/api/v1/get/color');
        const data = await res.json();
        setColor(data.data);
        console.log(data.data)
      }
      catch (error) {
        console.log("error", error)
      }
    };

    fetchColor();


  }, [])
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/totalProduct"
        );
        const data = await res.json();
        console.log("All Products:", data);

        // Filter products with subCategory.title === "T-Shirts"
        const filteredProducts = (data.AllProduct || []).filter(
          (item) => item.subCategory?.title === "T-Shirts"
        );

        setProducts(filteredProducts);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  // Wishlist Function
  async function AddToWishlist(item) {
    console.log("AddToWishlist called with:", item);
    const token = localStorage.getItem("user_token");

    if (token) {
      // ✅ Logged-in user: send API request
      try {
        const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/addToWishlist/${item._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

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
      let guestWishlist = JSON.parse(localStorage.getItem("guest_wishlist")) || [];

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


  const addToCart = async (item) => {
    // console.log(id)
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
          alert("Item added to cart successfully");
        } else {
          alert(data.message || "Failed to add item to cart");
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

  // addToCart();

  // Filtered + Paginated Products
  let filtered = selectedColors.length
    ? products.filter((item) => {
      const productColor = (item.color || "")
      return selectedColors.includes(productColor);
    })
    : [...products];

  // 2. Sort the filtered products
  if (sortOption === "lowToHigh") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === "highToLow") {
    filtered.sort((a, b) => b.price - a.price);
  }

  // 3. Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Color Filter Toggle
  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
    setCurrentPage(1);
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-[60px]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full h-[450px] md:w-64 bg-white p-4 shadow-sm">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="text-[18px] font-extrabold text-[#2e2e2e] uppercase">
              FILTER BY
            </h3>
            <button
              className="text-[#3559C7] text-sm font-bold uppercase hover:underline"
              onClick={() => setSelectedColors([])}
            >
              CLEAR ALL
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-[#2e2e2e] uppercase">
                Color
              </h4>
            </div>

            <ul className="space-y-8 border-b border-gray-300 pb-3">
             {colors.map((color, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <label
                    htmlFor={color.colorname}
                    className="text-[14px] text-[#2e2e2e] font-medium"
                  >
                    {color.colorname}
                  </label>
                  <input
                    type="checkbox"
                    id={color.colorname}
                    checked={selectedColors.includes(color.colorname)}
                    onChange={() => handleColorToggle(color.colorname)}
                    className="w-5 h-5 border border-[#a0a0a0] rounded-sm cursor-pointer checked:bg-[#3559C7] checked:border-[#3559C7] transition-all"
                  />
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products Section */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 px-1">
            <div className="text-[#4F4F4F] text-[16px] sm:text-[18px] font-semibold uppercase">
              Home / All Products / Catalog
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-3 py-2 rounded text-sm w-full sm:w-auto"
            >
              <option value="featured">Sort by featured</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          <section className="px-1 sm:px-0">
            {loading ? (
              <p className="text-center">Loading products...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : currentProducts.length === 0 ? (
              <p className="text-center text-gray-600">No products found</p>
            ) : (
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {currentProducts.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded shadow-sm overflow-hidden group bg-white"
                  >
                    <div className="p-4">
                      <div className="p-1.5 relative border border-gray-300">
                        <Link href={`PDP_page/${item._id}`}>
                          {" "}
                          <img
                            src={item.thumbnail?.[0] || "/no-image.png"}
                            alt={item.title}
                            className="w-full h-52 object-contain mb-4"
                          />{" "}
                        </Link>
                        {item.sale && (
                          <div className="absolute top-0 left-0 bg-[#539C27] text-white px-6 tracking-widest py-1 text-xs font-bold z-10">
                            SALE
                          </div>
                        )}
                      </div>

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
                          <>₹{Number(item.price).toFixed(2)}</>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center justify-between px-4 pb-4">
                      {item.quantity > 0 ? (
                        <>
                          <button
                            onClick={() => addToCart(item)}
                            className="flex-1 bg-[#3559C7] text-white font-bold text-sm py-3 px-4 flex items-center justify-center gap-2 hover:bg-blue-800 transition"
                          >
                            <LiaShoppingBagSolid />
                            ADD TO CART
                          </button>
                          <button
                            onClick={() => AddToWishlist(item)}
                            className="ml-2 border border-gray-300 w-12 h-12 flex items-center justify-center hover:bg-gray-100"
                          >
                            <FaRegHeart size={18} />
                          </button>
                        </>
                      ) : (
                        <span className="text-red-600 font-bold text-sm uppercase">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center flex-wrap gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded border text-sm ${page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
{
  /* <Link href={`/order/${item._id}`}>  */
}
