import React from 'react';
import { ShieldCheck, BadgeCheck, Clock } from 'lucide-react';

const badges = [
  {
    icon: ShieldCheck,
    title: 'Security and privacy controls',
    description: (
      <span>
        Documented access reviews and minimum necessary permissions. Read our{' '}
        <a
          href="/compliance-security"
          className="font-semibold text-electric-violet underline decoration-electric-violet/50 decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          compliance overview
        </a>
        .
      </span>
    )
  },
  {
    icon: BadgeCheck,
    title: 'Documented workflows',
    description: 'Playbooks, QA steps, and reporting cadences are aligned before launch and refreshed with client input.'
  },
  {
    icon: Clock,
    title: '24/7 Coverage',
    description: 'Follow-the-sun support available with shift coverage planned against your critical queues.'
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
