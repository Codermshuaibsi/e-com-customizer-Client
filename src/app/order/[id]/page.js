"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CheckoutForm from "../CheckoutForm/page"; // Adjust the path as per your folder structure

const OrderPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/getProductById/${id}`);
        const data = await res.json();
        setProduct(data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="order-page p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Order: {product.title}</h2>
      <div className="flex gap-6 mb-6">
        <img src={product.thumbnail[0]} alt={product.title} className="w-40 h-40 object-cover rounded" />
        <div>
          <p className="mb-2">{product.description}</p>
          <p className="font-semibold">Price: ₹{product.price}</p>
        </div>
      </div>

      <CheckoutForm product={product} />
    </div>
  );
};

export default OrderPage;
