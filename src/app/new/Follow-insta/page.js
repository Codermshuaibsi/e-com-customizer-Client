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
  return <>
    <section className="mt-5">
      <div className="mb-18 mt-18">
        <p className="lg:text-[56px] text-xl font-bold text-[#333333] text-center">
          FOLLOW US ON INSTAGRAM
        </p>
        <p className="text-center text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt leo et leo tincidun vel efficitur mi egestas curabitur.        </p>
      </div>

      <div className="grid-cols-1  grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        {
          INSTA.map((item, id) => (
            <div className="" key={id} >
              <img className="w-[100%]" src={item.img} alt="" />
            </div>
          ))
        }

      </div>
    </section>
  </>
}
