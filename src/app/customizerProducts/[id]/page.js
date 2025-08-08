"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BiCustomize } from "react-icons/bi";
import { useRouter } from "next/navigation";
const FitnessProducts = () => {
  const { id } = useParams(); // id is subCategoryId
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

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
        create custom fitness and sporting products.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {subCategoryData.map((product) => (
          <div
            key={product._id}
            className="border border-gray-200 rounded shadow-sm overflow-hidden group bg-white"
          >
            <div className="p-4">
              <div onClick={() => router.push(`/PDP_page/${product._id}`)} className="p-1.5 relative border border-gray-300">

                {" "}
                <img
                  src={product.images?.[0] || "/no-image.png"}
                  alt={product.title}
                  className="w-full h-52 object-contain mb-4"
                />{" "}

              </div>
              <h3 className="text-[17px] font-semibold mt-4">
                {product.title}
              </h3>
              <p className="text-lg font-bold mt-1 text-gray-800">
                {product.discountedPrice && product.discountedPrice < product.price ? (
                  <>
                    ₹{Number(product.discountedPrice).toFixed(2)}
                    <span className="line-through text-sm text-gray-500 ml-2">
                      ₹{Number(product.price).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>₹{Number(product.price || 0).toFixed(2)}</>
                )}
              </p>
            </div>
            <div className="flex products-center justify-between px-4 pb-4">
              {product.quantity > 0 ? (
                <>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-[#3559C7] text-white font-bold text-sm py-3 px-4 flex products-center justify-center gap-2 hover:bg-blue-800 transition"
                  >
                    <BiCustomize width={50} />
                    Customize it
                  </button>

                </>
              ) : (
                <span className="text-red-600 font-bold text-sm uppercase">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FitnessProducts;
