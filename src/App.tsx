import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import SitemapGenerator from './components/seo/SitemapGenerator';
import ScrollToTop from './components/ScrollToTop';

// Eager load HomePage for fastest initial render
import HomePage from './pages/HomePage';

// Lazy load all other pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const CandidatesPage = lazy(() => import('./pages/CandidatesPage')); // Talent page
const CandidateDetailPage = lazy(() => import('./pages/CandidateDetailPage')); // Individual candidate
const CareersPage = lazy(() => import('./pages/CareersPage')); // Remote Jobs
const CandidateAcknowledgementPage = lazy(() => import('./pages/CandidateAcknowledgementForm')); // Candidate Declaration

const CaseStudies = lazy(() => import('./pages/CaseStudiesPage'));

const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ApplyPage = lazy(() => import('./pages/ApplyPage'));

const CreativeDirectionPage = lazy(() => import('./pages/CreativeDirectionPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const ScheduleConsultationPage = lazy(() => import('./pages/ScheduleConsultationPage'));

function App() {
  return (
    <>
      <SitemapGenerator />
      <ScrollToTop />
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
          <Route path="pricing" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PricingPage />
            </Suspense>
          } />
          <Route path="candidates" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CandidatesPage />
            </Suspense>
          } />
          <Route path="candidates/:id" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CandidateDetailPage />
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
          <Route path="candidate-acknowledgement" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CandidateAcknowledgementPage />
            </Suspense>
          } />
          <Route path="creative-direction" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CreativeDirectionPage />
            </Suspense>
          } />
          <Route path="case-studies" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CaseStudies />
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
          <Route path="book" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ScheduleConsultationPage />
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
