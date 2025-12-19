import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeDollarSign, PhoneCall, Users, FileText, ArrowRight } from 'lucide-react';
import Section from '../components/ui/Section';
import { pods } from '../data/pods';
import MetaTags from '../components/seo/MetaTags';

const iconMap: Record<string, JSX.Element> = {
  'clinical-coordination': <Users size={32} />,
  'front-office': <PhoneCall size={32} />,
  'revenue-cycle': <BadgeDollarSign size={32} />,
  'medical-scribes': <FileText size={32} />
};

const roleHighlights = [
  {
    title: 'Patient Coordinator',
    description:
      'Manages intake workflows, demographics capture, and scheduling communication so patient visits stay aligned to clinic protocols.'
  },
  {
    title: 'Client Success Specialist',
    description:
      'Verifies benefits, eligibility, and payer preferences while documenting findings in client systems for accurate cost guidance.'
  },
  {
    title: 'Clinical Nurse Coordinator',
    description:
      'Delivers outreach, education, and follow-up coordination with consistent documentation inside clinical tools.'
  },
  {
    title: 'Order Entry Specialist',
    description:
      'Captures medication orders, documentation, and benefits checks to keep authorizations moving on time.'
  },
  {
    title: 'Claims Specialist',
    description:
      'Tracks claims, resolves denials, and maintains payer follow-up notes in revenue cycle systems.'
  },
  {
    title: 'Insurance Support Specialist',
    description:
      'Answers billing questions, posts payments, and coordinates patient outreach for balances and payment plans.'
  },
  {
    title: 'Medical Scribe',
    description:
      'Documents visits in the EHR to keep charts structured and complete for providers.'
  }
];

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-rich-black text-white min-h-screen pt-32 pb-20">
      <MetaTags
        title="Medical support services"
        description="Explore Uplift Technologies front office support, clinical and care coordination support, revenue cycle support, and medical scribes."
      />
      <div className="container-custom px-4">
        <div className="max-w-4xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Medical support services built for healthcare</h1>
          <p className="text-lg text-white/75">
            Structured teams and specialized roles help you scale coverage without adding extra management layers. Explore four support areas designed to keep intake, clinical coordination, revenue cycle, and documentation moving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pods.map((pod, index) => (
            <motion.div
              key={pod.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-2xl border border-border-muted/60 bg-surface/70 p-6 shadow-card"
            >
              <div className="text-electric-violet mb-4">{iconMap[pod.slug]}</div>
              <h2 className="text-2xl font-semibold mb-2">{pod.title}</h2>
              <p className="text-white/75 mb-4">{pod.summary}</p>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white/80 mb-2">Roles in this support area</h3>
                <ul className="list-disc list-inside space-y-1 text-white/70">
                  {pod.roles.map((role) => (
                    <li key={role.title}>{role.title}</li>
                  ))}
                </ul>
              </div>

              <Link
                to={`/services/${pod.slug}`}
                className="inline-flex items-center text-electric-violet font-semibold"
              >
                View service details
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <Section
        title="Operational roles"
        subtitle="Specialized roles align to each support area with clear responsibilities and documentation expectations."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roleHighlights.map((role) => (
            <div
              key={role.title}
              className="flex h-full flex-col rounded-2xl border border-border-muted/60 bg-surface/70 p-5"
            >
              <h3 className="text-lg font-semibold text-white">{role.title}</h3>
              <p className="mt-2 text-sm text-white/70">{role.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Operating model"
        subtitle="Structured teams and specialized roles deliver consistent coverage across time zones."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Structured teams',
              description: 'Uplift operates with structured teams aligned to each client’s needs and workflows.'
            },
            {
              title: 'Specialized roles',
              description: 'Specialized roles are assigned to intake, coordination, revenue cycle, and documentation queues.'
            },
            {
              title: '24/7 coverage',
              description: 'Rotating shifts and global time-zone alignment keep coverage active around the clock.'
            },
            {
              title: 'Internal training groupings',
              description: '“Pods” are internal training groupings only, supporting onboarding and ongoing quality.'
            },
            {
              title: 'Client systems',
              description: 'Work is performed inside client EHR, RCM, and communication systems.'
            },
            {
              title: 'Documented delivery',
              description: 'Reporting cadences and escalation paths keep stakeholders aligned on outcomes.'
            }
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border-muted/60 bg-surface/60 p-6">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-white/70">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Technology and integrations"
        subtitle="We operate inside client systems while maintaining training and quality workflows."
      >
        <div className="rounded-2xl border border-border-muted/60 bg-surface/70 p-6 text-white/80">
          <ul className="list-disc list-inside space-y-2">
            <li>Work happens inside client systems: EHR, RCM, patient communication stack, and practice management tools.</li>
            <li>Uplift uses a proprietary learning management system for training and quality assurance.</li>
          </ul>
        </div>
      </Section>

      <Section
        title="Why structured teams"
        subtitle="Aligned specialists, clear ownership, and documented workflows for every engagement."
        centered
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Role clarity',
              description: 'Each support area is staffed with defined responsibilities and clear handoffs.'
            },
            {
              title: 'Workflow alignment',
              description: 'Teams operate inside your EHR, billing, and communication tools with documented steps.'
            },
            {
              title: 'Flexible coverage',
              description: 'Shift planning keeps coverage responsive as volumes and schedules change.'
            }
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border-muted/60 bg-surface/60 p-6"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-white/70">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default ServicesPage;
