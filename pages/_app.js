import '../styles/globals.css';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

// Cart context
import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      };
    
    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove ? itemToRemove.price * itemToRemove.quantity : 0)
      };
    
    case 'UPDATE_QUANTITY':
      const itemToUpdate = state.items.find(item => item.id === action.payload.id);
      const quantityDiff = action.payload.quantity - (itemToUpdate?.quantity || 0);
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (itemToUpdate ? itemToUpdate.price * quantityDiff : 0)
      };
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      };
    
    default:
      return state;
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// User context
const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Theme context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

function MyApp({ Component, pageProps, router }) {
  const [cartState, cartDispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  });

  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app state
  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && parsedCart.items.length > 0) {
          cartDispatch({ type: 'CLEAR_CART' });
          parsedCart.items.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
              cartDispatch({ type: 'ADD_ITEM', payload: item });
            }
          });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(cartState));
    }
  }, [cartState, isLoading]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [user, isLoading]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, isLoading]);

  const addToCart = (product) => {
    cartDispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeFromCart = (productId) => {
    cartDispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      cartDispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    }
  };

  const clearCart = () => {
    cartDispatch({ type: 'CLEAR_CART' });
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    clearCart();
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const cartValue = {
    items: cartState.items,
    total: cartState.total,
    itemCount: cartState.items.reduce((sum, item) => sum + item.quantity, 0),
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
  };

  const userValue = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  const themeValue = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      <UserContext.Provider value={userValue}>
        <CartContext.Provider value={cartValue}>
          <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
            <Layout>
              <AnimatePresence mode="wait" initial={false}>
                <Component
                  {...pageProps}
                  key={router.asPath}
                />
              </AnimatePresence>
            </Layout>
          </div>
        </CartContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default MyApp;