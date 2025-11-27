import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CANDIDATES } from '../data/candidate';
import { CANDIDATE_DETAILS, type CandidateDetails } from '../data/candidateDetails';

type DetailField = keyof CandidateDetails;

const numberFormatter = new Intl.NumberFormat('en-US');

const formatSalaryRange = (range: { min: number; max: number }) => {
  const FX_PKR_PER_USD = 281;
  const pkr = `PKR ${numberFormatter.format(range.min)} – ${numberFormatter.format(range.max)}`;
  const usdMin = Math.round(range.min / FX_PKR_PER_USD);
  const usdMax = Math.round(range.max / FX_PKR_PER_USD);
  const usd = `~ USD ${numberFormatter.format(usdMin)} – ${numberFormatter.format(usdMax)}`;
  return `${pkr} (${usd})`;
};

const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editMode = searchParams.get('edit') === 'true';

  const candidate = useMemo(() => CANDIDATES.find((entry) => entry.id === id), [id]);
  const [details, setDetails] = useState<CandidateDetails>(() => (id ? CANDIDATE_DETAILS[id] ?? {} : {}));

  useEffect(() => {
    if (id) {
      setDetails(CANDIDATE_DETAILS[id] ?? {});
    }
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate('/candidates');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const updateDetail = (field: DetailField, value: string | string[]) => {
    setDetails((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const renderEditable = useCallback(
    (field: DetailField, multiline = false) => {
      if (!editMode) {
        const value = details[field];
        if (Array.isArray(value)) {
          return value.length ? (
            <ul className="pl-6 mt-3">
              {value.map((item) => (
                <li key={item} className="text-neutral-400 text-[0.875rem] mb-2">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-400 text-[0.875rem]">—</p>
          );
        }

        if (typeof value === 'string' && value.trim().length > 0) {
          return <p className="text-neutral-400">{value}</p>;
        }

        return <p className="text-neutral-400 text-[0.875rem]">—</p>;
      }

      const currentValue = details[field];
      const textValue = Array.isArray(currentValue) ? currentValue.join('\n') : currentValue ?? '';
      return (
        <textarea
          className="w-full px-4 py-3 bg-gray-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent transition-all"
          value={textValue}
          onChange={(event) => {
            const { value } = event.target;
            updateDetail(field, multiline ? value.split('\n').filter(Boolean) : value);
          }}
          rows={multiline ? 5 : 3}
          style={{ minHeight: multiline ? '120px' : '60px' }}
        />
      );
    },
    [details, editMode]
  );

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {
        window.prompt('Copy this link', window.location.href);
      });
    } else {
      window.prompt('Copy this link', window.location.href);
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    if (!target.dataset.fallback) {
      target.dataset.fallback = 'true';
      target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(candidate?.fullName ?? 'Candidate')}`;
    }
  };

  if (!candidate) {
    return (
      <section className="container-custom pb-12">
        <div className="p-12 border-2 border-dashed border-neutral-700 rounded-xl bg-gray-800 text-center">
          <h1 className="text-white">Not found</h1>
          <p className="mb-6 text-neutral-400">The requested candidate does not exist.</p>
          <button 
            type="button" 
            className="inline-flex items-center justify-center gap-2 min-h-[36px] px-4 py-2 rounded-md bg-transparent text-electric-violet border border-neutral-700 font-semibold text-[0.875rem] cursor-pointer transition-all duration-300 hover:border-electric-violet hover:bg-[rgba(155,29,255,0.1)]" 
            onClick={() => navigate('/candidates')}
          >
            Back to candidates
          </button>
        </div>
      </section>
    );
  }

  return (
    <main className="container-custom pt-28 sm:pt-32 pb-12 flex flex-col gap-6">
      {/* Top Actions Bar */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <button 
          type="button" 
          className="inline-flex items-center justify-center gap-2 min-h-[36px] px-4 py-2 rounded-md bg-transparent text-electric-violet border border-neutral-700 font-semibold text-[0.875rem] cursor-pointer transition-all duration-300 hover:border-electric-violet hover:bg-[rgba(155,29,255,0.1)]" 
          onClick={() => navigate('/candidates')}
        >
          Back to list
        </button>
        <div className="flex gap-2 flex-wrap">
          <button 
            type="button" 
            className="inline-flex items-center justify-center gap-2 min-h-[36px] px-4 py-2 rounded-md bg-transparent text-neutral-400 border border-transparent font-semibold text-[0.875rem] cursor-pointer transition-all duration-300 hover:text-white hover:bg-gray-800" 
            onClick={handleCopyLink}
          >
            Copy link
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 min-h-[36px] px-4 py-2 rounded-md border-none font-semibold text-[0.875rem] cursor-pointer transition-all duration-300 bg-[#9b1dff] text-white shadow-[0_0_20px_rgba(155,29,255,0.3)] hover:bg-[#7400c7] hover:translate-y-[-1px] hover:shadow-[0_0_30px_rgba(155,29,255,0.5)] active:translate-y-0"
            onClick={() => window.open(`mailto:${candidate.email}`, '_blank')}
          >
            Request interview
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="grid grid-cols-[140px_1fr] gap-6 p-8 border border-neutral-700 rounded-xl bg-gray-900 shadow-[0_6px_20px_rgba(0,0,0,0.3)]">
        <div className="w-[140px] h-[140px] rounded-xl overflow-hidden bg-gray-800 border border-neutral-700 grid place-items-center" aria-hidden="true">
          <img 
            src={candidate.profilePhoto} 
            alt={candidate.fullName} 
            onError={handleImageError}
            className="w-full h-full object-cover block"
          />
        </div>
        <div>
          <h1 className="font-poppins font-extrabold text-[clamp(1.5rem,3.5vw,2rem)] mb-3 text-white">
            {candidate.fullName} • {candidate.id}
          </h1>
          <div className="text-[1.125rem] mb-3 text-neutral-400">
            {candidate.title} · {candidate.seniority} · {candidate.yearsExp} yrs
          </div>
          <div className="flex gap-4 flex-wrap text-neutral-400 text-[0.875rem] mb-4">
            <span>Availability {candidate.availabilityLeadTime}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[candidate.primarySkill, ...candidate.skills.slice(0, 4)].map((skill) => (
              <span 
                key={skill} 
                className="px-3 py-2 rounded-full bg-[rgba(155,29,255,0.15)] border border-[rgba(155,29,255,0.3)] font-semibold text-[0.875rem] text-[#bb57ff] whitespace-nowrap"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left Column - Main Content */}
        <article className="bg-gray-900 border border-neutral-700 rounded-xl p-6 shadow-[0_6px_20px_rgba(0,0,0,0.3)]">
          <h3 className="font-poppins font-semibold text-[1.25rem] mb-4 text-white">Sample Work</h3>
          <div className="aspect-video border border-neutral-700 rounded-lg grid place-items-center bg-gradient-to-br from-[rgba(155,29,255,0.1)] to-gray-800 font-bold text-[#9b1dff] overflow-hidden mb-6">
            {candidate.videoUrl ? (
              <iframe
                src={candidate.videoUrl}
                title="Sample work video"
                allowFullScreen
                className="w-full h-full border-none"
              />
            ) : (
              'Video or demo can be shown here during live call'
            )}
          </div>

          <h2 className="font-poppins font-semibold text-[1.5rem] mb-4 text-white">Overview</h2>
          {editMode ? (
            renderEditable('overview', true)
          ) : (
            <p className="text-neutral-400 mb-6">
              {details.overview || candidate.summary || 'No overview available.'}
            </p>
          )}

          {details.careerHighlights && details.careerHighlights.length > 0 && !editMode && (
            <>
              <h3 className="font-poppins font-semibold text-[1.25rem] mt-6 mb-3 text-white">Career Highlights</h3>
              <ul className="pl-6 mt-3">
                {details.careerHighlights.map((highlight) => (
                  <li key={highlight} className="text-neutral-400 text-[0.875rem] mb-2">
                    {highlight}
                  </li>
                ))}
              </ul>
            </>
          )}

          {editMode && renderEditable('careerHighlights', true)}

          <h3 className="font-poppins font-semibold text-[1.25rem] mt-6 mb-3 text-white">Core Skills</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {(details.coreCompetencies || candidate.skills || []).map((skill) => (
              <span 
                key={skill} 
                className="px-3 py-2 rounded-full bg-[rgba(155,29,255,0.15)] border border-[rgba(155,29,255,0.3)] font-semibold text-[0.875rem] text-[#bb57ff] whitespace-nowrap"
              >
                {skill}
              </span>
            ))}
          </div>

          <h3 className="font-poppins font-semibold text-[1.25rem] mt-6 mb-3 text-white">Experience</h3>
          <div className="relative mt-4 mb-6 pl-6 before:content-[''] before:absolute before:left-[6px] before:top-[4px] before:bottom-[4px] before:w-[2px] before:bg-neutral-700 before:rounded">
            {candidate.experience.map((experience) => (
              <div 
                key={`${experience.company}-${experience.start}`} 
                className="relative mb-6 pl-2 before:content-[''] before:absolute before:left-[-18px] before:top-[6px] before:w-3 before:h-3 before:rounded-full before:bg-[#9b1dff] before:shadow-[0_0_8px_rgba(155,29,255,0.5)]"
              >
                <p className="m-0 font-bold text-base text-white">{experience.role}</p>
                <p className="my-1 text-neutral-400 text-[0.875rem]">{experience.company}</p>
                <p className="text-[0.875rem] text-neutral-500 mb-2">
                  {experience.start} – {experience.end}
                </p>
                {experience.highlights && experience.highlights.length > 0 && (
                  <ul className="mt-2 pl-5">
                    {experience.highlights.map((highlight) => (
                      <li key={highlight} className="text-neutral-400 text-[0.875rem] mb-1">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <h3 className="font-poppins font-semibold text-[1.25rem] mt-6 mb-3 text-white">Education</h3>
          <div className="relative mt-4 mb-6 pl-6 before:content-[''] before:absolute before:left-[6px] before:top-[4px] before:bottom-[4px] before:w-[2px] before:bg-neutral-700 before:rounded">
            {candidate.education.map((education) => (
              <div 
                key={`${education.institution}-${education.degree}`} 
                className="relative mb-6 pl-2 before:content-[''] before:absolute before:left-[-18px] before:top-[6px] before:w-3 before:h-3 before:rounded-full before:bg-[#9b1dff] before:shadow-[0_0_8px_rgba(155,29,255,0.5)]"
              >
                <p className="m-0 font-bold text-base text-white">{education.degree}</p>
                <p className="my-1 text-neutral-400 text-[0.875rem]">{education.institution}</p>
                <p className="text-[0.875rem] text-neutral-500">{education.year || '—'}</p>
              </div>
            ))}
          </div>

          {details.certifications && details.certifications.length > 0 && !editMode && (
            <>
              <h3 className="font-poppins font-semibold text-[1.25rem] mt-6 mb-3 text-white">Certifications</h3>
              <ul className="pl-6 mt-3">
                {details.certifications.map((certification) => (
                  <li key={certification} className="text-neutral-400 text-[0.875rem] mb-2">
                    {certification}
                  </li>
                ))}
              </ul>
            </>
          )}

          {editMode && renderEditable('certifications', true)}

          <h3 className="font-poppins font-semibold text-[1.25rem] mt-6 mb-3 text-white">Languages</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {candidate.languages.map((language) => (
              <span 
                key={language} 
                className="px-3 py-2 rounded-full bg-[rgba(155,29,255,0.15)] border border-[rgba(155,29,255,0.3)] font-semibold text-[0.875rem] text-[#bb57ff] whitespace-nowrap"
              >
                {language}
              </span>
            ))}
          </div>

          {details.additionalInfo && !editMode ? (
            <>
              <h3 className="font-poppins font-semibold text-[1.25rem] mt-6 mb-3 text-white">Additional Information</h3>
              <p className="text-neutral-400 text-[0.875rem] mt-3">
                {details.additionalInfo}
              </p>
            </>
          ) : null}

          {editMode && renderEditable('additionalInfo')}
        </article>

        {/* Right Column - Sidebar */}
        <aside className="bg-gray-900 border border-neutral-700 rounded-xl p-6 shadow-[0_6px_20px_rgba(0,0,0,0.3)] h-fit">
          <h2 className="font-poppins font-semibold text-[1.5rem] mb-4 text-white">Engagement</h2>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-neutral-700 mb-2">
            <span className="text-neutral-400 text-[0.875rem]">Seniority</span>
            <strong className="text-white font-semibold text-right">{candidate.seniority}</strong>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-neutral-700 mb-2">
            <span className="text-neutral-400 text-[0.875rem]">Primary skill</span>
            <strong className="text-white font-semibold text-right">{candidate.primarySkill}</strong>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-neutral-700 mb-2">
            <span className="text-neutral-400 text-[0.875rem]">Years of experience</span>
            <strong className="text-white font-semibold text-right">{candidate.yearsExp}</strong>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-neutral-700 mb-2">
            <span className="text-neutral-400 text-[0.875rem]">Starting availability</span>
            <strong className="text-white font-semibold text-right">{candidate.availabilityLeadTime}</strong>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-neutral-700 mb-2">
            <span className="text-neutral-400 text-[0.875rem]">Work window</span>
            <strong className="text-white font-semibold text-right">{candidate.workWindow}</strong>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-neutral-700 mb-2">
            <span className="text-neutral-400 text-[0.875rem]">Languages</span>
            <strong className="text-white font-semibold text-right">{candidate.languages.join(', ')}</strong>
          </div>

          <h2 className="font-poppins font-semibold text-[1.5rem] mt-6 mb-4 text-white">Contact</h2>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-neutral-700 mb-2">
            <span className="text-neutral-400 text-[0.875rem]">Email</span>
            <strong className="text-white font-semibold text-right">
              <a href={`mailto:${candidate.email}`} className="text-[#bb57ff] hover:underline">{candidate.email}</a>
            </strong>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-neutral-700 mb-2">
            <span className="text-neutral-400 text-[0.875rem]">Phone</span>
            <strong className="text-white font-semibold text-right">
              <a href={`tel:${candidate.phone}`} className="text-[#bb57ff] hover:underline">{candidate.phone}</a>
            </strong>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 min-h-[36px] px-4 py-2 rounded-md border-none font-semibold text-[0.875rem] cursor-pointer transition-all duration-300 bg-[#9b1dff] text-white shadow-[0_0_20px_rgba(155,29,255,0.3)] hover:bg-[#7400c7] hover:translate-y-[-1px] hover:shadow-[0_0_30px_rgba(155,29,255,0.5)] active:translate-y-0"
              onClick={() => window.open(`mailto:${candidate.email}`, '_blank')}
            >
              Email
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 min-h-[36px] px-4 py-2 rounded-md bg-transparent text-electric-violet border-2 border-electric-violet font-semibold text-[0.875rem] cursor-pointer transition-all duration-300 hover:bg-electric-violet hover:text-white"
              onClick={() => window.open(`tel:${candidate.phone}`, '_blank')}
            >
              Call
            </button>
          </div>
        </aside>
      </section>

      <footer className="text-center mt-8 text-neutral-400 text-[0.875rem]">
        Press Esc to return to the grid. Sharing is limited to this device unless deployed.
      </footer>
    </main>
  );
};

export default CandidateDetailPage;
