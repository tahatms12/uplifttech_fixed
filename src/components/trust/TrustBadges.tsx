import React from 'react';
import { ShieldCheck, BadgeCheck, Clock } from 'lucide-react';

const badges = [
  {
    icon: ShieldCheck,
    title: 'GDPR & HIPAA ready',
    description: 'Processes reviewed quarterly for compliance and data privacy.'
  },
  {
    icon: BadgeCheck,
    title: 'Satisfaction Guaranteed',
    description: '2-week satisfaction guarantee with flexible scaling.'
  },
  {
    icon: Clock,
    title: '24/7 Coverage',
    description: 'Follow-the-sun support with 99.9% uptime SLA.'
  }
];

const TrustBadges: React.FC = () => {
  return (
    <section className="bg-surface/60 py-12">
      <div className="container-custom">
        <div className="grid gap-6 md:grid-cols-3" role="list">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <article
                key={badge.title}
                role="listitem"
                className="flex h-full flex-col gap-3 rounded-2xl border border-border-muted/60 bg-surface-alt/80 p-6 shadow-card"
              >
                <Icon className="h-8 w-8 text-electric-violet" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-white">{badge.title}</h3>
                <p className="text-sm text-text-muted">{badge.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
