import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';

const ContactPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Contact Us | UPLIFT Technologies';
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Mail size={32} />,
      title: 'Email',
      details: 'hello@uplift-tech.com',
      link: 'mailto:hello@uplift-tech.com'
    },
    {
      icon: <Phone size={32} />,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <MapPin size={32} />,
      title: 'Location',
      details: 'Global Operations',
      link: null
    },
    {
      icon: <Clock size={32} />,
      title: 'Availability',
      details: '24/7 Support',
      link: null
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="pt-32 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48LYcCDZiUMZzX7lfxvW3hEk5JKuRtbm1dNVHP')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4
          }}
        />
        
        <div className="container-custom relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl md:max-w-2xl lg:max-w-3xl"
          >
            <h1 className="font-poppins font-semibold mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl">
              Get in <span className="gradient-text block sm:inline">Touch</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80">
              Ready to transform your operations? Let's start a conversation about how UPLIFT can help your business thrive.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <Section
        title="Contact Information"
        subtitle="Multiple ways to reach our team. We're here to help 24/7."
        centered
        className="bg-deep-purple/5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <Card key={info.title} delay={index}>
              <div className="text-electric-violet mb-4">{info.icon}</div>
              <h3 className="text-xl font-medium mb-3">{info.title}</h3>
              {info.link ? (
                <a 
                  href={info.link}
                  className="text-white/70 hover:text-electric-violet transition-colors"
                >
                  {info.details}
                </a>
              ) : (
                <p className="text-white/70">{info.details}</p>
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
            <h2 className="gradient-text mb-6">Send Us a Message</h2>
            <p className="text-lg text-white/80 mb-6">
              Fill out the form and our team will get back to you within 24 hours. We're excited to learn about your business needs.
            </p>
            <p className="text-lg text-white/80">
              Whether you need expert talent, consulting services, or custom software solutions, we're ready to help you achieve your goals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-white/20 bg-surface-alt/80 px-4 py-3 text-sm text-white focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-white/20 bg-surface-alt/80 px-4 py-3 text-sm text-white focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-white/80 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full rounded-md border border-white/20 bg-surface-alt/80 px-4 py-3 text-sm text-white focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-md border border-white/20 bg-surface-alt/80 px-4 py-3 text-sm text-white focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40 resize-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-electric-violet hover:bg-electric-violet/90 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
              >
                Send Message
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
        className="bg-deep-purple/5"
        maxWidth="max-w-3xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-lg text-white/80 mb-6">
            With our global team operating 24/7, expert talent across various domains, and commitment to excellence, we ensure your business never misses a beat.
          </p>
          <p className="text-lg text-white/80">
            Let's discuss how we can help you scale efficiently, reduce costs, and achieve sustainable growth through innovative solutions and dedicated support.
          </p>
        </motion.div>
      </Section>
    </>
  );
};

export default ContactPage;