import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CANDIDATES } from '../data/candidate';
import { CANDIDATE_DETAILS } from '../data/candidateDetails';
import '../styles/theme.css';

interface Candidate {
  id: string;
  fullName: string;
  title: string;
  seniority: string;
  yearsExp: number;
  skills: string[];
  primarySkill: string;
  locationCity: string;
  locationCountry: string;
  timezone: string;
  availabilityLeadTime: string;
  salaryRangePKR: { min: number; max: number };
  languages: string[];
  education: { degree: string; institution: string; year: string | number | null }[];
  experience: {
    company: string;
    role: string;
    start: string;
    end: string;
    highlights: string[];
  }[];
  videoUrl?: string;
  email: string;
  phone: string;
  profilePhoto: string;
  workWindow: string;
  summary: string;
}

const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editMode = searchParams.get('edit') === 'true';

  const candidate = useMemo(
    () => CANDIDATES.find((c) => c.id === id),
    [id]
  );

  // Use in-memory state instead of localStorage
  const [details, setDetails] = useState(
    () => CANDIDATE_DETAILS[id || ''] || {}
  );

  const updateDetail = (field: string, value: string | string[]) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const fmtNum = (n: number) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const pkrRangeToText = (range: { min: number; max: number }) => {
    const FX_PKR_PER_USD = 281;
    const pkr = `PKR ${fmtNum(range.min)} – ${fmtNum(range.max)}`;
    const usdMin = Math.round(range.min / FX_PKR_PER_USD);
    const usdMax = Math.round(range.max / FX_PKR_PER_USD);
    const usd = `~ USD ${fmtNum(usdMin)} – ${fmtNum(usdMax)}`;
    return `${pkr} (${usd})`;
  };

  if (!candidate) {
    return (
      <section className="notfound">
        <h1>Not found</h1>
        <p>The requested candidate does not exist.</p>
        <button
          className="btn outline small"
          onClick={() => navigate('/candidates')}
        >
          Back to candidates
        </button>
      </section>
    );
  }

  const renderEditable = (
    label: string,
    field: keyof typeof details,
    multiline = false
  ) => {
    if (!editMode) {
      return <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)' }}>
        {details[field] || '—'}
      </p>;
    }
    return (
      <textarea
        className="input"
        value={Array.isArray(details[field]) ? (details[field] as string[]).join('\n') : details[field] || ''}
        onChange={(e) =>
          updateDetail(
            field,
            multiline
              ? e.target.value.split('\n').filter(Boolean)
              : e.target.value
          )
        }
        rows={multiline ? 5 : 2}
        style={{ width: '100%', minHeight: multiline ? '120px' : '60px' }}
      />
    );
  };

  return (
    <main className="container stack" style={{ paddingBottom: '3rem' }}>
      <div className="actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="btn outline small"
          onClick={() => navigate('/candidates')}
        >
          Back to list
        </button>
        <div className="actions">
          <button
            className="btn ghost small"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          >
            Copy link
          </button>
          <button
            className="btn btn-primary small"
            onClick={() => alert('Interview request sent!')}
          >
            Request interview
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="photo">
          <img src={candidate.profilePhoto} alt={`${candidate.fullName} photo`} />
        </div>
        <div>
          <h1 className="name">{candidate.fullName} • {candidate.id}</h1>
          <div className="title">{candidate.title} · {candidate.seniority} · {candidate.yearsExp} yrs</div>
          <div className="meta-line">
            <span>{candidate.locationCity}, {candidate.locationCountry}</span>
            <span>{candidate.timezone}</span>
            <span>Availability {candidate.availabilityLeadTime}</span>
          </div>
          <div className="chips">
            {[candidate.primarySkill, ...candidate.skills.slice(0, 4)].map((s, i) => (
              <span key={i} className="chip">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid-2col">
        <article className="section">
            <h3>Sample Work</h3>
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

          <h2>Overview</h2>
          {editMode ? (
            renderEditable('Overview', 'overview', true)
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>
              {details.overview || candidate.summary || 'No overview available.'}
            </p>
          )}

          {details.careerHighlights && details.careerHighlights.length > 0 && (
            <>
              <h3>Career Highlights</h3>
              <ul style={{ paddingLeft: 'var(--sp-24)', marginTop: 'var(--sp-12)' }}>
                {details.careerHighlights.map((highlight: string, i: number) => (
                  <li key={i} style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)', marginBottom: 'var(--sp-8)' }}>
                    {highlight}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h3>Core Skills</h3>
          <div className="chips">
            {(details.coreCompetencies || candidate.skills || []).map((skill: string, i: number) => (
              <span key={i} className="chip">{skill}</span>
            ))}
          </div>

          <h3>Experience</h3>
          <div className="timeline">
            {candidate.experience.map((exp, i) => (
              <div key={i} className="item">
                <p className="role">{exp.role}</p>
                <p className="where">{exp.company}</p>
                <p className="period">{exp.start} – {exp.end}</p>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul>
                    {exp.highlights.map((h, j) => (
                      <li key={j}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <h3>Education</h3>
          <div className="timeline">
            {candidate.education.map((edu, i) => (
              <div key={i} className="item">
                <p className="role">{edu.degree}</p>
                <p className="where">{edu.institution}</p>
                <p className="period">{edu.year || '—'}</p>
              </div>
            ))}
          </div>

          {details.certifications && details.certifications.length > 0 && (
            <>
              <h3>Certifications</h3>
              <ul style={{ paddingLeft: 'var(--sp-24)', marginTop: 'var(--sp-12)' }}>
                {details.certifications.map((cert: string, i: number) => (
                  <li key={i} style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)', marginBottom: 'var(--sp-8)' }}>
                    {cert}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h3>Languages</h3>
          <div className="chips">
            {candidate.languages.map((lang, i) => (
              <span key={i} className="chip">{lang}</span>
            ))}
          </div>

          {details.additionalInfo && (
            <>
              <h3>Additional Information</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)', marginTop: 'var(--sp-12)' }}>
                {details.additionalInfo}
              </p>
            </>
          )}

          
        </article>

        {/* Sidebar */}
        <aside className="section">
          <h2>Engagement</h2>
          <div className="kv"><span>Seniority</span><strong>{candidate.seniority}</strong></div>
          <div className="kv"><span>Primary skill</span><strong>{candidate.primarySkill}</strong></div>
          <div className="kv"><span>Years of experience</span><strong>{candidate.yearsExp}</strong></div>
          <div className="kv"><span>Availability lead time</span><strong>{candidate.availabilityLeadTime}</strong></div>
          <div className="kv"><span>Work window</span><strong>{candidate.workWindow}</strong></div>
          <div className="kv"><span>Compensation</span>
            <strong>{pkrRangeToText(candidate.salaryRangePKR)}</strong>
          </div>

          <h2 style={{ marginTop: '24px' }}>Contact</h2>
          <div className="kv"><span>Email</span>
            <strong><a href={`mailto:${candidate.email}`}>{candidate.email}</a></strong>
          </div>
          <div className="kv"><span>Phone</span>
            <strong><a href={`tel:${candidate.phone}`}>{candidate.phone}</a></strong>
          </div>
          <div className="kv"><span>Location</span>
            <strong>{candidate.locationCity}, {candidate.locationCountry}</strong>
          </div>

          <div className="stack" style={{ marginTop: 24, gap: 12 }}>
            <button 
              className="btn btn-primary small" 
              onClick={() => window.open(`mailto:${candidate.email}`, '_blank')}
            >
              Email
            </button>
            <button 
              className="btn btn-secondary small" 
              onClick={() => window.open(`tel:${candidate.phone}`, '_blank')}
            >
              Call
            </button>
          </div>
        </aside>
      </section>

      <footer style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: 'var(--fs-small)' }}>
        Press Esc to return to the grid. Sharing is limited to this device unless deployed.
      </footer>
    </main>
  );
};

export default CandidateDetailPage;