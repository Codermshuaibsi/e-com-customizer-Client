"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

const FitnessProducts = () => {
  const { id } = useParams(); // id is subCategoryId
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategoryDetails = async () => {
      try {
        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/subCategoryPageDetails/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch subcategory details");

        const data = await res.json();
        console.log("Subcategory Data:", data);

        const allProducts = data?.selectedSubCategory?.products || [];
        setSubCategoryData(allProducts);
      } catch (err) {
        console.error("Error fetching subcategory details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSubCategoryDetails();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  if (!Array.isArray(subCategoryData) || subCategoryData.length === 0) {
    return <p className="text-center py-10">No products found.</p>;
  }

  return (
    <section className="py-16 px-4 md:px-10 lg:px-20 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Fitness & Sporting Goods Product Configurator
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-12">
        With niche-specific configurators, Doogma empowers your customers to
        create custom fitness and sporting items.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {subCategoryData.map((product) => (
          <div
            key={product._id}
            className="bg-white border rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-lg transition"
          >
            <Image
              src={product.thumbnail?.[0] || "/images/placeholder.png"}
              alt={product.title}
              width={200}
              height={200}
              className="object-contain"
            />

            <button className="mt-6 px-6 py-2 rounded-full text-sm font-semibold border border-gray-300 text-black transition hover:scale-105 bg-gradient-to-r from-yellow-300 to-teal-300">
              CUSTOMIZE IT
            </button>

            <h3 className="mt-6 text-lg font-medium text-gray-800 text-center">
              {product.title}
            </h3>

            <p className="text-sm text-gray-500 mt-2">{product.description}</p>

            <p className="text-base font-semibold text-green-600 mt-2">
              ₹{product.price}
            </p>

            {product.quantity === 0 && (
              <p className="text-red-500 text-sm mt-1">Out of Stock</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FitnessProducts;
