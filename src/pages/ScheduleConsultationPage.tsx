import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import emailjs from '@emailjs/browser';
import MetaTags from '../components/seo/MetaTags';

// Mock Section and Card components for demonstration
const Section = ({ title, subtitle, centered, className = '', maxWidth = 'max-w-6xl', children }) => (
  <section className={`py-16 ${className}`}>
    <div className={`container mx-auto px-4 ${maxWidth}`}>
      {title && (
        <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  </section>
);

const Card = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: delay * 0.1 }}
    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors"
  >
    {children}
  </motion.div>
);

const ContactPage = () => {
  // Cal element click embed code adapted to React
  useEffect(() => {
    type CalNamespace = (...args: unknown[]) => void;
    type CalEmbed = CalNamespace & { q?: unknown[][]; ns?: Record<string, CalNamespace>; loaded?: boolean };
    type CalClient = { Cal?: CalEmbed; document: Document };

    const initCal = (client: CalClient, scriptSrc: string, initLabel: string) => {
      const enqueue = (api: CalEmbed, args: unknown[]) => {
        api.q = api.q || [];
        api.q.push(args);
      };
      const doc = client.document;
      const cal: CalEmbed =
        client.Cal ||
        (function (...args: unknown[]) {
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            doc.head.appendChild(doc.createElement('script')).src = scriptSrc;
            cal.loaded = true;
          }
          if (args[0] === initLabel) {
            const namespace = args[1];
            const api = ((...rest: unknown[]) => enqueue(api, rest)) as CalEmbed;
            api.q = api.q || [];
            if (typeof namespace === 'string') {
              cal.ns = cal.ns || {};
              cal.ns[namespace] = cal.ns[namespace] || api;
              enqueue(cal.ns[namespace], args);
              enqueue(cal, ['initNamespace', namespace]);
            } else {
              enqueue(cal, args);
            }
            return;
          }
          enqueue(cal, args);
        } as CalEmbed);

      client.Cal = cal;
    };

    const calWindow = window as unknown as CalClient;

    initCal(calWindow, 'https://app.cal.com/embed/embed.js', 'init');

    if (calWindow.Cal) {
      calWindow.Cal('init', '30min', { origin: 'https://app.cal.com' });
      calWindow.Cal.ns?.['30min']?.('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    }
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'success' | 'error'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    console.log('Form submitted:', formData);

    try {
      // EmailJS configuration
      const serviceId = 'service_04ty7fg';
      const templateId = 'template_znsp7eh';
      const publicKey = 'aJW8lljt4LFwOzyor';

      console.log('Sending email with EmailJS...');

      // Send email using EmailJS
      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          company: formData.company || 'Not provided',
          message: formData.message,
          to_name: 'UPLIFT Technologies Team',
        },
        publicKey
      );

      console.log('Email sent successfully:', result);
      setSubmitStatus('success');

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Failed to send email:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      setSubmitStatus('error');

      // Reset error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: <Mail size={32} />,
      title: 'Email',
      details: 'business@uplift-technologies.com',
      link: 'mailto:business@uplift-technologies.com',
    },
    {
      icon: <Phone size={32} />,
      title: 'Phone (US)',
      details: '+1 855 643 5404',
      link: 'tel:+18556435404',
    },
    {
      icon: <Clock size={32} />,
      title: 'Availability',
      details: '24/7 Support',
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <MetaTags
        title="Book a consultation"
        description="Contact Uplift Technologies to discuss clinical support and revenue cycle services."
      />
      {/* Hero Section */}
      <div className="pt-32 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48LYcCDZiUMZzX7lfxvW3hEk5JKuRtbm1dNVHP')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4,
          }}
        />

        <div className="container mx-auto relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl md:max-w-2xl lg:max-w-3xl"
          >
            <h1 className="font-semibold mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl">
              Get in{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent block sm:inline">
                Touch
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300">
              Ready to transform your operations? Let's start a conversation about how UPLIFT can help your business
              thrive.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <Section
        title="Contact Information"
        subtitle="Multiple ways to reach our team. We're here to help 24/7."
        centered
        className="bg-purple-900/10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactInfo.map((info, index) => (
            <Card key={info.title + index} delay={index}>
              <div className="text-purple-400 mb-4">{info.icon}</div>
              <h3 className="text-xl font-medium mb-3">{info.title}</h3>
              {info.link ? (
                <a href={info.link} className="text-gray-400 hover:text-purple-400 transition-colors">
                  {info.details}
                </a>
              ) : (
                <p className="text-gray-400">{info.details}</p>
              )}
            </Card>
          ))}
        </div>
      </Section>

      {/* Contact Form Section */}
      <Section maxWidth="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-6 text-3xl font-bold">
              Send Us a Message
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Fill out the form and our team will get back to you within 24 hours. We're excited to learn about your
              business needs.
            </p>
            <p className="text-lg text-gray-300">
              Whether you need expert talent, consulting services, or custom software solutions, we're ready to help you
              achieve your goals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-gray-300 bg-gray-800/60 border border-gray-700 rounded-md p-3" role="note">
                Do not submit medical or sensitive information through this form.
              </p>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={isSubmitting && !formData.name.trim()}
                  className="w-full rounded-md border border-gray-600 bg-gray-800/80 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={isSubmitting && !formData.email.trim()}
                  className="w-full rounded-md border border-gray-600 bg-gray-800/80 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-gray-600 bg-gray-800/80 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={isSubmitting && !formData.message.trim()}
                  className="w-full rounded-md border border-gray-600 bg-gray-800/80 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/40 px-4 py-3 text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="text-sm font-medium">Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/40 px-4 py-3 text-red-400">
                  <p className="text-sm font-medium">
                    Failed to send message. Please try again or email us directly.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>

              {/* Cal trigger button */}
              <button
                type="button"
                data-cal-link="uplift-technologies/30min"
                data-cal-namespace="30min"
                data-cal-config='{"layout":"month_view"}'
                className="w-full mt-3 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md border border-gray-600 flex items-center justify-center"
              >
                View calendar
              </button>
            </form>
          </motion.div>
        </div>
      </Section>

      {/* Additional Info Section */}
      <Section
        title="Why Choose UPLIFT?"
        subtitle="We're more than just a service provider—we're your growth partner."
        centered
        className="bg-purple-900/10"
        maxWidth="max-w-3xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-lg text-gray-300 mb-6">
            With our global team operating 24/7, expert talent across various domains, and commitment to excellence, we
            ensure your business never misses a beat.
          </p>
          <p className="text-lg text-gray-300">
            Let's discuss how we can help you scale efficiently, reduce costs, and achieve sustainable growth through
            innovative solutions and dedicated support.
          </p>
        </motion.div>
      </Section>
    </div>
  );
};

export default ContactPage;
