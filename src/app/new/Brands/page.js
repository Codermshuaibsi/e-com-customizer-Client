"use client"
import React from 'react'

export default function Brands() {
    return (
        <>
            <section className="flex flex-col my-10 px-4">

                <div className="flex flex-col md:flex-row gap-7 w-full max-w-6xl py-10 mx-auto">
                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold md:w-3/5 w-full leading-snug">
                        WE HAVE ALL THE BRANDS YOU ARE LOOKING FOR
                    </p>
                    <p className="md:w-2/5 w-full py-3 text-base leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt leo et leo tincidunt vel efficitur mi egestas. Curabitur vulputate vestibulum dapibus orci vitae natoque penatibus et magnis dis parturient.
                    </p>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto w-full max-w-6xl">
                    <div className="border w-full h-[150px] flex items-center justify-center border-gray-300 p-6">
                        <img src="https://res.cloudinary.com/dxlykgx6w/image/upload/v1751182203/Group_1000009304_diidss.png" alt="Brand 1" />
                    </div>
                    <div className="border w-full h-[150px] flex items-center justify-center border-gray-300 p-6">
                        <img src="https://res.cloudinary.com/dxlykgx6w/image/upload/v1751182203/Group_1000009305_1_amv07z.png" alt="Brand 2" />
                    </div>
                    <div className="border w-full h-[150px] flex items-center justify-center border-gray-300 p-6">
                        <img src="https://res.cloudinary.com/dxlykgx6w/image/upload/v1751182203/PUM.DE_BIG-3030b719_1_jid4br.png" alt="Brand 3" />
                    </div>
                    <div className="border w-full h-[150px] flex items-center justify-center border-gray-300 p-6">
                        <img src="https://res.cloudinary.com/dxlykgx6w/image/upload/v1751182203/Under_armour_logo.svg_1_un2zfa.png" alt="Brand 4" />
                    </div>
                </div>
            </section>

        </>
    )
}
