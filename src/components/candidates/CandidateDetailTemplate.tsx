import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clipboard, ArrowLeft, Phone, Mail, MapPin, Globe2, Languages, Clock3 } from 'lucide-react';
import CTAButton from '../shared/CTAButton';
import SectionBlock from '../shared/SectionBlock';
import Card from '../ui/Card';
import MotionSection from '../shared/MotionSection';
import type { Candidate } from '../../data/candidates';

interface CandidateDetailTemplateProps {
  candidate: Candidate;
}

const CandidateDetailTemplate: React.FC<CandidateDetailTemplateProps> = ({ candidate }) => {
  const navigate = useNavigate();

  const handleCopy = () => {
    const url = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {
        window.prompt('Copy this link', url);
      });
    } else {
      window.prompt('Copy this link', url);
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    if (!target.dataset.fallback) {
      target.dataset.fallback = 'true';
      target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(candidate.fullName)}`;
    }
  };

  const chips = [candidate.primarySkill, ...candidate.skills].slice(0, 6);
  const capabilityChips = candidate.capabilities?.slice(0, 8) ?? chips;

  return (
    <div className="bg-rich-black text-white">
      <div className="container-custom pt-24 sm:pt-28 pb-10 flex flex-col gap-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-800 border border-neutral-700">
              <img
                src={candidate.profilePhoto || ''}
                alt={candidate.fullName}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold">
                {candidate.fullName} • {candidate.id}
              </h1>
              <p className="text-white/80 mt-2 text-lg">
                {candidate.title} · {candidate.seniority} · {candidate.yearsExp} yrs
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1.5 rounded-full bg-electric-violet/10 border border-electric-violet/40 text-electric-violet text-sm">
                  Availability {candidate.availabilityLeadTime}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-gray-800/70 border border-neutral-800 text-white/80 text-sm">
                  {candidate.workWindow}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <CTAButton
              variant="outline"
              onClick={() => navigate('/candidates')}
              className="min-w-[140px]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to candidates
            </CTAButton>
            <CTAButton variant="secondary" onClick={handleCopy} className="min-w-[140px]">
              <Clipboard className="mr-2 h-4 w-4" /> Copy link
            </CTAButton>
            <CTAButton
              variant="primary"
              href={`mailto:${candidate.email}`}
              className="min-w-[180px]"
            >
              Request interview
            </CTAButton>
          </div>
        </div>

        <Card className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" hoverEffect={false}>
          <div className="flex items-center gap-3 text-white/80">
            <MapPin className="h-5 w-5 text-electric-violet" />
            <div>
              <p className="text-sm text-white/60">Location & timezone</p>
              <p className="font-semibold">
                {candidate.locationCity}, {candidate.locationCountry} · {candidate.timezone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <Languages className="h-5 w-5 text-electric-violet" />
            <div>
              <p className="text-sm text-white/60">Languages</p>
              <p className="font-semibold">{candidate.languages.join(', ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <Clock3 className="h-5 w-5 text-electric-violet" />
            <div>
              <p className="text-sm text-white/60">Work window</p>
              <p className="font-semibold">{candidate.workWindow}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <Globe2 className="h-5 w-5 text-electric-violet" />
            <div>
              <p className="text-sm text-white/60">Availability</p>
              <p className="font-semibold">{candidate.availabilityLeadTime}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="container-custom pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-8">
            <SectionBlock title="Sample Work">
              <div className="media">
                {candidate.videoUrl ? (
                  <iframe
                    src={candidate.videoUrl}
                    title="Sample work video"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                ) : (
                  'Video or demo can be shown here during live call'
                )}
              </div>
            </SectionBlock>

            <SectionBlock title="Overview">
              <p className="text-white/80 leading-relaxed">{candidate.overview || candidate.summary}</p>
            </SectionBlock>

            {capabilityChips.length ? (
              <SectionBlock title="Core capabilities">
                <div className="flex flex-wrap gap-2">
                  {capabilityChips.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full bg-electric-violet/10 border border-electric-violet/30 text-electric-violet text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </SectionBlock>
            ) : null}

            <SectionBlock title="Experience">
              <div className="space-y-6">
                {candidate.experience.map((experience) => (
                  <MotionSection key={`${experience.company}-${experience.role}`} className="border-l border-neutral-800 pl-4">
                    <p className="text-sm text-white/70">{experience.start} – {experience.end}</p>
                    <h3 className="text-lg font-semibold">{experience.role}</h3>
                    <p className="text-white/70">{experience.company}</p>
                    {experience.highlights?.length ? (
                      <ul className="list-disc list-inside text-white/75 mt-2 space-y-1">
                        {experience.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    ) : null}
                  </MotionSection>
                ))}
              </div>
            </SectionBlock>

            {candidate.education.length ? (
              <SectionBlock title="Education and certifications">
                <div className="space-y-4">
                  {candidate.education.map((education) => (
                    <div key={`${education.institution}-${education.degree}`} className="border border-neutral-800 rounded-lg p-4 bg-gray-900/70">
                      <h4 className="text-lg font-semibold">{education.degree}</h4>
                      <p className="text-white/70">{education.institution}</p>
                      <p className="text-white/60 text-sm">{education.year || 'Year not provided'}</p>
                    </div>
                  ))}
                  {candidate.certifications?.length ? (
                    <div className="border border-neutral-800 rounded-lg p-4 bg-gray-900/70">
                      <p className="text-sm text-white/60">Certifications</p>
                      <ul className="list-disc list-inside text-white/80 mt-2 space-y-1">
                        {candidate.certifications.map((cert) => (
                          <li key={cert}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </SectionBlock>
            ) : null}

            <SectionBlock title="Compliance and privacy">
              <p className="text-white/75 leading-relaxed">
                Candidate information is provided for evaluation within UPLIFT Technologies review workflows. Profiles exclude protected health information, and sharing is limited to authorized decision makers. Please keep communications professional and respect local privacy expectations.
              </p>
            </SectionBlock>
          </div>

          <aside className="space-y-4">
            <Card hoverEffect={false} className="space-y-4">
              <h2 className="text-xl font-semibold">Engagement snapshot</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-white/60">Seniority</span><span className="font-semibold">{candidate.seniority}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Primary skill</span><span className="font-semibold">{candidate.primarySkill}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Years of experience</span><span className="font-semibold">{candidate.yearsExp}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Availability</span><span className="font-semibold">{candidate.availabilityLeadTime}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Work window</span><span className="font-semibold text-right">{candidate.workWindow}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Languages</span><span className="font-semibold text-right">{candidate.languages.join(', ')}</span></div>
              </div>
            </Card>

            <Card hoverEffect={false} className="space-y-3">
              <h3 className="text-lg font-semibold">Contact actions</h3>
              <CTAButton variant="primary" href={`mailto:${candidate.email}`} className="w-full">
                <Mail className="mr-2 h-4 w-4" /> Email
              </CTAButton>
              <CTAButton variant="outline" href={`tel:${candidate.phone}`} className="w-full">
                <Phone className="mr-2 h-4 w-4" /> Call
              </CTAButton>
            </Card>
          </aside>
        </div>

        <Card hoverEffect={false} className="mt-4 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Ready to request an interview?</h2>
          <p className="text-white/75 max-w-2xl mx-auto">
            Share the candidate with your team and reach out to schedule an interview window that fits your clinic workflow.
          </p>
          <div className="flex justify-center">
            <CTAButton variant="primary" href={`mailto:${candidate.email}`} size="lg">
              Request interview
            </CTAButton>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CandidateDetailTemplate;
