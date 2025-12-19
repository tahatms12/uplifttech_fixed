import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUpVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Optimized gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 aspect-[1/1] w-full bg-[radial-gradient(ellipse_at_center,#9B1DFF_0%,#280059_60%,transparent_70%)] blur-[80px]" />
      </div>

      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-rich-black pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* INCREASED GAP: Changed from gap-12 to gap-16 lg:gap-24 for more separation */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 px-[15px]">
          
          {/* --- RED BOX AREA: Text Content --- */}
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
            <motion.div
              className="mb-4 sm:mb-0"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.2,
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <motion.div
                variants={fadeUpVariants}
                className="w-full"
              >
                <h1 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  Expert growth solutions for <br className="hidden sm:block" /><span className="gradient-text">North America</span>
                </h1>
              </motion.div>

              <motion.div
                variants={fadeUpVariants}
                className="w-full mt-4 sm:mt-6"
              >
                <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-xl">
                  Transform your business with Uplift Technologies&apos; comprehensive medical support outsourcing. Structured teams of specialized roles work inside your EHR, RCM and communication systems to provide 24/7 coverage.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-0"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <Button to="/book" size="lg" className="group">
                <Calendar size={18} className="mr-2" />
                Schedule Free Consultation
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button to="/case-studies" variant="outline" size="lg">
                View Success Stories
              </Button>
            </motion.div>
          </div>

          {/* --- BLUE BOX AREA: Image Content --- */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              className="w-full"
            >
              {/* FIXED HEIGHT: Changed to exactly h-[350px] as requested */}
              <div className="relative w-full h-[350px] rounded-lg overflow-hidden bg-rich-black/70 backdrop-blur-sm border border-neutral-800/70 shadow-lg">
                <img
                  src="https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U489OxAJFfwdBSz7fDQec0oRvjxW8JlOaM2i6Ip"
                  alt="UPLIFT Technologies operations"
                  className="w-full h-full object-cover opacity-90"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
