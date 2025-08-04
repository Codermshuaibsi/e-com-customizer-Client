'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Palette, Users, Zap, Award, Globe,
  Target, Heart, TrendingUp, Shield, Sparkles, CheckCircle
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const hoverVariants = {
  hover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.3 }
  }
};

const AboutPage = () => {
  const stats = [
    { icon: Users, number: '10,000+', label: 'Happy Customers' },
    { icon: ShoppingBag, number: '50,000+', label: 'Products Customized' },
    { icon: Globe, number: '25+', label: 'Countries Served' },
    { icon: Award, number: '99.9%', label: 'Customer Satisfaction' }
  ];

  const features = [
    {
      icon: Palette,
      title: 'Custom Design Studio',
      description: 'Create unique designs with our intuitive customization tools.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Delivery',
      description: 'Get your customized products delivered quickly.'
    },
    {
      icon: Shield,
      title: 'Premium Quality',
      description: 'Only the finest materials and printing technologies used.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our priority with 24/7 support.'
    }
  ];

  const values = [
    { icon: Target, title: 'Innovation', description: 'Pushing boundaries in customization.' },
    { icon: Users, title: 'Community', description: 'Connecting people through personalization.' },
    { icon: Sparkles, title: 'Quality', description: 'Committed to top-notch materials.' },
    { icon: TrendingUp, title: 'Growth', description: 'Always evolving with trends.' }
  ];

  return (
    <motion.div
      className="bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <motion.div className="relative max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Transforming E-commerce Since 2025
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DesignTailor
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing online shopping by making every product uniquely yours.
          </motion.p>
        </motion.div>
      </section>

      {/* Stats Section */}o
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, number, label }, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100"
              variants={itemVariants}
              whileHover={hoverVariants.hover}
            >
              <div className="mx-auto w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">{number}</div>
              <p className="text-gray-600 mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Founded in 2025, DesignTailor empowers everyone to reflect their identity through custom goods.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              What began as a small team evolved into a global platform helping customers tell their story.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Mission-Driven</h4>
                  <p className="text-sm text-gray-600">Empowering creativity for all.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Innovation First</h4>
                  <p className="text-sm text-gray-600">Always evolving with your needs.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-center items-center">
            <div className="w-full max-w-md bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-6">
                  <Palette className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create. Customize. Celebrate.</h3>
                <p className="text-gray-600 text-sm">Your vision, our platform.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide cutting-edge tools and unparalleled quality to bring your ideas to life.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map(({ icon: Icon, title, description }, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                variants={itemVariants}
                whileHover={hoverVariants.hover}
              >
                <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600">What drives everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }, idx) => (
              <motion.div
                key={idx}
                className="p-6 text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 text-gray-700 rounded-xl mb-3 mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-md font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Customizing?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg mb-8 opacity-90">
            Join thousands who've turned creativity into reality.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold text-base hover:bg-gray-100 transition"
            >
              Start Customizing Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-bold text-base hover:bg-white hover:text-blue-600 transition"
            >
              View Our Products
            </motion.button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;
