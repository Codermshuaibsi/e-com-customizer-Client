"use client";

import React from "react";

import AllSection from "../app/new/page";
import Catalog_AllSection from "./Catalog_page/page";
import Product_Overview_AllSection from "./PDP_page/page";
import Catalog_tshirt_page from "./catalog_tshirt_page/page";
import New_product_AllSection from "./new_collection/page"
import Signup from "./signup/registeration/page";


export default function page() {
  return (
    <div>
      {/* <Product_Overview_AllSection /> */}
      {/* <Catalog_AllSection /> */}
      <AllSection />
      {/* <Signup /> */}
      {/* <New_product_AllSection /> */}
      {/* <Catalog_tshirt_page /> */}
    </div>
  );
}
