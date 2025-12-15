import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, BadgeDollarSign, PhoneCall, ArrowRight } from 'lucide-react';
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
    icon: <TrendingUp size={32} />,
    title: "Medical Benefits Pod",
    description: "Benefit investigations, payer preference checks, financial assistance enrollments, and cost estimates ahead of appointments.",
    link: "/services/administration",
    linkText: "View Medical Benefits Pod"
  },
  {
    icon: <Users size={32} />,
    title: "Clinical Coordination Pod",
    description: "Clinical Nurse Coordinators manage medication welcome calls, follow-up coordination, and schedule governance.",
    link: "/services/clinical-coordination",
    linkText: "View Clinical Coordination"
  },
  {
    icon: <PhoneCall size={32} />,
    title: "Intake and Order Entry Pod",
    description: "Order entry support covering demographics, insurance capture, documentation uploads, and benefits checks per new order.",
    link: "/services/front-office",
    linkText: "View Intake & Order Entry"
  },
  {
    icon: <BadgeDollarSign size={32} />,
    title: "Claims and AR Pod",
    description: "Claims tracking, denial resolution, payment posting, and patient billing support with clear documentation.",
    link: "/services/revenue-cycle",
    linkText: "View Claims & AR"
  }
];

const Services: React.FC = memo(() => {
  return (
    <Section
      title="Independent Practice Solutions"
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
