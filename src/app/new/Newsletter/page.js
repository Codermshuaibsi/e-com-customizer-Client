"use client";
import React, { useState } from "react";
import "./news.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // handle input change
  const handleOnChange = (e) => {
    setEmail(e.target.value);
  };

  // handle form submit
  const handleSubscribe = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://e-com-customizer.onrender.comapi/v1/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("🎉 Subscribed successfully!");
        setEmail("");
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Server error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <section className="mt-14">
      <div className="relative w-full h-[370px] sm:h-[420px] lg:h-[400px] overflow-hidden group">
        <img
          src="https://res.cloudinary.com/dxlykgx6w/image/upload/v1751264298/medium-shot-man-holding-hat_1_e6jkoh.png"
          className="w-full h-full object-cover"
          alt="Newsletter Banner"
        />

        <div className="absolute inset-0 pointer-events-none">
          {/* Corners */}
          <div className="absolute top-5 left-5 w-[25px] h-[25px] border-l-2 border-t-2 border-white" />
          <div className="absolute top-5 right-5 w-[25px] h-[25px] border-r-2 border-t-2 border-white" />
          <div className="absolute bottom-5 left-5 w-[25px] h-[25px] border-l-2 border-b-2 border-white" />
          <div className="absolute bottom-5 right-5 w-[25px] h-[25px] border-r-2 border-b-2 border-white" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-white text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide max-w-[90%]">
            Discover the Hottest New Arrivals in Clothing!
          </h2>
          <p className="text-sm sm:text-base max-w-[85%]">
          Subscribe now to get instant notifications about our latest collections, exclusive deals, and special offers. Stay ahead of the trends and never miss an update!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center mt-6 w-full max-w-[450px] gap-2 sm:gap-0">
            <input
              type="text"
              value={email}
              onChange={handleOnChange}
              placeholder="E-mail"
              className="w-full px-4 py-2 text-black outline-0 bg-gray-100 border border-gray-300"
            />
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="bg-[#3559C7] text-white px-6 py-2 w-full sm:w-auto"
            >
              {loading ? "Subscribing..." : "SUBSCRIBE"}
            </button>
          </div>

          {message && (
            <p className="mt-3 text-sm text-yellow-300 max-w-[90%]">{message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
