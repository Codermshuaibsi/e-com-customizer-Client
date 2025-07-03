"use client";
import React from "react";

const TruckersHero = () => {
  return (
    <section
      className="relative h-[300px] md:h-[450px] w-full bg-cover bg-center flex items-center"
      style={{
        height:"300px",
        backgroundImage:
          "url('https://res.cloudinary.com/dknrega1a/image/upload/v1751346425/image_dglpve.png')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Text Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-10">
        <div className="flex items-center space-x-3">
          {/* Vertical Gradient Line */}
          <div className="h-20 w-[12px] bg-gradient-to-b from-blue-500 to-black"></div>

          {/* Heading */}
          <h1 className="text-white text-4xl md:text-7xl font-bold tracking-wide">
            TRUCKERS
          </h1>
        </div>
      </div>
    </section>
  );
};

export default TruckersHero;
