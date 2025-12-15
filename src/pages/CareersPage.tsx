import React from 'react';
import { ArrowRight, Briefcase, Clock, MapPin } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionBlock from '../components/shared/SectionBlock';
import Card from '../components/ui/Card';
import CTAButton from '../components/shared/CTAButton';
import { roles } from '../data/roles';
import MetaTags from '../components/seo/MetaTags';

const CareersPage: React.FC = () => {
  return (
    <main className="bg-rich-black text-white min-h-screen">
      <MetaTags
        title="Careers"
        description="Explore remote healthcare operations roles at Uplift Technologies and apply to join our team."
      />

      <PageHero
        title="Remote Jobs"
        subtitle="Build your career with UPLIFT Technologies. Explore open roles across our service lines and apply to join our remote team."
        actions={<CTAButton href="#open-roles" variant="primary">View open roles</CTAButton>}
      />

      <SectionBlock id="open-roles" title="Open Positions" subtitle="Browse our current roles and apply for the one that fits you best." className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Card key={role.id} hoverEffect>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Briefcase size={16} /> {role.serviceLine}
                </div>
                <h2 className="text-xl font-semibold">{role.title}</h2>
                <p className="text-white/75">{role.summary}</p>
                <div className="flex flex-wrap gap-3 text-sm text-white/70">
                  <span className="inline-flex items-center gap-2"><Clock size={16} /> {role.hours}</span>
                  <span className="inline-flex items-center gap-2"><MapPin size={16} /> Remote</span>
                </div>
                <CTAButton to={`/careers/${role.slug}`} variant="primary" className="w-full sm:w-auto">
                  View role details <ArrowRight className="ml-2 h-4 w-4" />
                </CTAButton>
              </div>
            </Card>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock className="pt-0">
        <Card hoverEffect={false} className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Don't See the Right Fit?</h2>
          <p className="text-white/75">We’re always looking for new talent to join our team</p>
          <CTAButton to="/book" variant="outline" className="w-full sm:w-auto">
            Contact us
          </CTAButton>
        </Card>
      </SectionBlock>
    </main>
  );
};

export default CareersPage;
