"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});

  const cards = [
    { img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751269647/179431_1_cfedfv.png" },
    { img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751269647/Layer_1_2_xisnnr.png" },
    { img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751269647/jcb-512_1_yrnpe1.png" },
    { img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751269647/Group_71967_bvqxxf.png" },
    { img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751269647/Group_71970_zuzfza.png" },
    { img: "https://res.cloudinary.com/dxlykgx6w/image/upload/v1751269647/Group_71968_ndgnfz.png" },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
    { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
    { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
  ];

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/showAllCategory");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories for all categories
  useEffect(() => {
    const fetchAllSubcategories = async () => {
      const subs = {};
      for (const cat of categories) {
        try {
          const res = await fetch(
            `https://e-com-customizer.onrender.com/api/v1/fetchAllSubCategoryOfCategory/${cat._id}`
          );
          const data = await res.json();
          subs[cat.title] = data.categoryDetails?.subCategory || [];
        } catch (err) {
          console.error(`Error fetching subcategories for ${cat.title}:`, err);
          subs[cat.title] = [];
        }
      }
      setSubcategories(subs);
    };

    if (categories.length > 0) {
      fetchAllSubcategories();
    }
  }, [categories]);

  return (
    <footer className="bg-white mt-10 px-4 sm:px-6 lg:px-16 border-t border-gray-200">
      <div className="flex flex-col lg:flex-row justify-between gap-10 py-10 border-b border-gray-300">
        {/* Brand Info */}
        <div className="flex flex-col gap-3 text-center lg:text-start">
          <Link href="/">
            <img src="/Logo.png" alt="Logo" className="w-36 mx-auto lg:mx-0" />
          </Link>
          <p className="text-base text-center text-xl text-gray-800">Fashion that fits you.</p>
        </div>

        {/* Dynamic Category Columns */}
        <div className="grid grid-cols-2 sm:flex gap-8 w-full lg:w-[60%] justify-evenly">
          {categories.slice(0, 4).map((cat, idx) => (
            <div className="flex flex-col gap-2" key={idx}>
              <h3 className="text-lg font-semibold text-gray-800">{cat.title}</h3>
              {subcategories[cat.title]?.slice(0, 5).map((subcat, i) => (
                <Link
                  key={i}
                  href={`/Catalog_page/${subcat._id}`}
                  className="text-sm text-gray-600 hover:font-semibold hover:text-black transition"
                >
                  {subcat.title}
                </Link>
              ))}
            </div>
          ))}

          {/* Contact Info */}
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
            <p className="text-sm text-gray-600">Mon–Sat: 10 AM - 6 PM</p>
            <a href="tel:1234567890" className="text-sm text-gray-600 hover:text-black hover:font-semibold transition-all">
              1234567890
            </a>
            <a href="mailto:support@gmail.com">
              <p className="text-sm transition-all  hover:font-semibold text-gray-600">support@gmail.com</p>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 py-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <p className="text-sm text-gray-700">© Brand 2025. All rights reserved.</p>
          <div className="flex gap-3">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="bg-gray-800 p-2 rounded-full text-white  transition-all"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-3">
          {cards.map((card, id) => (
            <div className="w-12 h-8 flex items-center justify-center" key={id}>
              <img
                src={card.img}
                alt={`Payment card ${id}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
