import React from 'react';

type Logo = {
  name: string;
  abbreviation: string;
};

const logos: Logo[] = [
  { name: 'NorthStar Health', abbreviation: 'NH' },
  { name: 'Atlas Finance Group', abbreviation: 'AFG' },
  { name: 'Brightline Logistics', abbreviation: 'BL' },
  { name: 'Harbor & Co. Legal', abbreviation: 'HC' },
  { name: 'Lumen Retail Collective', abbreviation: 'LRC' },
  { name: 'Crescent Energy', abbreviation: 'CE' }
];

const ClientLogos: React.FC = () => {
  return (
    <section aria-label="Client logos" className="border-y border-border-muted/60 bg-surface/70 py-8 sm:py-10">
      <div className="container-custom">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-text-muted">Trusted by customer-obsessed brands</p>
        <ul className="mt-6 grid grid-cols-2 gap-4 text-sm text-text-muted sm:grid-cols-3 md:grid-cols-6">
          {logos.map((logo) => (
            <li
              key={logo.name}
              className="flex items-center justify-center rounded-lg border border-border-muted/60 bg-surface-alt/80 px-4 py-3 text-center font-medium"
            >
              <span className="sr-only">{logo.name}</span>
              <span aria-hidden="true" className="text-lg font-semibold tracking-wide text-white">
                {logo.abbreviation}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ClientLogos;
