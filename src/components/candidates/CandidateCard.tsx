import React, { useCallback } from 'react';
import type { Candidate } from '../../data/candidate';
import '../../styles/theme.css';

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
      className="card candidate stack"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`View profile for ${candidate.fullName}`}
    >
      <div className="profile-layout">
        <div className="photo" aria-hidden="true">
          <img src={candidate.profilePhoto} alt="" onError={handleImageError} />
        </div>
        <div className="meta">
          <h2 className="name">{candidate.fullName}</h2>
          <p className="title">
            {candidate.title} • {candidate.seniority} • {candidate.yearsExp} yrs
          </p>
          <p className="subtle">
            {candidate.locationCity}, {candidate.locationCountry} · {candidate.timezone}
          </p>
          <div className="chips" aria-label="Key skills">
            {[candidate.primarySkill, ...candidate.skills].slice(0, 5).map((skill) => (
              <span key={skill} className="chip">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="subtle" style={{ marginBottom: 0 }}>
        {candidate.summary}
      </p>

      <div className="kv" style={{ marginBottom: 0 }}>
        <span>Availability</span>
        <strong>{candidate.availabilityLeadTime}</strong>
      </div>
      <div className="kv" style={{ marginBottom: 0 }}>
        <span>Work window</span>
        <strong>{candidate.workWindow}</strong>
      </div>
      <div className="kv" style={{ marginBottom: 0 }}>
        <span>Primary skill</span>
        <strong>{candidate.primarySkill}</strong>
      </div>

      <button
        type="button"
        className="btn btn-primary small"
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
