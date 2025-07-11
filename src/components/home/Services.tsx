import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, TrendingUp, BadgeDollarSign, Megaphone, PhoneCall, Palette, ArrowRight } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = memo(({ icon, title, description, link, linkText, delay }) => {
  return (
    <Card delay={delay}>
      <div className="text-electric-violet mb-4">{icon}</div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-white/70 mb-4">{description}</p>
      <Link 
        to={link} 
        className="inline-flex items-center text-electric-violet hover:underline group"
        aria-label={linkText}
      >
        {linkText}
        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    prevProps.link === nextProps.link &&
    prevProps.linkText === nextProps.linkText &&
    prevProps.delay === nextProps.delay
  );
});

ServiceCard.displayName = 'ServiceCard';

const services = [
  {
    icon: <PhoneCall size={32} />,
    title: "Virtual Reception",
    description: "24/7 professional customer service and virtual reception coverage for US, UK & Canadian businesses.",
    link: "/services/front-desk",
    linkText: "Explore Professional Reception Services"
  },
  {
    icon: <BadgeDollarSign size={32} />,
    title: "Collections Services",
    description: "Recover outstanding accounts receivable with our compliant collection strategies for healthcare and B2B sectors.",
    link: "/services/collections",
    linkText: "Learn About Debt Collection Services"
  },
  {
    icon: <Users size={32} />,
    title: "Sales Outsourcing",
    description: "Scale your revenue with dedicated sales teams trained in your products. Available 24/7 for US, UK & Canadian markets.",
    link: "/services/sales",
    linkText: "Explore Outsourced Sales Operations"
  },
  {
    icon: <Megaphone size={32} />,
    title: "Marketing Operations",
    description: "Drive growth with comprehensive marketing services, from content creation to campaign management in your target markets.",
    link: "/services/marketing",
    linkText: "View Strategic Marketing Services"
  },
  {
    icon: <Palette size={32} />,
    title: "Creative Services",
    description: "Expert brand development and creative direction tailored for North American and UK market presence.",
    link: "/creative-direction",
    linkText: "See Creative Direction & Design Services"
  },
  {
    icon: <TrendingUp size={32} />,
    title: "Logistics Management",
    description: "Optimize your supply chain with expert logistics coordination and management across North America and the UK.",
    link: "/services/logistics",
    linkText: "Discover Supply Chain & Logistics Solutions"
  }
];

const Services: React.FC = memo(() => {
  return (
    <Section
      title="Outsourcing Solutions"
      subtitle="Comprehensive business process outsourcing services tailored for US, UK & Canadian markets, combining expert talent with cutting-edge technology."
      centered
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
            link={service.link}
            linkText={service.linkText}
            delay={index}
          />
        ))}
      </div>
    </Section>
  );
});

Services.displayName = 'Services';

export default Services;