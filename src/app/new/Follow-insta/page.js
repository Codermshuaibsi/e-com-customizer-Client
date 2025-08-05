"use client";
import React from "react";

export default function Followinsta() {
  const INSTA = [
    {
      img: "https://www.bringitonline.in/uploads/2/2/4/5/22456530/dsc07951_orig.jpg",
      overlay: "https://cdn.pixabay.com/photo/2015/07/13/07/41/icons-842893_1280.png",
      link: "https://www.facebook.com",
    },
    {
      img: "https://www.bringitonline.in/uploads/2/2/4/5/22456530/dsc07769_orig.jpg",
      overlay: "data:image/png;base64,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",
      link: "https://www.twitter.com",
    },
    {
      img: "https://www.bringitonline.in/uploads/2/2/4/5/22456530/dsc07631_orig.jpg",
      overlay: "https://cdn.pixabay.com/photo/2015/07/13/07/33/icons-842861_1280.png",
      link: "https://www.linkedin.com",
    },
    {
      img: "https://www.bringitonline.in/uploads/2/2/4/5/22456530/dsc07169_orig.jpg",
      overlay: "https://cdn-icons-png.flaticon.com/512/3955/3955024.png",
      link: "https://www.instagram.com",
    },
  ];

  return (
    <section className="mt-5">
      <div className="mb-18 mt-18 text-center">
        <p className="lg:text-[56px] text-xl font-bold text-[#333333]">
          FOLLOW US
        </p>
        <p className="text-lg px-4">
          Follow us on social media to get updates, inspiration, and exclusive offers!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {INSTA.map((item, id) => (
          <div key={id} className="relative group overflow-hidden rounded-lg">
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <img
                className="w-full h-full object-cover"
                src={item.img}
                alt={`Instagram ${id}`}
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 backdrop-blur-lg bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <img
                  src={item.overlay}
                  className="w-14 h-14"
                  alt="Social Icon"
                />
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
