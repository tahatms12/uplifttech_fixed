import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Linkedin } from 'lucide-react';
import Section from '../components/ui/Section';
import CalEmbed from '../components/calendar/CalEmbed';
import '../styles/zoho-form.css';

const ContactPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Contact Us | UPLIFT Technologies';
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
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-xl text-white/80">
              Have questions about our services? Ready to explore how UPLIFT can transform your operations? We're here to help.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Calendar Section */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">Schedule a Meeting</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Book a time that works best for you. We'll discuss your needs and how UPLIFT can help transform your operations.
          </p>
        </div>
        
        <div className="glass-card p-8">
          <CalEmbed 
            elementId="booking-calendar" 
            calLink="uplift-tech/30min"
            layout="week_view"
          />
        </div>
      </Section>
      
      {/* Contact Form Section */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold mb-6">Get in Touch</h2>
            <p className="text-white/80 mb-8">
              Fill out our discovery form to help us understand your needs better. We'll get back to you within 24 hours.
            </p>
            
            <div className="glass-card p-8">
              <iframe 
                aria-label='Uplift Technologies Discovery Form' 
                frameBorder="0" 
                style={{height: '500px', width: '99%', border: 'none'}} 
                src='https://forms.zohopublic.com/tahauplifttec1/form/UpliftTechnologiesDiscoveryForm/formperma/vARQawZk-3SV30FFnZL2mqa1HP_TsU1a_CGswypRAag'
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card p-8 h-full">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Reach Us Directly</h3>
                  <ul className="space-y-4">
                    <li>
                      <a 
                        href="tel:8556435404" 
                        className="flex items-center text-white/80 hover:text-electric-violet transition-colors"
                      >
                        <Phone size={20} className="mr-4 text-electric-violet" />
                        <span>(855) 643-5404</span>
                      </a>
                    </li>
                    <li>
                      <a 
                        href="mailto:business@uplift-technologies.com" 
                        className="flex items-center text-white/80 hover:text-electric-violet transition-colors"
                      >
                        <Mail size={20} className="mr-4 text-electric-violet" />
                        <span>business@uplift-technologies.com</span>
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://linkedin.com/company/uplift-technologies" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-white/80 hover:text-electric-violet transition-colors"
                      >
                        <Linkedin size={20} className="mr-4 text-electric-violet" />
                        <span>LinkedIn</span>
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Office Hours</h3>
                  <p className="text-white/80 mb-2">
                    Our team is available 24/7 for your business needs.
                  </p>
                  <p className="text-white/80">
                    Sales & Support: Monday - Friday, 8am - 8pm EST
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-electric-violet text-sm sm:text-base">How quickly can you start working with us?</h4>
                      <p className="text-white/80 mt-1 text-sm sm:text-base">
                        Typically, we can begin within 1-2 weeks of finalizing our agreement, depending on the complexity of your needs.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-electric-violet">Do you require long-term contracts?</h4>
                      <p className="text-white/80 mt-1">
                        We offer flexible engagement models, including month-to-month options and longer-term agreements with preferred rates.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-electric-violet">How do you ensure data security?</h4>
                      <p className="text-white/80 mt-1">
                        We maintain strict HIPAA, GDPR, and PIPEDA compliance with regular security audits and encrypted data transmission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
      
      {/* Map Section */}
      <Section className="bg-deep-purple/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">Global Reach, Local Expertise</h2>
          <p className="text-white/80 max-w-3xl mx-auto">
            While our team operates remotely across the globe, we provide localized expertise for businesses throughout North America, the UK, and the GCC.
          </p>
        </div>
        
        <div className="relative rounded-lg sm:rounded-xl overflow-hidden h-[250px] sm:h-[350px] md:h-[400px]">
          <div className="absolute inset-0 bg-neutral-900/50 z-10 flex items-center justify-center">
            <div className="glass-card p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md text-center mx-4">
              <h3 className="text-2xl font-medium mb-4">Ready to Get Started?</h3>
              <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-6">
                Book a consultation today and discover how our services can transform your operations.
              </p>
            </div>
          </div>
          <img 
            src="https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrWX2rELwIaUN5ZeFJCVGqXkKD9szcLwxHtEbg" 
            alt="Global team collaboration" 
            className="w-full h-full object-cover"
          />
        </div>
      </Section>
    </>
  );
};

export default ContactPage;