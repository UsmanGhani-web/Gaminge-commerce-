'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    // Check for existing user session
    const existingUser = localStorage.getItem('user');
    if (existingUser) {
      try {
        setUser(JSON.parse(existingUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can implement search functionality here
      console.log('Searching for:', searchQuery);
      // For now, just clear the search
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-logo-section">
          <Link href="/" className="nav-logo">
            <i className="fas fa-gamepad"></i>
            <span>GamingTech Pro</span>
          </Link>
        </div>
        
        {/* Search Bar Section */}
        <div className="nav-search-section">
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className={`search-input-wrapper ${isSearchFocused ? 'focused' : ''}`}>
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="search-clear"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        
        {/* Navigation Menu Section */}
        <div className="nav-menu-section">
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <Link 
                href="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/products" 
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/custom-build" 
                className={`nav-link ${isActive('/custom-build') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Custom Build
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/components" 
                className={`nav-link ${isActive('/components') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Components
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/contact" 
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* User Profile Section */}
          <div className="nav-user-section">
            {user ? (
              <div className="user-profile">
                <div className="user-info">
                  <span className="user-name">{user.firstName}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link href="/auth/login" className="auth-btn login-btn">
                  <i className="fas fa-sign-in-alt"></i>
                  Login
                </Link>
                <Link href="/auth/register" className="auth-btn register-btn">
                  <i className="fas fa-user-plus"></i>
                  Register
                </Link>
              </div>
            )}
          </div>

          <div 
            className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </div>
    </nav>
  );
} 