import React from 'react';
import { Candidate } from '../../data/candidate';

interface Props {
  candidate: Candidate;
  onClick: () => void;
}

const CandidateCard: React.FC<Props> = ({ candidate, onClick }) => (
  <article className="card candidate" tabIndex={0} onClick={onClick}>
    <div className="profile-layout">
      <div className="photo">
        <img src={candidate.profilePhoto} alt={candidate.fullName} loading="lazy" />
      </div>
      <div className="meta">
        <div className="name">{candidate.fullName} • {candidate.id}</div>
        <div className="title">
          {candidate.title} · {candidate.seniority} · {candidate.yearsExp} yrs
        </div>
        <div className="subtle">
          {candidate.locationCity}, {candidate.locationCountry} · {candidate.timezone}
        </div>
        <div className="chips">
          {candidate.skills.slice(0, 5).map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
        </div>
      </div>
    </div>
  </article>
);

export default CandidateCard;
