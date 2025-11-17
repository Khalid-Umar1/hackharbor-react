import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ theme, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-50 border-b-2 ${isDark ? 'bg-bg-dark border-brand' : 'bg-white border-brand-light shadow-md'}`}>
      <div className="container mx-auto px-5 py-4 flex justify-between items-center">
        <div className="logo">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
            HackHarbor
          </h1>
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
          isDark ? 'bg-bg-dark border-brand' : 'bg-white border-brand-light'
        }`}>
          <ul className="flex flex-col md:flex-row gap-0 md:gap-8">
            <li className={`border-b md:border-0 ${isDark ? 'border-card' : 'border-brand-light'}`}>
              <Link to="/" className={`block px-5 py-3 md:p-0 transition-colors ${
                isDark ? 'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
              }`}>Home</Link>
            </li>
            <li className={`border-b md:border-0 ${isDark ? 'border-card' : 'border-brand-light'}`}>
              <Link to="/events" className={`block px-5 py-3 md:p-0 transition-colors ${
                isDark ? 'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
              }`}>Events</Link>
            </li>
            <li className={`border-b md:border-0 ${isDark ? 'border-card' : 'border-brand-light'}`}>
              <Link to="/training" className={`block px-5 py-3 md:p-0 transition-colors ${
                isDark ? 'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
              }`}>Training</Link>
            </li>
            <li className={`border-b md:border-0 ${isDark ? 'border-card' : 'border-brand-light'}`}>
              <Link to="/ctf" className={`block px-5 py-3 md:p-0 transition-colors ${
                isDark ? 'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
              }`}>CTF</Link>
            </li>
            <li className={`border-b md:border-0 ${isDark ? 'border-card' : 'border-brand-light'}`}>
              <Link to="/about" className={`block px-5 py-3 md:p-0 transition-colors ${
                isDark ? 'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
              }`}>About us</Link>
            </li>
            <li className={`border-b md:border-0 ${isDark ? 'border-card' : 'border-brand-light'}`}>
              <Link to="/github-search" className={`block px-5 py-3 md:p-0 transition-colors ${
                isDark ? 'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
              }`}>GitHub Search</Link>
            </li>
            <li>
              <Link to="/login" className={`block px-5 py-3 md:p-0 transition-colors ${
                isDark ? 'text-text hover:text-accent' : 'text-text-light hover:text-accent-light'
              }`}>Login/Sign-up</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}