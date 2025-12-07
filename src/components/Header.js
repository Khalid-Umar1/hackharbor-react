import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ theme, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 border-b-2 ${isDark ? 'bg-bg-dark border-brand' : 'bg-white border-brand-light shadow-md'}`}>
      <div className="container mx-auto px-5 py-4 flex justify-between items-center">
        <div className="logo">
          <Link to="/">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
              HackHarbor
            </h1>
          </Link>
        </div>
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className={`hidden md:block px-4 py-2 rounded-lg font-medium transition-all ${
            isDark 
              ? 'bg-brand text-text hover:bg-accent hover:text-bg-dark' 
              : 'bg-brand-light text-text-light hover:bg-accent-light hover:text-white'
          }`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        
        <button 
          className={`md:hidden text-3xl ${isDark ? 'text-text' : 'text-text-light'}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-full left-0 right-0 md:top-auto border-t md:border-0 ${
          isDark ?  'bg-bg-dark border-brand' : 'bg-white border-brand-light'
        }`}>
          <ul className="flex flex-col md:flex-row md:items-center gap-0 md:gap-6">
            <li className={`border-b md:border-0 ${isDark ?  'border-card' : 'border-brand-light'}`}>
              <Link to="/" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-3 md:p-0 transition-colors ${
                isDark ?  'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
              }`}>Home</Link>
            </li>
            
            {isAuthenticated && (
              <li className={`border-b md:border-0 ${isDark ? 'border-card' : 'border-brand-light'}`}>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-3 md:p-0 transition-colors ${
                  isDark ?  'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
                }`}>Dashboard</Link>
              </li>
            )}
            
            <li className={`border-b md:border-0 ${isDark ? 'border-card' : 'border-brand-light'}`}>
              <Link to="/events" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-3 md:p-0 transition-colors ${
                isDark ? 'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
              }`}>Events</Link>
            </li>
            <li className={`border-b md:border-0 ${isDark ? 'border-card' : 'border-brand-light'}`}>
              <Link to="/training" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-3 md:p-0 transition-colors ${
                isDark ? 'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
              }`}>Training</Link>
            </li>
            <li className={`border-b md:border-0 ${isDark ?  'border-card' : 'border-brand-light'}`}>
              <Link to="/ctf" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-3 md:p-0 transition-colors ${
                isDark ? 'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
              }`}>CTF</Link>
            </li>
            <li className={`border-b md:border-0 ${isDark ?  'border-card' : 'border-brand-light'}`}>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-3 md:p-0 transition-colors ${
                isDark ? 'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
              }`}>About</Link>
            </li>
            
            {/* Conditional Login/Logout */}
            {isAuthenticated ?  (
              <>
                <li className={`border-b md:border-0 ${isDark ?  'border-card' : 'border-brand-light'}`}>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`block px-5 py-3 md:p-0 transition-colors ${
                      isDark ? 'text-accent hover:text-primary' : 'text-accent-light hover:text-primary-light'
                    }`}
                  >
                    👤 {user?.name || 'Profile'}
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className={`block w-full text-left px-5 py-3 md:px-4 md:py-2 md:rounded-lg transition-all ${
                      isDark 
                        ? 'text-error hover:bg-error/20' 
                        : 'text-error hover:bg-error/10'
                    }`}
                  >
                    🚪 Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className={`border-b md:border-0 ${isDark ?  'border-card' : 'border-brand-light'}`}>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-3 md:p-0 transition-colors ${
                    isDark ? 'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
                  }`}>Login</Link>
                </li>
                <li>
                  <Link 
                    to="/signup" 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`block px-5 py-3 md:px-4 md:py-2 md:rounded-lg font-medium transition-all ${
                      isDark 
                        ? 'md:bg-accent md:text-bg-dark md:hover:bg-primary text-accent' 
                        : 'md:bg-accent-light md:text-white md:hover:bg-primary-light text-accent-light'
                    }`}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}