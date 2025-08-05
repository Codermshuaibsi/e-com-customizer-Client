"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  ShoppingBag,
  Loader2,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";

const User_profile_dero = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("user_token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/getUserDetail",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("user_token");
            router.push("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("User data fetched:", data);
        if (data.success) {
          setUserData(data.data); // Handle different response structures
        } else {
          throw new Error(data.message || "Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    router.push("/mainuserprofile");
    setIsOpen(false);
  };

  const handleOrderClick = () => {
    router.push("/orderhistory");
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    console.log("Account Settings clicked");
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_ID"); // Remove any other stored user data
    router.push("/login");
    setIsOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center space-x-3 bg-white rounded-full p-2 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-red-200"
        >
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold">
            !
          </div>
          <ChevronDown className="w-4 h-4 text-red-500" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
            <div className="p-4 text-center">
              <p className="text-red-600 text-sm">Failed to load user data</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const userName =
    userData?.name || userData?.fullName || userData?.firstName || "User";
  const userEmail = userData?.email || "user@example.com";
  const thumbnail = userData?.thumbnail || "https://via.placeholder.com/150";
  const userInitials = getUserInitials(userName);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}

      <button
        onClick={() => setIsOpen(!isOpen)}

        className="flex flex-row-reverse gap-2 cursor-pointer items-center space-x-3 bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
      >
        <div className="flex items-center space-x-2">
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </div>
        <p className="cursor-pointer text-lg text-gray-500 underline-2">My Account</p>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-semibold overflow-hidden">
          {thumbnail ? (
            <>
              <img
                src={thumbnail}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />

            </>

          ) : (
            userInitials
          )}
        </div>

      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  userInitials
                )}
              </div>
              <div className="flex-1 min-w-0 text-left pl-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {`${userName.toUpperCase()} ${userData?.lastName || ""}`}
                </h3>

                <p className="text-sm text-gray-600 truncate">{userEmail}</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
            >
              <User className="w-5 h-5 text-gray-500 mr-3" />
              <span className="text-gray-700 font-medium">View Profile</span>
            </button>

            <button
              onClick={handleOrderClick}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
            >
              <ShoppingBag className="w-5 h-5 text-gray-500 mr-3" />
              <span className="text-gray-700 font-medium">Order History</span>

            </button>
            <button
              className="w-full flex items-center px-4  py-3 text-left hover:bg-gray-50 transition-colors duration-150"
              onClick={() => router.push("/wishlist")}
            >
              <Heart size={23} />
              <span className="text-gray-700 mx-3 font-medium">Wishlist</span>

            </button>

            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
            >
              <Settings className="w-5 h-5 text-gray-500 mr-3" />
              <span className="text-gray-700 font-medium">
                Account Settings
              </span>
            </button>

            <hr className="my-2 border-gray-100" />

            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-red-50 transition-colors duration-150 text-red-600"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User_profile_dero;
