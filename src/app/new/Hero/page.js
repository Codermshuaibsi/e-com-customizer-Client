"use client";
import React from "react";
import { FiTruck } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { IoRepeatOutline } from "react-icons/io5";
import { LuCircleCheckBig } from "react-icons/lu";
import { LuTrello } from "react-icons/lu";

export default function Hero() {
  return (
    <section>
      <div className="flex flex-wrap gap-4 sm:gap-8 justify-center mt-4 px-4">
        {["TSHIRT", "HATS", "NEW COLLECTIONS", "BRAND", "ABOUT"].map((item) => (
          <a
            key={item}
            className="uppercase text-base sm:text-xl font-semibold text-[#333333]"
            href=""
          >
            {item}
          </a>
        ))}
      </div>
      <section
        className="w-full h-[80vh] mt-4 bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dxlykgx6w/image/upload/v1751104298/Group_505_zbfxcq.png)",
        }}
      >
        <div className="max-w-7xl w-full px-4 sm:px-8 lg:px-22 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src="https://res.cloudinary.com/dxlykgx6w/image/upload/v1751105298/Asset_1_n45nya.png"
              alt="Gradient Bar"
              className="h-50 w-4 hidden sm:block"
            />

            <div className="flex flex-col gap-4 max-w-xl">
              <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight uppercase">
                Summer Looks, <br /> Hotter Deals!
              </h1>
              <p className="text-sm sm:text-base lg:w-auto sm:w-[400px] md:w-auto w-[300px] text-white">
                Grab flat <strong>30% OFF</strong> on select hats & tees.
                <br className="hidden sm:block" />
                Limited time only!
              </p>

              <button className="flex items-center gap-2 bg-white text-black px-4 py-3 w-fit text-sm font-bold border border-black shadow hover:scale-105 transition">
                SHOP NOW
                <IoIosArrowForward className="bg-black text-white rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="w-full mt-5 relative">
        <img
          className="w-full object-cover"
          src="https://res.cloudinary.com/dxlykgx6w/image/upload/v1751104298/Group_505_zbfxcq.png"
          alt="Hero"
        />

        <div className="absolute top-10 left-6 sm:top-20 md:top-20 sm:left-16 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            className="h-72 w-5 hidden sm:block"
            src="https://res.cloudinary.com/dxlykgx6w/image/upload/v1751105298/Asset_1_n45nya.png"
            alt=""
          />

          <div className="text-white flex flex-col gap-6 sm:gap-8 max-w-[90%] md:max-w-[450px] sm:max-w-[450px]">
            <p className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Summer Looks, Hotter Deals!
            </p>
            <p className="text-base sm:text-xl lg:text-2xl uppercase">
              Grab flat <strong>30% OFF</strong> on select hats & tees. Limited
              time only!
            </p>
            <div className="bg-white text-black flex gap-2 items-center w-[160px] sm:w-[190px] py-2 sm:py-3 px-6 sm:px-8">
              <p className="font-bold text-sm sm:text-base">SHOP NOW</p>
              <IoIosArrowForward className="bg-black text-white rounded-full p-1" />
            </div>
          </div>
        </div>
      </div> */}

      <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-6 mb-6 px-4 text-sm sm:text-xl font-semibold text-center">
        <div className="flex items-center gap-2">
          <FiTruck />
          <p>Express Delivery</p>
        </div>
        <div className="flex items-center gap-2">
          <IoRepeatOutline />
          <p>Easy Returns</p>
        </div>
        <div className="flex items-center gap-2">
          <LuCircleCheckBig />
          <p>Secure Payment</p>
        </div>
        <div className="flex items-center gap-2">
          <LuTrello />
          <p>Veteran Owned</p>
        </div>
      </div>
    </section>
  );
}
