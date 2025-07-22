"use client";
import React, { useState } from "react";
import "../Navbar/page.css";
import {
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaSearch,
} from "react-icons/fa";
import { HiOutlineHeart } from "react-icons/hi"
import { FiMail } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";
export default function Navbar() {
  const navItems = ["TSHIRT", "HATS", "NEW COLLECTIONS", "BRAND", "ABOUT"];
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useRouter();
  const Goto_new_page = (index) => {
    const routes = [
      "/catalog_tshirt_page",
      "/Catalog_page",
      "/catalog_tshirt_page",
      "/brand",
      "/about",
    ];
    navigation.push(routes[index]);
  };
  return (
    <header>
      <div className="bg-black text-white text-sm px-4 md:px-10 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
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
      <div className="bg-white py-4 px-4 md:px-8 lg:px-16 flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Left: brand + search */}
        <div className="flex flex-col md:flex-row w-full lg:w-2/3 items-center gap-6">
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#333333]">
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
          <div className="flex gap-4 md:gap-6 items-center">
            <div className="relative">
              <LiaShoppingBagSolid className="text-2xl md:text-3xl text-[#424241]" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full"></span>
            </div>
            <FiMail className="text-2xl md:text-3xl text-[#424241]" />
          </div>
        </div>

        {/* Right: icons + login */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
          <div className="flex gap-4 items-center">
            <a
              href="#"
              className="text-[#3559C7] font-semibold text-base sm:text-lg underline"
            >
              SIGN IN
            </a>
            <button className="bg-[#3559C7] text-white px-4 py-2 sm:px-6 sm:py-3 font-semibold">
              SIGN UP
            </button>
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
          showMenu ? "flex" : "hidden"
        } sm:flex flex-wrap gap-4 sm:gap-8 justify-center mt-3 mb-3 px-5`}
      >
        {navItems.map((item, index) => (
          <a
            key={item}
            className="uppercase text-base sm:text-xl font-semibold text-[#333333]"
            href="#"
            onClick={() => Goto_new_page(index)}
          >
            {item}
          </a>
        ))}
      </div>
    </header>
  );
}
