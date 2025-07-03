"use client";
import React from "react";

export default function Followinsta() {
  const INSTA = [
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751262800/beautiful-woman-baseball-cap-headband-fashion-studio-shoot_zbchuf.png",
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751262799/man-beige-cap-with-c-logo-men-s-apparel-shoot_auzbve.png",
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751262800/view-trucker-hat-chair_zbspmq.png",
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751262799/baseball-cap-with-sunglasses_fjjzdn.png",
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751262799/view-trucker-hat-with-copy-space_kug0oc.png",
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751262799/image_ygy7zd.png",
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751262799/image_1_eu9tp8.png",
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751262799/image_2_ozyaox.png",
    },
  ];

  return (
    <>
      <section className="mt-5">
        <div className="mb-18 mt-18">
          <p className="lg:text-[56px] text-xl font-bold text-[#333333] text-center">
            FOLLOW US ON INSTAGRAM
          </p>
          <p className="text-center text-lg px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            tincidunt leo et leo tincidun vel efficitur mi egestas curabitur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {INSTA.map((item, id) => (
            <div key={id} className="relative group overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={item.img}
                alt={`Instagram ${id}`}
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-[#860000]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dknrega1a/image/upload/v1751374415/Group_540_yl5gys.png"
                  alt="Instagram Icon"
                  className="w-10 h-10"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
