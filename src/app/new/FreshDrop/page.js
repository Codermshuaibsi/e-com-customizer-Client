"use client"
import { IoIosArrowForward } from "react-icons/io";
import React from 'react'
import { useRouter } from "next/navigation";

export default function FreshDrop() {
    const router = useRouter();
    return (

        <>
            <section
                className="w-full h-[450px] bg-cover bg-center flex items-center"
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


                            <button onClick={() => router.push("/new_collection")} className="flex cursor-pointer items-center gap-2 bg-white text-black px-4 py-3 w-fit text-sm font-bold border border-black shadow hover:scale-105 transition">
                                Browse New Arrivals
                                <IoIosArrowForward className="bg-black text-white rounded-full" />

                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
