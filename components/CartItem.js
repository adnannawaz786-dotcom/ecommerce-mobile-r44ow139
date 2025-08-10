'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  onToggleWishlist,
  isWishlisted = false 
}) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    setQuantity(newQuantity);
    
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setQuantity(item.quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setIsRemoving(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await onToggleWishlist(item.id);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const subtotal = (item.price * quantity).toFixed(2);
  const hasDiscount = item.originalPrice && item.originalPrice > item.price;
  const discountPercent = hasDiscount 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <AnimatePresence>
      {!isRemoving && (
        <motion.div
          initial={{ opacity: 1, height: 'auto' }}
          exit={{ 
            opacity: 0, 
            height: 0,
            marginBottom: 0,
            transition: { duration: 0.3, ease: 'easeInOut' }
          }}
          layout
          className="mb-4"
        >
          <Card className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={item.image || '/api/placeholder/96/96'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {hasDiscount && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5"
                  >
                    -{discountPercent}%
                  </Badge>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                    {item.variant && (
                      <p className="text-xs text-gray-500 mb-1">
                        {item.variant}
                      </p>
                    )}
                    {item.size && (
                      <p className="text-xs text-gray-500">
                        Size: {item.size}
                      </p>
                    )}
                  </div>

                  {/* Wishlist & Remove Actions */}
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      onClick={handleToggleWishlist}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart 
                        className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      onClick={handleRemove}
                      disabled={isRemoving}
                      aria-label="Remove from cart"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-lg text-gray-900">
                    ${item.price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-500 line-through">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Quantity Controls & Subtotal */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1 || isUpdating}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <motion.span 
                      className="font-semibold text-sm min-w-[2rem] text-center"
                      key={quantity}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {quantity}
                    </motion.span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={isUpdating || (item.stock && quantity >= item.stock)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <motion.div 
                    className="text-right"
                    key={subtotal}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="font-bold text-lg text-gray-900">
                      ${subtotal}
                    </p>
                    {quantity > 1 && (
                      <p className="text-xs text-gray-500">
                        ${item.price.toFixed(2)} each
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Stock Warning */}
                {item.stock && item.stock <= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      Only {item.stock} left in stock
                    </Badge>
                  </motion.div>
                )}

                {/* Delivery Info */}
                {item.freeShipping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mt-2"
                  >
                    <Badge variant="secondary" className="text-green-700 bg-green-50">
                      Free Shipping
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Loading Overlay */}
            {isUpdating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-lg"
              >
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartItem;