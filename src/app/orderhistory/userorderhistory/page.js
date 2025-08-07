'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  User,
  IndianRupee,
  AlertCircle,
  RefreshCw,
  Eye,
  X,
  Calendar,
  ShoppingBag,
  CreditCard,
  Navigation,
  ChevronRight,
  Star,
  Filter,
  Search
} from 'lucide-react';

const OrderHistoryPage = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailPopup, setOrderDetailPopup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrderHistory = useCallback(async (isRetry = false) => {
    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const token = localStorage.getItem('user_token');

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Fetching order history...');

      const response = await fetch(`https://e-com-customizer.onrender.com/api/v1/orders/orderHistory`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        } else if (response.status === 404) {
          // No orders found - set empty array and return
          setOrderHistory([]);
          return;
        } else {
          throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        // Handle the response based on your backend API structure
        const orders = data.orderHistory || data.orders || [];

        // Transform and sort orders
        const transformedOrders = orders
          .map(order => ({
            ...order,
            // Ensure we have the right field names
            orderDate: order.createdAt || order.orderDate,
            orderStatus: (order.orderStatus || order.status || 'pending').toLowerCase(),
            products: (order.products || []).map(product => ({
              ...product,
              productId: product.productId || {
                title: 'Product title not available',
                price: 0,
                thumbnail: [],
                description: 'Product description not available'
              }
            }))
          }))
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        setOrderHistory(transformedOrders);
        console.log('Transformed orders:', transformedOrders);
      } else {
        throw new Error(data.message || 'Failed to fetch order history');
      }

    } catch (error) {
      console.error("Error fetching order history:", error);
      setError(error.message);

      // If it's an authentication error, you might want to redirect to login
      if (error.message.includes('authentication') || error.message.includes('Session expired')) {
        // Uncomment and adjust based on your routing setup
        // localStorage.removeItem('user_token');
        // window.location.href = '/login';
      }
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
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
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
    return '0';
  };

  const calculateOrderTotal = (products) => {
    return products.reduce((total, product) => {
      const price = product.productId?.price || product.price || 0;
      const quantityBought = product.quantity || 1; // quantity bought by user
      return total + price * quantityBought;
    }, 0);
  };

  // Calculate total price for individual product (quantity × price)
  const calculateProductTotal = (product) => {
    const price = product.productId?.price || product.price || 0;
    const quantity = product.quantity || 1;
    return price * quantity;
  };

  const getTrackingSteps = (order) => {
    const steps = [
      { label: 'Order Placed', completed: true, date: order.orderDate },
      { label: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(order.orderStatus) },
      { label: 'Shipped', completed: ['shipped', 'delivered'].includes(order.orderStatus) },
      { label: 'Delivered', completed: order.orderStatus === 'delivered', date: order.actualDelivery }
    ];
    return steps;
  };

  const filteredOrders = orderHistory.filter(order => {
    const matchesSearch = order.products?.some(product =>
      product.productId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // OrderDetailPopup Component
  const OrderDetailPopup = ({ order, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Order Details</h2>
              <p className="opacity-90 text-sm sm:text-base">
                #{order.orderId || order._id?.slice(-8).toUpperCase()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-120px)]">
          {/* Order Tracking */}
          <div className="p-4 sm:p-6 border-b">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Track Your Order
              </h3>
              {order.trackingNumber && (
                <div className="text-xs sm:text-sm text-gray-600">
                  Tracking: <span className="font-mono font-semibold">{order.trackingNumber}</span>
                </div>
              )}
            </div>

            <div className="relative">
              {getTrackingSteps(order).map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center mb-4 ${index === getTrackingSteps(order).length - 1 ? 'mb-0' : ''}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${step.completed
                    ? 'bg-green-500 border-green-500'
                    : 'bg-gray-200 border-gray-300'
                    }`}>
                    {step.completed && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  {index < getTrackingSteps(order).length - 1 && (
                    <div className={`w-px h-8 ml-2 ${step.completed ? 'bg-green-500' : 'bg-gray-300'
                      } absolute top-4`} style={{ left: '7px' }} />
                  )}
                  <div className="ml-4 flex-grow">
                    <div className={`font-medium text-sm sm:text-base ${step.completed ? 'text-green-700' : 'text-gray-500'}`}>
                      {step.label}
                    </div>
                    {step.date && (
                      <div className="text-xs sm:text-sm text-gray-500">
                        {formatDate(step.date)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {order.estimatedDelivery && order.orderStatus !== 'delivered' && (
              <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium text-sm sm:text-base">Estimated Delivery</span>
                </div>
                <p className="text-blue-600 mt-1 text-sm sm:text-base">{formatDate(order.estimatedDelivery)}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="p-4 sm:p-6 border-b">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              Order Summary
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {order.products?.map((product, index) => (
                <motion.div
                  key={product._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={product.productId?.thumbnail?.[0] || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=300&h=300&fit=crop'}
                    alt={product.productId?.title || 'Product'}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-white shadow-sm"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560472355-536de3962603?w=300&h=300&fit=crop';
                    }}
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                      {product.productId?.title || 'Product title not available'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.productId?.description || 'Product description not available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <span>Qty: <strong>{product.quantity || 1}</strong></span>
                        {product.color && (
                          <span>Color: <strong>{product.color}</strong></span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 font-bold text-base sm:text-lg">
                        <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4" />
                        {formatPrice(calculateProductTotal(product))}

                      </div>
                    </div>
                  </div>
                </motion.div>
              )) || (
                  <p className="text-gray-500 text-center py-8 text-sm sm:text-base">No products found in this order</p>
                )}
            </div>

            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-lg sm:text-xl font-bold">
                <span>Total Amount</span>
                <div className="flex items-center gap-1 text-green-600">
                  <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                  {formatPrice(calculateOrderTotal(order.products))}


                </div>
              </div>
            </div>
          </div>

          {/* Payment & Delivery Info */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Payment Method */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Payment Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="font-medium text-sm sm:text-base">
                  Payment Method: <span className="text-blue-600">{order.paymentMethod || 'Not specified'}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Order placed on {formatDate(order.orderDate)}</p>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Delivery Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-sm sm:text-base">{order.shippingAddress.fullName || order.shippingAddress.name || 'Name not provided'}</span>
                    </div>
                    {order.shippingAddress.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm sm:text-base">{order.shippingAddress.phone}</span>
                      </div>
                    )}
                    <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      <p>{order.shippingAddress.address}</p>
                      {order.shippingAddress.landmark && (
                        <p className="text-gray-600">Near {order.shippingAddress.landmark}</p>
                      )}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                      <p className="font-medium">{order.shippingAddress.country || 'India'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Notes */}
            {order.orderNotes && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3">Special Instructions</h3>
                <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-200">
                  <p className="text-yellow-800 text-xs sm:text-sm">{order.orderNotes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="animate-pulse"
          >
            <div className="h-6 sm:h-8 bg-gray-300 rounded-md w-32 sm:w-48 mb-4 sm:mb-6"></div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border mb-4 sm:mb-6 p-3 sm:p-6"
              >
                <div className="h-4 sm:h-6 bg-gray-300 rounded w-24 sm:w-32 mb-3 sm:mb-4"></div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  // Error State
  if (error && orderHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">My Orders</h1>
            <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-12 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-300 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Unable to load orders</h2>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">{error}</p>
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg text-sm sm:text-base"
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
          </motion.div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!orderHistory || orderHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">My Orders</h1>
            <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-12 text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Looks like you haven't placed any orders yet.</p>
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg text-sm sm:text-base">
                Start Shopping
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">My Orders</h1>
              <p className="text-sm sm:text-base text-gray-600">{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found</p>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm w-full sm:w-auto"
                />
              </div>

              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white text-sm w-full sm:w-auto"
                >
                  <option value="all">All Status</option>
                  <option value="delivered">Delivered</option>
                  <option value="shipped">Shipped</option>
                  <option value="processing">Processing</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => fetchOrderHistory(true)}
                disabled={retrying}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 shadow-sm text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error Warning */}
        <AnimatePresence>
          {error && orderHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6"
            >
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">Some data might be outdated. {error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 sm:space-y-6"
        >
          <AnimatePresence>
            {filteredOrders.map((order, index) => {
              const orderTotal = order.totalAmount || calculateOrderTotal(order.products || []);
              const orderStatus = order.orderStatus || order.status || 'processing';

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="border-b border-gray-100 p-3 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-600">Order ID:</span>
                          <span className="text-xs sm:text-sm font-bold text-gray-900">
                            #{order.orderId || order._id?.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        {order.orderDate && (
                          <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            Placed on {formatDate(order.orderDate)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(orderStatus)}`}>
                          {getStatusIcon(orderStatus)}
                          {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                        </div>
                        <div className="flex items-center gap-1 text-lg sm:text-xl font-bold text-gray-900">
                          <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                          {order.products?.map((product, index) => (
                            <span key={product._id || index}>
                              {formatPrice(calculateProductTotal(product))}
                              {index < order.products.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products Section */}
                  <div className="p-3 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        Items Ordered ({order.products?.length || 0})
                      </h3>
                      <div className="flex items-center gap-2">
                        {/* Hide View Details button on mobile */}
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                          className="hidden sm:inline-flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                          {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                        </button>
                        <button
                          onClick={() => setOrderDetailPopup(order)}
                          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
                        >
                          <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                          Track Order
                        </button>
                      </div>
                    </div>

                    <motion.div
                      animate={{
                        height: selectedOrder === order._id ? 'auto' : '160px',
                        opacity: selectedOrder === order._id ? 1 : 0.75
                      }}
                      transition={{ duration: 0.3 }}
                      className={`space-y-3 sm:space-y-4 overflow-hidden ${selectedOrder !== order._id ? 'relative' : ''}`}
                    >
                      {order.products?.length > 0 ? order.products.map((product, productIndex) => (
                        <motion.div
                          key={product._id || productIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: productIndex * 0.1 }}
                          className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-100"
                        >
                          <div className="flex-shrink-0">
                            <img
                              src={product.productId?.thumbnail?.[0] || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=300&h=300&fit=crop'}
                              alt={product.productId?.title || 'Product'}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border-2 border-white shadow-sm"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1560472355-536de3962603?w=300&h=300&fit=crop';
                              }}
                            />
                          </div>

                          <div className="flex-grow">
                            <h4 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                              {product.productId?.title || 'Untitled Product'}
                            </h4>
                            {product.productId?.description && (
                              <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{product.productId.description}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-5 mt-4 sm:gap-4 text-xs sm:text-sm">
                              {product.color && (
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">Color:</span>
                                  <span className="font-medium text-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white rounded-md border text-xs">{product.color}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Qty:</span>
                                <span className="font-semibold text-gray-700 bg-white border rounded px-2 py-0.5 text-xs sm:text-sm">
                                  {product.quantity || 1}
                                </span>
                                <span className="mx-1 text-gray-400 font-medium text-xs">×</span>
                                <span className="flex items-center font-semibold text-gray-700 bg-white border rounded px-2 py-0.5 text-xs sm:text-sm">
                                  <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5" />
                                  {formatPrice(product.productId?.price || product.price || 0)}
                                </span>
                                <span className="ml-2 text-gray-500 text-xs">=</span>
                                <span className="flex items-center font-bold text-green-600 text-xs sm:text-sm">
                                  <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5" />
                                  {formatPrice(calculateProductTotal(product))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )) : (
                        <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No products found in this order</p>
                      )}

                      {selectedOrder !== order._id && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-2 sm:hidden">
                          <button
                            onClick={() => setSelectedOrder(order._id)}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm"
                          >
                            View More <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Shipping Address - Show only when expanded */}
                  <AnimatePresence>
                    {selectedOrder === order._id && order.shippingAddress && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100 p-3 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50"
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          Delivery Address
                        </h3>

                        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                                  {order.shippingAddress.fullName || order.shippingAddress.name || 'Name not provided'}
                                </span>
                              </div>
                              {order.shippingAddress.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700 text-sm sm:text-base">{order.shippingAddress.phone}</span>
                                </div>
                              )}
                            </div>

                            <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* No Results Found */}
        {filteredOrders.length === 0 && orderHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border p-6 sm:p-12 text-center"
          >
            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No orders found</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Try adjusting your search criteria or filters.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Order Detail Popup */}
      <AnimatePresence>
        {orderDetailPopup && (
          <OrderDetailPopup
            order={orderDetailPopup}
            onClose={() => setOrderDetailPopup(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderHistoryPage;