import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CANDIDATES } from '../data/candidate';
import CandidateCard from '../components/candidates/CandidateCard';
import '../styles/theme.css';

interface GridState {
  q: string;
  seniority: string[];
  primary: string[];
  tz: string;
  sort: string;
  page: number;
  per: number;
}

const DEFAULT_STATE: GridState = {
  q: '',
  seniority: [],
  primary: [],
  tz: '',
  sort: 'relevance',
  page: 1,
  per: 12,
};

const CandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useState<GridState>(DEFAULT_STATE);

  // 🧠 Load state from query string on mount
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setState((prev) => ({
      ...prev,
      q: params.q || '',
      seniority: params.seniority ? params.seniority.split(',') : [],
      primary: params.primary ? params.primary.split(',') : [],
      tz: params.tz || '',
      sort: params.sort || 'relevance',
      page: parseInt(params.page || '1'),
      per: parseInt(params.per || '12'),
    }));
  }, [searchParams]);

  // 🧮 Derived lists
  const primaryOptions = useMemo(() => {
    const set = new Set(CANDIDATES.map((c) => c.primarySkill));
    return Array.from(set).sort();
  }, []);

  // 🧩 Filtering + Sorting logic
  const filteredCandidates = useMemo(() => {
    let list = [...CANDIDATES];

    const q = state.q.trim().toLowerCase();
    if (q) {
      const parts = q.split(/\s+/).filter(Boolean);
      list = list.filter((c) =>
        parts.every((p) => c._tokens?.includes(p))
      );
    }
    if (state.seniority.length) {
      const set = new Set(state.seniority);
      list = list.filter((c) => set.has(c.seniority));
    }
    if (state.primary.length) {
      const set = new Set(state.primary);
      list = list.filter((c) => set.has(c.primarySkill));
    }
    if (state.tz) {
      list = list.filter((c) => c.timezone === state.tz);
    }

    switch (state.sort) {
      case 'exp':
        list.sort((a, b) => b.yearsExp - a.yearsExp);
        break;
      case 'name':
        list.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      default:
        if (q) {
          list.sort((a, b) => {
            const as = +(a.fullName.toLowerCase().includes(q) || a.title.toLowerCase().includes(q));
            const bs = +(b.fullName.toLowerCase().includes(q) || b.title.toLowerCase().includes(q));
            if (bs !== as) return bs - as;
            return b.yearsExp - a.yearsExp;
          });
        }
    }

    return list;
  }, [state]);

  // 🔢 Pagination logic
  const pages = Math.max(1, Math.ceil(filteredCandidates.length / state.per));
  const currentPage = Math.min(state.page, pages);
  const start = (currentPage - 1) * state.per;
  const currentItems = filteredCandidates.slice(start, start + state.per);

  const updateQuery = (updates: Partial<GridState>) => {
    const newState = { ...state, ...updates };
    setState(newState);
    const params = new URLSearchParams();
    if (newState.q) params.set('q', newState.q);
    if (newState.seniority.length) params.set('seniority', newState.seniority.join(','));
    if (newState.primary.length) params.set('primary', newState.primary.join(','));
    if (newState.tz) params.set('tz', newState.tz);
    if (newState.sort !== 'relevance') params.set('sort', newState.sort);
    if (newState.page !== 1) params.set('page', String(newState.page));
    if (newState.per !== 12) params.set('per', String(newState.per));
    setSearchParams(params);
  };

  // 🧭 Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateQuery({ q: e.target.value, page: 1 });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    updateQuery({ [id]: value ? [value] : [], page: 1 } as any);
  };

  const handlePageChange = (dir: 'prev' | 'next') => {
    updateQuery({ page: dir === 'prev' ? Math.max(1, state.page - 1) : Math.min(pages, state.page + 1) });
  };

  return (
    <main className="container stack" style={{ paddingBottom: '3rem' }}>
      <h1>Available Candidates</h1>
      <p>Search and refine to find a match. Enter to open a profile.</p>

      {/* 🔍 Filters Section */}
      <section className="glass-card stack">
        <div className="controls" role="group" aria-label="Search and filters">
          <label className="control">
            <span>Search</span>
            <input
              id="q"
              className="input"
              type="search"
              value={state.q}
              onChange={handleSearchChange}
              placeholder="Name, skill, title, city, country"
            />
          </label>

          <label className="control">
            <span>Seniority</span>
            <select id="seniority" className="select" value={state.seniority[0] || ''} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </label>

          <label className="control">
            <span>Primary Skill</span>
            <select id="primary" className="select" value={state.primary[0] || ''} onChange={handleFilterChange}>
              <option value="">Any</option>
              {primaryOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <label className="control">
            <span>Timezone</span>
            <select id="tz" className="select" value={state.tz} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="UTC+5">UTC+5</option>
              <option value="UTC+3">UTC+3</option>
              <option value="UTC+2">UTC+2</option>
              <option value="UTC+0">UTC+0</option>
              <option value="UTC+4">UTC+4</option>
              <option value="UTC+8">UTC+8</option>
            </select>
          </label>

          <label className="control">
            <span>Sort</span>
            <select id="sort" className="select" value={state.sort} onChange={handleFilterChange}>
              <option value="relevance">Relevance</option>
              <option value="exp">Years of experience desc</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>

        <div className="results-bar">
          <output>
            Showing {currentItems.length} of {filteredCandidates.length} candidates
          </output>
          <div className="actions" style={{ gap: '6px' }}>
            <label className="subtle">Per page</label>
            <select
              className="select select-per"
              value={state.per}
              onChange={(e) => updateQuery({ per: parseInt(e.target.value), page: 1 })}
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </select>
            <button className="btn ghost small" onClick={() => updateQuery(DEFAULT_STATE)}>
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* 🧑‍💼 Candidates Grid */}
      <section className="list grid" role="grid">
        {currentItems.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} onClick={() => navigate(`/candidates/${candidate.id}`)} />
        ))}
      </section>

      {/* ⏩ Pagination */}
      <nav className="pagination" aria-label="Pagination">
        <button className="btn outline small" onClick={() => handlePageChange('prev')} disabled={state.page <= 1}>
          &larr;
        </button>
        <span className="subtle">Page {currentPage} of {pages}</span>
        <button className="btn outline small" onClick={() => handlePageChange('next')} disabled={state.page >= pages}>
          &rarr;
        </button>
      </nav>
    </main>
  );
};

export default CandidatesPage;
