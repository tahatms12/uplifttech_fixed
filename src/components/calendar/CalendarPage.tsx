import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';
import CalEmbed from './CalEmbed';

const CalendarPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Book a Meeting | UPLIFT Technologies';
  }, []);
  
  return (
    <>
      {/* Hero Section */}
      <div className="pt-32 pb-20 gradient-bg relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric-violet/20 rounded-full filter blur-[100px] animate-glow"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-poppins font-semibold mb-6">
              Book a <span className="gradient-text">Meeting</span>
            </h1>
            <p className="text-xl text-white/80">
              Schedule a time to discuss your business needs and discover how UPLIFT Technologies can help transform your operations.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Calendar Section */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">Select a Time</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Choose a date and time that works best for you. Our team is available to discuss your specific needs and how we can help.
          </p>
        </div>
        
        <div className="glass-card p-8">
          <CalEmbed 
            elementId="full-page-calendar" 
            calLink="uplift-tech/30min"
            layout="week_view"
            style={{ height: '800px' }}
          />
        </div>
      </Section>
      
      {/* Additional Info Section */}
      <Section className="bg-deep-purple/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-medium mb-3">What to Expect</h3>
            <p className="text-white/80">
              During our initial consultation, we'll discuss your business challenges, goals, and how our services can be tailored to meet your specific needs.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-medium mb-3">Meeting Duration</h3>
            <p className="text-white/80">
              Our initial consultations typically last 30 minutes. If we need more time, we can schedule a follow-up session to dive deeper into your requirements.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-medium mb-3">Preparation</h3>
            <p className="text-white/80">
              To make the most of our time together, consider preparing a brief overview of your current operations, challenges, and goals you'd like to achieve.
            </p>
          </motion.div>
        </div>
      </Section>
    </>
  );
};

export default CalendarPage;