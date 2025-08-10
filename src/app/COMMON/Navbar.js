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
import { IoCallOutline, IoNotificationsCircle } from "react-icons/io5";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { HiMenu, HiX, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import User_profile_dero from "../userprofile/page";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import clsx from 'clsx'
import { BiNotification } from "react-icons/bi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

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
    "GUNS": "/guns",
  };


  const [showMenu, setShowMenu] = useState(false);
  const navigation = useRouter();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showCLOTHES, setShowCLOTHES] = useState(false);
  const [showGUNS, setShowGUNS] = useState(false);
  const [showCategories, setShowCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [Search, setSearch] = useState("")
  const { cartCount, setsearchResults } = useAuth();

  const navItems = ["NEW COLLECTIONS", "ABOUT", "CUSTOMIZE", "CLOTHES", "GUNS"];


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

  const handleOnChange = (e) => {
    setSearch(e.target.value);
  };




  const handleSearch = async () => {
    if (!Search || Search.trim() === "") {
      toast.message("Please enter a search term")
      return;
    }

    try {
      // localStorage.removeItem("searchResults")
      const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/search/product/?query=${Search}`);
      const data = await res.json();
      setsearchResults([])
      if (res.ok) {
        console.log("Search Results:", data.data); // ✅ You can navigate or display it here
        // For example, store in localStorage or redirect:
        // localStorage.setItem("searchResults", JSON.stringify(data.data));
        setsearchResults(data.data)
        navigation.push('/Search')
      } else {
        alert(data.message || "Product not found");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Something went wrong with the search");
    }
  };

  const handlekey = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    else {
      return
    }
  }



  return (

    <header className="sticky top-0 left-0 right-0 bg-white z-20">
      <div className="bg-black  text-white text-sm px-4 md:px-10 py-3 flex flex-row md:flex-row justify-between items-center gap-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
          <div className="flex items-center gap-2">
            <IoCallOutline />
            <a href="tel:+8979302837" className="hover:text-blue-500">+91-8979302837</a>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope />
            <a href="mailto:support@homie.com" className="hover:text-blue-500">support@homie.com</a>
          </div>
        </div>

        {/* Right social & blog */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
          <a href="#" className="underline">
            Read our Blog
          </a>
          <div className="flex gap-4">
            <a href="https://www.facebook.com" target="_blank"> <FaFacebookF className="text-lg" /></a>
            <a href="https://www.twitter.com" target="_blank"><FaTwitter className="text-lg" /></a>
            <a href="https://www.instagram.com" target="_blank"> <FaInstagram className="text-lg" /></a>
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
              <h1>DesignTailor</h1>
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
              value={Search}
              onChange={handleOnChange}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-l-md text-base"
            />
            <button onClick={handleSearch} className="bg-[#3559C7] cursor-pointer text-white px-4 rounded-r-md flex items-center justify-center min-w-[50px]">
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
                {console.log("Cart Count:", cartCount)}
              </span>


            </div>


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
              <h1>DesignTailor</h1>
            </div>

            <div className="flex w-full max-w-lg">
              <input
                type="text"
                value={Search}
                onChange={handleOnChange}
                onKeyDown={handlekey}
                placeholder="Search here"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-l-md"
              />
              <button onClick={handleSearch} className="bg-[#3559C7] cursor-pointer text-white px-4 rounded-r-md">
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
                <Link href={"/get_all_cart"}> <p className="hover:font-medium cursor-pointer">Cart</p></Link>
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
                onClick={() => {
                  setShowCLOTHES((showCLOTHES) => !showCLOTHES);
                  setShowCustomizer(false);
                }}
              >
                <a
                  className={clsx(
                    "uppercase text-base sm:text-md font-semibold cursor-pointer transition-colors flex items-center gap-1",
                    isActive ? "text-blue-600" : "text-[#333333] hover:text-gray-600"
                  )}
                >
                  {item}
                  {showCLOTHES ? (
                    <HiChevronUp className="ml-1 transition-transform duration-200" />
                  ) : (
                    <HiChevronDown className="ml-1 transition-transform duration-200" />
                  )}
                </a>
          
                {showCLOTHES && (
                  <div
                    className="absolute left-1/2 top-full w-[80vw] max-w-2xl -translate-x-1/2 
                       bg-white p-6 border border-gray-200 shadow-2xl rounded-md z-50 
                       grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3"
                  >
                    {showCategories
                      .filter((category) => category.title !== "GUNS") // GUNS remove kiya
                      .map((category) => (
                        <div key={category._id}>
                          <h3 className="text-lg font-semibold mb-2 text-gray-800">
                            {category.title}
                          </h3>
                          <ul className="space-y-1">
                            {category.subCategory?.map((sub) => (
                              <li key={sub._id}>
                                <Link
                                  href={`/Catalog_page/${sub._id}`}
                                  className="text-sm sm:text-sm text-gray-600 hover:text-blue-600 transition-colors transform hover:scale-105 duration-200 font-normal"
                                  style={{ display: "inline-block" }}
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
                    "uppercase text-base sm:text-md font-semibold cursor-pointer transition-colors flex items-center gap-1",
                    showCustomizer ? "text-blue-600" : "text-[#333333] hover:text-gray-600"
                  )}
                  onClick={() => {
                    setShowCustomizer(showCustomizer => !showCustomizer)
                    setShowCLOTHES(false)
                  }}
                >
                  {item}
                  {showCustomizer ? (
                    <HiChevronUp className="ml-1 transition-transform duration-200" />
                  ) : (
                    <HiChevronDown className="ml-1 transition-transform duration-200" />
                  )}
                </a>

                {showCustomizer && (
                  <div
                    className="absolute left-1/2 top-full w-[95vw] max-w-2xl -translate-x-1/2 bg-white p-6 border border-gray-200 shadow-2xl rounded-md z-50 "
                    onMouseEnter={() => setShowCustomizer(true)}
                    onMouseLeave={() => setShowCustomizer(false)}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
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
                                  className="text-sm sm:text-sm text-gray-600 hover:text-blue-600 transition-colors transform hover:scale-105 duration-200 font-normal"
                                  style={{ display: 'inline-block' }}
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

          // GUN
          if (item === "GUNS") {
            return (
              <div key={item} className="relative group mb-2" ref={dropdownRef}>
                <a
                  className={clsx(
                    "uppercase text-base sm:text-md font-semibold cursor-pointer transition-colors flex items-center gap-1",
                    showGUNS ? "text-blue-600" : "text-[#333333] hover:text-gray-600"
                  )}
                  onClick={() => {
                    setShowGUNS(prev => !prev);
                    setShowCustomizer(false);
                    setShowCLOTHES(false); // CLOTHES close
                  }}
                >
                  {item}
                  {showGUNS ? (
                    <HiChevronUp className="ml-1 transition-transform duration-200" />
                  ) : (
                    <HiChevronDown className="ml-1 transition-transform duration-200" />
                  )}
                </a>
          
                {showGUNS && (
                  <div
                    className="absolute left-1/2 top-full w-[200px] -translate-x-1/2 bg-white p-4 border border-gray-200 shadow-2xl rounded-md z-50"
                    onMouseEnter={() => setShowGUNS(true)}
                    onMouseLeave={() => setShowGUNS(false)}
                  >
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/guns/ar"
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-normal"
                        >
                          AR
                        </Link>
                      </li>
                    </ul>
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

        {/* Dropdown for Guns */}
        {/* <div className="flex gap-4 items-center">
          <div className="relative group">
            <button className="text-[#3559C7] font-semibold text-sm underline">
              Guns
            </button>
            <div className="absolute hidden group-hover:block bg-white border border-gray-200 rounded shadow-lg mt-2">
              <ul className="py-2">
                <li>
                  <a
                    href="/guns/pistols"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Pistols
                  </a>
                </li>
                <li>
                  <a
                    href="/guns/rifles"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Rifles
                  </a>
                </li  >
                <li>
                  <a
                    href="/guns/shotguns"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Shotguns
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div> */}



      </div>
    </header >
  );
}
