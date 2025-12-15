import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { rolesBySlug } from '../data/roles';
import PageHero from '../components/shared/PageHero';
import SectionBlock from '../components/shared/SectionBlock';
import CTAButton from '../components/shared/CTAButton';
import Card from '../components/ui/Card';

const RoleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const role = slug ? rolesBySlug[slug] : undefined;

  if (!role) {
    return <Navigate to="/careers" replace />;
  }

  return (
    <main className="bg-rich-black text-white min-h-screen">
      <Helmet>
        <title>{`${role.title} | Careers at UPLIFT Technologies`}</title>
        <meta
          name="description"
          content={`Learn more about the ${role.title} role at UPLIFT Technologies including responsibilities, qualifications, and how to apply.`}
        />
      </Helmet>

      <PageHero
        title={role.title}
        subtitle={`${role.serviceLine} | ${role.employmentType} | ${role.hours}`}
        actions={
          <CTAButton href={`mailto:${role.sections.applyEmail}`} variant="primary">
            Apply now
          </CTAButton>
        }
      />

      <div className="container-custom pb-14">
        <SectionBlock title="Role Overview" className="pt-0">
          <Card hoverEffect={false}>
            <p className="text-white/80 leading-relaxed">{role.sections.overview}</p>
          </Card>
        </SectionBlock>

        <SectionBlock title="Key Responsibilities" className="pt-4">
          <div className="grid gap-4">
            {role.sections.responsibilities.map((group) => (
              <Card key={group.title} hoverEffect={false}>
                <h3 className="text-lg font-semibold mb-2">{group.title}</h3>
                <ul className="list-disc list-inside text-white/80 space-y-1">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Qualifications and Skills" className="pt-4">
          <Card hoverEffect={false}>
            <ul className="list-disc list-inside text-white/80 space-y-1">
              {role.sections.qualifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        </SectionBlock>

        <SectionBlock title="Technical Requirements" className="pt-4">
          <Card hoverEffect={false}>
            <ul className="list-disc list-inside text-white/80 space-y-1">
              {role.sections.technicalRequirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        </SectionBlock>

        <SectionBlock title="Apply" className="pt-4">
          <Card hoverEffect={false} className="space-y-3">
            <p className="text-white/80">Send your resume or profile to {role.sections.applyEmail}.</p>
            <CTAButton href={`mailto:${role.sections.applyEmail}`} variant="primary" className="w-full sm:w-auto">
              Email your application
            </CTAButton>
            <p className="text-white/70 text-sm">{role.sections.equalOpportunity}</p>
          </Card>
        </SectionBlock>
      </div>
    </main>
  );
};

export default RoleDetailPage;
