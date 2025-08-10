import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  ShoppingCart, 
  User, 
  Menu,
  X,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const Layout = ({ children }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
  }, [router.asPath]);

  const navigationItems = [
    { href: '/', icon: Home, label: 'Home', exact: true },
    { href: '/products', icon: Search, label: 'Products' },
    { href: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
    { href: '/profile', icon: User, label: 'Profile' }
  ];

  const menuItems = [
    { href: '/orders', icon: Package, label: 'My Orders' },
    { href: '/wishlist', icon: Heart, label: 'Wishlist' },
    { href: '/settings', icon: Settings, label: 'Settings' },
    { href: '/logout', icon: LogOut, label: 'Logout' }
  ];

  const isActive = (href, exact = false) => {
    if (exact) {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Package className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopMobile
            </span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMenu}
            className="relative p-2"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </Button>
        </div>
      </motion.header>

      {/* Side Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-semibold text-slate-900">Menu</h2>
                  <Button variant="ghost" size="sm" onClick={closeMenu}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors group"
                        onClick={closeMenu}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                          <span className="text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="text-center text-sm text-slate-500">
                  <p>Version 1.0.0</p>
                  <p className="mt-2">© 2024 ShopMobile</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => {
            const active = isActive(item.href, item.exact);
            
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                    active 
                      ? 'bg-gradient-to-br from-blue-50 to-purple-50' 
                      : 'hover:bg-slate-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <item.icon 
                      className={`w-6 h-6 transition-colors ${
                        active 
                          ? 'text-blue-600' 
                          : 'text-slate-600'
                      }`} 
                    />
                    {item.badge && item.badge > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge 
                          variant="destructive" 
                          className="h-5 min-w-5 text-xs flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500"
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  <span 
                    className={`text-xs mt-1 font-medium transition-colors ${
                      active 
                        ? 'text-blue-600' 
                        : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                      layoutId="activeIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
};

export default Layout;