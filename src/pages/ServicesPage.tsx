import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeDollarSign, PhoneCall, Users, TrendingUp, ArrowRight } from 'lucide-react';
import Section from '../components/ui/Section';
import { pods } from '../data/pods';
import { roles, rolesById } from '../data/roles';
import MetaTags from '../components/seo/MetaTags';

const iconMap: Record<string, JSX.Element> = {
  administration: <TrendingUp size={32} />,
  'clinical-coordination': <Users size={32} />,
  'front-office': <PhoneCall size={32} />,
  'revenue-cycle': <BadgeDollarSign size={32} />
};

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-rich-black text-white min-h-screen pt-32 pb-20">
      <MetaTags
        title="Healthcare service pods"
        description="Explore Uplift Technologies pods for medical benefits support, clinical coordination, intake, and revenue cycle." 
      />
      <div className="container-custom px-4">
        <div className="max-w-4xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Services Pods Built for Healthcare</h1>
          <p className="text-lg text-white/75">
            Each pod focuses on one specialty role so you know exactly who is doing the work. Explore how our teams cover medical benefits, clinical coordination, order entry, and claims without adding extra management layers.
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
                <h3 className="text-sm font-semibold text-white/80 mb-2">Roles in this pod</h3>
                <ul className="list-disc list-inside space-y-1 text-white/70">
                  {pod.roleIds.map((roleId) => (
                    <li key={roleId}>{rolesById[roleId]?.title}</li>
                  ))}
                </ul>
              </div>

              <Link
                to={`/services/${pod.slug}`}
                className="inline-flex items-center text-electric-violet font-semibold"
              >
                View pod details
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <Section
        title="Roles we staff"
        subtitle="Every role links to a dedicated pod and career profile so you can review responsibilities and workflows."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Link
              key={role.id}
              to={`/careers/${role.slug}`}
              className="group flex h-full flex-col justify-between rounded-2xl border border-border-muted/60 bg-surface/70 p-5 transition-colors hover:border-electric-violet"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted">{role.serviceLine}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{role.title}</h3>
                <p className="mt-2 text-sm text-white/70">{role.summary}</p>
              </div>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-electric-violet">
                View role
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        title="How pods integrate with your workflows"
        subtitle="Operational steps stay documented from onboarding through ongoing delivery."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Onboarding and credentialing',
              description:
                'We align start dates with your intake, background, and credentialing steps, sharing checklists and completion proofs before go-live.'
            },
            {
              title: 'Access provisioning',
              description:
                'Access requests follow minimum necessary permissions with approvals logged and renewals tracked to keep systems tidy.'
            },
            {
              title: 'Workflow alignment',
              description:
                'Pod leads map daily routines to your EHR, billing, and communication tools with measurable SLAs tied to your queues.'
            },
            {
              title: 'QA and audits',
              description:
                'Quality checks sample work weekly with documented findings, remediation steps, and shared updates during reviews.'
            },
            {
              title: 'Reporting cadence',
              description:
                'Scorecards and backlog metrics are sent on an agreed cadence covering throughput, accuracy, and blockers.'
            },
            {
              title: 'Escalation paths',
              description:
                'Named contacts handle incident routing with clear timelines for acknowledgement, mitigation, and client communication.'
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
        title="Why Pods"
        subtitle="Aligned specialists, clear ownership, and documented workflows for every engagement."
        centered
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Single-role focus',
              description: 'Each pod is anchored by one healthcare role with responsibilities documented up front.'
            },
            {
              title: 'Healthcare ready',
              description: 'All roles operate within payer, EMR, or billing tools and follow clinical documentation standards.'
            },
            {
              title: 'Transparent pricing',
              description: 'Hourly ranges stay consistent across pods so you can model coverage by hours and weeks.'
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
