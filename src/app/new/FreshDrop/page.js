"use client"
import { IoIosArrowForward } from "react-icons/io";
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";

export default function FreshDrop() {
    const router = useRouter();
    const [addedToCart, setAddedToCart] = useState(false);

    // Debug: log state changes
    useEffect(() => {
        console.log("addedToCart:", addedToCart);
    }, [addedToCart]);

    return (
        <>
            <section
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-left md:bg-cover flex items-center"
                style={{
                    backgroundImage:
                        "url('https://t3.ftcdn.net/jpg/03/20/68/66/360_F_320686681_Ur6vdYQgDC9WiijiVfxlRyQffxOgfeFz.jpg')",
                }}
            >
                <div className="max-w-7xl w-full px-4 sm:px-8 lg:px-16 text-white *:">
                    <div className="flex flex-col justify-end sm:flex-row items-start sm:items-center gap-6">

                        <img
                            src="https://res.cloudinary.com/dxlykgx6w/image/upload/v1751178289/Asset_1_uaudcw.png"
                            alt="Gradient Bar"
                            className="h-50 w-4 hidden sm:block"
                        />

                        <div className="flex flex-col gap-4 max-w-xl">
                            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight uppercase">
                                New Vibes<br /> Just Dropped
                            </h1>
                            <p className="text-sm sm:text-base lg:w-auto sm:w-[400px] md:w-auto w-[300px] text-white">
                                Discover the latest in streetwear – caps and tees that redefine bold style.
                                <br className="hidden sm:block" />
                                Grab yours before they’re gone.
                            </p>

                            {!addedToCart ? (
                                <button
                                    type="button"
                                    onClick={() => setAddedToCart(true)}
                                    className="flex cursor-pointer items-center gap-2 bg-white text-black px-4 py-3 w-fit text-sm font-bold border border-black shadow hover:scale-105 transition"
                                >
                                    Add to Cart
                                    <IoIosArrowForward className="bg-black text-white rounded-full" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => router.push("/get_all_cart")}
                                    className="flex cursor-pointer items-center gap-2 bg-green-600 text-white px-4 py-3 w-fit text-sm font-bold border border-black shadow hover:scale-105 transition"
                                >
                                    Go to Cart
                                    <IoIosArrowForward className="bg-white text-green-600 rounded-full" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
