import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CartSidebar from './CartSidebar';
import LoginModal from './LoginModal';
import './Header.css';

const Header = ({ showAddForm, setShowAddForm, plants }) => {
  const { user, isAdmin, logout } = useAuth();
  const { items, getCartTotal } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const [showCart, setShowCart] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile detection and responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);
      
      // Auto-close mobile menu when switching to desktop
      if (!isMobileView && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    // Check on component mount
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && 
          !event.target.closest('.mobile-nav') && 
          !event.target.closest('.mobile-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  // Handle admin actions (login or toggle add form)
  const handleAdminClick = () => {
    if (isAdmin()) {
      setShowAddForm(!showAddForm);
    } else {
      setShowLoginModal(true);
    }
    // Close mobile menu after action
    setIsMobileMenuOpen(false);
  };

  // Smooth scroll to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
    setIsMobileMenuOpen(false);
  };

  // Calculate cart totals
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = getCartTotal();

  // Handle mobile menu toggle with safety check
  const handleMobileToggle = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  // Dynamic admin button text based on state
  const getAdminButtonText = () => {
    if (!isAdmin()) {
      return 'Admin';
    }
    return showAddForm ? 'Close Form' : 'Add Plant';
  };

  // Dynamic mobile admin button text
  const getMobileAdminButtonText = () => {
    if (!isAdmin()) {
      return 'Admin Login';
    }
    return showAddForm ? 'Close Form' : 'Add Plant';
  };

  // Handle search functionality
  const handleSearchClick = () => {
    // Scroll to search section in banner
    scrollToSection('plants-section');
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Main Header */}
      <header className={`modern-header ${isScrolled ? 'header-scrolled' : ''} ${theme}`}>
        <div className="header-container">
          {/* Logo Section */}
          <div 
            className="header-logo" 
            onClick={() => scrollToSection('home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                scrollToSection('home');
              }
            }}
          >
            <span className="logo-plant" aria-hidden="true">🌱</span>
            <span className="logo-text gradient-text">URVANN</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="header-nav" role="navigation">
            <button 
              className="nav-button" 
              onClick={() => scrollToSection('home')}
              type="button"
            >
              Home
            </button>
            <button 
              className="nav-button" 
              onClick={() => scrollToSection('plants-section')}
              type="button"
            >
              Products
            </button>
            <button 
              className="nav-button" 
              onClick={() => scrollToSection('about')}
              type="button"
            >
              About
            </button>
            <button 
              className="nav-button" 
              onClick={() => scrollToSection('contact')}
              type="button"
            >
              Contact
            </button>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Theme Toggle Button */}
            <button 
              className="action-btn theme-toggle" 
              onClick={toggleTheme}
              type="button"
              title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            >
              {isDark ? (
                // Sun icon for light mode
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                // Moon icon for dark mode
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              )}
            </button>

            {/* Search Button */}
            <button 
              className="action-btn search-btn" 
              onClick={handleSearchClick}
              type="button"
              title="Search plants"
              aria-label="Search plants"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Cart Button */}
            <button 
              className="action-btn cart-btn" 
              onClick={() => setShowCart(true)}
              type="button"
              title={`Shopping cart - ${totalQuantity} items`}
              aria-label={`Shopping cart with ${totalQuantity} items`}
            >
              <div className="cart-icon-wrapper">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {totalQuantity > 0 && (
                  <span className="cart-badge" aria-hidden="true">
                    {totalQuantity > 99 ? '99+' : totalQuantity}
                  </span>
                )}
              </div>
              {/* Cart preview tooltip */}
              {totalQuantity > 0 && (
                <div className="cart-preview">
                  <span className="cart-total">₹{cartTotal.toLocaleString()}</span>
                </div>
              )}
            </button>

            {/* Account Button */}
            <button 
              className="action-btn account-btn" 
              onClick={() => user ? null : setShowLoginModal(true)}
              type="button"
              title={user ? `Logged in as ${user.name || 'User'}` : 'Login to account'}
              aria-label={user ? `Account menu for ${user.name || 'User'}` : 'Login to account'}
            >
              {user ? (
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </button>

            {/* Desktop Admin/Add Plant Button */}
            {!isMobile && (
              <button 
                className={`admin-btn ${showAddForm ? 'active' : ''} ${isAdmin() ? 'authenticated' : 'login'}`}
                onClick={handleAdminClick}
                type="button"
                title={isAdmin() ? (showAddForm ? 'Close add plant form' : 'Open add plant form') : 'Admin login'}
              >
                <span className="admin-btn-icon">
                  {!isAdmin() ? 'Login' : showAddForm ? '❌' : '➕'}
                </span>
                {getAdminButtonText()}
              </button>
            )}

            {/* Desktop Logout Button */}
            {!isMobile && user && (
              <button 
                className="logout-btn"
                onClick={handleLogout}
                type="button"
                title="Logout from account"
              >
                <span className="logout-btn-icon"></span>
                Logout
              </button>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <button 
                className="mobile-toggle"
                onClick={handleMobileToggle}
                type="button"
                title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMobile && (
          <>
            {/* Mobile Navigation Overlay */}
            <div 
              className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Mobile Navigation Menu */}
            <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`} role="navigation">
              {/* Mobile Nav Header */}
              <div className="mobile-nav-header">
                <div className="mobile-nav-logo">
                  <span className="logo-text gradient-text">URVANN</span>
                </div>
                <div className="mobile-nav-controls">
                  {/* Mobile Theme Toggle */}
                  <button 
                    className="mobile-theme-toggle"
                    onClick={toggleTheme}
                    type="button"
                    title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
                    aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
                  >
                    {isDark ? '☀️' : '🌙'}
                  </button>
                  <button 
                    className="mobile-nav-close"
                    onClick={() => setIsMobileMenuOpen(false)}
                    type="button"
                    title="Close menu"
                    aria-label="Close navigation menu"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Mobile Nav Content */}
              <div className="mobile-nav-content">
                {/* User Info Section */}
                {user && (
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="mobile-user-details">
                      <p className="mobile-user-name">
                        Welcome, {user.name || 'User'}!
                      </p>
                      <p className="mobile-user-role">
                        {isAdmin() ? ' Admin Account' : 'Plant Lover'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Links Section */}
                <div className="mobile-nav-section">
                  <h3 className="mobile-nav-section-title">Navigate</h3>
                  <button 
                    onClick={() => scrollToSection('home')} 
                    className="mobile-nav-link"
                    type="button"
                  >
                    <span className="mobile-nav-icon"></span>
                    <span>Home</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('plants-section')} 
                    className="mobile-nav-link"
                    type="button"
                  >
                    <span className="mobile-nav-icon"></span>
                    <span>Products</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('about')} 
                    className="mobile-nav-link"
                    type="button"
                  >
                    <span className="mobile-nav-icon"></span>
                    <span>About</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('contact')} 
                    className="mobile-nav-link"
                    type="button"
                  >
                    <span className="mobile-nav-icon"></span>
                    <span>Contact</span>
                  </button>
                </div>

                {/* Cart Section */}
                {totalQuantity > 0 && (
                  <div className="mobile-nav-section">
                    <h3 className="mobile-nav-section-title">Shopping Cart</h3>
                    <div className="mobile-cart-summary">
                      <div className="mobile-cart-info">
                        <div className="cart-items">
                          <span className="cart-count">{totalQuantity}</span>
                          <span> item{totalQuantity !== 1 ? 's' : ''}</span>
                        </div>
                        <span className="cart-total">₹{cartTotal.toLocaleString()}</span>
                      </div>
                      <button 
                        className="mobile-view-cart-btn"
                        onClick={() => {
                          setShowCart(true);
                          setIsMobileMenuOpen(false);
                        }}
                        type="button"
                      >
                        🛒 View Cart
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons Section */}
                <div className="mobile-nav-section">
                  <h3 className="mobile-nav-section-title">Actions</h3>
                  
                  {/* Search Button */}
                  <button 
                    className="mobile-action-btn search"
                    onClick={() => {
                      handleSearchClick();
                      setIsMobileMenuOpen(false);
                    }}
                    type="button"
                  >
                    <span className="mobile-btn-icon">🔍</span>
                    <span>Search Plants</span>
                  </button>

                  {/* Admin/Add Plant Button */}
                  <button 
                    className={`mobile-action-btn admin ${isAdmin() ? 'authenticated' : 'login'} ${showAddForm ? 'active' : ''}`}
                    onClick={handleAdminClick}
                    type="button"
                  >
                    <span className="mobile-btn-icon">
                      {!isAdmin() ? '🔐' : showAddForm ? '❌' : '➕'}
                    </span>
                    <span>{getMobileAdminButtonText()}</span>
                  </button>

                  {/* Login/Logout Button */}
                  {!user ? (
                    <button 
                      className="mobile-action-btn login"
                      onClick={() => {
                        setShowLoginModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      type="button"
                    >
                      <span className="mobile-btn-icon">👤</span>
                      <span>Login Account</span>
                    </button>
                  ) : (
                    <button 
                      className="mobile-action-btn logout"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      type="button"
                    >
                      <span className="mobile-btn-icon">🚪</span>
                      <span>Logout</span>
                    </button>
                  )}
                </div>

                {/* App Info Footer */}
                <div className="mobile-nav-footer">
                  <p>Made with 💚 for plant lovers</p>
                  <small>Version 1.0.0 | {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode</small>
                </div>
              </div>
            </nav>
          </>
        )}
      </header>

      {/* Cart Sidebar Component */}
      <CartSidebar 
        isOpen={showCart} 
        onClose={() => setShowCart(false)}
        items={items}
        total={cartTotal}
      />

      {/* Login Modal Component */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Header;
