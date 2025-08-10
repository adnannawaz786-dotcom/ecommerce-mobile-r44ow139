import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart, ArrowUpDown, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

const products = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Electronics',
    brand: 'AudioTech',
    rating: 4.8,
    reviews: 1247,
    image: '/api/placeholder/300/300',
    badge: 'Best Seller',
    inStock: true,
    colors: ['black', 'white', 'blue'],
    description: 'High-quality wireless headphones with noise cancellation'
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: null,
    category: 'Electronics',
    brand: 'FitTech',
    rating: 4.6,
    reviews: 892,
    image: '/api/placeholder/300/300',
    badge: 'New',
    inStock: true,
    colors: ['black', 'silver', 'rose-gold'],
    description: 'Advanced fitness tracking with heart rate monitoring'
  },
  {
    id: 3,
    name: 'Designer Leather Jacket',
    price: 149.99,
    originalPrice: 249.99,
    category: 'Fashion',
    brand: 'StyleCo',
    rating: 4.7,
    reviews: 456,
    image: '/api/placeholder/300/300',
    badge: 'Sale',
    inStock: true,
    colors: ['black', 'brown'],
    description: 'Premium leather jacket with modern design'
  },
  {
    id: 4,
    name: 'Organic Coffee Beans',
    price: 24.99,
    originalPrice: null,
    category: 'Food',
    brand: 'BrewMaster',
    rating: 4.9,
    reviews: 2341,
    image: '/api/placeholder/300/300',
    badge: 'Organic',
    inStock: true,
    colors: [],
    description: 'Premium organic coffee beans from sustainable farms'
  },
  {
    id: 5,
    name: 'Gaming Mechanical Keyboard',
    price: 89.99,
    originalPrice: 129.99,
    category: 'Electronics',
    brand: 'GameTech',
    rating: 4.5,
    reviews: 678,
    image: '/api/placeholder/300/300',
    badge: 'Gaming',
    inStock: false,
    colors: ['black', 'rgb'],
    description: 'RGB mechanical keyboard for gaming enthusiasts'
  },
  {
    id: 6,
    name: 'Yoga Mat Premium',
    price: 39.99,
    originalPrice: null,
    category: 'Sports',
    brand: 'ZenFit',
    rating: 4.4,
    reviews: 234,
    image: '/api/placeholder/300/300',
    badge: 'Eco-Friendly',
    inStock: true,
    colors: ['purple', 'blue', 'pink'],
    description: 'Non-slip premium yoga mat for all skill levels'
  },
  {
    id: 7,
    name: 'Smartphone Case',
    price: 19.99,
    originalPrice: 29.99,
    category: 'Electronics',
    brand: 'ProtectTech',
    rating: 4.3,
    reviews: 1567,
    image: '/api/placeholder/300/300',
    badge: 'Popular',
    inStock: true,
    colors: ['clear', 'black', 'blue', 'red'],
    description: 'Durable protection for your smartphone'
  },
  {
    id: 8,
    name: 'Running Shoes',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Sports',
    brand: 'RunFast',
    rating: 4.6,
    reviews: 891,
    image: '/api/placeholder/300/300',
    badge: 'Athletic',
    inStock: true,
    colors: ['white', 'black', 'red'],
    description: 'Comfortable running shoes for daily training'
  }
];

const categories = ['All', 'Electronics', 'Fashion', 'Food', 'Sports'];
const brands = ['All', 'AudioTech', 'FitTech', 'StyleCo', 'BrewMaster', 'GameTech', 'ZenFit', 'ProtectTech', 'RunFast'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' }
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order for featured
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, sortBy]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setPriceRange([0, 500]);
    setSortBy('featured');
  };

  const getBadgeColor = (badge) => {
    switch (badge.toLowerCase()) {
      case 'best seller':
        return 'bg-yellow-500 text-white';
      case 'new':
        return 'bg-green-500 text-white';
      case 'sale':
        return 'bg-red-500 text-white';
      case 'organic':
        return 'bg-emerald-500 text-white';
      case 'gaming':
        return 'bg-purple-500 text-white';
      case 'eco-friendly':
        return 'bg-teal-500 text-white';
      case 'popular':
        return 'bg-blue-500 text-white';
      case 'athletic':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const ProductCard = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`${viewMode === 'grid' ? 'w-full' : 'w-full'}`}
    >
      <Card className={`h-full hover:shadow-lg transition-all duration-300 ${!product.inStock ? 'opacity-75' : ''} ${viewMode === 'list' ? 'flex flex-row' : ''}`}>
        <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'w-full'}`}>
          <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {product.badge && (
              <Badge className={`absolute top-2 left-2 ${getBadgeColor(product.badge)}`}>
                {product.badge}
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart 
                  className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                />
              </Button>
            </div>
          </div>
        </div>
        
        <div className={`${viewMode === 'list' ? 'flex-1 p-4' : 'p-4'}`}>
          <CardHeader className="p-0 mb-3">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg leading-tight mb-1">{product.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium ml-1">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
            </div>
          </CardHeader>

          <CardContent className="p-0 mb-4">
            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
            
            {product.colors.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-500">Colors:</span>
                <div className="flex gap-1">
                  {product.colors.slice(0, 3).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{
                        backgroundColor: color === 'rgb' ? 'linear-gradient(45deg, red, blue, green)' :
                                       color === 'rose-gold' ? '#E8B4B8' :
                                       color === 'clear' ? 'transparent' : color
                      }}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-0">
            <Button
              className="w-full"
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">Discover our amazing collection of products</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{filteredProducts.length} products found</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">