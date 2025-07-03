"use client";
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
// import "./footer.css";

export default function Footer() {
  const cards = [
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751269647/179431_1_cfedfv.png",
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751269647/Layer_1_2_xisnnr.png",
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751269647/jcb-512_1_yrnpe1.png",
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751269647/Group_71967_bvqxxf.png",
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751269647/Group_71970_zuzfza.png",
    },
    {
      img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751269647/Group_71968_ndgnfz.png",
    },
  ];

  return (
    <section className="mt-10 px-4 sm:px-6 lg:px-16">
      <div className="flex flex-col lg:flex-row justify-between gap-10 p-6 border-b border-gray-300">
        <div className="flex flex-col gap-3">
          <p className="text-4xl sm:text-5xl text-[#333] lg:text-start text-center font-bold">
            BRAND
          </p>
          <p className="text-base lg:text-start text-center text-gray-600">
            Lorem Ipsum is a Dummy
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-10 w-full lg:w-[60%] justify-evenly ">
          <div className="flex gap-10 ext-class-foot">
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold mb-2">Hats & Cap</h3>
              <p className="text-sm sm:text-base font-medium">Lorem Ipsum</p>
              <p className="text-sm sm:text-base font-medium">Lorem Ipsum</p>
              <p className="text-sm sm:text-base font-medium">Lorem Ipsum</p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold mb-2">T-SHIRT</h3>
              <p className="text-sm sm:text-base font-medium">Lorem Ipsum</p>
              <p className="text-sm sm:text-base font-medium">Lorem Ipsum</p>
              <p className="text-sm sm:text-base font-medium">Lorem Ipsum</p>
            </div>
          </div>
          <div className="flex flex-col ext-class-foot2 gap-3">
            <h3 className="text-lg font-bold mb-2">CONTACT US</h3>
            <p className="text-sm sm:text-base font-medium">
              10 AM - 6 PM, Monday - Saturday
            </p>
            <p className="text-sm sm:text-base font-medium">1234567889</p>
            <p className="text-sm sm:text-base font-medium">Lorem Ipsum</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col mx-6 sm:flex-row justify-between items-center gap-6 py-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <p className="text-sm sm:text-base font-semibold text-center sm:text-center">
            © Brand 2025
          </p>
          <div className="flex gap-3">
            <div className="bg-[#333] p-2  text-white">
              <FaFacebookF />
            </div>
            <div className="bg-[#333] p-2  text-white">
              <FaTwitter />
            </div>
            <div className="bg-[#333] p-2  text-white">
              <FaInstagram />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end gap-3">
          {cards.map((card, id) => (
            <div className="w-12 h-8 flex items-center justify-center" key={id}>
              <img
                src={card.img}
                alt={`card-${id}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
