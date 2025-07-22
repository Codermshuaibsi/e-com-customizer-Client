"use client";

import React from "react";

import ProductPage from "./FilterProduct/page";
import Navbar1 from "../COMMON/Navbar";
import Footer1 from "../COMMON/Footer";

function Catalog_AllSection() {
  return (
    <>
      <div className=" mx-auto max-w-[1720px]">
         <Navbar1 />
            {/* <TruckersHero /> */}
            <ProductPage />
         <Footer1 />
      </div>
    </>
  );
}

export default Catalog_AllSection;
