import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, TrendingUp, BadgeDollarSign, PhoneCall, ArrowRight, CheckCircle } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import CallToAction from '../components/home/CallToAction';
import MetaTags from '../components/seo/MetaTags';
import StructuredData from '../components/seo/StructuredData';
import { podBySlug } from '../data/pods';
import { rolesById } from '../data/roles';

const iconMap: Record<string, JSX.Element> = {
  administration: <TrendingUp size={32} />,
  'clinical-coordination': <Users size={32} />,
  'front-office': <PhoneCall size={32} />,
  'revenue-cycle': <BadgeDollarSign size={32} />
};

const ServiceDetailPage: React.FC = () => {
  const { service } = useParams<{ service: string }>();
  const pod = service ? podBySlug[service] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [service]);

  if (!pod) {
    return (
      <div className="min-h-screen bg-rich-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold">Service not found</h1>
          <Link to="/services" className="text-electric-violet font-semibold inline-flex items-center">
            Return to services
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  const rolesInPod = pod.roleIds.map((id) => rolesById[id]).filter(Boolean);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pod.title,
    description: pod.summary,
    provider: {
      '@type': 'Organization',
      name: 'UPLIFT Technologies'
    }
  };

  return (
    <>
      <MetaTags
        title={pod.title}
        description={pod.summary}
      />
      <StructuredData data={structuredData} />

      <main className="bg-rich-black text-white min-h-screen">
        <section className="relative overflow-hidden pt-28 pb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-electric-violet/20 via-transparent to-transparent" />
          <div className="container-custom relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 text-electric-violet mb-4">
                {iconMap[pod.slug]}
                <span className="text-sm uppercase tracking-widest">{pod.segmentLabel}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-semibold mb-4">{pod.title}</h1>
              <p className="text-lg text-white/75 mb-6">{pod.longDescription}</p>

              <div className="flex flex-wrap gap-4">
                <Button to="/book" size="lg" analyticsLabel="service_detail_schedule">
                  Schedule a call
                </Button>
                <Link to="/pricing" className="inline-flex items-center text-electric-violet font-semibold">
                  View pricing
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-border-muted/60 bg-surface/70 p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-3">What this pod delivers</h2>
              <ul className="space-y-3 text-white/80">
                {pod.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-electric-violet mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="container-custom py-12 grid lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl border border-border-muted/60 bg-surface/70 p-6 shadow-card">
            <h3 className="text-2xl font-semibold mb-4">Roles in this pod</h3>
            {rolesInPod.map((role) => (
              <div key={role.id} className="mb-6 last:mb-0">
                <h4 className="text-lg font-semibold mb-2">{role.title}</h4>
                <ul className="space-y-2 text-white/80 list-disc list-inside">
                  {role.sections.responsibilities.flatMap((group) => group.items).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-border-muted/60 bg-surface/70 p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-3">Outcomes</h3>
              <div className="space-y-4">
                {pod.benefits.map((benefit) => (
                  <div key={benefit.title}>
                    <h4 className="text-lg font-semibold text-electric-violet">{benefit.title}</h4>
                    <p className="text-white/75">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border-muted/60 bg-surface/70 p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-3">How we work</h3>
              <ol className="space-y-3 text-white/80 list-decimal list-inside">
                {pod.process.map((step) => (
                  <li key={step.title}>
                    <span className="font-semibold text-white">{step.title}: </span>
                    {step.description}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <Section
          title="Start with the right pod"
          subtitle="Tell us your targets and we will align the specialist, hours, and documentation to your workflow."
          centered
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Button to="/book" size="lg" analyticsLabel="service_detail_consult">
              Book a consultation
            </Button>
            <Button to="/pricing" variant="secondary" size="lg" analyticsLabel="service_detail_pricing">
              Review pricing
            </Button>
          </div>
        </Section>

        <CallToAction />
      </main>
    </>
  );
};

export default ServiceDetailPage;
