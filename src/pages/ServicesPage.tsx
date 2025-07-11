import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, TrendingUp, BadgeDollarSign, Megaphone, PhoneCall, ArrowRight, CheckCircle } from 'lucide-react';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface ServiceProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  imageSrc: string;
  path: string;
  delay: number;
}

const ServiceCard: React.FC<ServiceProps> = ({
  icon,
  title,
  description,
  features,
  imageSrc,
  path,
  delay
}) => {
  return (
    <Card delay={delay} className="flex flex-col h-full">
      <div className="flex items-start gap-4 mb-6">
        <div className="text-electric-violet p-3 bg-electric-violet/10 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-white/70">{description}</p>
        </div>
      </div>
      
      <div className="relative h-48 w-full rounded-lg overflow-hidden my-4">
        <img 
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle size={18} className="text-electric-violet mt-1 mr-2 flex-shrink-0" />
            <span className="text-white/80">{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-auto">
        <Link 
          to={path}
          className="inline-flex items-center text-electric-violet font-medium hover:underline group"
        >
          Learn More
          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Card>
  );
};

const ServicesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Services | UPLIFT Technologies';
  }, []);
  
  const services = [
    {
      icon: <Users size={28} />,
      title: "Sales",
      description: "Drive revenue growth with our specialized sales teams trained in your products and services.",
      features: [
        "Outbound and inbound sales specialists",
        "Pipeline management and opportunity tracking",
        "CRM management and reporting",
        "Sales process optimization"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrOwsfWsPtf5tLxrJBKGIUXpzSWP3AO9Qwhg1N",
  path: "/contact"
    },
    {
      icon: <TrendingUp size={28} />,
      title: "Logistics",
      description: "Streamline operations with end-to-end logistics and supply chain management solutions.",
      features: [
        "Order processing and tracking",
        "Inventory management",
        "Shipping and distribution coordination",
        "Supply chain optimization"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhr7Adl4MJoqhwKnVTQZaEAGCsP4eUcDWl2dOm1",
      path: "/services/logistics"
    },
    {
      icon: <BadgeDollarSign size={28} />,
      title: "Collections",
      description: "Recover outstanding accounts receivable with our compliant, respectful approach.",
      features: [
        "AR recovery strategies",
        "Payment plan coordination",
        "HIPAA/GDPR compliant processes",
        "Detailed reporting and analytics"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrkd1LlTf7QUG3gos5DHvRIOeTxSVCiYqEJwZA",
      path: "/services/collections"
    },
    {
      icon: <Megaphone size={28} />,
      title: "Marketing",
      description: "Amplify your brand with full-service marketing operations and campaign management.",
      features: [
        "Content creation and management",
        "Digital advertising campaigns",
        "Social media management",
        "Performance tracking and optimization"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhriqLUaVAGx5GHot7PpSj1Nqiscbey38YkwXh2",
      path: "/services/marketing"
    },
    {
      icon: <PhoneCall size={28} />,
      title: "Front Desk",
      description: "Provide exceptional customer service with virtual receptionists available 24/7.",
      features: [
        "Appointment scheduling and management",
        "Customer inquiries and support",
        "Call routing and message taking",
        "Virtual office administration"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrffylYS3u4vE1XnCFZWHLb5YdoJeqV2ijy6fI",
      path: "/services/front-desk"
    }
  ];

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
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-white/80">
              Comprehensive outsourcing solutions designed to optimize your operations, reduce costs, and drive growth across your organization.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Services Overview */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
              imageSrc={service.imageSrc}
              path={service.path}
              delay={index}
            />
          ))}
        </div>
      </Section>
      
      {/* Why Choose Us */}
      <Section
        title="Why Choose UPLIFT"
        subtitle="We deliver more than just services — we provide comprehensive solutions that transform how your business operates."
        centered
        className="bg-deep-purple/5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <ul className="space-y-6">
              {[
                {
                  title: "Expert Talent Pool",
                  description: "Access specialized professionals without the overhead of full-time hires."
                },
                {
                  title: "Management Consulting",
                  description: "Implementation of industry best practices through proven methodologies."
                },
                {
                  title: "Technology Integration",
                  description: "Cutting-edge software and automation solutions to maximize efficiency."
                },
                {
                  title: "Scalable Solutions",
                  description: "Flexible services that grow with your business needs and budget."
                },
                {
                  title: "24/7 Global Operations",
                  description: "Around-the-clock coverage ensuring your business never sleeps."
                }
              ].map((item, index) => (
                <li key={index} className="glass-card p-5">
                  <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-white/70">{item.description}</p>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <div className="relative">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="UPLIFT team in action" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-rich-black p-6 rounded-xl border border-neutral-800 max-w-xs">
                <h3 className="text-xl mb-2 text-electric-violet font-medium">Industry Compliant</h3>
                <p className="text-white/80">All our services are HIPAA, GDPR, and PIPEDA compliant, ensuring your data remains secure and protected.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
      
      {/* CTA Section */}
      <Section>
        <motion.div 
          className="bg-gradient-to-r from-deep-purple/30 to-rich-black border border-neutral-800 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-poppins font-semibold mb-4">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Schedule a consultation to discuss your specific needs and discover how our services can help your business thrive.
          </p>
          <Button to="/contact" size="lg">
            Book a Meeting
          </Button>
        </motion.div>
      </Section>
    </>
  );
};

export default ServicesPage;