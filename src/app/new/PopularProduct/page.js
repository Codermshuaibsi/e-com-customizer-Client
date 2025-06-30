"use client";
import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { LiaShoppingBagSolid } from "react-icons/lia";

export default function PopularPro() {
    const hats = [
        {
            img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751181412/images_5_1_rxdsej.png",
            sale: false,
        },
        {
            img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751181412/images_8_1_cfx3qe.png",
            sale: false,
        },
        {
            img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751181412/images_9_1_dgnanl.png",
            sale: false,
        },
        {
            img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751181411/purepng.com-red-t-shirtclothingred-t-shirtfashion-dress-shirt-cloth-tshirt-631522326799mcfdo_1_clofl9.png",
            sale: false,
        },
        {
            img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751181412/images_5_1_rxdsej.png",
            sale: false,
        },
        {
            img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751181412/images_8_1_cfx3qe.png",
            sale: false,
        },
        {
            img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751181412/images_9_1_dgnanl.png",
            sale: false,
        },
        {
            img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751181411/purepng.com-red-t-shirtclothingred-t-shirtfashion-dress-shirt-cloth-tshirt-631522326799mcfdo_1_clofl9.png",
            sale: false,
        },

    ];
    return (
        <>
            <section>
                <div className="mb-6 mt-6">
                    <p className="text-[56px] font-bold text-[#333333] text-center">
                        OUR MOST POPULAR PRODUCTS
                    </p>
                    <p className="text-center text-lg">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt leo et leo tincidun vel efficitur mi egestas curabitur.
                    </p>
                </div>
                <section className="bg-white py-10 px-4">
                    <div className="max-w-[1330] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                        {hats.map((hat, idx) => (
                            <div
                                key={idx}
                                className="border border-gray-200  rounded shadow-sm overflow-hidden  group"
                            >
                                <div className="p-4">
                                    <div className="p-1.5 relative border border-gray-300">
                                        <img
                                            src={hat.img}
                                            alt="Hat"
                                            className="w-full h-52 object-contain mb-4"
                                        />
                                        {hat.sale && (
                                            <div className="absolute top-0 left-0 bg-[#539C27] text-white px-8 tracking-widest clip-sale py-1.5 text-sm font-bold z-10">
                                                SALE
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold mt-4">LOREM IPSUM</h3>
                                    <p className="text-xl font-bold mt-1">
                                        $ 12.23
                                        <span className="line-through text-xs text-gray-500 ml-2">
                                            $ 14.23
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-between px-4 pb-4">
                                    <button className="flex-1 bg-[#3559C7] text-white font-bold text-sm py-4.5 px-4 flex items-center justify-center gap-2 hover:bg-blue-800 transition">
                                        <LiaShoppingBagSolid />
                                        SHOP NOW
                                    </button>
                                    <button className="ml-2 border border-gray-300 w-14 h-14 flex items-center justify-center hover:bg-gray-100 ">
                                        <FaRegHeart size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </>
    );
}