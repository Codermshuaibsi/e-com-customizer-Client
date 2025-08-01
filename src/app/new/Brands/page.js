"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import slugify from "slugify";

export default function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/totalBrands"
        );
        const data = await res.json();
        console.log("Fetched Brands:", data);

        if (res.ok) {
          const activeBrands = data.filter((brand) => brand.active === true);
          setBrands(activeBrands); // adjust if your API response uses a different key
        } else {
          console.error("Failed to fetch brands:", data.message);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <section className="flex flex-col my-10 px-4">
      <div className="flex flex-col md:flex-row gap-7 w-full max-w-6xl py-10 mx-auto">
        <p className="text-3xl sm:text-4xl md:text-5xl font-bold md:w-3/5 w-full leading-snug">
          WE HAVE ALL THE BRANDS YOU ARE LOOKING FOR
        </p>
        <p className="md:w-2/5 w-full py-3 text-base leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt
          leo et leo tincidunt vel efficitur mi egestas. Curabitur vulputate
          vestibulum dapibus orci vitae natoque penatibus et magnis dis
          parturient.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto w-full max-w-6xl">
        {brands.slice(0, 4).map((brand, index) => (
          <div
            key={index}
            className="border w-full h-[150px] flex items-center justify-center border-gray-300 p-6"
          >
            <Link
              href={`/getbrandsproduct/${slugify(brand.name, { lower: true })}`}
            >
              {" "}
              <img
                src={brand.logoUrl}
                alt={brand.name || `Brand ${index + 1}`}
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
