"use client";
import React from "react";
import "../Navbar/page.css";
import {
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaSearch,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import { LiaShoppingBagSolid } from "react-icons/lia";

export default function Navbar() {
  return (
    <header>
      <div className="bg-black text-white text-md p-4 px-20 flex lg:flex-row flex-col md:flex-row gap-4  justify-between items-center">
        <div className="flex ext-call items-center gap-6">
          <div className="flex items-center ">
            <IoCallOutline />
            <span>
              <a href="tel:+1234567890">+12 345 6789 0</a>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope />
            <span>
              <a href="mailto:support@homie.com">support@homie.com</a>
            </span>
          </div>
        </div>
        <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col items-center  gap-5">
          <a href="#" className="underline">
            Read our Blog
          </a>
          <div className="flex gap-6">
            <FaFacebookF className="text-xl" />
            <FaTwitter className="text-xl" />
            <FaInstagram className="text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white py-4 ext-css px-4 lg:mx-16 md:mx-16 mx-4 lg:w-[90%] md::w-[90%] w-[100%] sm:mx-4 flex lg:flex-row flex-col mt-3.5 justify-between items-center gap-4">
        <div className="flex w-[68%] ext-brand gap-[50px] ">
          <div className="text-5xl ext-brand-title font-bold text-[#333333]">
            BRAND
          </div>

          <div className="flex flex-1 max-w-[690px]  w-full">
            <input
              type="text"
              placeholder="Search here"
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-l-md"
            />
            <button className="bg-[#3559C7] text-white px-4 rounded-r-md">
              <FaSearch />
            </button>
          </div>
        </div>

        <div className="flex ext-sign items-center gap-8">
          <div className="flex gap-6">
            <div className="relative">
              <LiaShoppingBagSolid className="text-3xl text-[#424241]" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full"></span>
            </div>

            <FiMail className="text-3xl text-[#424241]" />
          </div>

          <div className="flex gap-6 items-center">
            <a
              href="#"
              className="text-[#3559C7] w-[73px] font-semibold text-xl underline"
            >
              SIGN IN
            </a>
            <button className="bg-[#3559C7] w-[137px] text-white px-8 py-3 font-semibold ">
              SIGN UP
            </button>
          </div>
        </div>
      </div>

      <hr className="text-[#d6d6d6] mt-3" />
    </header>
  );
}
