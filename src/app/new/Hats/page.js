"use client";
import React, { useRef } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";


export default function ShirtSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" }); // Animate once when near viewport
  const router = useRouter();

  return (
    <section
      ref={ref}
      className="w-full min-h-[500px] bg-cover bg-center flex justify-center lg:justify-start items-center"
      style={{
        backgroundImage:
          "url('https://5.imimg.com/data5/HD/BG/OZ/SELLER-19528648/printed-shirts.jpeg')",
      }}
    >
      <div className="max-w-[1400px] px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-white rounded-2xl max-w-auto p-5 backdrop-blur-2xl"
        >
          <motion.h1  
            initial={{ opacity: 0, y: -30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:w-[700px] font-extrabold leading-tight text-center md:text-center lg:text-start uppercase"
          >
            Cool Printed Shirts <br /> That Speak Your Vibe
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-center md:text-center lg:text-start mt-6"
          >
            Discover statement shirts in bold prints and vibrant colors.
            <br className="hidden sm:block" />
            Elevate your look. Be unique. Be unforgettable.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            onClick={()=> router.push('/Catalog_page/6890ac148bdc0af1632302c4')}
            className="mt-8 px-6 py-3 cursor-pointer hover:scale-105 transition-all bg-white text-black font-bold flex items-center gap-2 hover:bg-gray-100  mx-auto lg:mx-0"
          >
            EXPLORE COLLECTION
            <IoIosArrowForward className="text-white bg-black rounded-full p-1 text-2xl" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
