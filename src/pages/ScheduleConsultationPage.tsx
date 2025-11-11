import React from 'react';
import { Helmet } from 'react-helmet';
import { CalendarDays } from 'lucide-react';
import LeadFormWizard from '../components/forms/LeadFormWizard';

const ScheduleConsultationPage: React.FC = () => {
  return (
    <main className="bg-rich-black text-white">
      <Helmet>
        <title>Schedule a Discovery Call | UPLIFT Technologies</title>
        <meta
          name="description"
          content="Book a 15-minute discovery call with UPLIFT Technologies. Share your outsourcing needs and receive vetted candidates within three days."
        />
      </Helmet>

      <section className="bg-[radial-gradient(circle_at_top,_rgba(155,29,255,0.35),_transparent_60%)] pt-32 pb-16">
        <div className="container-custom grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-electric-violet/50 bg-electric-violet/10 px-4 py-2 text-sm text-electric-violet">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              15-minute consult, zero pressure
            </p>
            <h1 className="mt-6 text-4xl font-semibold text-white">Let’s build your remote team</h1>
            <p className="mt-4 text-lg text-text-muted">
              Answer a few quick questions, choose a time that works for you, and our specialists will share vetted candidates within three business days.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-text-muted">
              <li>• Inline validation keeps your details accurate.</li>
              <li>• We auto-detect your timezone so nothing gets lost in translation.</li>
              <li>• Satisfaction guaranteed — cancel anytime.</li>
            </ul>
          </div>
          <LeadFormWizard />
        </div>
      </section>

      <section className="container-custom pb-20">
        <div className="rounded-3xl border border-border-muted/60 bg-surface/80 p-8 text-sm text-text-muted shadow-card">
          <h2 className="text-lg font-semibold text-white">Need help sooner?</h2>
          <p className="mt-3">
            Email <a className="text-electric-violet hover:underline" href="mailto:hello@uplift-tech.com">hello@uplift-tech.com</a> or call <a className="text-electric-violet hover:underline" href="tel:+14165551234">+1 (416) 555-1234</a>. Our team replies within four business hours.
          </p>
        </div>
      </section>
    </main>
  );
};

export default ScheduleConsultationPage;
