import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Image, Clock, Coins } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import api from "../api/axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [isCreditsLoading, setIsCreditsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isAuthenticated, getIdToken } = useAuth();

  // Fetch user credits
  useEffect(() => {
    const fetchUserCredits = async () => {
      if (!user) return;
      
      setIsCreditsLoading(true);
      
      try {
        const response = await api.get('/api/credits/balance');
        
        if (response.data.success) {
          setUserCredits(response.data.data?.credits || 0);
        }
      } catch (error) {
        console.error('Error fetching user credits:', error);
      } finally {
        setIsCreditsLoading(false);
      }
    };

    if (user) {
      fetchUserCredits();
    } else {
      setIsCreditsLoading(false);
    }
  }, [user, getIdToken]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing-section', isPricingLink: true },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '/contact', isRoute: true }
  ];

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      const { signOut, auth } = await import('../lib/firebase');
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    // Handle hash links - redirect to home then scroll if not on home page
    if (href.startsWith('#')) {
      if (window.location.pathname !== '/') {
        window.location.href = `/${href}`;
        return;
      }
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    // Use navigate for page routes instead of direct href manipulation
    if (href.startsWith('/')) {
      window.location.href = href;
      return;
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
              1DollarLogo
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
                  >
                    {link.name}
                  </Link>
                ) : (
                  link.isPricingLink ? (
                    <span
                      key={link.name}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    >
                      {link.name}
                    </span>
                  ) : (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  )
                )
              ))}
            </div>
          </div>

          {/* User Profile / CTA Button - Desktop */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Profile Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
                >
                  {/* Initial-based Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-lg">
                      {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  
                  {/* User Name */}
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {user?.displayName || 'User'}
                    </p>
                  </div>
                  
                  {/* Chevron Down Icon */}
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-500 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">
                        {user?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || ''}
                      </p>
                    </div>
                    
                    {/* Credits Display */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">
                        Credits: {isCreditsLoading ? (
                          <span className="inline-flex items-center">
                            <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-solid border-current border-r-transparent align-middle mr-2"></span>
                            <span className="text-gray-400">Loading...</span>
                          </span>
                        ) : (
                          <span className={userCredits === 0 && !isCreditsLoading ? "text-gray-400" : ""}>
                            {userCredits}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut size={14} className="mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105 focus:scale-105 inline-block focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X size={24} className="text-blue-600" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/generate"
                className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105 w-full text-center"
              >
                Start Free
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>

    {/* Login Modal */}
    <LoginModal 
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
    />
    </>
  );
};

export default Navbar;
