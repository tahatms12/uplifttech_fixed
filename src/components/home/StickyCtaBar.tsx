import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';

const StickyCtaBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 320;
      setIsVisible(show);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`sticky bottom-4 inset-x-0 z-40 transition-transform duration-300 ease-out px-4 sm:px-6 lg:px-8 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-rich-black/90 backdrop-blur-xl shadow-[0_18px_40px_-20px_rgba(8,23,55,0.75)] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue-light">Need support fast?</p>
            <p className="text-base text-white/80">Tap below to book your 15-minute discovery call.</p>
          </div>
          <div className="flex w-full sm:w-auto gap-3">
            <Button to="/contact" size="md" className="w-full sm:w-auto" analyticsLabel="sticky_cta_get_started">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCtaBar;
