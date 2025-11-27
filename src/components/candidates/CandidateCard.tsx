import React, { useCallback } from 'react';
import type { Candidate } from '../../data/candidate';

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

  return (
    <article
      className="relative cursor-pointer bg-gray-900 border border-neutral-700 rounded-lg p-6 shadow-[0_6px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.4)] focus-visible:shadow-[0_0_0_2px_#9b1dff,0_6px_20px_rgba(0,0,0,0.3)] focus-visible:border-electric-violet focus-visible:outline-none flex flex-col gap-6"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`View profile for ${candidate.fullName}`}
    >
      {/* Profile Layout - Image + Meta Info */}
      <div className="grid grid-cols-[96px_1fr] gap-4 items-start">
        {/* Profile Photo */}
        <div 
          className="w-24 h-24 rounded-xl overflow-hidden bg-gray-800 border border-neutral-700 grid place-items-center"
          aria-hidden="true"
        >
          <img 
            src={candidate.profilePhoto} 
            alt="" 
            onError={handleImageError}
            className="w-full h-full object-cover block"
          />
        </div>

        {/* Meta Info */}
        <div className="flex flex-col gap-2">
          <h2 className="font-poppins font-bold text-[1.25rem] leading-[1.3] text-white m-0">
            {candidate.fullName}
          </h2>
          <p className="text-neutral-400 text-[0.875rem] m-0">
            {candidate.title} • {candidate.seniority} • {candidate.yearsExp} yrs
          </p>
          <p className="text-neutral-500 text-[0.875rem] m-0">
            {candidate.locationCity}, {candidate.locationCountry} · {candidate.timezone}
          </p>

          {/* Skills Chips */}
          <div className="flex flex-wrap gap-2" aria-label="Key skills">
            {[candidate.primarySkill, ...candidate.skills].slice(0, 5).map((skill) => (
              <span 
                key={skill} 
                className="px-3 py-2 rounded-full bg-[rgba(155,29,255,0.15)] border border-[rgba(155,29,255,0.3)] font-semibold text-[0.875rem] text-[#bb57ff] whitespace-nowrap"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Text */}
      <p className="text-neutral-400 text-[0.875rem] leading-[1.25] mb-0">
        {candidate.summary}
      </p>

      {/* Key-Value Pairs */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-neutral-700 mb-2">
        <span className="text-neutral-400 text-[0.875rem]">Availability</span>
        <strong className="text-white font-semibold text-right">{candidate.availabilityLeadTime}</strong>
      </div>
      
      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-neutral-700 mb-2">
        <span className="text-neutral-400 text-[0.875rem]">Work window</span>
        <strong className="text-white font-semibold text-right">{candidate.workWindow}</strong>
      </div>
      
      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-neutral-700 mb-0">
        <span className="text-neutral-400 text-[0.875rem]">Primary skill</span>
        <strong className="text-white font-semibold text-right">{candidate.primarySkill}</strong>
      </div>

      {/* View Profile Button */}
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 min-h-[36px] px-4 py-2 rounded-md border-none font-inter font-semibold text-[0.875rem] cursor-pointer transition-all duration-300 bg-[#9b1dff] text-white shadow-[0_0_20px_rgba(155,29,255,0.3)] hover:bg-[#7400c7] hover:translate-y-[-1px] hover:shadow-[0_0_30px_rgba(155,29,255,0.5)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_#9b1dff,0_0_20px_rgba(155,29,255,0.3)] mt-2"
        onClick={(event) => {
          event.stopPropagation();
          onClick?.();
        }}
      >
        View profile
      </button>
    </article>
  );
};

export default CandidateCard;
