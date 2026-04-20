import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Success Stories', path: '/stories' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold text-xl shadow-glow-sm">
              AX
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">
              Alumina<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">X</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary-400 ${
                  location.pathname === link.path ? 'text-primary-400' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link to="/roles" className="btn-primary py-2 px-5 text-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button - Placeholder */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
