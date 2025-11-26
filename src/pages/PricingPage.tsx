import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Disclosure } from '@headlessui/react';
import { ChevronDown, ShoppingCart, X, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import ClientLogos from '../components/trust/ClientLogos';
import TrustBadges from '../components/trust/TrustBadges';

interface PricingTier {
  level: 'Intermediate' | 'Professional';
  range: string;
}

interface PricingRow {
  category: string;
  tiers: PricingTier[];
}

interface CartItem {
  id: string;
  category: string;
  hoursPerWeek: number;
  weeks: number;
  cost: number;
  isSinglePrice: boolean;
  minCost?: number;
  maxCost?: number;
}

const pricingData: PricingRow[] = [
  {
    category: 'Virtual Assistants',
    tiers: [
      { level: 'Intermediate', range: '$9/hour' },
      { level: 'Professional', range: '$12/hour' }
    ]
  },
  // {
  //   category: 'Sales Reps',
  //   tiers: [
  //     { level: 'Intermediate', range: '$9/hour' },
  //     { level: 'Professional', range: '$12/hour' }
  //   ]
  // },
  {
    category: 'Marketing',
    tiers: [
      { level: 'Intermediate', range: '$9/hour' },
      { level: 'Professional', range: '$12/hour' }
    ]
  },
  {
    category: 'Collections',
    tiers: [
      { level: 'Intermediate', range: '$9/hour' },
      { level: 'Professional', range: '$12/hour' }
    ]
  },
  {
    category: 'Admin',
    tiers: [
      { level: 'Intermediate', range: '$9/hour' },
      { level: 'Professional', range: '$12/hour' }
    ]
  },
  {
    category: 'Patient Coordinator',
    tiers: [
        { level: 'Intermediate', range: '-'},
        { level: 'Professional', range: '$10/hour'}
    ]
  },
  {
    category: 'Client Success Specialist',
    tiers: [
        { level: 'Intermediate', range: '-'},
        { level: 'Professional', range: '$10/hour'}
    ]
  },
  {
    category: 'Clinical Nurse Coordinator',
    tiers: [
        { level: 'Intermediate', range: '-'},
        { level: 'Professional', range: '$12/hour'}
    ]
  },
  {
    category: 'Order Entry Specialist',
    tiers: [
        { level: 'Intermediate', range: '-'},
        { level: 'Professional', range: '$12/hour'}
    ]
  },
  {
    category: 'Claims Specialist',
    tiers: [
        { level: 'Intermediate', range: '-'},
        { level: 'Professional', range: '$10/hour'}
    ]
  },
  {
    category: 'Insurance Support Specialist',
    tiers: [
        { level: 'Intermediate', range: '-'},
        { level: 'Professional', range: '$10/hour'}
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
      'Yes. You may scale down to a smaller pod or cancel with a seven day notice. Our team will support knowledge transfer for a smooth transition.'
  },
  {
    question: 'How your future team is selected?',
    answer:
      'Every specialist passes language, compliance, and scenario-based assessments. Only 3% of applicants become part of our remote bench.'
  }
];

const PricingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(pricingData[0]);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [weeks, setWeeks] = useState(4);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const estimatedRange = useMemo(() => {
    // Get valid prices (not '-')
    const validTiers = selectedCategory.tiers.filter(tier => tier.range !== '-');
    
    if (validTiers.length === 0) {
      return { minTotal: 0, maxTotal: 0, isSinglePrice: false };
    }
    
    // Extract prices
    const prices = validTiers.map(tier => {
      const priceStr = tier.range.replace(/\$/g, '').replace('/hour', '').trim();
      return Number(priceStr);
    });
    
    // If only one price is available
    if (prices.length === 1) {
      const total = prices[0] * hoursPerWeek * weeks;
      return { minTotal: total, maxTotal: total, isSinglePrice: true };
    }
    
    // If two prices are available, create a range
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minTotal = minPrice * hoursPerWeek * weeks;
    const maxTotal = maxPrice * hoursPerWeek * weeks;
    
    return { minTotal, maxTotal, isSinglePrice: false };
  }, [selectedCategory, hoursPerWeek, weeks]);

  const addToCart = () => {
    const newItem: CartItem = {
      id: Date.now().toString(),
      category: selectedCategory.category,
      hoursPerWeek,
      weeks,
      cost: estimatedRange.isSinglePrice ? estimatedRange.minTotal : 0,
      isSinglePrice: estimatedRange.isSinglePrice,
      minCost: estimatedRange.isSinglePrice ? undefined : estimatedRange.minTotal,
      maxCost: estimatedRange.isSinglePrice ? undefined : estimatedRange.maxTotal,
    };
    setCart([...cart, newItem]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      if (item.isSinglePrice) {
        return total + item.cost;
      }
      return total;
    }, 0);
  }, [cart]);

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
              <Button to="/book" size="lg" analyticsLabel="pricing_schedule_call">
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
                  className="w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-2 text-sm text-white focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40 [&>option]:bg-zinc-900 [&>option]:text-white"
                  style={{
                    colorScheme: 'dark'
                  }}
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
                style={{ colorScheme: 'dark' }}
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
                style={{ colorScheme: 'dark' }}
              />

              <div className="rounded-xl border border-electric-violet/40 bg-electric-violet/10 p-4">
                <p className="text-sm text-text-muted">Estimated investment</p>
                <p className="mt-2 text-2xl font-semibold text-electric-violet">
                  {estimatedRange.isSinglePrice ? (
                    `${estimatedRange.minTotal.toLocaleString()} USD`
                  ) : (
                    `${estimatedRange.minTotal.toLocaleString()} - ${estimatedRange.maxTotal.toLocaleString()} USD`
                  )}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={addToCart}
                  className="flex-1 rounded-lg bg-electric-violet px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-electric-violet/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet focus-visible:ring-offset-2 focus-visible:ring-offset-rich-black"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  disabled={cart.length === 0}
                  className="flex items-center gap-2 rounded-lg border border-border-muted/60 bg-surface-alt/80 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-alt/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet focus-visible:ring-offset-2 focus-visible:ring-offset-rich-black"
                >
                  <ShoppingCart className="h-4 w-4" />
                  View Cart {cart.length > 0 && `(${cart.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientLogos />

        <TrustBadges />

      <section className="container-custom py-16" aria-labelledby="pricing-table-heading">
        <h2 id="pricing-table-heading" className="text-3xl font-semibold text-white">Hourly ranges by role</h2>
        <p className="mt-2 text-text-muted">
          Transparent ranges help you model your ROI. We recommend Intermediate tier for most teams to balance speed, expertise, and coverage.
        </p>

        <div className="mt-8 hidden overflow-hidden rounded-3xl border border-border-muted/60 bg-surface/80 shadow-card lg:block">
          <table className="min-w-full divide-y divide-border-muted/60">
            <caption className="sr-only">Pricing table for outsourcing roles</caption>
            <thead className="bg-surface-alt/80 text-left text-sm uppercase tracking-widest text-text-muted">
              <tr>
                <th scope="col" className="px-6 py-4">Category</th>
                {['Intermediate', 'Professional'].map((tier) => (
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

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl border border-border-muted/60 bg-surface shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-muted/60 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">Your Cart</h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-alt hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="h-16 w-16 text-text-muted/40" />
                  <p className="mt-4 text-lg text-text-muted">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 rounded-xl border border-border-muted/60 bg-surface-alt/80 p-4"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{item.category}</h4>
                        <p className="mt-1 text-sm text-text-muted">
                          {item.hoursPerWeek} hours/week × {item.weeks} weeks
                        </p>
                        <p className="mt-2 text-lg font-semibold text-electric-violet">
                          {item.isSinglePrice ? (
                            `${item.cost.toLocaleString()} USD`
                          ) : (
                            `${item.minCost?.toLocaleString()} - ${item.maxCost?.toLocaleString()} USD`
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-border-muted/60 px-6 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">Total Items:</span>
                  <span className="text-lg text-text-muted">{cart.length}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    Empty Cart
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="flex-1 rounded-lg bg-electric-violet px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-electric-violet/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default PricingPage;
