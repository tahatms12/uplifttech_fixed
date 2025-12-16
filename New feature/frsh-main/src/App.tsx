import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Strategy from './components/Strategy';
import Portfolio from './components/Portfolio';
import Tokenomics from './components/Tokenomics';
import Roadmap from './components/Roadmap';
import Community from './components/Community';
import Footer from './components/Footer';
import FloatingParticles from './components/FloatingParticles';
import PriceTicker from './components/PriceTicker';
import LoginPage from './pages/training/LoginPage';
import DashboardPage from './pages/training/DashboardPage';
import CoursePage from './pages/training/CoursePage';
import AdminPage from './pages/training/AdminPage';
import VerifyPage from './pages/training/VerifyPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen animated-bg relative">
        <FloatingParticles />
        <Header />
        <PriceTicker />
        <Routes>
          <Route
            path="/"
            element={(
              <main>
                <Hero />
                <About />
                <Strategy />
                <Portfolio />
                <Tokenomics />
                <Roadmap />
                <Community />
              </main>
            )}
          />
          <Route path="/training" element={<LoginPage />} />
          <Route path="/training/dashboard" element={<DashboardPage />} />
          <Route path="/training/course/:courseId" element={<CoursePage />} />
          <Route path="/training/admin" element={<AdminPage />} />
          <Route path="/training/verify" element={<VerifyPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
