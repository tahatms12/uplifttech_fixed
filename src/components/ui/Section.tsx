import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  centered?: boolean;
  maxWidth?: string;
}

const Section: React.FC<SectionProps> = ({
  id,
  className = '',
  children,
  title,
  subtitle,
  centered = false,
  maxWidth = 'max-w-7xl',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }
    }
  };

  return (
    <section id={id} className={`py-12 sm:py-16 md:py-20 lg:py-24 ${className}`}>
      <div className={`container-custom ${maxWidth} mx-auto px-4 sm:px-6`}>
        {(title || subtitle) && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
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
            className={`mb-8 sm:mb-12 ${centered ? 'text-center mx-auto' : ''} ${centered ? 'max-w-xl sm:max-w-2xl md:max-w-3xl' : ''}`}
          >
            {title && (
              <motion.h2
                variants={fadeUpVariants}
                className="gradient-text mb-3 text-3xl sm:mb-4 sm:text-4xl"
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p
                variants={fadeUpVariants}
                className="text-base text-text-muted sm:text-lg"
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        )}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1
              }
            }
          }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default Section;