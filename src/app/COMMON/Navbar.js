"use client";
import React, { useEffect, useRef, useState } from "react";
// import "../Navbar/page.css";
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

export default function Navbar() {
  const navItems = [
    "TSHIRT",
    "HATS",
    "NEW COLLECTIONS",
    "BRAND",
    "ABOUT",
    "CUSTOMIZER",
  ];
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useRouter();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showCategories, setShowCategories] = useState([]);
  const [showBrand, setShowBrand] = useState(false);
  const [brands, setBrands] = useState([]);
  const Goto_new_page = (index) => {
    const routes = [
      "/catalog_tshirt_page",
      "/Catalog_page",
      "/new_collection",
      "/brand",
      "/about",
    ];

    if (index === 5) {
      // CUSTOMIZER clicked
      setShowCustomizer(true); // trigger a state
    } else {
      navigation.push(routes[index]);
    }

    // navigation.push(routes[index]);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    setIsLoggedIn(!!token);

    const fetchAllCategories = async () => {
      try {
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/showAllCategory"
        );

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();
        console.log("Fetched Categories:", data);
        setShowCategories(data.data);
        console.log("All Categories:", data);
        return data;
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    };

    const fetchBrands = async () => {
      try {
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/totalBrands"
        );
        const json = await res.json();
        console.log("Fetched Brands: Navber", json);
        if (res.ok)
          {
              const activeBrands = json.filter((brand) => brand.active === true);
      setBrands(activeBrands);
          }
        else console.error(json.message);
      } catch (e) {
        console.error("Failed to fetch brands:", e);
      }
    };

    fetchBrands();
    fetchAllCategories();
    // true if token exists
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    setIsLoggedIn(false);
    navigation.push("/login");
  };
  const pathname = usePathname();

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
        BRAND
      </div>
      
      {/* Auth section for mobile */}
      <div className="flex gap-2 items-center">
        {isLoggedIn ? (
          <button className="text-[#3559C7] font-semibold text-sm underline">
            <User_profile_dero />
          </button>
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
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></span>
      </div>
      
      <Link href={"/mainuserprofile"}>
        <FiMail className="text-3xl text-[#424241]" />
      </Link>
      
      <button
        className="text-red-500"
        onClick={() => navigation.push("/wishlist")}
      >
        {true ? <HiHeart size={32} /> : <HiOutlineHeart size={32} />}
      </button>
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
        BRAND
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
        <div className="relative">
          <Link href={"/get_all_cart"}>
            <LiaShoppingBagSolid className="text-3xl text-[#424241]" />
          </Link>
          <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full"></span>
        </div>
        
        <Link href={"/mainuserprofile"}>
          <FiMail className="text-3xl text-[#424241]" />
        </Link>
        
        <button
          className="text-red-500"
          onClick={() => navigation.push("/wishlist")}
        >
          {true ? <HiHeart size={30} /> : <HiOutlineHeart size={30} />}
        </button>
      </div>
    </div>

    {/* Right: Auth */}
    <div className="flex gap-4 items-center whitespace-nowrap">
      {isLoggedIn ? (
        <button className="text-[#3559C7] font-semibold text-base xl:text-lg underline">
          <User_profile_dero />
        </button>
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
        className={`${
          showMenu ? "" : "hidden"
        } md:flex flex-wrap gap-4 sm:gap-8 justify-center mt-3 mb-3 px-5 relative`}
      >
        {navItems.map((item, index) => {
          if (item === "CUSTOMIZER") {
            return (
              <div key={item} className="relative group mb-2" ref={dropdownRef}>
                <a
                  className="uppercase text-base sm:text-md font-semibold text-[#333333] cursor-pointer"
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

          if (item === "BRAND") {
  return (
    <div
      key="brand"
      className="relative group mb-2"
      ref={dropdownRef}
      onMouseEnter={() => setShowBrand(true)}
      onMouseLeave={() => setShowBrand(false)}
    >
      <a className="uppercase text-base sm:text-md font-semibold cursor-pointer hover:text-gray-600 transition-colors">
        {item}
      </a>
      
      {showBrand && (
       <div className="absolute left-1/2 top-full w-[90vw] max-w-[350px] -translate-x-1/2 bg-white p-6 border border-gray-200 shadow-xl rounded-md z-50 animate-fadeIn">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
    {brands.map((brand) => (
      <div key={brand._id} className="flex flex-col items-center group/brand transition-transform duration-200">
        <Link href={`/getbrandsproduct/${slugify(brand.name, { lower: true })}`}>
          <div className="transition-transform hover:scale-105 w-[60px]">
            <img
              src={brand.logoUrl}
              alt={`${brand.name} logo`}
              className="h-14 w-20 object-scale-down mb-2 rounded-lg shadow-sm"
              loading="lazy"
            />
          </div>
        </Link>
        <span className="text-[9px] font-bold text-center group-hover/brand:text-blue-600 transition-colors">
          {brand.name}
        </span>
      </div>
    ))}
  </div>
</div>

      )}
    </div>
  );
}

          // For other nav items
          return (
            <div key={item} className="relative mb-3">
              <a
                className="uppercase text-base sm:text-md font-semibold text-[#333333] cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => Goto_new_page(index)}
              >
                {item}
              </a>
            </div>
          );
        })}
      </div>
    </header>
  );
}
