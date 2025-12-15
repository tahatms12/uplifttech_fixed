import React, { useCallback } from 'react';
import Card from '../ui/Card';
import CTAButton from '../shared/CTAButton';
import type { Candidate } from '../../data/candidates';

interface CandidateCardProps {
  candidate: Candidate;
  onClick?: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onClick }) => {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.();
      }
    },
    [onClick]
  );

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    if (!target.dataset.fallback) {
      target.dataset.fallback = 'true';
      target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(candidate.fullName)}`;
    }
  };

  const skills = [candidate.primarySkill, ...candidate.skills].slice(0, 4);

  return (
    <Card
      className="h-full cursor-pointer flex flex-col gap-4"
      hoverEffect
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View profile for ${candidate.fullName}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 border border-neutral-700 shrink-0">
          <img
            src={candidate.profilePhoto || ''}
            alt={candidate.fullName}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-white truncate">{candidate.fullName}</h3>
          <p className="text-sm text-white/70">
            {candidate.title} • {candidate.seniority} • {candidate.yearsExp} yrs
          </p>
          <p className="text-sm text-white/60">
            {candidate.locationCity}, {candidate.locationCountry} · {candidate.timezone}
          </p>
        </div>
      </div>

      <p className="text-white/75 text-sm leading-relaxed">{candidate.summary}</p>

      <div className="flex flex-wrap gap-2" aria-label="Key skills">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 rounded-full bg-electric-violet/10 border border-electric-violet/30 text-electric-violet text-xs font-semibold"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-neutral-800 bg-gray-900/70 px-4 py-3 flex justify-between">
          <span className="text-white/60">Availability</span>
          <span className="text-white font-semibold">{candidate.availabilityLeadTime}</span>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-gray-900/70 px-4 py-3 flex justify-between">
          <span className="text-white/60">Work window</span>
          <span className="text-white font-semibold text-right">{candidate.workWindow}</span>
        </div>
      </div>

      <div className="pt-2">
        <CTAButton
          variant="primary"
          className="w-full"
          onClick={(event) => {
            event.stopPropagation();
            onClick?.();
          }}
        >
          View profile
        </CTAButton>
      </div>
    </Card>
  );
};

export default CandidateCard;
