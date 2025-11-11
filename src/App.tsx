import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import SitemapGenerator from './components/seo/SitemapGenerator';

// Other existing pages
import HomePage from './pages/HomePage';

// Lazy load for better performance
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ApplyPage = lazy(() => import('./pages/ApplyPage'));
const CreativeDirectionPage = lazy(() => import('./pages/CreativeDirectionPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const ScheduleConsultationPage = lazy(() => import('./pages/ScheduleConsultationPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// New candidate system pages
const CandidatesPage = lazy(() => import('./pages/CandidatesPage'));
const CandidateDetailPage = lazy(() => import('./pages/CandidateDetailPage'));

function App() {
  return (
    <>
      <SitemapGenerator />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          {/* Existing app routes */}
          <Route
            path="about"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="services"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ServicesPage />
              </Suspense>
            }
          />
          <Route
            path="services/:service"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ServiceDetailPage />
              </Suspense>
            }
          />
          <Route
            path="case-studies"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CaseStudiesPage />
              </Suspense>
            }
          />
          <Route
            path="careers"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CareersPage />
              </Suspense>
            }
          />
          <Route
            path="apply"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ApplyPage />
              </Suspense>
            }
          />
          <Route
            path="creative-direction"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CreativeDirectionPage />
              </Suspense>
            }
          />
          <Route
            path="payment"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PaymentPage />
              </Suspense>
            }
          />
          <Route
            path="privacy-policy"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PrivacyPolicyPage />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ScheduleConsultationPage />
              </Suspense>
            }
          />

          {/* 🧑‍💼 New candidate directory system */}
          <Route
            path="candidates"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CandidatesPage />
              </Suspense>
            }
          />
          <Route
            path="candidates/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CandidateDetailPage />
              </Suspense>
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
