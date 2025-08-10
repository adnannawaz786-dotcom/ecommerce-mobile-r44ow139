import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Star, ShoppingCart, Heart, Search, Menu, X, Filter, ChevronRight, Zap, Shield, Truck, Headphones, ArrowRight, TrendingUp, Gift } from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: 'Summer Sale 2024',
      subtitle: 'Up to 70% Off',
      description: 'Discover amazing deals on fashion, electronics, and more',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      cta: 'Shop Now',
      color: 'from-purple-600 to-blue-600'
    },
    {
      id: 2,
      title: 'New Arrivals',
      subtitle: 'Fresh Collections',
      description: 'Explore the latest trends and must-have items',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      cta: 'Explore',
      color: 'from-pink-600 to-orange-600'
    },
    {
      id: 3,
      title: 'Premium Quality',
      subtitle: 'Best Brands',
      description: 'Shop from top brands with guaranteed quality',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
      cta: 'Discover',
      color: 'from-green-600 to-teal-600'
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🏪', count: 1200 },
    { id: 'electronics', name: 'Electronics', icon: '📱', count: 245 },
    { id: 'fashion', name: 'Fashion', icon: '👕', count: 389 },
    { id: 'home', name: 'Home & Garden', icon: '🏠', count: 156 },
    { id: 'sports', name: 'Sports', icon: '⚽', count: 98 },
    { id: 'books', name: 'Books', icon: '📚', count: 312 }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.8,
      reviews: 2847,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'electronics',
      badge: 'Best Seller',
      discount: 31,
      features: ['Noise Cancelling', 'Wireless', '30h Battery']
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.6,
      reviews: 1523,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'electronics',
      badge: 'New',
      discount: 20,
      features: ['Heart Rate', 'GPS', 'Waterproof']
    },
    {
      id: 3,
      name: 'Premium Coffee Maker',
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.9,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'home',
      badge: 'Premium',
      discount: 25,
      features: ['Auto Brew', 'Thermal Carafe', 'Programmable']
    },
    {
      id: 4,
      name: 'Designer Sneakers',
      price: 79.99,
      originalPrice: 119.99,
      rating: 4.7,
      reviews: 634,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'fashion',
      badge: 'Trending',
      discount: 33,
      features: ['Comfortable', 'Durable', 'Stylish']
    },
    {
      id: 5,
      name: 'Yoga Mat Set',
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.5,
      reviews: 445,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'sports',
      badge: 'Eco-Friendly',
      discount: 33,
      features: ['Non-Slip', 'Eco Material', 'Carrying Strap']
    },
    {
      id: 6,
      name: 'Bestseller Book Collection',
      price: 24.99,
      originalPrice: 39.99,
      rating: 4.8,
      reviews: 1287,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'books',
      badge: 'Limited Edition',
      discount: 38,
      features: ['Hardcover', 'Collector Edition', 'Signed Copy']
    }
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free delivery on orders over $50',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions',
      color: 'text-green-600'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer service',
      color: 'text-purple-600'
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Express delivery available',
      color: 'text-orange-600'
    }
  ];

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? featuredProducts 
    : featuredProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold text-slate-800">EcommerceMobile</span>
            </motion.div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs bg-red-500">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-200"
            >
              <div className="container mx-auto px-4 py-4">
                <nav className="space-y-2">
                  <a href="#" className="block py-2 text-slate-600 hover:text-blue-600">Home</a>
                  <a href="#" className="block py-2 text-slate-600 hover:text-blue-600">Products</a>
                  <a href="#" className="block py-2 text-slate-600 hover:text-blue-600">Categories</a>
                  <a href="#" className="block py-2 text-slate-600 hover:text-blue-600">About</a>
                  <a href="#" className="block py-2 text-slate-600 hover:text-blue-