"use client";
import React from "react";
import Hero from "@/app/new/Hero/page";

const HeroPageTshirt = () => {

  return (
    <section
      className="relative h-[300px] md:h-[450px] w-full bg-cover bg-center flex items-center"
      style={{
        height:"300px",
        backgroundImage:
          "url('https://res.cloudinary.com/dknrega1a/image/upload/v1751346425/image_dglpve.png')",
      }}
    >
      
      <div className="absolute inset-0 bg-black/40"></div>

      
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-10">
        <div className="flex items-center space-x-3">
         
          <div className="h-20 w-[12px] bg-gradient-to-b from-blue-500 to-black"></div>

        
          <h1 className="text-white text-4xl md:text-7xl font-bold tracking-wide">
            TRUCKERS
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroPageTshirt;
