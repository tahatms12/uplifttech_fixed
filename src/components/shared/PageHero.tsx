import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
  rightSlot?: React.ReactNode;
  align?: 'left' | 'center';
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  badge,
  actions,
  rightSlot,
  align = 'left'
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="pt-28 sm:pt-32 pb-10 sm:pb-14 bg-gradient-to-b from-rich-black via-rich-black to-[#0b0a14]">
      <div className="container-custom grid gap-10 lg:grid-cols-[1.6fr_1fr] items-center">
        <div className={align === 'center' ? 'text-center' : 'text-left'}>
          {badge ? (
            <motion.span
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="inline-flex items-center rounded-full border border-electric-violet/60 bg-electric-violet/10 px-4 py-2 text-sm font-semibold text-electric-violet"
            >
              {badge}
            </motion.span>
          ) : null}
          <motion.h1
            className="mt-4 font-sans text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            {title}
          </motion.h1>
          {subtitle ? (
            <motion.p
              className="mt-4 max-w-2xl text-base sm:text-lg text-white/80"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          ) : null}
          {actions ? (
            <motion.div
              className={`mt-6 flex flex-wrap gap-3 ${align === 'center' ? 'justify-center' : ''}`}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.12 }}
            >
              {actions}
            </motion.div>
          ) : null}
        </div>
        {rightSlot ? (
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            {rightSlot}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
};

export default PageHero;
