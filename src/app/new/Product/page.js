"use client";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

export default function Product() {
  const sliderItems = [
    {
      title: "TRUCKERS",
      image:
        "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751113640/Group_72626_c80lwx.png",
    },
    {
      title: "CLASSICS",
      image:
        "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751113653/Group_72627_lntamr.png",
    },
    {
      title: "FLATCAPS",
      image:
        "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751113662/Group_514_b8jobe.png",
    },
  ];
  return (
    <>
      <section className="flex flex-col mt-20 ">
        <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col pr-[36px] gap-10 justify-between md:mx-15 mx-10 sm:mx-10  lg:mx-26 ">
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dxlykgx6w/image/upload/v1751111518/Asset_2_apr3sr.png"
              alt=""
            />
            <p className="lg:text-5xl md:text-5xl text-2xl sm:text-5xl font-bold ">
              EXPLORE OUR PRODUCTS
            </p>
          </div>
          <div className="flex items-center">
            <button className="bg-[#3559C7] text-white px-6  h-[50px]">
              BROWSE OUR SELECTION
            </button>
          </div>
        </div>
        <section className="w-full bg-white py-8">
          <div className="max-w-[1300px] lg:mx-23 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-between gap-4">
              {sliderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-[500px] overflow-hidden group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full  group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-35 left-10 w-[30px] h-[30px] border-l-2 border-t-2 border-white" />
                    <div className="absolute top-35 right-10 w-[30px] h-[30px] border-r-2 border-t-2 border-white" />
                    <div className="absolute bottom-35 left-10 w-[30px] h-[30px] border-l-2 border-b-2 border-white" />
                    <div className="absolute bottom-35 right-10 w-[30px] h-[30px] border-r-2 border-b-2 border-white" />
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                    <h2 className="text-3xl font-extrabold tracking-wide">
                      {item.title}
                    </h2>
                    <button className="mt-4 px-6 py-3 bg-white text-black text-lg font-bold flex items-center gap-2 hover:bg-gray-100 transition">
                      SHOP NOW
                      <span className="text-black text-xl">
                        <IoIosArrowForward className="bg-black text-white rounded-4xl  " />
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="flex justify-center items-center mt-6 gap-2 text-white">
                        <button className="bg-black w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800">
                            &#x276E;
                        </button>
                        <span className="bg-black px-4 py-1 rounded-full text-sm">1/3</span>
                        <button className="bg-black w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800">
                            &#x276F;
                        </button>
                    </div> */}
          </div>
        </section>
      </section>
    </>
  );
}
