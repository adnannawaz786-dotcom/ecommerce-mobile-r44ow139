'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  onQuickView, 
  isWishlisted = false,
  className = '',
  variant = 'default' // default, compact, featured
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!product) return null;

  const {
    id,
    name,
    price,
    originalPrice,
    discount,
    image,
    images = [],
    rating = 0,
    reviewCount = 0,
    category,
    badge,
    inStock = true,
    isNew = false,
    isFeatured = false,
    description
  } = product;

  const discountPercentage = originalPrice && price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : discount;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product, quantity);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const incrementQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: variant === 'compact' ? 1.02 : 1.05, 
      y: -4,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    tap: { scale: 0.98 }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.3 } }
  };

  const overlayVariants = {
    initial: { opacity: 0, y: 20 },
    hover: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : index < rating
            ? 'fill-yellow-200 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className={`group cursor-pointer ${className}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex p-3 space-x-3">
            {/* Image */}
            <div className="relative flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <img
                src={image || '/api/placeholder/80/80'}
                alt={name}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
              {discountPercentage > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-gray-900 truncate">
                    {name}
                  </h3>
                  {category && (
                    <p className="text-xs text-gray-500 mt-0.5">{category}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {formatPrice(price)}
                    </span>
                    {originalPrice && originalPrice > price && (
                      <span className="text-xs text-gray-500 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 h-auto w-auto"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={`group cursor-pointer ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          
          <motion.img
            variants={imageVariants}
            src={image || '/api/placeholder/300/300'}
            alt={name}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {isNew && (
              <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                New
              </Badge>
            )}
            {isFeatured && (
              <Badge className="bg-purple-500 text-white text-xs px-2 py-1">
                Featured
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                -{discountPercentage}%
              </Badge>
            )}
            {badge && (
              <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
                {badge}
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
            onClick={handleToggleWishlist}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.button>

          {/* Hover Overlay */}
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-black/20 flex items-center justify-center"
          >
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="backdrop-blur-sm bg-white/90"
                onClick={handleQuickView}
              >
                <Eye className="w-4 h-4 mr-1" />
                Quick View
              </Button>
            </div>
          </motion.div>

          {/* Stock Status */}
          {!inStock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="text-gray-600 font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Category */}
          {category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {category}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
            {name}
          </h3>

          {/* Description */}
          {description && variant === 'featured' && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex items-center">
                {renderStars(rating)}
              </div>
              <span className="text-xs text-gray-500">
                ({reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-bold text-lg text-gray-900">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0">
          <div className="w-full space-y-2">
            {/* Quantity Selector */}
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 p-0"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-sm font-medium min-w-[2ch] text-center">
                {quantity}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 p-0"
                onClick={incrementQuantity}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;