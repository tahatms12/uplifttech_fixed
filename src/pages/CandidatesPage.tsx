import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CandidateCard from '../components/candidates/CandidateCard';
import { CANDIDATES, type Candidate } from '../data/candidate';
import '../styles/theme.css';

interface GridState {
  q: string;
  seniority: string[];
  primary: string[];
  tz: string;
  sort: 'relevance' | 'exp' | 'name';
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
  per: 12
};

const applySearchTokens = (candidate: Candidate, queryParts: string[]) => {
  if (!queryParts.length) {
    return true;
  }

  const tokens = candidate._tokens ?? [];
  return queryParts.every((part) => tokens.includes(part));
};

const CandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<GridState>(DEFAULT_STATE);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setState((previous) => ({
      ...previous,
      q: params.q ?? '',
      seniority: params.seniority ? params.seniority.split(',') : [],
      primary: params.primary ? params.primary.split(',') : [],
      tz: params.tz ?? '',
      sort: (params.sort as GridState['sort']) || 'relevance',
      page: Number.parseInt(params.page ?? '1', 10) || 1,
      per: Number.parseInt(params.per ?? '12', 10) || 12
    }));
  }, [searchParams]);

  const primaryOptions = useMemo(() => {
    return Array.from(new Set(CANDIDATES.map((candidate) => candidate.primarySkill))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, []);

  const timezoneOptions = useMemo(() => {
    return Array.from(new Set(CANDIDATES.map((candidate) => candidate.timezone))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, []);

  const filteredCandidates = useMemo(() => {
    const query = state.q.trim().toLowerCase();
    const parts = query.split(/\s+/).filter(Boolean);
    let list = CANDIDATES.filter((candidate) => applySearchTokens(candidate, parts));

    if (state.seniority.length) {
      const allowed = new Set(state.seniority);
      list = list.filter((candidate) => allowed.has(candidate.seniority));
    }

    if (state.primary.length) {
      const allowed = new Set(state.primary);
      list = list.filter((candidate) => allowed.has(candidate.primarySkill));
    }

    if (state.tz) {
      list = list.filter((candidate) => candidate.timezone === state.tz);
    }

    switch (state.sort) {
      case 'exp':
        list = [...list].sort((a, b) => b.yearsExp - a.yearsExp);
        break;
      case 'name':
        list = [...list].sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      default:
        if (parts.length) {
          list = [...list].sort((a, b) => {
            const aMatch = Number(
              a.fullName.toLowerCase().includes(query) || a.title.toLowerCase().includes(query)
            );
            const bMatch = Number(
              b.fullName.toLowerCase().includes(query) || b.title.toLowerCase().includes(query)
            );
            if (bMatch !== aMatch) {
              return bMatch - aMatch;
            }
            return b.yearsExp - a.yearsExp;
          });
        }
        break;
    }

    return list;
  }, [state]);

  const pages = Math.max(1, Math.ceil(filteredCandidates.length / state.per));
  const currentPage = Math.min(state.page, pages);
  const startIndex = (currentPage - 1) * state.per;
  const currentItems = filteredCandidates.slice(startIndex, startIndex + state.per);

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateQuery({ q: event.target.value, page: 1 });
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = event.target;

    switch (id) {
      case 'seniority':
        updateQuery({ seniority: value ? [value] : [], page: 1 });
        break;
      case 'primary':
        updateQuery({ primary: value ? [value] : [], page: 1 });
        break;
      case 'tz':
        updateQuery({ tz: value, page: 1 });
        break;
      case 'sort':
        updateQuery({ sort: value as GridState['sort'] });
        break;
      default:
        break;
    }
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number.parseInt(event.target.value, 10) || 12;
    updateQuery({ per: value, page: 1 });
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    const nextPage = direction === 'prev' ? Math.max(1, currentPage - 1) : Math.min(pages, currentPage + 1);
    updateQuery({ page: nextPage });
  };

  const clearFilters = () => {
    updateQuery({ ...DEFAULT_STATE });
  };

  return (
    <main className="container stack" style={{ paddingBottom: '3rem' }}>
      <h1>Available Candidates</h1>
      <p>Search and refine to find a match. Press Enter on a card to open a profile.</p>

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
              {primaryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="control">
            <span>Timezone</span>
            <select id="tz" className="select" value={state.tz} onChange={handleFilterChange}>
              <option value="">Any</option>
              {timezoneOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
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
            <label className="subtle" htmlFor="per-page">
              Per page
            </label>
            <select
              id="per-page"
              className="select select-per"
              value={state.per}
              onChange={handlePerPageChange}
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </select>
            <button type="button" className="btn ghost small" onClick={clearFilters}>
              Clear
            </button>
          </div>
        </div>
      </section>

      <section className="list grid" role="grid">
        {currentItems.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onClick={() => navigate(`/candidates/${candidate.id}`)}
          />
        ))}
      </section>

      <nav className="pagination" aria-label="Pagination controls">
        <button
          type="button"
          className="btn outline small"
          onClick={() => handlePageChange('prev')}
          disabled={currentPage <= 1}
        >
          &larr;
        </button>
        <span className="subtle">
          Page {currentPage} of {pages}
        </span>
        <button
          type="button"
          className="btn outline small"
          onClick={() => handlePageChange('next')}
          disabled={currentPage >= pages}
        >
          &rarr;
        </button>
      </nav>
    </main>
  );
};

export default CandidatesPage;
