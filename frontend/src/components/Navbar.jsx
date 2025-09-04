import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Coffee, User, Home, Menu as MenuIcon } from 'lucide-react';
import { Button } from './ui/button';
import { openCart } from '../store/slices/cartSlice';

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { totalItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-amber-600" />
            <span className="font-serif text-2xl font-bold gradient-text">
              Cafe Delicious
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-amber-600'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Башкы бет</span>
            </Link>
            <Link
              to="/menu"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                location.pathname === '/menu'
                  ? 'text-amber-600'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              <MenuIcon className="h-4 w-4" />
              <span>Меню</span>
            </Link>
          </div>

          {/* Cart and Admin */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              className="relative border-amber-200 hover:bg-amber-50"
              onClick={() => dispatch(openCart())}
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Admin Link */}
            <Link to="/admin/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-amber-600"
              >
                <User className="h-4 w-4 mr-1" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;