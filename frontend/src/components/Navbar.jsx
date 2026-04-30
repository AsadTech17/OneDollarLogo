import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Image, Clock, Coins, ArrowRight } from 'lucide-react';
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
      <nav className="sticky top-0 z-50 w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/1DollarLogo - Icon (Logo Trans) .png" 
                alt="1DollarLogo" 
                className="h-10 w-auto object-contain"
                style={{ height: '150px' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="font-semibold text-[#0a1d37] hover:text-blue-700 transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </Link>
                ) : (
                  link.isPricingLink ? (
                    <span
                      key={link.name}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="font-semibold text-[#0a1d37] hover:text-blue-700 transition-colors duration-200 relative group cursor-pointer"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                    </span>
                  ) : (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="font-semibold text-[#0a1d37] hover:text-blue-700 transition-colors duration-200 relative group"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                    </a>
                  )
                )
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Start Creating Button */}
            <Link
              to="/generate"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full flex items-center space-x-2 transition-colors duration-200"
            >
              Start Creating
              <ArrowRight size={16} />
            </Link>

            {/* User Profile */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Profile Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
                >
                  {/* Initial-based Avatar */}
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-lg">
                      {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  
                  {/* Chevron Down Icon */}
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-700 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-blue-100 py-2 z-50">
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
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 transition-colors duration-200"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button and credits */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Credits Display */}
            {isAuthenticated && (
              <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                🪙 {isCreditsLoading ? (
                  <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-solid border-current border-r-transparent align-middle"></span>
                ) : (
                  userCredits
                )} OPPAL
              </div>
            )}
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
          <div className="md:hidden bg-white border-t border-gray-200">
            {/* Credits Display at top of menu */}
            {isAuthenticated && (
              <div className="px-4 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-200">
                <div className="flex items-center justify-center">
                  <div className="bg-amber-100 text-amber-700 px-3 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    🪙 {isCreditsLoading ? (
                      <span className="inline-flex items-center">
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-solid border-current border-r-transparent align-middle mr-2"></span>
                        Loading...
                      </span>
                    ) : (
                      userCredits
                    )} OPPAL
                  </div>
                </div>
              </div>
            )}

            {/* Start Creating Button - Mobile */}
            <div className="px-4 py-3">
              <Link
                to="/generate"
                onClick={() => setIsMenuOpen(false)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                Start Creating
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="py-2">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 font-bold text-blue-900 hover:text-blue-700 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <span
                    key={link.name}
                    onClick={(e) => {
                      handleSmoothScroll(e, link.href);
                      setIsMenuOpen(false);
                    }}
                    className="block px-4 py-3 font-bold text-blue-900 hover:text-blue-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-b border-gray-100"
                  >
                    {link.name}
                  </span>
                )
              ))}
            </div>

            {/* User Actions */}
            <div className="border-t border-gray-200">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  Login
                </button>
              )}
            </div>
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
