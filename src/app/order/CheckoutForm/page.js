"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CartPaymentPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectID, setSelecte] = useState();
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("online"); // "online" or "cod"
  const [placingOrder, setPlacingOrder] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    country: "India",
  });

  // 🧠 Fetch Cart + Addresses
  useEffect(() => {
    const token = localStorage.getItem("user_token");

    const fetchCart = async () => {
      try {
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/fetchAllCartItems",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();

        if (data.success) {
          setCartItems(data.cartItems);

          const total = data.cartItems.reduce((acc, item) => {
            return acc + (item.price || 0) * (item.quantity || 1);
          }, 0);
          setTotalAmount(total);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    const fetchAddresses = async () => {
      try {
        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/getAllAddresses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setSavedAddresses(data?.data || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    const loadData = async () => {
      await Promise.all([fetchCart(), fetchAddresses()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleSelectAddress = async (addressId) => {
    if (!addressId) {
      setSelectedAddressId("");
      setAddress({
        fullName: "",
        phone: "",
        state: "",
        city: "",
        pincode: "",
        address: "",
        country: "India",
      });
      return;
    }

    setSelectedAddressId(addressId);
    const token = localStorage.getItem("user_token");

    try {
      const res = await fetch(
        `https://e-com-customizer.onrender.com/api/v1/getSingleAddress/${addressId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setSelecte(addressId);
      }

      if (data?.data) {
        setAddress({
          fullName: data.data.fullName,
          phone: data.data.phone,
          state: data.data.state,
          city: data.data.city,
          pincode: data.data.pincode,
          address: data.data.address,
          country: data.data.country,
        });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const createAddress = async () => {
    const token = localStorage.getItem("user_token");
    try {
      const res = await fetch("https://e-com-customizer.onrender.com/api/v1/createAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });

      const data = await res.json();
      if (data.success) {
        alert("Address saved successfully");
        // Refresh addresses
        const addressRes = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/getAllAddresses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const addressData = await addressRes.json();
        setSavedAddresses(addressData?.data || []);
        setShowAddressForm(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating address:", error);
      alert("Failed to save address");
    }
  };

  // Handle COD Order Placement
  const handleCodOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }

    setPlacingOrder(true);
    const token = localStorage.getItem("user_token");

    try {
      const res = await fetch("https://e-com-customizer.onrender.com/api/v1/payment/cod-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: cartItems.map((item) => ({
            productId: item.productId || item._id, // Ensure productId is sent
            quantity: item.quantity || 1,
          })),
          amount: totalAmount,
          addressId: selectedAddressId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Order placed successfully! Order ID: ${data.orderId}`);
        window.location.href = `/orders/${data.orderId}`;
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing COD order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };


  // Validate if order can be placed
  const canPlaceOrder = () => {
    return selectedAddressId && cartItems.length > 0 && !placingOrder;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Cart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                    1
                  </span>
                  Shipping Address
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showAddressForm ? "Cancel" : "Add New Address"}
                </button>
              </div>

              {savedAddresses.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose from saved addresses
                  </label>
                  <select
                    onChange={(e) => handleSelectAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedAddressId}
                  >
                    <option value="">Select a saved address</option>
                    {savedAddresses.map((addr) => (
                      <option key={addr._id} value={addr._id}>
                        {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(showAddressForm || savedAddresses.length === 0) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={address.fullName}
                        onChange={(e) =>
                          setAddress({ ...address, fullName: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={address.phone}
                        onChange={(e) =>
                          setAddress({ ...address, phone: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter state"
                        value={address.state}
                        onChange={(e) =>
                          setAddress({ ...address, state: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter city"
                        value={address.city}
                        onChange={(e) =>
                          setAddress({ ...address, city: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter pincode"
                        value={address.pincode}
                        onChange={(e) =>
                          setAddress({ ...address, pincode: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={address.country}
                        onChange={(e) =>
                          setAddress({ ...address, country: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line *
                    </label>
                    <input
                      type="text"
                      placeholder="House no, Street name, Area"
                      value={address.address}
                      onChange={(e) =>
                        setAddress({ ...address, address: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={createAddress}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
                  >
                    Save Address
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                Payment Method
              </h2>

              <div className="space-y-3">
                <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    id="online"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="online" className="ml-3 flex items-center cursor-pointer flex-1">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💳</span>
                      <div>
                        <p className="font-medium text-gray-900">Online Payment</p>
                        <p className="text-sm text-gray-600">Pay securely with card/UPI/wallet</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="cod" className="ml-3 flex items-center cursor-pointer flex-1">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💰</span>
                      <div>
                        <p className="font-medium text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when your order is delivered</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Cart Items Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                Order Summary ({cartItems.length} items)
              </h2>

              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{item.price}</p>
                      <p className="text-sm text-gray-600">
                        Total: ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Price Summary & Action */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h3>

              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold text-gray-900 mt-4 mb-6">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>

              {paymentMethod === "cod" ? (
                <button
                  onClick={handleCodOrder}
                  disabled={!canPlaceOrder()}
                  className={`w-full font-semibold py-3 rounded-lg transition ${canPlaceOrder()
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {placingOrder ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Placing Order...
                    </span>
                  ) : (
                    "Place Order (COD)"
                  )}
                </button>
              ) : (
                <Link
                  href={{
                    pathname: "/pay",
                    query: {
                      address: JSON.stringify(address),
                      total: totalAmount,
                      selectID: selectID,
                    },
                  }}
                >
                  <button
                    disabled={!canPlaceOrder()}
                    className={`w-full font-semibold py-3 rounded-lg transition ${canPlaceOrder()
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Proceed to Payment
                  </button>
                </Link>
              )}

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  By placing your order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPaymentPage;