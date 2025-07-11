import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = '';
    };
  }, []);
  
  useEffect(() => {
    closeMenu();
  }, [location]);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services', hasDropdown: true },
    { name: 'Creative Direction', path: '/creative-direction' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  const serviceLinks = [
    { name: 'Sales', path: '/services/sales' },
    { name: 'Logistics', path: '/services/logistics' },
    { name: 'Collections', path: '/services/collections' },
    { name: 'Marketing', path: '/services/marketing' },
    { name: 'Front Desk', path: '/services/front-desk' },
  ];
  
  return (
    <>
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen ? 'bg-rich-black/95 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-3 sm:py-5'
        }`}
      >
        <div className="container-custom px-3 sm:px-4">
          <nav className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-8">
            {/* Mobile Menu Button (Left) */}
            <div className="lg:hidden">
              <button 
                className="relative z-50 p-2 rounded-full bg-rich-black/80 backdrop-blur-md border border-neutral-700"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            {/* Logo (Center) */}
            <Link to="/" className="relative z-50 justify-self-center" onClick={closeMenu}>
              <Logo />
            </Link>
            
            {/* Desktop Navigation (Right) */}
            <div className="hidden lg:flex items-center justify-end space-x-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.hasDropdown ? (
                    <button 
                      className="nav-link flex items-center"
                      onMouseEnter={() => setIsServicesOpen(true)}
                      onMouseLeave={() => setIsServicesOpen(false)}
                    >
                      {link.name}
                      <ChevronDown size={16} className="ml-1" />
                    </button>
                  ) : (
                    <NavLink 
                      to={link.path} 
                      className={({ isActive }) => 
                        isActive ? 'nav-link nav-link-active' : 'nav-link'
                      }
                    >
                      {link.name}
                    </NavLink>
                  )}
                  
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-56 bg-rich-black/95 backdrop-blur-md border border-neutral-800 rounded-md shadow-lg overflow-hidden"
                          onMouseEnter={() => setIsServicesOpen(true)}
                          onMouseLeave={() => setIsServicesOpen(false)}
                        >
                          <div className="py-2">
                            {serviceLinks.map((service) => (
                              <Link
                                key={service.name}
                                to={service.path}
                                className="block px-4 py-2 text-sm hover:bg-deep-purple/30 transition-colors"
                              >
                                {service.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
              
              <Link to="/book" className="btn btn-primary flex items-center">
                <Calendar size={18} className="mr-2" />
                Book a Meeting
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-rich-black/95 backdrop-blur-md z-40"
              onClick={closeMenu}
            />
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-rich-black/98 backdrop-blur-md lg:hidden flex flex-col pt-24 px-6 z-40"
              style={{
                backgroundImage: `url('https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48LYcCDZiUMZzX7lfxvW3hEk5JKuRtbm1dNVHP')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="flex flex-col space-y-6 mt-8">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.hasDropdown && !link.name.includes("Creative") ? (
                      <>
                        <button 
                          className="flex items-center text-xl font-medium py-2"
                          onClick={() => setIsServicesOpen(!isServicesOpen)}
                        >
                          {link.name}
                          <ChevronDown 
                            size={20} 
                            className={`ml-2 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                        
                        <AnimatePresence>
                          {isServicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden ml-4 border-l-2 border-electric-violet/30 pl-4 mt-2"
                            >
                              {serviceLinks.map((service) => (
                                <Link
                                  key={service.name}
                                  to={service.path}
                                  className="block py-2 text-white/80 hover:text-electric-violet transition-colors"
                                  onClick={closeMenu}
                                >
                                  {service.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <NavLink 
                        to={link.path} 
                        className={({ isActive }) => 
                          `block text-xl font-medium py-2 ${isActive ? 'text-electric-violet' : 'text-white/80 hover:text-white'}`
                        }
                        onClick={closeMenu}
                      >
                        {link.name}
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-auto mb-8">
                <div className="mb-3 sm:mb-5">
                  <Link 
                    to="/book" 
                    className="w-full btn btn-primary flex items-center justify-center text-base"
                    onClick={closeMenu}
                  >
                    <Calendar size={18} className="mr-2" />
                    Book a Meeting
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;