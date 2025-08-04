"use client";
import React from "react";

export default function Followinsta() {
  const INSTA = [
    {
      img: "https://www.bringitonline.in/uploads/2/2/4/5/22456530/dsc07951_orig.jpg",
    },
    {
      img: "https://www.bringitonline.in/uploads/2/2/4/5/22456530/dsc07769_orig.jpg",
    },
    {
      img: "https://www.bringitonline.in/uploads/2/2/4/5/22456530/dsc07631_orig.jpg",
    },
    {
      img: "https://www.bringitonline.in/uploads/2/2/4/5/22456530/dsc07169_orig.jpg",
    },
  ];

  const Overlay = [
    {
      img0: "https://cdn.pixabay.com/photo/2015/07/13/07/41/icons-842893_1280.png", // Instagram logo 1
    },
    {
      img0: "data:image/png;base64,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", // Instagram logo 2

    },
    {
      img0: "https://cdn.pixabay.com/photo/2015/07/13/07/33/icons-842861_1280.png", // Instagram logo 3
    },
    {
      img0: "https://cdn-icons-png.flaticon.com/512/3955/3955024.png", // Instagram logo 4
    },
  ];

  return (
    <section className="mt-5">
      <div className="mb-18 mt-18">
        <p className="lg:text-[56px] text-xl font-bold text-[#333333] text-center">
          FOLLOW US
        </p>
        <p className="text-center text-lg px-4">
          Follow us on social media to get updates, inspiration, and exclusive
          offers!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {INSTA.map((item, id) => (
          <div key={id} className="relative group overflow-hidden rounded-lg">
            <img
              className="w-full h-full object-cover"
              src={item.img}
              alt={`Instagram ${id}`}
            />

            {/* Unique overlay on hover */}
            <div className="absolute inset-0 backdrop-blur-lg cursor-pointer  opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <img
                src={Overlay[id]?.img0}
                className="w-14 h-14"
                alt="Overlay Icon"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
