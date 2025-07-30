'use client';

import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, User, IndianRupee } from 'lucide-react';

const OrderHistoryPage = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderHistory = async () => {
    try {
      // Simulating localStorage access for demo
    const token=  localStorage.getItem("user_token");
      const response = await fetch('https://e-com-customizer.onrender.com/api/v1/getOrderHistory', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

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
          _id: '1',
          orderDate: '2024-01-15',
          status: 'Delivered',
          totalAmount: 2499,
          shippingAddress: {
            fullName: 'John Doe',
            phone: '+91 9876543210',
            address: '123 Main Street, Apartment 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            landmark: 'Near Central Mall',
            country: 'India'
          },
          products: [
            {
              _id: 'p1',
              title: 'Premium Bluetooth Headphones',
              description: 'Wireless noise-cancelling headphones with 30hr battery',
              color: 'Black',
              price: 2499,
              quantity: 1,
              thumbnail: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop']
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    console.log("Status:", status);
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

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

  if (!orderHistory || orderHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500">Looks like you haven't placed any orders yet.</p>
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
          <p className="text-gray-600">{orderHistory.length} order{orderHistory.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="space-y-6">
          {orderHistory.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="border-b border-gray-100 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Order ID:</span>
                      <span className="text-sm font-bold text-gray-900">#{order._id}</span>
                    </div>
                    {order.orderDate && (
                      <div className="text-sm text-gray-500">
                        Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status || 'processing')}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </div>
                    {order.totalAmount && (
                      <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                        <IndianRupee className="w-4 h-4" />
                        {order.totalAmount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Items Ordered ({order.products.length})
                </h3>
                
                <div className="space-y-4">
                  {order.products.map((product) => (
                    <div key={product._id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0">
                        <img
                          src={product.thumbnail?.[0] || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=300&h=300&fit=crop'}
                          alt={product.title}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{product.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Color:</span>
                            <span className="font-medium text-gray-700">{product.color}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Qty:</span>
                            <span className="font-medium text-gray-700">{product.quantity}</span>
                          </div>
                          <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                            <IndianRupee className="w-4 h-4" />
                            {product.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
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
                        <span className="font-semibold text-gray-900">{order.shippingAddress.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{order.shippingAddress.phone}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <p>{order.shippingAddress.address}</p>
                      {order.shippingAddress.landmark && (
                        <p className="text-gray-600">Near {order.shippingAddress.landmark}</p>
                      )}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                      <p className="font-medium">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;