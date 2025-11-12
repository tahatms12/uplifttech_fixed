import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CANDIDATES } from '../data/candidate';
import { CANDIDATE_DETAILS, type CandidateDetails } from '../data/candidateDetails';
import '../styles/theme.css';

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
            <ul style={{ paddingLeft: 'var(--sp-24)', marginTop: 'var(--sp-12)' }}>
              {value.map((item) => (
                <li
                  key={item}
                  style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)', marginBottom: 'var(--sp-8)' }}
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)' }}>—</p>
          );
        }

        if (typeof value === 'string' && value.trim().length > 0) {
          return <p style={{ color: 'var(--text-muted)' }}>{value}</p>;
        }

        return <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)' }}>—</p>;
      }

      const currentValue = details[field];
      const textValue = Array.isArray(currentValue) ? currentValue.join('\n') : currentValue ?? '';
      return (
        <textarea
          className="input"
          value={textValue}
          onChange={(event) => {
            const { value } = event.target;
            updateDetail(field, multiline ? value.split('\n').filter(Boolean) : value);
          }}
          rows={multiline ? 5 : 3}
          style={{ width: '100%', minHeight: multiline ? '120px' : '60px' }}
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
      <section className="container" style={{ paddingBottom: '3rem' }}>
        <div className="notfound">
          <h1>Not found</h1>
          <p>The requested candidate does not exist.</p>
          <button type="button" className="btn outline small" onClick={() => navigate('/candidates')}>
            Back to candidates
          </button>
        </div>
      </section>
    );
  }

  return (
    <main className="container stack" style={{ paddingBottom: '3rem' }}>
      <div className="actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" className="btn outline small" onClick={() => navigate('/candidates')}>
          Back to list
        </button>
        <div className="actions">
          <button type="button" className="btn ghost small" onClick={handleCopyLink}>
            Copy link
          </button>
          <button
            type="button"
            className="btn btn-primary small"
            onClick={() => window.open(`mailto:${candidate.email}`, '_blank')}
          >
            Request interview
          </button>
        </div>
      </div>

      <section className="hero">
        <div className="photo" aria-hidden="true">
          <img src={candidate.profilePhoto} alt={candidate.fullName} onError={handleImageError} />
        </div>
        <div>
          <h1 className="name">
            {candidate.fullName} • {candidate.id}
          </h1>
          <div className="title">
            {candidate.title} · {candidate.seniority} · {candidate.yearsExp} yrs
          </div>
          <div className="meta-line">
            <span>
              {candidate.locationCity}, {candidate.locationCountry}
            </span>
            <span>{candidate.timezone}</span>
            <span>Availability {candidate.availabilityLeadTime}</span>
          </div>
          <div className="chips">
            {[candidate.primarySkill, ...candidate.skills.slice(0, 4)].map((skill) => (
              <span key={skill} className="chip">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

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
            renderEditable('overview', true)
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>
              {details.overview || candidate.summary || 'No overview available.'}
            </p>
          )}

          {details.careerHighlights && details.careerHighlights.length > 0 && !editMode && (
            <>
              <h3>Career Highlights</h3>
              <ul style={{ paddingLeft: 'var(--sp-24)', marginTop: 'var(--sp-12)' }}>
                {details.careerHighlights.map((highlight) => (
                  <li
                    key={highlight}
                    style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)', marginBottom: 'var(--sp-8)' }}
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </>
          )}

          {editMode && renderEditable('careerHighlights', true)}

          <h3>Core Skills</h3>
          <div className="chips">
            {(details.coreCompetencies || candidate.skills || []).map((skill) => (
              <span key={skill} className="chip">
                {skill}
              </span>
            ))}
          </div>

          <h3>Experience</h3>
          <div className="timeline">
            {candidate.experience.map((experience) => (
              <div key={`${experience.company}-${experience.start}`} className="item">
                <p className="role">{experience.role}</p>
                <p className="where">{experience.company}</p>
                <p className="period">
                  {experience.start} – {experience.end}
                </p>
                {experience.highlights && experience.highlights.length > 0 && (
                  <ul>
                    {experience.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <h3>Education</h3>
          <div className="timeline">
            {candidate.education.map((education) => (
              <div key={`${education.institution}-${education.degree}`} className="item">
                <p className="role">{education.degree}</p>
                <p className="where">{education.institution}</p>
                <p className="period">{education.year || '—'}</p>
              </div>
            ))}
          </div>

          {details.certifications && details.certifications.length > 0 && !editMode && (
            <>
              <h3>Certifications</h3>
              <ul style={{ paddingLeft: 'var(--sp-24)', marginTop: 'var(--sp-12)' }}>
                {details.certifications.map((certification) => (
                  <li
                    key={certification}
                    style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)', marginBottom: 'var(--sp-8)' }}
                  >
                    {certification}
                  </li>
                ))}
              </ul>
            </>
          )}

          {editMode && renderEditable('certifications', true)}

          <h3>Languages</h3>
          <div className="chips">
            {candidate.languages.map((language) => (
              <span key={language} className="chip">
                {language}
              </span>
            ))}
          </div>

          {details.additionalInfo && !editMode ? (
            <>
              <h3>Additional Information</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)', marginTop: 'var(--sp-12)' }}>
                {details.additionalInfo}
              </p>
            </>
          ) : null}

          {editMode && renderEditable('additionalInfo')}
        </article>

        <aside className="section">
          <h2>Engagement</h2>
          <div className="kv">
            <span>Seniority</span>
            <strong>{candidate.seniority}</strong>
          </div>
          <div className="kv">
            <span>Primary skill</span>
            <strong>{candidate.primarySkill}</strong>
          </div>
          <div className="kv">
            <span>Years of experience</span>
            <strong>{candidate.yearsExp}</strong>
          </div>
          <div className="kv">
            <span>Availability lead time</span>
            <strong>{candidate.availabilityLeadTime}</strong>
          </div>
          <div className="kv">
            <span>Work window</span>
            <strong>{candidate.workWindow}</strong>
          </div>
          <div className="kv">
            <span>Compensation</span>
            <strong>{formatSalaryRange(candidate.salaryRangePKR)}</strong>
          </div>

          <h2 style={{ marginTop: '24px' }}>Contact</h2>
          <div className="kv">
            <span>Email</span>
            <strong>
              <a href={`mailto:${candidate.email}`}>{candidate.email}</a>
            </strong>
          </div>
          <div className="kv">
            <span>Phone</span>
            <strong>
              <a href={`tel:${candidate.phone}`}>{candidate.phone}</a>
            </strong>
          </div>
          <div className="kv">
            <span>Location</span>
            <strong>
              {candidate.locationCity}, {candidate.locationCountry}
            </strong>
          </div>

          <div className="stack" style={{ marginTop: 24, gap: 12 }}>
            <button
              type="button"
              className="btn btn-primary small"
              onClick={() => window.open(`mailto:${candidate.email}`, '_blank')}
            >
              Email
            </button>
            <button
              type="button"
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
