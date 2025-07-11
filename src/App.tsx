import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import SitemapGenerator from './components/seo/SitemapGenerator';

// Eager load HomePage for fastest initial render
import HomePage from './pages/HomePage';

// Lazy load all other pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ApplyPage = lazy(() => import('./pages/ApplyPage'));
const CalendarPage = lazy(() => import('./components/calendar/CalendarPage'));
const CreativeDirectionPage = lazy(() => import('./pages/CreativeDirectionPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));

function App() {
  return (
    <>
      <SitemapGenerator />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AboutPage />
            </Suspense>
          } />
          <Route path="services" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ServicesPage />
            </Suspense>
          } />
          <Route path="services/:service" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ServiceDetailPage />
            </Suspense>
          } />
          <Route path="case-studies" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CaseStudiesPage />
            </Suspense>
          } />
          <Route path="careers" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CareersPage />
            </Suspense>
          } />
          <Route path="apply" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ApplyPage />
            </Suspense>
          } />
          <Route path="contact" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ContactPage />
            </Suspense>
          } />
          <Route path="creative-direction" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CreativeDirectionPage />
            </Suspense>
          } />
          <Route path="book" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CalendarPage />
            </Suspense>
          } />
          <Route path="payment" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PaymentPage />
            </Suspense>
          } />
          <Route path="privacy-policy" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PrivacyPolicyPage />
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<LoadingSpinner />}>
              <NotFoundPage />
            </Suspense>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default App;