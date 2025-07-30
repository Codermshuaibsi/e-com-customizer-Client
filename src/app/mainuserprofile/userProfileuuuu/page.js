"use client";

import { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSun,
  FaMoon,
  FaUser,
  FaMapMarkerAlt,
  FaBox,
  FaHeart,
  FaKey,
  FaCog,
  FaSignOutAlt,
  FaUserTimes,
} from "react-icons/fa";

const UserProfilePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState({});
  const [editingAddress, setEditingAddress] = useState({});
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [UserShipingAddresses, setUserShipingAddresses] = useState([]);
  const [GetUserDetail, setGetUserDetail] = useState({
    name: "",
    email: "",
    phone: "",
    lastName: "",
    thumbnail: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
   const [uploading, setUploading] = useState(false);
  // Dummy user data for orders and wishlist
  const [user, setUser] = useState({
    profileImage: "/avatar.png",
    wishlist: [
      { id: 1, name: "Stylish Hat", price: "₹1,999", image: "🎩" },
      { id: 2, name: "Cool Shoes", price: "₹3,499", image: "👟" },
    ],
    recentOrders: [
      {
        id: "ORD123",
        status: "Delivered",
        date: "15 Jul 2025",
        amount: "₹2,499",
      },
      {
        id: "ORD124",
        status: "Shipped",
        date: "20 Jul 2025",
        amount: "₹1,299",
      },
    ],
  });
  const fetchOrderHistory = async () => {
    try {
      // Simulating localStorage access for demo
      const token = localStorage.getItem("user_token");
      const response = await fetch(
        "https://e-com-customizer.onrender.com/api/v1/getOrderHistory",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Order History Data:", data);
      if (data.success) {
        setOrderHistory(data.orderHistory);
      } else {
        console.error("Failed to fetch order history:", data.message);
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
      // Demo data for showcase
      setOrderHistory([
        {
          _id: "1",
          orderDate: "2024-01-15",
          status: "Delivered",
          totalAmount: 2499,
          shippingAddress: {
            fullName: "John Doe",
            phone: "+91 9876543210",
            address: "123 Main Street, Apartment 4B",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            landmark: "Near Central Mall",
            country: "India",
          },
          products: [
            {
              _id: "p1",
              title: "Premium Bluetooth Headphones",
              description:
                "Wireless noise-cancelling headphones with 30hr battery",
              color: "Black",
              price: 2499,
              quantity: 1,
              thumbnail: [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
              ],
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("user_token");

      const response = await fetch(
        "https://e-com-customizer.onrender.com/api/v1/change-password",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password.");
      }

      setMessage(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    } catch (err) {
      setError(err.message || "An error occurred. Try again later.");
      setMessage("");
    }
  };

  useEffect(() => {
    const GetUserDetailApi = async () => {
      try {
        const yourAuthToken = localStorage.getItem("user_token");
        const response = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/getUser",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${yourAuthToken}`,
            },
          }
        );

        const data = await response.json();
        console.log("User fetched successfully:", data.data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user");
        }

        setGetUserDetail({
          name: data.data.firstName || "",
          email: data.data.email || "",
          phone: data.data.phoneNumber || "",
          lastName: data.data.lastName || "",
          thumbnail: data.data.thumbnail || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error.message);
        alert("Error fetching user: " + error.message);
      }
    };

    const getAllAddresses = async () => {
      try {
        const token = localStorage.getItem("user_token");

        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/getAllAddresses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch addresses");
        }

        const data = await res.json();
        console.log("Addresses:", data.data);
        setUserShipingAddresses(data.data || []);
        return data;
      } catch (error) {
        console.error("Error fetching addresses:", error.message);
      }
    };

    GetUserDetailApi();
    getAllAddresses();
    fetchOrderHistory();
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const openEditModal = () => {
    setEditingUser({
      firstName: GetUserDetail.name,
      lastName: GetUserDetail.lastName,
      email: GetUserDetail.email,
      phoneNumber: GetUserDetail.phone,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser({});
  };

  const saveUserChanges = async () => {
    console.log("Saving user changes:", editingUser);
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(
        "https://e-com-customizer.onrender.com/api/v1/updateDetails/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: editingUser.firstName,
            lastName: editingUser.lastName,
            phoneNumber: editingUser.phoneNumber,
            email: editingUser.email,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Update local state
      setGetUserDetail({
        name: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        phone: editingUser.phoneNumber,
      });

      setIsEditModalOpen(false);
      setEditingUser({});
      console.log("User updated successfully:", data);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating user: " + error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setEditingUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Address Modal Functions
  const openAddAddressModal = async () => {
    setEditingAddress({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      type: "home",
      isDefault: false,
    });

    setIsEditingAddress(false);
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (address) => {
    setEditingAddress({ ...address });
    setIsEditingAddress(true);
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
    setEditingAddress({});
    setIsEditingAddress(false);
  };

  const handleAddressInputChange = (field, value) => {
    setEditingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveAddress = async () => {
    try {
      // Validation
      if (
        !editingAddress.fullName ||
        !editingAddress.phone ||
        !editingAddress.address ||
        !editingAddress.city ||
        !editingAddress.state ||
        !editingAddress.pincode
      ) {
        alert("Please fill all required fields");
        return;
      }

      const token = localStorage.getItem("user_token");
      const url = isEditingAddress
        ? `https://e-com-customizer.onrender.com/api/v1/updateAddress/${editingAddress._id}`
        : "https://e-com-customizer.onrender.com/api/v1/createAddress";

      const method = isEditingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingAddress),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Update local state
      if (isEditingAddress) {
        setUserShipingAddresses((prev) =>
          prev.map((addr) =>
            addr._id === editingAddress._id ? editingAddress : addr
          )
        );
        alert("Address updated successfully!");
      } else {
        setUserShipingAddresses((prev) => [...prev, data.data]);
        alert("Address added successfully!");
      }

      setIsAddressModalOpen(false);
      setEditingAddress({});
      setIsEditingAddress(false);
      console.log("Address saved successfully:", data);
    } catch (error) {
      alert("Error saving address: " + error.message);
    }
  };

  const deleteAddress = async (addressId) => {
    console.log("Deleting address with ID:", addressId);
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(
        `https://e-com-customizer.onrender.com/api/v1/deleteAddress/${addressId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete address");
      }

      // Remove from local state
      setUserShipingAddresses((prev) =>
        prev.filter((addr) => addr._id !== addressId)
      );
      alert("Address deleted successfully!");
      console.log("Address deleted successfully");
    } catch (error) {
      alert("Error deleting address: " + error.message);
    }
  };

   const handleImageChange = async (e) => {
  console.log("frffd"); // 👈 Debug log
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert("Max file size is 2MB");
    return;
  }

  try {
    setUploading(true);
    const formData = new FormData();
    formData.append("thumbnail", file); // Make sure backend accepts this field name

    const token = localStorage.getItem("user_token");

    const res = await fetch("http://localhost:4000/api/v1/updateThumbnail", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert("Profile photo updated successfully");
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (err) {
    console.error(err);
    alert("Image upload failed");
  } finally {
    setUploading(false);
  }
};

  const menuItems = [
    { id: "profile", label: "My Profile", icon: FaUser },
    { id: "addresses", label: "Manage Addresses", icon: FaMapMarkerAlt },
    { id: "orders", label: "My Orders", icon: FaBox },
    { id: "wishlist", label: "My Wishlist", icon: FaHeart },
    { id: "password", label: "Change Password", icon: FaKey },
    { id: "settings", label: "Settings", icon: FaCog },
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-sm p-6 mb-6`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
             <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
  {GetUserDetail?.thumbnail ? (
    <img
      src={GetUserDetail.thumbnail}
      alt="User"
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    GetUserDetail?.name?.charAt(0).toUpperCase() || "U"
  )}
</div>

              <div>
                <h1 className="text-2xl font-semibold">
                  Hello{" "}
                  {GetUserDetail.name
                    ? GetUserDetail.name.split(" ")[0]
                    : "User"}{" "}
                  👋
                </h1>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Manage your profile and preferences
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              } transition-colors`}
            >
              {darkMode ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-blue-500" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm p-4 h-fit`}
          >
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : darkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}

              <hr
                className={`my-4 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              />

              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50">
                <FaSignOutAlt className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>

              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50">
                <FaUserTimes className="w-5 h-5" />
                <span className="font-medium">Delete Account</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-sm p-6`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Personal Information
                  </h2>
                  <button
                    onClick={openEditModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <FaEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      Full Name
                    </label>
                    <div
                      className={`p-3 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      {GetUserDetail.name +
                        " " +
                        (GetUserDetail.lastName || "")}
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      Email Address
                    </label>
                    <div
                      className={`p-3 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      {GetUserDetail.email}
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      Phone Number
                    </label>
                    <div
                      className={`p-3 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      +91 {GetUserDetail.phone}
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      Gender
                    </label>
                    <div
                      className={`p-3 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      Male
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-sm p-6`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Manage Addresses</h2>
                  <button
                    onClick={openAddAddressModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {UserShipingAddresses.length === 0 ? (
                    <div className="text-center py-8">
                      <p
                        className={`${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        No addresses found. Add your first address!
                      </p>
                    </div>
                  ) : (
                    UserShipingAddresses.map((addr, index) => (
                      <div
                        key={addr._id || index}
                        className={`p-4 rounded-lg border ${
                          darkMode
                            ? "border-gray-700 bg-gray-700"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">
                                {addr.type === "home"
                                  ? "🏠 Home"
                                  : addr.type === "work"
                                  ? "🏢 Work"
                                  : "📍 Other"}
                              </span>
                              {addr.isDefault && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="font-medium mb-1">{addr.fullName}</p>
                            <p
                              className={`${
                                darkMode ? "text-gray-300" : "text-gray-600"
                              } mb-2`}
                            >
                              {addr.address}, {addr.city}, {addr.state} -{" "}
                              {addr.pincode}, {addr.country}
                            </p>
                            <p
                              className={`${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              } text-sm`}
                            >
                              Phone: +91 {addr.phone}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditAddressModal(addr)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteAddress(addr._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-sm p-6`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">My Orders</h2>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    View All Orders
                  </button>
                </div>

                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 rounded-lg border ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaBox className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Order #{order._id}</p>
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Placed on {order.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{order.totalAmount}</p>
                          <span
                            className={`text-sm px-2 py-1 rounded-full ${
                              order.orderStatus === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-sm p-6`}
              >
                <h2 className="text-xl font-semibold mb-6">
                  My Wishlist ({user.wishlist.length} items)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.wishlist.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {item.image}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{item.name}</h3>
                          <p className="text-lg font-semibold text-blue-600">
                            {item.price}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition-colors">
                          Add to Cart
                        </button>
                        <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-sm p-6`}
              >
                <h2 className="text-xl font-semibold mb-6">Change Password</h2>

                <form
                  onSubmit={handleChangePassword}
                  className="space-y-4 max-w-md"
                >
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`w-full p-3 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full p-3 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full p-3 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Confirm new password"
                    />
                  </div>

                  {message && (
                    <p className="text-green-600 font-medium">{message}</p>
                  )}
                  {error && <p className="text-red-600 font-medium">{error}</p>}

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {activeTab === "settings" && (
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-sm p-6`}
              >
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } mb-2`}
                      >
                        Language
                      </label>
                      <select
                        className={`w-full p-3 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Tamil</option>
                        <option>Bengali</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } mb-2`}
                      >
                        Currency
                      </label>
                      <select
                        className={`w-full p-3 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                    <div>
                      <h3 className="font-medium">Dark Mode</h3>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Switch between light and dark theme
                      </p>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        darkMode ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                          darkMode ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Receive order updates and offers via email
                      </p>
                    </div>
                    <button className="relative w-12 h-6 rounded-full transition-colors bg-blue-600">
                      <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#0000007a] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Edit Profile</h2>
                <button
                  onClick={closeEditModal}
                  className={`p-2 rounded-full ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } transition-colors`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Picture Section */}
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {GetUserDetail?.thumbnail ? (
                    <img
                      src={GetUserDetail.thumbnail}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>
                      {GetUserDetail.name ? GetUserDetail.name.charAt(0) : "U"}
                    </span>
                  )}
                </div>
                <div>
 <label className="cursor-pointer">
  <div
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors inline-block"
  >
    {uploading ? "Uploading..." : "Change Photo"}
    <input
      id="uploadImage"
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="hidden"
    />
  </div>
</label>


  <p
    className={`text-sm mt-1 ${
      darkMode ? "text-gray-400" : "text-gray-600"
    }`}
  >
    JPG, GIF or PNG. Max size 2MB
  </p>
</div>


                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={editingUser.firstName || ""}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={`w-full p-3 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editingUser.lastName || ""}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={`w-full p-3 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={editingUser.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full p-3 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={editingUser.phoneNumber || ""}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className={`w-full p-3 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeEditModal}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveUserChanges}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-[#0000007a] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  {isEditingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={closeAddressModal}
                  className={`p-2 rounded-full ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } transition-colors`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } mb-2`}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={editingAddress.fullName || ""}
                        onChange={(e) =>
                          handleAddressInputChange("fullName", e.target.value)
                        }
                        className={`w-full p-3 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } mb-2`}
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={editingAddress.phone || ""}
                        onChange={(e) =>
                          handleAddressInputChange("phone", e.target.value)
                        }
                        className={`w-full p-3 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Address Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } mb-2`}
                      >
                        Address (House No, Building, Street, Area) *
                      </label>
                      <textarea
                        value={editingAddress.address || ""}
                        onChange={(e) =>
                          handleAddressInputChange("address", e.target.value)
                        }
                        className={`w-full p-3 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter complete address"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                        >
                          City/District/Town *
                        </label>
                        <input
                          type="text"
                          value={editingAddress.city || ""}
                          onChange={(e) =>
                            handleAddressInputChange("city", e.target.value)
                          }
                          className={`w-full p-3 rounded-lg border ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Enter city"
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                        >
                          State *
                        </label>
                        <select
                          value={editingAddress.state || ""}
                          onChange={(e) =>
                            handleAddressInputChange("state", e.target.value)
                          }
                          className={`w-full p-3 rounded-lg border ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
                          <option value="">Select State</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="West Bengal">West Bengal</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Haryana">Haryana</option>
                        </select>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                        >
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          value={editingAddress.pincode || ""}
                          onChange={(e) =>
                            handleAddressInputChange("pincode", e.target.value)
                          }
                          className={`w-full p-3 rounded-lg border ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Enter PIN code"
                          maxLength={6}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } mb-2`}
                      >
                        Country *
                      </label>
                      <input
                        type="text"
                        value={editingAddress.country || "India"}
                        onChange={(e) =>
                          handleAddressInputChange("country", e.target.value)
                        }
                        className={`w-full p-3 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Type */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Address Type</h3>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="addressType"
                        value="home"
                        checked={editingAddress.type === "home"}
                        onChange={(e) =>
                          handleAddressInputChange("type", e.target.value)
                        }
                        className="mr-2"
                      />
                      <span>🏠 Home</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="addressType"
                        value="work"
                        checked={editingAddress.type === "work"}
                        onChange={(e) =>
                          handleAddressInputChange("type", e.target.value)
                        }
                        className="mr-2"
                      />
                      <span>🏢 Work</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="addressType"
                        value="other"
                        checked={editingAddress.type === "other"}
                        onChange={(e) =>
                          handleAddressInputChange("type", e.target.value)
                        }
                        className="mr-2"
                      />
                      <span>📍 Other</span>
                    </label>
                  </div>
                </div>

                {/* Default Address Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="defaultAddress"
                    checked={editingAddress.isDefault || false}
                    onChange={(e) =>
                      handleAddressInputChange("isDefault", e.target.checked)
                    }
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="defaultAddress"
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Make this my default address
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeAddressModal}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveAddress}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    {isEditingAddress ? "Update Address" : "Save Address"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
