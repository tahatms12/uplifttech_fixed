import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Users, BadgeDollarSign, PhoneCall, FileText, ArrowRight } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';

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
    title: "Front Office Support",
    description: "We handle patient intake, demographics and insurance capture, benefits eligibility investigations, cost estimates and order entry so your staff can focus on care.",
    link: "/services/front-office",
    linkText: "View Front Office Support"
  },
  {
    icon: <Users size={32} />,
    title: "Clinical and Care Coordination Support",
    description: "Our nurses and scribes manage medication welcome calls, follow-ups, adverse-event documentation and charting to keep clinical workflows moving.",
    link: "/services/clinical-coordination",
    linkText: "View Clinical and Care Coordination Support"
  },
  {
    icon: <BadgeDollarSign size={32} />,
    title: "Revenue Cycle Support",
    description: "From claims follow-up and denial resolution to payment posting and patient billing, we keep your revenue cycle healthy and transparent.",
    link: "/services/revenue-cycle",
    linkText: "View Revenue Cycle Support"
  },
  {
    icon: <FileText size={32} />,
    title: "Medical Scribes",
    description: "Accurate, structured clinical notes created directly in your EHR by trained scribes support providers during and after visits.",
    link: "/services/medical-scribes",
    linkText: "View Medical Scribes"
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

      <div className="mt-10 rounded-2xl border border-border-muted/60 bg-surface/60 p-6 text-white/80">
        <p className="text-base sm:text-lg">
          Uplift operates with structured teams and specialized roles so coverage stays consistent across time zones. We provide 24/7 coverage while working inside client EHR, RCM, and communication systems to keep workflows moving.
        </p>
        <div className="mt-6">
          <Button to="/services" size="lg" analyticsLabel="home_services_view">
            Explore services
          </Button>
        </div>
      </div>
    </Section>
  );
});

Services.displayName = 'Services';

export default Services;
