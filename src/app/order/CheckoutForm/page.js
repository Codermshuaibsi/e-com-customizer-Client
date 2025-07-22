"use client";

import React from "react";

const CheckoutForm = ({ product }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const verifyPayment = async (response, token) => {
    try {
      const verifyRes = await fetch("https://e-com-customizer.onrender.com/api/v1/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });

      const data = await verifyRes.json();

      if (data.success) {
        alert("✅ Payment successful and verified!");
      } else {
        alert("⚠️ Payment verification failed.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("⚠️ Payment verification failed.");
    }
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay SDK.");
      return;
    }

    const token = localStorage.getItem("user_token");
    if (!token) {
      alert("User not logged in");
      return;
    }

    try {
      const orderRes = await fetch("https://e-com-customizer.onrender.com/api/v1/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: product.price * 100,
          products: [product._id],
        }),
      });

      const orderData = await orderRes.json();
      const order = orderData.order;

      if (!order || !order.id) {
        alert("Order creation failed");
        return;
      }

      const options = {
        key: "rzp_test_us_b4wIfG2cSTF8D7", // ✅ replace with your Razorpay test key
        amount: order.amount,
        currency: order.currency,
        name: "Kushel Digi",
        description: "UPI Test Payment",
        order_id: order.id,
        handler: async (response) => await verifyPayment(response, token),
        method: {
          upi: true,
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong during payment.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Pay with Razorpay
    </button>
  );
};

export default CheckoutForm;
