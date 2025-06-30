"use client";
import React from "react";
import "./news.css";

export default function Newsletter() {
  return (
    <section className="mt-14">
      <div className="relative w-full h-[370px] sm:h-[420px] lg:h-[400px] overflow-hidden group">
        <img
          src="https://res.cloudinary.com/dxlykgx6w/image/upload/v1751264298/medium-shot-man-holding-hat_1_e6jkoh.png"
          className="w-full h-full object-cover"
          alt="Newsletter Banner"
        />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-5 left-5  lg:top-18 lg:left-45  sm:top-10 sm:left-10 w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] border-l-2 border-t-2 ext-class-ang1 border-white" />

          <div className="absolute top-5 right-5  lg:top-18 lg:right-45 sm:top-10 sm:right-10 w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] border-r-2 border-t-2 ext-class-ang2 border-white" />

          <div className="absolute bottom-5 left-5  lg:bottom-18 lg:left-45 sm:bottom-10 sm:left-10 w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] border-l-2 border-b-2 ext-class-ang3 border-white" />

          <div className="absolute bottom-5 right-5  lg:bottom-18 lg:right-45 sm:bottom-10 sm:right-10 w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] border-r-2 border-b-2 ext-class-ang4 border-white" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-white text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide max-w-[90%]">
            BE THE FIRST TO KNOW ABOUT NEW GUN ARRIVALS!
          </h2>
          <p className="text-sm sm:text-base max-w-[85%]">
            We'll message you about new weapons, monthly specials, and price
            drops!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center mt-6 w-full max-w-[450px] gap-2 sm:gap-0">
            <input
              type="text"
              placeholder="E-mail"
              className="w-full px-4 py-2 text-black outline-0 bg-gray-100 border border-gray-300"
            />
            <button className="bg-[#3559C7] text-white px-6 py-2 w-full sm:w-auto">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
