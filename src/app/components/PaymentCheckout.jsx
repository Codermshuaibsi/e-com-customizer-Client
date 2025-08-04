"use client";
import React, { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const stripePromise = loadStripe(
  "pk_test_51RsJEb3GsajO6t88ZKWvWWb0z8bkUlGGI9V2TCu4SmtHQjN4qRERfLwu0YStLwLpstX6u6d7CDU8kTr0gIjtc97E00z5dNj7WD"
);

function PaymentCheckout() {
  const searchParams = useSearchParams();
  const [totalAmount, setTotalAmount] = useState(0);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const addr = searchParams.get("address");
  const totalp = searchParams.get("total");
  const id = searchParams.get("selectID");

  useEffect(() => {
    const token = localStorage.getItem("user_token");

    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/fetchAllCartItems",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();

        if (data.success) {
          const total = data.cartItems.reduce((acc, item) => {
            return acc + (item.price || 0) * (item.quantity || 1);
          }, 0);
          setTotalAmount(total);

          // Create Payment Intent
          const paymentRes = await fetch(
            "https://e-com-customizer.onrender.com/api/v1/payment/checkout",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                amount: total,
                products: data.cartItems.map((item) => item.productId),
              }),
            }
          );

          const paymentData = await paymentRes.json();
          if (paymentRes.ok) {
            setClientSecret(paymentData.clientSecret);
          } else {
            setError("Failed to create payment intent: " + paymentData?.message);
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Failed to load payment information");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#3b82f6",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorDanger: "#ef4444",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  };

  const options = {
    clientSecret,
    appearance,
    layout: {
      type: "tabs",
      defaultCollapsed: false,
    }
  };

  if (loading) {
    return (
      <div className="lg:col-span-1">
        <div className="sticky top-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="animate-pulse">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <div className="w-4 h-4 bg-blue-200 rounded"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:col-span-1">
        <div className="sticky top-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Error</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-4 shadow-lg">
              3
            </span>
            Payment Details
          </h2>
          <p className="text-gray-600 text-sm mt-2">Secure payment powered by Stripe</p>
        </div>

        {/* Amount Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total Amount</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
              <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="p-6">
          {clientSecret && options ? (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm totalp={totalp} id={id} />
            </Elements>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <svg className="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Initializing secure payment...</p>
              <p className="text-sm text-gray-500 mt-1">Please wait while we set up your payment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CheckoutForm = ({ id, totalp }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/success",
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      try {
        const token = localStorage.getItem("user_token");

        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/fetchAllCartItems",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        console.log("hkghjgjhghgjg", data)
        if (data.success) {
          const verifyRes = await fetch(
            "https://e-com-customizer.onrender.com/api/v1/payment/verifySignature",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                paymentIntentId: paymentIntent.id,
                addressId: id,
                amount: totalp,
                products: data.cartItems.map((item) => item.productId),
              }),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            setSuccess(true);
            setMessage("Order placed successfully!");
          } else {
            setMessage("Payment succeeded but order failed to process. Please contact support.");
          }
        }
      } catch (error) {
        setMessage("Payment succeeded but there was an error processing your order. Please contact support.");
      }
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-green-600 mb-4">{message}</p>
        <Link href={"/orderhistory"}>   <button

          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          View Orders
        </button> </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <PaymentElement />
      </div>

      {message && (
        <div className={`p-4 rounded-lg border ${message.includes('successfully')
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
          }`}>
          <div className="flex items-center">
            <svg className={`w-5 h-5 mr-2 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {message.includes('successfully') ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${!stripe || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-[0.98]'
          }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Complete Secure Payment
          </div>
        )}
      </button>

      <div className="text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Your payment information is secure and encrypted
        </p>
      </div>
    </form>
  );
};

export default PaymentCheckout;