import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';
import Button from '../ui/Button';

interface NavigationLink {
  name: string;
  path: string;
  type?: 'dropdown' | 'link';
}

const primaryLinks: NavigationLink[] = [
  { name: 'Solutions', path: '/services', type: 'dropdown' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'About Us', path: '/about' },
  { name: 'Remote Jobs', path: '/careers' }
];

const solutionLinks = [
  { name: 'Virtual Assistants', path: '/services/front-desk' },
  { name: 'Sales Reps', path: '/services/sales' },
  { name: 'Marketing', path: '/services/marketing' },
  { name: 'Collections', path: '/services/collections' },
  { name: 'Operations', path: '/services/logistics' }
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const solutionsButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      const container = mobileNavRef.current;
      if (container) {
        const getFocusable = () =>
          container.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );

        const initialFocusable = getFocusable();
        initialFocusable[0]?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            setIsMenuOpen(false);
          }

          if (event.key === 'Tab') {
            const focusable = getFocusable();
            if (focusable.length === 0) {
              return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        };

        const handleClick = (event: MouseEvent) => {
          if (container && !container.contains(event.target as Node)) {
            setIsMenuOpen(false);
          }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClick);

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('mousedown', handleClick);
        };
      }
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus({ preventScroll: true });
    }
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSolutionsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        solutionsButtonRef.current &&
        !solutionsButtonRef.current.contains(event.target as Node)
      ) {
        setIsSolutionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSolutionsKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsSolutionsOpen(true);
      const firstItem = dropdownRef.current?.querySelector<HTMLAnchorElement>('a');
      firstItem?.focus();
    }
    if (event.key === 'Escape') {
      setIsSolutionsOpen(false);
      solutionsButtonRef.current?.focus();
    }
  };

  const handleDropdownKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsSolutionsOpen(false);
      solutionsButtonRef.current?.focus();
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-rich-black/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <nav className="grid grid-cols-[auto_1fr_auto] items-center gap-2 py-4 sm:py-5" aria-label="Main navigation">
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border-muted/60 bg-surface-alt/80 text-white lg:hidden"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="justify-self-center lg:justify-self-start" aria-label="UPLIFT Technologies home">
            <Logo />
          </Link>

          <div className="hidden items-center justify-end gap-6 lg:flex">
            {primaryLinks.map((link) =>
              link.type === 'dropdown' ? (
                <div key={link.name} className="relative">
                  <button
                    ref={solutionsButtonRef}
                    className={`nav-link inline-flex items-center gap-1 ${
                      location.pathname.startsWith('/services') ? 'nav-link-active' : ''
                    }`}
                    aria-haspopup="true"
                    aria-expanded={isSolutionsOpen}
                    onClick={() => setIsSolutionsOpen((previous) => !previous)}
                    onKeyDown={handleSolutionsKeyDown}
                  >
                    {link.name}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isSolutionsOpen ? 'rotate-180 text-electric-violet' : 'text-text-muted'}`}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence>
                    {isSolutionsOpen && (
                      <motion.div
                        ref={dropdownRef}
                        role="menu"
                        aria-label="Solutions"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-3 w-64 rounded-2xl border border-border-muted/70 bg-surface/95 p-2 shadow-card"
                        onKeyDown={handleDropdownKeyDown}
                      >
                        {solutionLinks.map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                              `flex items-start gap-3 rounded-xl px-4 py-3 text-sm transition-colors hover:bg-surface-alt/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet ${
                                isActive ? 'text-electric-violet' : 'text-text-muted'
                              }`
                            }
                            role="menuitem"
                          >
                            <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-electric-violet" aria-hidden="true" />
                            <span>{item.name}</span>
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? 'nav-link nav-link-active' : 'nav-link hover:text-white'
                  }
                >
                  {link.name}
                </NavLink>
              )
            )}
            <Button to="/contact" size="md" className="w-auto" analyticsLabel="nav_get_started">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Get Started
            </Button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-rich-black/95 backdrop-blur-lg lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            ref={mobileNavRef}
          >
            <div className="flex h-full flex-col justify-between px-6 pb-12 pt-28">
              <nav aria-label="Mobile navigation" className="space-y-6">
                {primaryLinks.map((link) =>
                  link.type === 'dropdown' ? (
                    <div key={link.name}>
                      <button
                        className="flex w-full items-center justify-between rounded-xl border border-border-muted/70 bg-surface-alt/80 px-4 py-3 text-left text-lg font-semibold text-white"
                        onClick={() => setIsSolutionsOpen((previous) => !previous)}
                        aria-expanded={isSolutionsOpen}
                        aria-controls="mobile-solutions"
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${isSolutionsOpen ? 'rotate-180 text-electric-violet' : 'text-text-muted'}`}
                          aria-hidden="true"
                        />
                      </button>
                      <AnimatePresence>
                        {isSolutionsOpen && (
                          <motion.div
                            id="mobile-solutions"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="mt-3 space-y-2 rounded-2xl border border-border-muted/60 bg-surface-alt/80 p-3"
                          >
                            {solutionLinks.map((item) => (
                              <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                  `block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                                    isActive
                                      ? 'bg-electric-violet/20 text-electric-violet'
                                      : 'text-text-muted hover:bg-surface/70 hover:text-white'
                                  }`
                                }
                              >
                                {item.name}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      className={({ isActive }) =>
                        `block rounded-xl border border-border-muted/60 bg-surface-alt/80 px-4 py-3 text-lg font-semibold transition-colors ${
                          isActive ? 'text-electric-violet' : 'text-text-muted hover:bg-surface/70 hover:text-white'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  )
                )}
              </nav>

              <div className="space-y-3">
                <Button to="/contact" size="lg" className="w-full" analyticsLabel="mobile_nav_get_started">
                  <Calendar className="h-5 w-5" aria-hidden="true" />
                  Get Started
                </Button>
                <p className="text-center text-sm text-text-muted">
                  24/7 support team ready within three business days.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
