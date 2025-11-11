import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import ClientLogos from '../components/trust/ClientLogos';
import TrustBadges from '../components/trust/TrustBadges';

interface PricingTier {
  level: 'Entry' | 'Mid' | 'Pro';
  range: string;
}

interface PricingRow {
  category: string;
  tiers: PricingTier[];
}

const pricingData: PricingRow[] = [
  {
    category: 'Virtual Assistants',
    tiers: [
      { level: 'Entry', range: '$18-$22/hour' },
      { level: 'Mid', range: '$23-$28/hour' },
      { level: 'Pro', range: '$29-$36/hour' }
    ]
  },
  {
    category: 'Sales Reps',
    tiers: [
      { level: 'Entry', range: '$22-$28/hour' },
      { level: 'Mid', range: '$29-$36/hour' },
      { level: 'Pro', range: '$37-$46/hour' }
    ]
  },
  {
    category: 'Marketing',
    tiers: [
      { level: 'Entry', range: '$24-$30/hour' },
      { level: 'Mid', range: '$31-$38/hour' },
      { level: 'Pro', range: '$39-$52/hour' }
    ]
  },
  {
    category: 'Collections',
    tiers: [
      { level: 'Entry', range: '$23-$29/hour' },
      { level: 'Mid', range: '$30-$38/hour' },
      { level: 'Pro', range: '$39-$48/hour' }
    ]
  },
  {
    category: 'Admin',
    tiers: [
      { level: 'Entry', range: '$18-$22/hour' },
      { level: 'Mid', range: '$23-$28/hour' },
      { level: 'Pro', range: '$29-$34/hour' }
    ]
  }
];

const faqs = [
  {
    question: 'How do billing cycles work?',
    answer:
      'We invoice bi-weekly in USD with clear breakdowns by role, hours, and outcomes. You can pause or adjust allocations at any time before the next cycle.'
  },
  {
    question: 'What is included in the satisfaction guarantee?',
    answer:
      'If the match is not perfect within the first two weeks, we will replace the talent or credit your invoice. No setup fees, no hidden charges.'
  },
  {
    question: 'Can we scale down or cancel?',
    answer:
      'Yes. You may scale down to a smaller pod or cancel with seven days’ notice. Our team will support knowledge transfer for a smooth transition.'
  },
  {
    question: 'How do you vet staff?',
    answer:
      'Every specialist passes language, compliance, and scenario-based assessments. Only 4% of applicants become part of UPLIFT’s remote bench.'
  }
];

const PricingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(pricingData[0]);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [weeks, setWeeks] = useState(4);

  const estimatedRange = useMemo(() => {
    const tier = selectedCategory.tiers[1];
    const [min, max] = tier.range
      .replace(/\$/g, '')
      .replace(/\s/g, '')
      .split('-')
      .map((value) => Number(value.replace('/hour', '')));
    const minTotal = min * hoursPerWeek * weeks;
    const maxTotal = max * hoursPerWeek * weeks;
    return { minTotal, maxTotal };
  }, [selectedCategory, hoursPerWeek, weeks]);

  return (
    <main className="bg-rich-black pb-20 text-white">
      <Helmet>
        <title>Transparent Outsourcing Pricing | UPLIFT Technologies</title>
        <meta
          name="description"
          content="Clear hourly pricing for virtual assistants, sales reps, marketing experts, collections specialists, and admin support. No setup fees and a 2-week satisfaction guarantee."
        />
      </Helmet>

      <section className="bg-[linear-gradient(160deg,_rgba(155,29,255,0.35),_transparent)] pt-32 pb-20">
        <div className="container-custom grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold text-white">Pricing that scales with your goals</h1>
            <p className="mt-4 text-lg text-text-muted">
              Build the exact team you need with hourly specialists across sales, marketing, collections, and admin. No setup fees.
              Cancel anytime. 2-week satisfaction guarantee.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button to="/contact" size="lg" analyticsLabel="pricing_schedule_call">
                Ready to start? Schedule a call
              </Button>
              <p className="text-sm text-text-muted">Average onboarding time: 3 business days</p>
            </div>
          </div>
          <div className="rounded-3xl border border-border-muted/60 bg-surface/85 p-6 shadow-card">
            <h2 className="text-lg font-semibold text-white">Estimate your investment</h2>
            <p className="mt-2 text-sm text-text-muted">
              Choose a role category and the coverage you need. We will share a custom proposal on your discovery call.
            </p>
            <div className="mt-6 space-y-5">
              <label className="block text-sm font-medium text-text-muted" htmlFor="category">
                Role needed
              </label>
              <select
                id="category"
                className="w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-2 text-sm text-white focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
                value={selectedCategory.category}
                onChange={(event) => {
                  const category = pricingData.find((row) => row.category === event.target.value);
                  if (category) {
                    setSelectedCategory(category);
                  }
                }}
              >
                {pricingData.map((row) => (
                  <option key={row.category} value={row.category}>
                    {row.category}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium text-text-muted" htmlFor="hours">
                Hours per week
              </label>
              <input
                id="hours"
                type="number"
                min={10}
                max={60}
                value={hoursPerWeek}
                onChange={(event) => setHoursPerWeek(Number(event.target.value))}
                className="w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-2 text-sm text-white focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
              />

              <label className="block text-sm font-medium text-text-muted" htmlFor="weeks">
                Weeks of support
              </label>
              <input
                id="weeks"
                type="number"
                min={1}
                max={12}
                value={weeks}
                onChange={(event) => setWeeks(Number(event.target.value))}
                className="w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-2 text-sm text-white focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
              />

              <div className="rounded-xl border border-electric-violet/40 bg-electric-violet/10 p-4">
                <p className="text-sm text-text-muted">Estimated investment</p>
                <p className="mt-2 text-2xl font-semibold text-electric-violet">
                  ${estimatedRange.minTotal.toLocaleString()} - ${estimatedRange.maxTotal.toLocaleString()} USD
                </p>
                <p className="mt-2 text-xs text-text-muted">
                  Based on {selectedCategory.category} ({selectedCategory.tiers[1].level} level). Final rates confirmed on your call.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientLogos />

      <section className="container-custom py-16" aria-labelledby="pricing-table-heading">
        <h2 id="pricing-table-heading" className="text-3xl font-semibold text-white">Hourly ranges by role</h2>
        <p className="mt-2 text-text-muted">
          Transparent ranges help you model your ROI. We recommend Mid tier for most teams to balance speed, expertise, and coverage.
        </p>

        <div className="mt-8 hidden overflow-hidden rounded-3xl border border-border-muted/60 bg-surface/80 shadow-card lg:block">
          <table className="min-w-full divide-y divide-border-muted/60">
            <caption className="sr-only">Pricing table for outsourcing roles</caption>
            <thead className="bg-surface-alt/80 text-left text-sm uppercase tracking-widest text-text-muted">
              <tr>
                <th scope="col" className="px-6 py-4">Category</th>
                {['Entry', 'Mid', 'Pro'].map((tier) => (
                  <th scope="col" key={tier} className="px-6 py-4">
                    {tier}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted/60 text-sm">
              {pricingData.map((row) => (
                <tr key={row.category}>
                  <th scope="row" className="whitespace-nowrap px-6 py-5 text-left text-base font-semibold text-white">
                    {row.category}
                  </th>
                  {row.tiers.map((tier) => (
                    <td key={`${row.category}-${tier.level}`} className="px-6 py-5 text-text-muted">
                      <span className="font-semibold text-white">{tier.level}</span>
                      <p className="text-sm text-text-muted">{tier.range}</p>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-4 lg:hidden" aria-label="Pricing tiers">
          {pricingData.map((row) => (
            <article key={row.category} className="rounded-2xl border border-border-muted/60 bg-surface-alt/80 p-5">
              <h3 className="text-lg font-semibold text-white">{row.category}</h3>
              <dl className="mt-4 space-y-3">
                {row.tiers.map((tier) => (
                  <div key={`${row.category}-${tier.level}`} className="flex items-baseline justify-between">
                    <dt className="text-sm text-text-muted">{tier.level}</dt>
                    <dd className="text-base font-semibold text-white">{tier.range}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <TrustBadges />

      <section className="container-custom py-16" aria-labelledby="pricing-faq-heading">
        <div className="max-w-3xl">
          <h2 id="pricing-faq-heading" className="text-3xl font-semibold text-white">Pricing FAQs</h2>
          <p className="mt-2 text-text-muted">Answers to the most common questions about billing, coverage, and satisfaction.</p>
        </div>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <Disclosure key={faq.question}>
              {({ open }) => (
                <div className="overflow-hidden rounded-2xl border border-border-muted/60 bg-surface-alt/80">
                  <Disclosure.Button className="flex w-full items-center justify-between px-5 py-4 text-left text-base font-medium text-white">
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${open ? 'rotate-180 text-electric-violet' : 'text-text-muted'}`}
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="border-t border-border-muted/60 px-5 py-4 text-sm text-text-muted">
                    {faq.answer}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </section>

      <section className="bg-surface/70 py-16">
        <div className="container-custom flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-semibold text-white">Ready to start? Schedule a call</h2>
          <p className="max-w-2xl text-text-muted">
            Tell us your targets and we will share a tailored roadmap, vetted talent shortlist, and onboarding plan within 72 hours.
          </p>
          <Button to="/contact" size="lg" analyticsLabel="pricing_footer_schedule">
            Schedule discovery call
          </Button>
        </div>
      </section>
    </main>
  );
};

export default PricingPage;
