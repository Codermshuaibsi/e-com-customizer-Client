"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Searched_Items() {
    const [results, setResults] = useState([]);
    const [sortOption, setSortOption] = useState("featured");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [clickedButtons, setClickedButtons] = useState({});
    const [wishlistedItems, setWishlistedItems] = useState({});
    const { searchResults } = useAuth();

    const router = useRouter();

    // Load search results from localStorage
   useEffect(() => {
    if (Array.isArray(searchResults)) {
        setResults(searchResults);
    } else {
        console.warn("Search results not an array:", searchResults);
    }
}, [searchResults]);


    // Apply sorting and price filtering
    const getFilteredSortedResults = () => {

        const filtered = results;

        const sorted = [...filtered].sort((a, b) => {
            const priceA =
                a.discountedPrice && a.discountedPrice < a.price
                    ? a.discountedPrice
                    : a.price;
            const priceB =
                b.discountedPrice && b.discountedPrice < b.price
                    ? b.discountedPrice
                    : b.price;

            if (sortOption === "lowToHigh") return priceA - priceB;
            if (sortOption === "highToLow") return priceB - priceA;
            return 0; 
        });

        return sorted;
    };

    const filteredSortedResults = getFilteredSortedResults();

    // Pagination
    const totalPages = Math.ceil(filteredSortedResults.length / itemsPerPage);
    const currentProducts = filteredSortedResults.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                            quantity: 1,
                            productId: item._id,
                        }),
                    }
                );

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
            let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
            const already = guestCart.find((i) => i._id === item._id);

            if (!already) {
                guestCart.push(item);
                localStorage.setItem("guest_cart", JSON.stringify(guestCart));
                toast.success("Item added to local cart");
            } else {
                toast.success("Item already in local cart");
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
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl text-center font-bold mb-4">Search Results</h1>

            {/* Filter and Sort Controls */}
            <div className="mb-6 flex flex-col flex-wrap items-center mx-auto gap-4">

                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border px-3 py-2 rounded text-sm"
                >
                    <option value="featured">Sort by featured</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                </select>
            </div>

            {filteredSortedResults.length === 0 ? (
                <p className="text-gray-500">No products found.</p>
            ) : (
                <>
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
                                                    src={
                                                        item.images?.[0] ||
                                                        item.images ||
                                                        "/no-image.png"
                                                    }
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
                                        {(item.quantity || 0) > 0 ? (
                                            <>
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
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded border text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Searched_Items;