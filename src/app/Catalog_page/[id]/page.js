"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import clsx from "clsx";
import { toast } from "react-toastify";


const Catalog = () => {
    const { id } = useParams(); // id is subCategoryId
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState("featured");

    const [clickedButtons, setClickedButtons] = useState({});
    const [wishlistedItems, setWishlistedItems] = useState({});
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);


    const [selectedColors, setSelectedColors] = useState([]);
    const [colors, setColor] = useState([]);


    useEffect(() => {

        const fetchColor = async () => {
            try {

                const res = await fetch('https://e-com-customizer.onrender.com/api/v1/get/color');
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
        const fetchSubCategoryDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `https://e-com-customizer.onrender.com/api/v1/subCategoryPageDetails/${id}`
                );

                if (!res.ok) {
                    throw new Error(`Failed to fetch subcategory details: ${res.status}`);
                }

                const data = await res.json();
                console.log("Subcategory Data:", data);

                const allProducts = data?.selectedSubCategory?.products || [];
                setSubCategoryData(allProducts);
            } catch (err) {
                console.error("Error fetching subcategory details:", err);
                setError(err.message || "Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSubCategoryDetails();
        }
    }, [id]);

    // Cart function
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
                        body: JSON.stringify({
                            quantity: 1, // or let user choose
                            productId: item._id, // optional but likely required
                        }),
                    }
                );

                const data = await res.json();

                if (res.ok) {
                    toast.success("Item added to cart successfully");
                } else {
                    toast.error("Failed to add item to cart");
                }
            } catch (error) {
                console.error("Error adding to server cart:", error);
                toast.error("Failed to add item to cart");
            }
        } else {
            // Guest cart logic
            let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
            const already = guestCart.find((items) => items._id === item._id);

            if (!already) {
                guestCart.push(item);
                localStorage.setItem("guest_cart", JSON.stringify(guestCart));
                toast.success("Item added to local cart");
            } else {
                toast.success("Item already in local cart");
            }
        }
    };

    const sortedProducts = [...subCategoryData].sort((a, b) => {
        if (sortOption === "lowToHigh") return a.price - b.price;
        if (sortOption === "highToLow") return b.price - a.price;
        return 0;
    });


    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const currentProducts = sortedProducts.slice(
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
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-[60px]">
                <div className="flex flex-col md:flex-row gap-6">

                    {/* <aside className="w-full h-[450px] md:w-64 bg-white p-4 shadow-sm">
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
                    </aside> */}
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
                            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {currentProducts.map((item, idx) => (
                                    <div
                                        key={item._id || idx}
                                        className="border border-gray-200 rounded shadow-sm overflow-hidden group bg-white"
                                    >
                                        <div className="p-4">
                                            <div className="p-1.5 relative border border-gray-300">
                                                <Link href={`/PDP_page/${item._id}`}>
                                                    <img
                                                        src={item.thumbnail?.[0] || item.thumbnail || "/no-image.png"}
                                                        alt={item.title || "Product"}
                                                        className="w-full h-52 object-contain mb-4"
                                                    />
                                                </Link>
                                                {item.sale && (
                                                    <div className="absolute top-0 left-0 bg-[#539C27] text-white px-6 tracking-widest py-1 text-xs font-bold z-10">
                                                        SALE
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="text-[17px] font-semibold mt-4">
                                                {item.title || "Untitled Product"}
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
                                            {(item.quantity || 0) > 0 ? (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            addToCart(item);
                                                            setClickedButtons((prev) => ({ ...prev, [item._id]: true }));
                                                            setTimeout(() => {
                                                                setClickedButtons((prev) => ({ ...prev, [item._id]: false }));
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
                        </section>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex justify-center flex-wrap gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded border text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

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

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded border text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default Catalog;