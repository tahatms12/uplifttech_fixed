import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import Button from '../ui/Button';

const CallToAction: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-radial from-electric-violet/20 to-rich-black"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-violet/10 rounded-full filter blur-[100px] animate-pulse-slow"></div>
      
      <div className="container-custom relative z-10">
        <motion.div
          className="mx-auto max-w-4xl rounded-2xl border border-border-muted/60 bg-gradient-to-r from-electric-violet/30 to-rich-black p-6 text-center sm:p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-3 text-2xl font-heading font-semibold sm:mb-4 sm:text-3xl md:text-4xl">
            Ready to <span className="gradient-text">UPLIFT</span> Your Business?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-base text-text-muted sm:mb-8 sm:text-lg md:text-xl">
            Schedule a free consultation today and discover how our services can drive efficiency and growth for your operations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button to="/book" size="lg" className="group" analyticsLabel="cta_book_meeting">
              <Calendar size={18} className="mr-2" />
              Book a Meeting
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button to="/case-studies" variant="outline" size="lg" analyticsLabel="cta_explore_work">
              Explore Our Work
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;