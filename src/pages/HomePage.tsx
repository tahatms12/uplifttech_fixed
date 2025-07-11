import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import Hero from '../components/home/Hero';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { AnimatePresenceGroup } from '../components/motion';

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
      <Helmet>
        <title>UPLIFT Technologies | People-Powered Outsourcing Partner</title>
        <meta name="description" content="Transform your operations with UPLIFT Technologies. Expert outsourcing solutions across sales, marketing, collections & more. Available 24/7 in US, Canada & UK." />
      </Helmet>

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