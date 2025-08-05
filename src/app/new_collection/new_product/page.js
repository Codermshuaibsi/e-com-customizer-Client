"use client";
import React, { useEffect, useState, useMemo } from "react";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { toast } from "react-toastify";

export default function New_Product() {
  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  const [clickedButtons, setClickedButtons] = useState({});
  const [wishlistedItems, setWishlistedItems] = useState({});
  const [loading, setLoading] = useState({ products: true, categories: true });
  const router = useRouter();

  // Constants
  const ITEMS_PER_PAGE = 6;
  const API_BASE_URL = "https://e-com-customizer.onrender.com/api/v1";

  // Fetch data on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubcategories]);

  const fetchProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const res = await fetch(`${API_BASE_URL}/totalProduct`);
      const data = await res.json();
      setProducts(data.AllProduct || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  // Wishlist Function
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

  const fetchCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const res = await fetch(`${API_BASE_URL}/showAllCategory`);
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([]);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const fetchSubcategories = async (categoryId, categoryTitle) => {
    try {
      const res = await fetch(`${API_BASE_URL}/fetchAllSubCategoryOfCategory/${categoryId}`);
      const data = await res.json();

      const subcategoryList = data.success && data.categoryDetails
        ? data.categoryDetails.subCategory || []
        : [];

      setSubcategories(prev => ({
        ...prev,
        [categoryTitle]: subcategoryList
      }));

      console.log(`Subcategories for ${categoryTitle}:`, subcategoryList);
    } catch (err) {
      console.error(`Failed to fetch subcategories for ${categoryTitle}:`, err);
      setSubcategories(prev => ({
        ...prev,
        [categoryTitle]: []
      }));
    }
  };

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
  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = selectedSubcategories.length === 0
      ? products
      : products.filter(product =>
        selectedSubcategories.includes(product.subCategory?.title)
      );

    // Sort products
    switch (sortBy) {
      case "price-low-high":
        filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high-low":
        filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "featured":
      default:
        // Keep original order for featured
        break;
    }

    return filtered;
  }, [products, selectedSubcategories, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  // Event handlers
  const handleCategoryToggle = async (category) => {
    const { _id: categoryId, title: categoryTitle } = category;

    if (expandedCategories.includes(categoryTitle)) {
      setExpandedCategories(prev => prev.filter(c => c !== categoryTitle));
    } else {
      setExpandedCategories(prev => [...prev, categoryTitle]);

      if (!subcategories[categoryTitle]) {
        await fetchSubcategories(categoryId, categoryTitle);
      }
    }
  };

  const handleSubcategoryToggle = (subcategoryTitle) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategoryTitle)
        ? prev.filter(s => s !== subcategoryTitle)
        : [...prev, subcategoryTitle]
    );
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedSubcategories([]);
    setExpandedCategories([]);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination buttons
  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      if (currentPage <= 3) {
        buttons.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        buttons.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        buttons.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-[60px]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filter */}
        <aside className="w-full md:w-64  bg-white p-5 shadow-md rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center border-b pb-3 mb-5">
            <h3 className="text-lg font-extrabold text-[#2e2e2e] uppercase tracking-wide">
              Filter By
            </h3>
            <button
              className={`text-[#3559C7] text-xs font-bold uppercase hover:underline transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
              onClick={clearAllFilters}
              disabled={selectedSubcategories.length === 0}
            >
              Clear All
            </button>
          </div>

          {loading.categories ? (
            <div className="text-center text-gray-500 py-4">
              Loading categories...
            </div>
          ) : categories.length > 0 ? (
            <>
              <div className="mb-4">
                <h4 className="text-[13px] font-bold text-[#2e2e2e] uppercase mb-3 tracking-wider">
                  Categories
                </h4>
              </div>

              <div className="space-y-4 border-b border-gray-200 pb-4">
                {categories.map((category, idx) => (
                  <div key={category._id || idx} className="space-y-2">
                    <div className="flex items-cente cursor-pointer justify-between">
                      <button
                        onClick={() => handleCategoryToggle(category)}
                        className="flex justify-between items-center cursor-pointer w-full text-left group"
                      >
                        <span className="text-sm text-[#2e2e2e] font-semibold group-hover:text-[#3559C7] transition-colors">
                          {category.title}
                        </span>
                        <span className="text-2xl font-mono text-[#555]">
                          {expandedCategories.includes(category.title) ? '−' : '+'}
                        </span>
                      </button>
                    </div>

                    {expandedCategories.includes(category.title) && (
                      <div className="ml-2 space-y-2 border-l-2 border-gray-200 pl-3">
                        {subcategories[category.title]?.length > 0 ? (
                          subcategories[category.title].map((subcategory, subIdx) => (
                            <div key={subcategory._id || subIdx} className="flex items-center justify-between">
                              <label
                                htmlFor={`sub-${subcategory._id}`}
                                className="text-sm text-[#555] font-normal cursor-pointer hover:text-[#3559C7] transition-colors flex-1"
                              >
                                {subcategory.title}
                              </label>
                              <input
                                type="checkbox"
                                id={`sub-${subcategory._id}`}
                                checked={selectedSubcategories.includes(subcategory.title)}
                                onChange={() => handleSubcategoryToggle(subcategory.title)}
                                className="w-5 h-5 border border-gray-300 rounded-sm cursor-pointer checked:bg-[#3559C7] checked:border-[#3559C7] transition-all"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="text-[12px] text-gray-500 italic py-1">
                            {subcategories[category.title] ? 'No subcategories found' : 'Loading...'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-4">No categories available</div>
          )}

          {/* Active Filters */}
          {selectedSubcategories.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-200">
              <h5 className="text-sm font-bold text-[#2e2e2e] mb-3">Active Filters:</h5>
              <div className="flex flex-wrap gap-2">
                {selectedSubcategories.map((subcategory, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-[#3559C7] text-white text-xs px-3 py-1.5 rounded-full shadow-sm"
                  >
                    {subcategory}
                    <button
                      onClick={() => handleSubcategoryToggle(subcategory)}
                      className="ml-1 text-white hover:text-gray-200 transition-colors text-lg"
                      aria-label={`Remove ${subcategory} filter`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>


        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 px-1">
            <div className="text-[#4F4F4F] text-[16px] sm:text-[18px] font-semibold">
              <span className="uppercase">Home / All Products / Catalog</span>
              {selectedSubcategories.length > 0 && (
                <span className="text-[#3559C7] ml-2 font-normal">
                  ({filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''})
                </span>
              )}
            </div>
            <select
              className="border px-3 py-2 rounded text-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#3559C7] focus:border-transparent"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="featured">Sort by featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          {/* Products Grid */}
          <section className="px-1 sm:px-0">
            {loading.products ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3559C7]"></div>
                <p className="text-gray-500 mt-2">Loading products...</p>
              </div>
            ) : currentProducts.length > 0 ? (
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {currentProducts.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="border border-gray-200 rounded-lg shadow-sm overflow-hidden group bg-white hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-4 cursor-pointer"
                      onClick={() => router.push(`/PDP_page/${item._id}`)}
                    >

                      <div className="p-1.5 relative border border-gray-300 rounded">
                        <img
                          src={item.thumbnail?.[0] || "/no-image.png"}
                          alt={item.title || "Product image"}
                          className="w-full h-52 object-contain mb-4"
                          loading="lazy"
                        />
                        {item.sale && (
                          <div className="absolute top-2 left-2 bg-[#539C27] text-white px-3 py-1 text-xs font-bold rounded">
                            SALE
                          </div>
                        )}
                      </div>
                      <h3 className="text-[17px] font-semibold mt-4 line-clamp-2">
                        {item.title?.length > 50
                          ? item.title.slice(0, 50) + "..."
                          : item.title || "Untitled Product"}
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
                    <div className="flex items-center gap-2 px-4 pb-4">
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
                        ADD TO CART
                      </button>
                      <button
                        onClick={() => AddToWishlist(item)}
                        className="ml-2 border border-gray-300 w-12 h-12 flex items-center justify-center hover:bg-gray-100"
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
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <p className="text-gray-500 text-lg mb-2">
                  {selectedSubcategories.length > 0
                    ? "No products found matching your filters"
                    : "No products available"}
                </p>
                {selectedSubcategories.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[#3559C7] hover:underline mt-2"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {generatePaginationButtons().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === "..."}
                  className={`px-3 py-2 text-sm border rounded transition-colors ${page === currentPage
                    ? "bg-[#3559C7] text-white border-[#3559C7]"
                    : page === "..."
                      ? "cursor-default"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}