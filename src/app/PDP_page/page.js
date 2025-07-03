"use client";

import React from "react";
import Navbar from "../COMMON/Navbar";
import Footer from "../COMMON/Footer";

import ProductDetailPage from "./Product_Overview/page";


function Product_Overview_AllSection() {
  return (
    <>
      <div className=" mx-auto max-w-[1720px]">
        <Navbar />
           <ProductDetailPage />
        <Footer />
      </div>
    </>
  );
}

export default Product_Overview_AllSection;
