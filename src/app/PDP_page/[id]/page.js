"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { BiMinus, BiPlus } from "react-icons/bi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import Navbar from "../../COMMON/Navbar";

export default function productDetailPage() {
  const { id } = useParams();


  const [selectedImage, setSelectedImage] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setproduct] = useState(null);
  const [hats, setproducts4] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });

  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const addToCart = async (item) => {
    console.log(id)
    const token = localStorage.getItem("user_token");

    if (token) {
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
      let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      console.log("guestCart", guestCart)

      const already = guestCart.find((items) => items.id === item);

      if (!already) {
        guestCart.push(item);
        localStorage.setItem("guest_cart", JSON.stringify(guestCart));
        alert("Item added to local cart");
      } else {
        alert("Item already in local cart");
      }
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      id: Date.now(),
      ...reviewForm,
      date: new Date().toLocaleDateString()
    };
    setReviews([...reviews, newReview]);
    setReviewForm({ name: '', email: '', rating: 5, comment: '' });
  };

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/getproductById/${id}`);
        const data = await res.json();
        console.log("single",data.data)

        if (res.ok && data.data?.thumbnail?.length > 0) {
          setproduct(data.data);
          setSelectedImage(data.data.thumbnail[0]);
        }

      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchproducts = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/totalproduct");
        const data = await res.json();
        console.log(data)
        setproducts4(data.Allproduct || []);
        console.log(data.Allproduct);
      } catch (err) {
        setError("Failed to fetch products");
      }
    };

    if (id) {
      fetchproduct();
    }
    fetchproducts();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <>
      <motion.div
        className="p-6 py-10 px-15 max-w-full bg-white"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="text-[#4F4F4F] text-[11px] sm:text-[12px] font-semibold uppercase py-2"
          variants={itemVariants}
        >
          Home / All products /
        </motion.div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: Images */}
          <motion.div className="flex-[1.2]" variants={itemVariants}>
            <motion.div
              className="border-2 rounded-lg p-4 relative border-[#3559C7] h-[300px] overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage}
                  alt="Main Hat"
                  className="w-full object-contain h-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              <div className="absolute bottom-3 right-3 text-white text-xl bg-black bg-opacity-50 p-2 rounded-full">
                ⤢
              </div>
            </motion.div>

            <motion.div
              className="flex md:justify-center justify-start mt-4 gap-4 md:gap-6 overflow-x-auto flex-nowrap"
              variants={itemVariants}
            >
              {product?.thumbnail?.map((img, idx) => (
                <motion.div
                  key={idx}
                  className="min-w-[80px] h-[90px] md:min-w-0 p-1 border rounded cursor-pointer border-[#3559C7]"
                  onClick={() => setSelectedImage(img)}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="h-20 object-contain" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: product Details */}
          <motion.div className="flex-[1.5]" variants={itemVariants}>
            <motion.h2
              className="sm:text-2xl font-extrabold uppercase"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {product?.title}
            </motion.h2>

            <motion.div
              className="flex items-center mt-2 gap-4"
              variants={itemVariants}
            >
              <span className="text-[#3559C7] text-xl font-bold">{product?.price}</span>
              <span className="line-through text-gray-500">{product?.discountedPrice}</span>
              <span className="sm:text-sm text-green-600 text-[10px] font-medium">Availability: In stock</span>
            </motion.div>

            <motion.div
              className="mt-2 flex items-center gap-2 border-b border-t border-[#D9D9D9] py-2"
              variants={itemVariants}
            >
              <span className="text-yellow-400 text-lg">★★★★★</span>
              <span className="sm:text-sm text-[9px] font-semibold">{reviews.length || 20} Reviews</span>
              <motion.button
                className="ml-auto text-xs font-bold text-[#333] uppercase underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                GET PRICE alertS
              </motion.button>
            </motion.div>

            <motion.p
              className="mt-4 text-[15px] text-gray-700 leading-relaxed"
              variants={itemVariants}
            >
              {product?.description}
            </motion.p>

            {/* Quantity and Buttons */}
            <motion.div
              className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2"
              variants={itemVariants}
            >
              <div className="mt-6">
                <h4 className="font-bold text-[18px] text-[#3559C7] mb-2">QUANTITY</h4>
                <div className="flex items-center gap-4">
                  <motion.button
                    className="w-8 h-8 border rounded-[50%] flex items-center justify-center text-lg hover:bg-gray-100"
                    onClick={decreaseQty}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <AiOutlineMinus />
                  </motion.button>
                  <motion.span
                    className="text-lg font-semibold"
                    key={quantity}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {quantity}
                  </motion.span>
                  <motion.button
                    className="w-8 h-8 border flex rounded-[50%] items-center justify-center text-lg hover:bg-gray-100"
                    onClick={increaseQty}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <AiOutlinePlus />
                  </motion.button>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  className="bg-[#3559C7] text-white px-6 py-2 font-bold text-sm uppercase hover:bg-blue-800 transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Customize
                </motion.button>
                <motion.button
                  onClick={() => addToCart(product)}
                  className="border border-[#3559C7] text-[#3559C7] px-6 py-2 font-bold text-sm uppercase hover:bg-[#3559C7] hover:text-white transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>

            <motion.p
              className="text-sm text-gray-500 mt-4"
              variants={itemVariants}
            >
              Fast and secure, low cost shipping.
            </motion.p>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          className="mt-10 border-t pt-6 w-full"
          variants={itemVariants}
        >
          <div className="flex gap-10 justify-center mb-4">
            <motion.button
              className={`text-lg font-bold uppercase ${activeTab === "description"
                ? "text-[#3559C7] border-b-2 border-[#3559C7]"
                : "text-gray-600"
                }`}
              onClick={() => setActiveTab("description")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Description
            </motion.button>
            <motion.button
              className={`text-lg font-bold uppercase ${activeTab === "reviews"
                ? "text-[#3559C7] border-b-2 border-[#3559C7]"
                : "text-gray-600"
                }`}
              onClick={() => setActiveTab("reviews")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reviews ({reviews.length})
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "description" ? (
              <motion.div
                key="description"
                className="bg-gray-50 px-6 py-10 text-lg text-gray-800 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {product?.description}
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                className="py-10 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Review Form */}
                <motion.div
                  className="max-w-2xl mx-auto mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h3 className="text-xl font-bold mb-4 text-[#3559C7]">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={reviewForm.name}
                          onChange={handleReviewInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3559C7] focus:border-transparent"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={reviewForm.email}
                          onChange={handleReviewInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3559C7] focus:border-transparent"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                            className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                          >
                            <FaStar />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comment *</label>
                      <textarea
                        name="comment"
                        value={reviewForm.comment}
                        onChange={handleReviewInputChange}
                        required
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3559C7] focus:border-transparent"
                        placeholder="Share your experience with this product..."
                      />
                    </motion.div>

                    <motion.button
                      type="submit"
                      className="bg-[#3559C7] text-white px-6 py-3 font-bold text-sm uppercase hover:bg-blue-800 transition-colors rounded-md"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Submit Review
                    </motion.button>
                  </form>
                </motion.div>

                {/* Reviews Display */}
                <div className="max-w-4xl mx-auto">
                  {reviews.length > 0 ? (
                    <motion.div
                      className="space-y-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {reviews.map((review, index) => (
                        <motion.div
                          key={review.id}
                          className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm"
                          variants={itemVariants}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{review.name}</h4>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center mb-3">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      className="text-center text-gray-500 py-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      No reviews yet. Be the first to review this product!
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-[#f6f6f6] pt-7"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-2xl font-extrabold uppercase text-center text-[#2C3E50] mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Related products
        </motion.h2>

        <section className="px-3 sm:px-6 md:px-10 py-10">
          <motion.div
            className="max-w-7xl mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {hats
              .sort(() => 0.5 - Math.random())
              .slice(0, 4)
              .map((hat, idx) => (
                <motion.div
                  key={idx}
                  className="border border-gray-200 rounded shadow-sm overflow-hidden group bg-white"
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 h-[380px]">
                    <Link href={`/PDP_page/${hat?._id}`}>
                      <motion.div
                        className="p-1.5 relative border border-gray-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img
                          src={hat.thumbnail}
                          alt="Hat"
                          className="w-full h-52 object-contain mb-4"
                        />
                        {hat.sale && (
                          <motion.div
                            className="absolute top-0 left-0 bg-[#539C27] text-white px-6 tracking-widest py-1 text-xs font-bold z-10"
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                          >
                            SALE
                          </motion.div>
                        )}
                      </motion.div>
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
                    <motion.button
                      onClick={() => addToCart(hat)}
                      className="flex-1 bg-[#3559C7] text-white font-bold text-sm py-[14px] px-4 flex items-center justify-center gap-2 hover:bg-blue-800 transition"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <LiaShoppingBagSolid />
                      Add to Cart
                    </motion.button>
                    <motion.button
                      className="ml-2 border border-gray-300 w-12 h-12 flex items-center justify-center hover:bg-gray-100"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <FaRegHeart size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </section>
      </motion.div>
    </>
  );
}