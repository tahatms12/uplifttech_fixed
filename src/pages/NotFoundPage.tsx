import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Page Not Found | UPLIFT Technologies';
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric-violet/20 rounded-full filter blur-[100px] animate-glow"></div>
      
      <div className="container-custom relative z-10 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-9xl font-bold mb-6">
            <span className="gradient-text">404</span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-xl text-white/80 mb-10">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button to="/" size="lg" className="group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Homepage
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;