import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, User } from 'lucide-react';
import CandidateCard from '../components/candidates/CandidateCard';
import { CANDIDATES, type Candidate } from '../data/candidate';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="pt-28 sm:pt-32 pb-12 container-custom">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="mb-4">Available Candidates</h1>
        <p className="text-neutral-400">Search and refine to find a match. Press Enter on a card to open a profile.</p>
      </motion.div>

      <motion.section
        className="glass-card mb-8 p-4 sm:p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex flex-col gap-4 mb-6" role="group" aria-label="Search and filters">
          {/* Search Input */}
          <label className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-base">
              <Search size={16} />
              Search
            </span>
            <input
              id="q"
              className="w-full px-4 py-3 bg-gray-800 border border-neutral-700 rounded-md text-base placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent transition-all"
              type="search"
              value={state.q}
              onChange={handleSearchChange}
              placeholder="Name, skill, title, city, country"
            />
          </label>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-base">
                <Filter size={16} />
                Seniority
              </span>
              <select 
                id="seniority" 
                className="w-full px-4 py-3 bg-gray-800 border border-neutral-700 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent transition-all"
                value={state.seniority[0] || ''} 
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-base">Primary Skill</span>
              <select 
                id="primary" 
                className="w-full px-4 py-3 bg-gray-800 border border-neutral-700 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent transition-all"
                value={state.primary[0] || ''} 
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                {primaryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-base">Timezone</span>
              <select 
                id="tz" 
                className="w-full px-4 py-3 bg-gray-800 border border-neutral-700 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent transition-all"
                value={state.tz} 
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                {timezoneOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-base">Sort</span>
              <select 
                id="sort" 
                className="w-full px-4 py-3 bg-gray-800 border border-neutral-700 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent transition-all"
                value={state.sort} 
                onChange={handleFilterChange}
              >
                <option value="relevance">Relevance</option>
                <option value="exp">Years of experience desc</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-800/50 border border-neutral-700 rounded-lg">
          <div className="flex items-center gap-2 font-bold text-base">
            <User size={18} />
            <span>Showing {currentItems.length} of {filteredCandidates.length} candidates</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-sm text-neutral-400">
              Per page
              <select
                id="per-page"
                className="px-3 py-2 bg-gray-800 border border-neutral-700 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-electric-violet transition-all"
                value={state.per}
                onChange={handlePerPageChange}
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
            </label>
            <button 
              type="button" 
              className="px-4 py-2 text-sm bg-transparent border border-neutral-700 text-neutral-400 hover:text-base hover:bg-gray-800 rounded-md transition-all"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
      </motion.section>

      {/* Candidates Grid */}
      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        role="grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {currentItems.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            variants={itemVariants}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <CandidateCard
              candidate={candidate}
              onClick={() => navigate(`/candidates/${candidate.id}`)}
            />
          </motion.div>
        ))}
      </motion.section>

      {/* Pagination */}
      <motion.nav
        className="flex items-center justify-end gap-4 mt-8 flex-wrap"
        aria-label="Pagination controls"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <button
          type="button"
          className="px-4 py-2 text-sm bg-transparent border border-neutral-700 text-electric-violet hover:border-electric-violet hover:bg-electric-violet/10 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange('prev')}
          disabled={currentPage <= 1}
        >
          &larr; Previous
        </button>
        <span className="text-sm text-neutral-400">
          Page {currentPage} of {pages}
        </span>
        <button
          type="button"
          className="px-4 py-2 text-sm bg-transparent border border-neutral-700 text-electric-violet hover:border-electric-violet hover:bg-electric-violet/10 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange('next')}
          disabled={currentPage >= pages}
        >
          Next &rarr;
        </button>
      </motion.nav>
    </main>
  );
};

export default CandidatesPage;
