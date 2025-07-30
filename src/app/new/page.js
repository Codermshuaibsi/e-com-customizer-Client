"use client";

import React from "react";
// import Navbar from "./Navbar/page";
import Hero from "./Hero/page";
import Product from "./Product/page";
import HatsSection from "./Hats/page";
import FeaturePro from "./FeaturedProduct/page";
import FreshDrop from "./FreshDrop/page";
import PopularPro from "./PopularProduct/page";
import Brands from "./Brands/page";
import Followinsta from "./Follow-insta/page";
import Newsletter from "./Newsletter/page";
import Footer from "./Footer/page";
import Navbar from "../COMMON/Navbar";

function AllSection() {
  return (
    <>
      <div className=" mx-auto max-w-[1720px]">
        {/* <Navbar /> */}
        <Hero />
        <Product />
        <HatsSection />
        <FeaturePro />
        <FreshDrop />
        <PopularPro />
        <Brands />
        <Followinsta />
        <Newsletter />
        <Footer />
      </div>
    </>
  );
}

export default AllSection;
