"use client";

import React from "react";

import ProductPage from "./FilterProduct/page";
import Footer1 from "../COMMON/Footer";

function Catalog_AllSection() {
  return (
    <>
      <div className=" mx-auto max-w-[1720px]">
            {/* <TruckersHero /> */}
            <ProductPage />\
      </div>
    </>
  );
}

export default Catalog_AllSection;
