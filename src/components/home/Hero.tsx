import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageSquare, Sparkles, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';
import StickyCtaBar from './StickyCtaBar';

const steps = [
  {
    title: 'Tell us your needs',
    description: 'Share the roles, coverage hours, and tools your team already uses so we can mirror your workflow.',
    icon: MessageSquare
  },
  {
    title: 'Get vetted candidates in 3 days',
    description: 'We shortlist specialists with proven North American experience and clear communication skills.',
    icon: Sparkles
  },
  {
    title: 'Scale up',
    description: 'Launch with one role or a whole pod and expand support in sales, marketing, collections, or operations when you are ready.',
    icon: TrendingUp
  }
];

const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const fadeIn = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }), [shouldReduceMotion]);

  return (
    <header className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(11,99,246,0.25),_transparent_60%)]">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(5,11,22,0)_0%,rgba(5,11,22,0.85)_85%,rgba(5,11,22,1)_100%)]" aria-hidden="true" />
      <div className="container-custom flex flex-col-reverse lg:flex-row items-center gap-12 pt-32 pb-20 lg:py-36">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
          }}
          className="w-full lg:w-1/2"
        >
          <motion.div variants={fadeIn}>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-brand-blue-light/80">
              <span className="inline-flex h-2 w-2 rounded-full bg-brand-blue" aria-hidden="true" />
              24/7 support – 99.9% uptime
            </p>
          </motion.div>
          <motion.h1 variants={fadeIn} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            People-Powered Outsourcing, On-Demand
          </motion.h1>
          <motion.p variants={fadeIn} className="mt-4 text-base sm:text-lg lg:text-xl text-white/80 max-w-xl">
            Expert remote teams in Sales, Marketing, Collections & Operations. Launch flexible pods that plug into your stack in days, not months.
          </motion.p>
          <motion.div variants={fadeIn} className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button to="/contact" size="lg" className="w-full sm:w-auto" analyticsLabel="hero_get_started">
              Get Started
            </Button>
            <Button to="/pricing" variant="secondary" size="lg" analyticsLabel="hero_view_pricing">
              View Pricing
            </Button>
          </motion.div>
          <motion.div variants={fadeIn} className="mt-10">
            <ol className="space-y-4" aria-label="How UPLIFT Technologies works">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue font-semibold" aria-hidden="true">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-start gap-2">
                        <Icon className="mt-1 h-5 w-5 text-brand-blue" aria-hidden="true" />
                        <h2 className="text-lg font-semibold text-white">{step.title}</h2>
                      </div>
                      <p className="mt-1 text-sm text-white/75">{step.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-brand-blue/40 bg-brand-blue/10 px-4 py-2 text-sm text-brand-blue" role="status">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
              24/7 Support Guaranteed
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <figure className="relative mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_30px_60px_-30px_rgba(11,99,246,0.6)]">
            <picture>
              <source srcSet="/images/hero-team.svg" type="image/svg+xml" />
              <img
                src="/images/hero-team.svg"
                alt="Remote team collaborating in a virtual workspace"
                className="rounded-2xl"
                loading="eager"
              />
            </picture>
            <figcaption className="mt-4 text-sm text-white/70">
              Trusted by teams who value human connection and on-demand scalability.
            </figcaption>
          </figure>
        </motion.div>
      </div>

      <StickyCtaBar />
    </header>
  );
};

export default Hero;
