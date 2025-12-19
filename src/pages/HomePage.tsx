import React, { lazy, Suspense } from 'react';
import Hero from '../components/home/Hero';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { AnimatePresenceGroup } from '../components/motion';
import MetaTags from '../components/seo/MetaTags';

// Lazy load below-the-fold components
const Services = lazy(() => 
  import(/* webpackChunkName: "services" */ '../components/home/Services')
);
const CaseStudies = lazy(() => 
  import(/* webpackChunkName: "case-studies" */ '../components/home/CaseStudies')
);
const Testimonials = lazy(() => 
  import(/* webpackChunkName: "testimonials" */ '../components/home/Testimonials')
);
const CallToAction = lazy(() => 
  import(/* webpackChunkName: "call-to-action" */ '../components/home/CallToAction')
);

const HomePage: React.FC = () => {
  return (
    <AnimatePresenceGroup className="overflow-x-hidden">
      <MetaTags
        title="Uplift Technologies | Clinical support and operations partner"
        description="People-powered medical support outsourcing with structured teams, specialized roles, and 24/7 coverage inside client systems." 
      />

      {/* Hero section loads immediately */}
      <Hero />
      
      {/* Lazy load below-the-fold sections with loading states */}
      <Suspense fallback={<LoadingSpinner />}>
        <Services />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <CaseStudies />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <Testimonials />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <CallToAction />
      </Suspense>
    </AnimatePresenceGroup>
  );
};

export default HomePage;
