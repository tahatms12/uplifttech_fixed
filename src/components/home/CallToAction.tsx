import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import Button from '../ui/Button';

const CallToAction: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-radial from-deep-purple/20 to-rich-black"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-violet/10 rounded-full filter blur-[100px] animate-pulse-slow"></div>
      
      <div className="container-custom relative z-10">
        <motion.div
          className="bg-gradient-to-r from-deep-purple/30 to-rich-black border border-neutral-800 rounded-2xl p-6 sm:p-8 md:p-12 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold mb-3 sm:mb-4">
            Ready to <span className="gradient-text">UPLIFT</span> Your Business?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Schedule a free consultation today and discover how our services can drive efficiency and growth for your operations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button to="/book" size="lg" className="group">
              <Calendar size={18} className="mr-2" />
              Book a Meeting
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button to="/case-studies" variant="outline" size="lg">
              Explore Our Work
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;