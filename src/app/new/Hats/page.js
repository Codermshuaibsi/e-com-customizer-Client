"use client";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

export default function HatsSection() {
  return (
    <>
      <section
        className="w-full min-h-[94vh] bg-cover bg-center flex justify-center lg:justify-start  items-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dxlykgx6w/image/upload/v1751115174/view-baseball-cap_ebcgvo.png')",
          // backgroundSize: "contain",
          // backgroundRepeat: "no-repeat",
          // backgroundPosition: "center",
        }}
      >
        <div className="max-w-[1400px]  px-6 md:px-12 lg:px-20">
          <div className="text-white max-w-xl">
            <h1 className="text-4xl md:text-6xl lg:w-[700px] md:max-w-[700px] lg:text-start md:text-center text-center sm:text-center font-extrabold leading-tight">
              Make It Yours Custom <br /> Hats & Tees
            </h1>
            <p className="text-lg md:text-xl lg:text-start md:text-center text-center sm:text-center mt-6">
              DESIGN YOUR OWN. PICK COLORS, ADD TEXT, <br />
              CREATE A LOOK THAT’S UNIQUELY YOU.
            </p>
            <button className="mt-8 px-6 py-3 lg:mx-0 mx-auto bg-white text-black font-bold flex items-center gap-2 hover:bg-gray-100 transition">
              START DESIGNING
              <span className="text-xl">
                <IoIosArrowForward className="bg-black text-white rounded-4xl  " />
              </span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
