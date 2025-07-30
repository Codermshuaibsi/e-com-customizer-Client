"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import React, { useState } from "react";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { FaRegHeart } from "react-icons/fa";
import { BiMinus, BiPlus } from "react-icons/bi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
// import { Link } from "lucide-react";
import Link from "next/link";
import Navbar from "../../COMMON/Navbar";
export default function ProductDetailPage() {


 const { id } = useParams();

  const thumbnails = [
    "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116991/101-0378-YEL-F01_750x_1_tweatg.png",
    "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0378-YEL-F01_750x_1_2_hqnoo3.png",
    "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0378-YEL-F01_750x_1_1_zhc0mr.png",
    "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116991/101-0378-YEL-F01_750x_1_tweatg.png"
  ];

  //  const hats = [
  //   {
  //     img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116991/101-0378-YEL-F01_750x_1_tweatg.png",
  //     sale: true,
  //     color: "Yellow",
  //   },
  //   {
  //     img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116991/101-0391-BLK-F01_750x_1_woo9r9.png",
  //     sale: false,
  //     color: "Black",
  //   },
  //   {
  //     img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0378-YA-BLK-F01_750x_1_sp0dgy.png",
  //     sale: false,
  //     color: "Black",
  //   },
  //   {
  //     img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0378-YEL-F01_750x_1_2_hqnoo3.png",
  //     sale: false,
  //     color: "Yellow",
  //   },
  //   {
  //     img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0378-YA-RED-F01_750x_1_jqz2si.png",
  //     sale: false,
  //     color: "Red",
  //   },
  //   {
  //     img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0378-YEL-F01_750x_1_1_zhc0mr.png",
  //     sale: false,
  //     color: "Yellow",
  //   },
  //   {
  //     img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0512-RUS_750x_1_r1ryco.png",
  //     sale: true,
  //     color: "Rust",
  //   },
  //   {
  //     img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751116990/101-0512-WIN-F01_750x_1_u5i4af.png",
  //     sale: true,
  //     color: "Wine",
  //   },
  // ];

  const [selectedImage, setSelectedImage] = useState(thumbnails[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [hats, setProducts4] = useState([]);

  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));


 const addToCart = async (item) => {
  console.log(id)
  const token = localStorage.getItem("user_token");

  if (token) {
    // ✅ Logged-in Cart
    try {
      const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/addToCart/${item._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Server Cart:", data);
      if (!res.ok) {

        alert(data.message || "Item added to cart successfully");
        
      }
    } catch (error) {
      console.error("Error adding to server cart:", error);
    }
  } else {
    // ✅ Guest Cart (localStorage)
    let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
    console.log("guestCart",guestCart)

    // check if item already exists
    const already = guestCart.find((items) => items.id === item);
    
    if (!already) {
      // guestCart.push({ item, quantity: 1 });
      guestCart.push(item);
      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      alert("Item added to local cart");
    } else {
      alert("Item already in local cart");
    }
  }
};
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/getProductById/${id}`);
        const data = await res.json();
         // Adjust if API response differs
        console.log(data.data)

        if(res.ok) {
          setSelectedImage(data.data.thumbnail[0]); 
          setProduct(data.data);// Assuming product has an images array
        } 
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

     const fetchProducts = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/totalProduct");
        const data = await res.json();
        console.log(data)
        setProducts4(data.AllProduct || []);
        console.log(data.AllProduct)  ;
      } catch (err) {
        setError("Failed to fetch products");
      } 
    };

   


    if (id) {
      fetchProduct();
    }
     fetchProducts();
  }, []);

  

  return ( <>
  <Navbar />
    <div className="p-6  py-10 px-15 max-w-full bg-white">
      <div className="text-[#4F4F4F] text-[11px] sm:text-[12px] font-semibold uppercase py-2"> 
            Home / All Products / Cap / Lorem Ipsum is Simply
          </div>
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Images */}
        <div className="flex-[1.2]">
          <div className="border-2 rounded-lg p-4 relative border-[#3559C7] h-[300px]">
            <img src={selectedImage} alt="Main Hat" className="w-full object-contain h-full" />
            <div className="absolute bottom-3 right-3 text-white text-xl bg-black bg-opacity-50 p-2 rounded-full">
              ⤢
            </div>
          </div>

         <div className="flex md:justify-center justify-start mt-4 gap-4 md:gap-6 overflow-x-auto flex-nowrap">
  {thumbnails.map((img, idx) => (
    <div
      key={idx}
      className="min-w-[80px] h-[90px] md:min-w-0 p-1 border rounded cursor-pointer border-[#3559C7]"
      onClick={() => setSelectedImage(img)}
    >
      <img src={img} alt={`Thumbnail ${idx}`} className="h-20 object-contain" />
    </div>
  ))}
</div>

        </div>

        {/* Right: Product Details */}
        <div className="flex-[1.5]">
          <h2 className="sm:text-2xl font-extrabold uppercase">{product?.title}</h2>
          <div className="flex items-center mt-2 gap-4">
            <span className="text-[#3559C7] text-xl font-bold">{product?.price}</span>
            <span className="line-through text-gray-500">$14.33</span>
            <span className="sm:text-sm text-green-600 text-[10px] font-medium">Availability: In stock</span>
          </div>

          <div className="mt-2 flex items-center gap-2 border-b border-t border-[#D9D9D9] py-2">
            <span className="text-yellow-400 text-lg">★★★★★</span>
            <span className="sm:text-sm text-[9px] font-semibold">20 Reviews</span>
            <button className="ml-auto text-xs font-bold text-[#333] uppercase underline">GET PRICE ALERTS</button>
          </div>

          <p className="mt-4 text-[15px] text-gray-700 leading-relaxed">
           {product?.description}
          </p>

          {/* Quantity and Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
               <div className="mt-6">
            <h4 className="font-bold text-[18px] text-[#3559C7] mb-2">QUANTITY</h4>
            <div className="flex items-center gap-4">
              <button
                className="w-8 h-8 border rounded-[50%] flex items-center justify-center text-lg"
                onClick={decreaseQty}
              >
                <AiOutlineMinus />
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                className="w-8 h-8 border flex  rounded-[50%] items-center justify-center text-lg"
                onClick={increaseQty}
              >
                <AiOutlinePlus />
              </button>
            </div>
          </div>
            <div className="flex gap-3">
              <button className="bg-[#3559C7] text-white px-6 py-2 font-bold text-sm uppercase">
                Customize
              </button>
              <button  onClick={()=>addToCart(product)} className="border border-[#3559C7] text-[#3559C7] px-6 py-2 font-bold text-sm uppercase">
                Add to Cart
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">Fast and secure, low cost shipping.</p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-10 border-t pt-6 w-full">
        <div className="flex gap-10 justify-center mb-4">
          <button
            className={`text-lg font-bold uppercase ${
              activeTab === "description"
                ? "text-[#3559C7] border-b-2 border-[#3559C7]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`text-lg font-bold uppercase ${
              activeTab === "reviews"
                ? "text-[#3559C7] border-b-2 border-[#3559C7]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {activeTab === "description" ? (
          <div className="bg-gray-50 px-6 py-10 text-lg text-gray-800 w-full">
            {product?.description}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 w-full">No reviews yet.</div>
        )}
      </div>


  </div>

         <div className="bg-[#f6f6f6] pt-7">
      <h2 className="text-2xl font-extrabold uppercase text-center text-[#2C3E50] mb-10">
        Related Products
      </h2>


    <section className="px-3 sm:px-6 md:px-10 py-10">
  <div className="max-w-7xl mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
    {hats
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
      .map((hat, idx) => (
        <div
          key={idx}
          className="border border-gray-200 rounded shadow-sm overflow-hidden group bg-white"
        >
          <div className="p-4 h-[380px]">
       <Link href={`/PDP_page/${hat?._id}`}>  
          <div className="p-1.5 relative border border-gray-300">
              <img
                src={hat.thumbnail}
                alt="Hat"
                className="w-full h-52 object-contain mb-4"
              />
              {hat.sale && (
                <div className="absolute top-0 left-0 bg-[#539C27] text-white px-6 tracking-widest py-1 text-xs font-bold z-10">
                  SALE
                </div>
              )}
            </div>
            </Link> 
            <h3 className="text-[17px] font-semibold mt-4">{hat.title}</h3>
            <p className="text-lg font-bold mt-1 text-gray-800">
                      {hat.discountedPrice &&
                      hat.discountedPrice < hat.price ? (
                        <>
                          ₹{Number(hat.discountedPrice).toFixed(2)}
                          <span className="line-through text-sm text-gray-500 ml-2">
                            ₹{Number(hat.price).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <>₹{Number(hat.price).toFixed(2)}</>
                      )}
                    </p>
          </div>
          <div className="flex items-center justify-between px-4 pb-4">
            <button onClick={() => addToCart(hat)} className="flex-1 bg-[#3559C7] text-white font-bold text-sm py-[14px] px-4 flex items-center justify-center gap-2 hover:bg-blue-800 transition">
              <LiaShoppingBagSolid />
              Add to Cart
            </button>
            <button className="ml-2 border border-gray-300 w-12 h-12 flex items-center justify-center hover:bg-gray-100">
              <FaRegHeart size={18} />
            </button>
          </div>
        </div>
      ))}
  </div>
</section>


  

    </div>

    
   </>
  );
}

