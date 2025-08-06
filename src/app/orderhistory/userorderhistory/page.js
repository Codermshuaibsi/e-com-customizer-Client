'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, User, IndianRupee, alertCircle, RefreshCw, Eye } from 'lucide-react';


const OrderHistoryPage = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrderHistory = useCallback(async (isRetry = false) => {
    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Check if user is authenticated
      const token = localStorage.getItem("user_token");
      if (!token) {
        throw new Error("Please login to view your orders");
      }

      const response = await fetch('https://e-com-customizer.onrender.com/api/v1/getOrderHistory', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
      });

      // Handle different HTTP status codes
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        } else if (response.status === 404) {
          throw new Error("Order history not found");
        } else if (response.status >= 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log(data)

      if (data.success && Array.isArray(data.orderHistory)) {
        // Sort orders by date (newest first)
        const sortedOrders = data.orderHistory.sort((a, b) =>
          new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt)
        );
        setOrderHistory(sortedOrders);
      } else if (data.success && data.orderHistory.length === 0) {
        setOrderHistory([]);
      } else {
        throw new Error(data.message || "Failed to fetch order history");
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
      setError(error.message);

      // Only show demo data in development or if explicitly requested

    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, []);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  const handleRetry = () => {
    fetchOrderHistory(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'processing': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <alertCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Date unavailable';
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'number' && !isNaN(price)) {
      return price.toLocaleString('en-IN');
    }
    return '₹0';
  };


  const calculateOrderTotal = (products) => {
    return products.reduce((total, product) => {
      const price = product.productId?.price || product.price || 0;
      const quantity = product.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded-md w-48 mb-6"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border mb-6 p-6">
                <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error && orderHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <alertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Unable to load orders</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {retrying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!orderHistory || orderHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <div className="flex items-center gap-4">
            <p className="text-gray-600">{orderHistory.length} order{orderHistory.length !== 1 ? 's' : ''}</p>
            <button
              onClick={() => fetchOrderHistory(true)}
              disabled={retrying}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {error && orderHistory.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <alertCircle className="w-5 h-5" />
              <span className="text-sm">Some data might be outdated. {error}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {orderHistory.map((order) => {
            const orderTotal = order.totalAmount || calculateOrderTotal(order.products || []);
            const orderStatus = order.orderStatus || order.status || 'processing';

            return (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="border-b border-gray-100 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Order ID:</span>
                        <span className="text-sm font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
                      </div>
                      {order.orderDate && (
                        <div className="text-sm text-gray-500">
                          Placed on {formatDate(order.orderDate)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(orderStatus)}`}>
                        {getStatusIcon(orderStatus)}
                        {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                      </div>
                      <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                        <IndianRupee className="w-4 h-4" />
                        {formatPrice(calculateOrderTotal(order.products))}


                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Section */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Items Ordered ({order.products?.length || 0})
                    </h3>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                      className="inline-flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  <div className={`space-y-4 transition-all duration-300 ${selectedOrder === order._id ? 'max-h-none opacity-100' : 'max-h-32 overflow-hidden opacity-75'
                    }`}>
                    {order.products?.map((product, index) => (
                      <div key={product._id || index} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0">
                          <img
                            src={product.productId.thumbnail?.[0] || product.thumbnail || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=300&h=300&fit=crop'}
                            alt={product.productId.title || 'Product'}
                            className="w-20 h-20 object-cover rounded-lg border"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1560472355-536de3962603?w=300&h=300&fit=crop';
                            }}
                          />
                        </div>

                        <div className="flex-grow">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                            {product.productId.title || 'Untitled Product'}
                          </h4>
                          {product.productId.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            {product.color && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Color:</span>
                                <span className="font-medium text-gray-700">{product.color}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">Qty:</span>
                              <span className="font-medium text-gray-700">{product.quantity || 1}</span>
                            </div>
                            <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                              <IndianRupee className="w-4 h-4" />
                              {formatPrice(product.productId.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )) || (
                        <p className="text-gray-500 text-center py-4">No products found in this order</p>
                      )}
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Delivery Address
                    </h3>

                    <div className="bg-white rounded-lg p-4 border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-900">
                              {order.shippingAddress.fullName || 'Name not provided'}
                            </span>
                          </div>
                          {order.shippingAddress.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{order.shippingAddress.phone}</span>
                            </div>
                          )}
                        </div>

                        <div className="text-sm text-gray-700 leading-relaxed">
                          {order.shippingAddress.address && <p>{order.shippingAddress.address}</p>}
                          {order.shippingAddress.landmark && (
                            <p className="text-gray-600">Near {order.shippingAddress.landmark}</p>
                          )}
                          <p>
                            {order.shippingAddress.city && `${order.shippingAddress.city}, `}
                            {order.shippingAddress.state && `${order.shippingAddress.state} - `}
                            {order.shippingAddress.pincode}
                          </p>
                          {order.shippingAddress.country && (
                            <p className="font-medium">{order.shippingAddress.country}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;