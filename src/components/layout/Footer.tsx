import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Linkedin, MapPin, ArrowRight } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-deep-purple/20 border-t border-neutral-800 pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="container-custom px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-3 sm:mt-4 text-sm text-white/70 max-w-xs">
              Your people-powered outsourcing partner built for 24/7 operations, driving efficiency and growth.
            </p>
            <div className="mt-4 sm:mt-6 flex space-x-4">
              <a 
                href="https://linkedin.com/company/uplift-technologies-intl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-electric-violet transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {['Clinical Coordination', 'Administration', 'Revenue Cycle', 'Creative Direction', 'Front Office'].map((service) => (
                <li key={service}>
                  <Link 
                    to={`/services/${service.toLowerCase().replace(' ', '-')}`}
                    className="text-white/70 hover:text-electric-violet transition-colors duration-300 flex items-center"
                  >
                    <ArrowRight size={14} className="mr-2" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Creative Direction', path: '/creative-direction' },
                { name: 'Case Studies', path: '/case-studies' },
                { name: 'Careers', path: '/careers' },
                { name: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-white/70 hover:text-electric-violet transition-colors duration-300 flex items-center"
                  >
                    <ArrowRight size={14} className="mr-2" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Contact Us</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a 
                  href="tel:8556435404" 
                  className="text-white/70 hover:text-electric-violet transition-colors duration-300 flex items-center"
                >
                  <Phone size={18} className="mr-3" />
                  (855) 643-5404
                </a>
              </li>
              <li>
                <a 
                  href="mailto:business@uplift-technologies.com" 
                  className="text-white/70 hover:text-electric-violet transition-colors duration-300 flex items-center"
                >
                  <Mail size={18} className="mr-3" />
                  business@uplift-technologies.com
                </a>
              </li>
              <li>
                <div className="text-white/70 flex items-start">
                  <MapPin size={18} className="mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="mb-2">Sheridan, Wyoming, USA</p>
                    <p className="mb-2">Islamabad, Pakistan</p>
                  </div>
                </div>
              </li>
            </ul>
            <div className="mt-4 sm:mt-6">
              <Link to="/contact" className="btn btn-primary w-full sm:w-auto">
                Book a Meeting
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
