import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Linkedin, Instagram, MapPin, ArrowRight } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-deep-purple/20 border-t border-neutral-800 pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="container-custom px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Logo + description + social */}
          <div className="lg:col-span-1 flex flex-col items-start">
            <div className="mb-3 sm:mb-4">
              <Logo />
            </div>

            <p className="text-sm text-white/70 max-w-xs">
              Your people-powered Clinical Support partner built for 24/7 operations, driving efficiency and growth.
            </p>

            <div className="mt-4 sm:mt-6 flex flex-row flex-wrap gap-3">
              <a
                href="https://linkedin.com/company/uplift-technologies-intl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-white/70 hover:text-electric-violet transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/uplifttechnologies_/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-white/70 hover:text-electric-violet transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'Medical Benefits Pod', path: '/services/administration' },
                { name: 'Clinical Coordination Pod', path: '/services/clinical-coordination' },
                { name: 'Intake and Order Entry Pod', path: '/services/front-office' },
                { name: 'Claims and AR Pod', path: '/services/revenue-cycle' }
              ].map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-white/70 hover:text-electric-violet transition-colors duration-300 flex items-center"
                  >
                    <ArrowRight size={14} className="mr-2" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              {[ 
                { name: 'About Us', path: '/about' },
                { name: 'Case Studies', path: '/case-studies' },
                { name: 'Compliance & Security', path: '/compliance-security' },
                { name: 'Careers', path: '/careers' },
                { name: 'Contact', path: '/book' },
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

          {/* Contact */}
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
                    <p className="mb-2">Sheridan, Wyoming</p>
                    <p className="mb-2">Islamabad, Pakistan</p>
                  </div>
                </div>
              </li>
            </ul>
            <div className="mt-4 sm:mt-6">
              <Link to="/book" className="btn btn-primary w-full sm:w-auto">
                Book a Meeting
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 md:mt-16 pt-4 sm:pt-6 border-t border-neutral-800 text-xs sm:text-sm text-white/50 flex flex-col sm:flex-row justify-between items-center">
          <p>© {currentYear} Uplift Technologies. All rights reserved.</p>
          <div className="mt-3 sm:mt-0 flex space-x-4 sm:space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
