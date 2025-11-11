import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-rich-black text-white">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-4 focus:left-4 bg-electric-violet text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-violet"
      >
        Skip to main content
      </a>
      <Navbar />
      <Breadcrumbs />
      <AnimatePresence mode="wait">
        <motion.main 
          id="main-content"
          className="flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          tabIndex={-1}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Layout;