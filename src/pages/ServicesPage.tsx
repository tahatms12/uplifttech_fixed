import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeDollarSign, PhoneCall, Users, TrendingUp, ArrowRight } from 'lucide-react';
import Section from '../components/ui/Section';
import { pods } from '../data/pods';
import { rolesById } from '../data/roles';

const iconMap: Record<string, JSX.Element> = {
  administration: <TrendingUp size={32} />,
  'clinical-coordination': <Users size={32} />,
  'front-office': <PhoneCall size={32} />,
  'revenue-cycle': <BadgeDollarSign size={32} />
};

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-rich-black text-white min-h-screen pt-32 pb-20">
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
