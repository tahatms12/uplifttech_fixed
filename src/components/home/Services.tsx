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
    title: "Front Office Reception",
    description: "24/7 professional customer service and virtual reception coverage for US & Canadian businesses.",
    link: "/services/front-Office",
    linkText: "Explore Professional Reception Services"
  },
  {
    icon: <BadgeDollarSign size={32} />,
    title: "AR Collections Services",
    description: "Recover outstanding accounts receivable with our compliant collection strategies for healthcare and B2B sectors.",
    link: "/services/Revenue-cycle",
    linkText: "Learn About Debt Collection Services"
  },
  {
    icon: <Palette size={32} />,
    title: "Marketing And Creative Operations",
    description: "Drive growth with comprehensive marketing services, from content creation to campaign management in your target markets.",
    link: "/creative-direction",
    linkText: "View Strategic Marketing Services"
  },
  {
    icon: <Megaphone size={32} />,
    title: "Recall Services",
    description: "Expert outbound customer development and bookings tailored for healthcare presence.",
    link: "/services/front-office",
    linkText: "See How Our Front Office Can Help You"
  },
  {
    icon: <TrendingUp size={32} />,
    title: "Office Quality Management",
    description: "Optimize your Clinic's efficiency with meaningful coordination and management.",
    link: "/services/administration",
    linkText: "Discover Supply Chain & Logistics Solutions"
  }
];

const Services: React.FC = memo(() => {
  return (
    <Section
      title="Clinical and Independent Practice Solutions"
      subtitle="Comprehensive healthcare support services tailored for HIPAA and PIPEDA compliant markets, combining expert talent with cutting-edge technology."
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
