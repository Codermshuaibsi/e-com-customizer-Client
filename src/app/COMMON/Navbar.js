"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaSearch,
} from "react-icons/fa";
import slugify from "slugify";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { FiMail } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { HiMenu, HiX } from "react-icons/hi";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import User_profile_dero from "../userprofile/page";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import clsx from 'clsx'
// import Image from "next/image";


export const alert = (text, type = "success") => {
  Toastify({
    text: text,
    duration: 3000,
    close: true,
    gravity: "top", // top or bottom
    position: "right", // left, center or right
    backgroundColor:
      type === "success"
        ? "linear-gradient(to right, #00b09b, #96c93d)"
        : type === "error"
          ? "linear-gradient(to right, #ff5f6d, #ffc371)"
          : "#333",
  }).console.log();
};





export default function Navbar() {

  const routeMap = {
    "NEW COLLECTIONS": "/new_collection",
    "ABOUT": "/About",
    "CUSTOMIZE": "/customizer",
    "CLOTHES": "/clothes",
  };
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useRouter();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showCLOTHES, setShowCLOTHES] = useState(false);
  const [showCategories, setShowCategories] = useState([]);
  const [showBrand, setShowBrand] = useState(false);
  const [brands, setBrands] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const navItems = ["NEW COLLECTIONS", "ABOUT", "CUSTOMIZE", "CLOTHES"];

  const pathname = usePathname();
  const Goto_new_page = (item) => {
    if (item === "CUSTOMIZE") {
      setShowCustomizer(true);
    } else if (routeMap[item]) {
      navigation.push(routeMap[item]);
    }
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = typeof window !== "undefined" && localStorage.getItem("user_token");
  const Id = typeof window !== "undefined" && localStorage.getItem("user_Id")



  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        if (!token) return;

        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1//AllCartItems/${Id}`, // Replace ":id" with actual user id if needed
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok && data?.cartItems) {
          const total = data.cartItems.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(total);
        } else {
          console.warn("Could not fetch cart items:", data.message);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();
  }, []);




  useEffect(() => {
    setIsLoggedIn(!!token);

    const fetchAllCategories = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/showAllCategory");
        const data = await res.json();
        setShowCategories(data.data || []);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    const fetchBrands = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/totalBrands");
        const json = await res.json();
        if (res.ok) {
          const activeBrands = json.filter((brand) => brand.active);
          setBrands(activeBrands);
        }
      } catch (e) {
        console.error("Failed to fetch brands:", e);
      }
    };

    fetchBrands();
    fetchAllCategories();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    setIsLoggedIn(false);
    navigation.push("/login");
  };

  useEffect(() => {
    console.log("📍 Current route:", pathname);
  }, [pathname]);

  const customizerCategories = [
    "Fitness & Sporting Goods",
    "Jewelry & Watches",
    "Sports & Apparel",
    "Furniture & Home Decor",
    "Food & Beverages",
    "B2B",
    "Industrial",
    "Electronics",
    "Promotional",
  ];

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCustomizer(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (

    <header>
      <div className="bg-black text-white text-sm px-4 md:px-10 py-3 flex flex-row md:flex-row justify-between items-center gap-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
          <div className="flex items-center gap-2">
            <IoCallOutline />
            <a href="tel:+1234567890">+12 345 6789 0</a>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope />
            <a href="mailto:support@homie.com">support@homie.com</a>
          </div>
        </div>

        {/* Right social & blog */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
          <a href="#" className="underline">
            Read our Blog
          </a>
          <div className="flex gap-4">
            <FaFacebookF className="text-lg" />
            <FaTwitter className="text-lg" />
            <FaInstagram className="text-lg" />
          </div>
        </div>
      </div>

      {/* Middle main nav */}
      <div className="bg-white py-4 px-4 md:px-8 lg:px-16">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Top row: Brand + Auth */}
          <div className="flex justify-between items-center mb-4">
            <div
              className="text-2xl sm:text-3xl font-bold text-[#333333] cursor-pointer"
              onClick={() => navigation.push("/")}
            >
              <img src="/Logo.png" alt="" className="w-[100px] lg:w-lg xl:w-lg sm:w-sm" />
            </div>

            {/* Auth section for mobile */}
            <div className="flex gap-2 items-center">
              {token ? (
                <span className="text-[#3559C7] font-semibold text-sm underline">
                  <User_profile_dero />
                </span>
              ) : (
                <>
                  <a
                    href="#"
                    className="text-[#3559C7] font-semibold text-sm underline"
                    onClick={() => navigation.push("/login")}
                  >
                    SIGN IN
                  </a>
                  <button
                    className="bg-[#3559C7] text-white px-3 py-2 text-sm font-semibold rounded"
                    onClick={() => navigation.push("/signup")}
                  >
                    SIGN UP
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="flex w-full mb-4">
            <input
              type="text"
              placeholder="Search here"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-l-md text-base"
            />
            <button className="bg-[#3559C7] text-white px-4 rounded-r-md flex items-center justify-center min-w-[50px]">
              <FaSearch />
            </button>
          </div>

          {/* Icons row */}
          <div className="flex justify-center gap-8 items-center">
            <div className="relative">
              <Link href={"/get_all_cart"}>
                <LiaShoppingBagSolid className="text-3xl text-[#424241]" />
              </Link>
              <span className="absolute -top-2 -right-2  text-white text-xs font-semibold h-5 w-5 flex items-center justify-center rounded-full bg-blue-600">
                {cartCount}
              </span>


            </div>

            <Link href={"/mainuserprofile"}>
              <FiMail className="text-3xl text-[#424241]" />
            </Link>
          </div>

        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center gap-4">
          {/* Left: brand + search */}
          <div className="flex w-full lg:w-2/3 items-center gap-6">
            <div
              className="text-4xl xl:text-5xl font-bold text-[#333333] cursor-pointer whitespace-nowrap"
              onClick={() => navigation.push("/")}
            >
              <img src="/Logo.png" alt="" className="w-lg" />
            </div>

            <div className="flex w-full max-w-lg">
              <input
                type="text"
                placeholder="Search here"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-l-md"
              />
              <button className="bg-[#3559C7] text-white px-4 rounded-r-md">
                <FaSearch />
              </button>
            </div>

            <div className="flex gap-6 items-center">
              <div className="flex cursor-pointer flex-col relative ">
                <Link href={"/get_all_cart"}>
                  <LiaShoppingBagSolid className="text-3xl text-[#424241]" />
                  <span className="absolute -top-2 -right-2  text-white text-xs font-semibold h-5 w-5 flex items-center justify-center rounded-full bg-blue-600">
                    {cartCount}
                  </span>

                </Link>
                <p className="hover:font-medium cursor-pointer">Cart</p>
              </div>


             
            </div>
          </div>

          {/* Right: Auth */}
          <div className="flex gap-4 items-center cursor-pointer
             whitespace-nowrap">
            {isLoggedIn ? (
              <span className="text-[#3559C7] cursor-pointer font-semibold text-base xl:text-lg underline">
                <User_profile_dero />
              </span>
            ) : (
              <>
                <a
                  href="#"
                  className="text-[#3559C7] font-semibold text-base xl:text-lg underline"
                  onClick={() => navigation.push("/login")}
                >
                  SIGN IN
                </a>
                <button
                  className="bg-[#3559C7] text-white px-6 py-3 font-semibold rounded"
                  onClick={() => navigation.push("/signup")}
                >
                  SIGN UP
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <hr className="text-[#d6d6d6]" />

      <div className="sm:hidden flex justify-between items-center px-4 mt-4 md-3">
        <h2 className="text-xl font-bold text-[#333]">MENU</h2>
        <button
          className="text-2xl"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {showMenu ? <HiX /> : <HiMenu />}
        </button>
      </div>

      <div
        className={`${showMenu ? "" : "hidden"
          } md:flex flex-wrap gap-4 sm:gap-8 justify-center mt-3 mb-3 px-5 relative`}
      >
        {navItems.map((item) => {
          const currentPath = routeMap[item];
          const isActive = pathname === currentPath;

          // CLOTHES Dropdown
          if (item === "CLOTHES") {
            return (
              <div
                key="CLOTHES"
                className="relative group mb-2"
                onMouseEnter={() => setShowCLOTHES(true)}
                onMouseLeave={() => setShowCLOTHES(false)}
              >
                <a
                  className={clsx(
                    "uppercase text-base sm:text-md font-semibold cursor-pointer transition-colors",
                    isActive ? "text-blue-600" : "text-[#333333] hover:text-gray-600"
                  )}
                >
                  {item}
                </a>

                {showCLOTHES && (
                  <div className="absolute left-1/2 flex gap-15 top-full w-[600px] items-start -translate-x-1/2 bg-white p-4 border border-gray-200 shadow-xl rounded-md z-50">
                    {showCategories.map((category) => (
                      <div key={category._id}>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                          {category.title}
                        </h3>
                        <ul className="space-y-1">
                          {category.subCategory?.map((sub) => (
                            <li key={sub._id}>
                              <Link
                                href={`/Catalog_page/${sub._id}`}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                              >
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // CUSTOMIZER Dropdown
          if (item === "CUSTOMIZE") {
            return (
              <div key={item} className="relative group mb-2" ref={dropdownRef}>
                <a
                  className={clsx(
                    "uppercase text-base sm:text-md font-semibold cursor-pointer transition-colors",
                    isActive ? "text-blue-600" : "text-[#333333] hover:text-gray-600"
                  )}
                  onMouseEnter={() => setShowCustomizer(true)}
                  onMouseLeave={() => setShowCustomizer(false)}
                >
                  {item}
                </a>

                {showCustomizer && (
                  <div
                    className="absolute left-1/2 top-full w-[95vw] max-w-2xl -translate-x-1/2 bg-white p-6 border border-gray-200 shadow-2xl rounded-md z-50"
                    onMouseEnter={() => setShowCustomizer(true)}
                    onMouseLeave={() => setShowCustomizer(false)}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {showCategories.map((category) => (
                        <div key={category._id}>
                          <h3 className="text-lg font-semibold mb-2 text-gray-800">
                            {category.title}
                          </h3>
                          <ul className="space-y-1">
                            {category.subCategory?.map((sub) => (
                              <li key={sub._id}>
                                <Link
                                  href={`/customizerProducts/${sub._id}`}
                                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                  {sub.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // Default Nav Items (NEW COLLECTIONS, ABOUT)
          return (
            <div key={item} className="relative mb-3">
              <a
                className={clsx(
                  "uppercase text-base sm:text-md font-semibold cursor-pointer transition-colors",
                  isActive ? "text-blue-600" : "text-[#333333] hover:text-blue-600"
                )}
                onClick={() => Goto_new_page(item)}
              >
                {item}
              </a>
            </div>
          );
        })}

      </div>
    </header >
  );
}
