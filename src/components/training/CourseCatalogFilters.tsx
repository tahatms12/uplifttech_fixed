import React from 'react';

export interface CatalogFiltersState {
  difficulty: string;
  duration: string;
  category: string;
  status: string;
  requirement: string;
  sort: string;
}

interface CourseCatalogFiltersProps {
  categories: string[];
  value: CatalogFiltersState;
  onChange: (next: CatalogFiltersState) => void;
}

const CourseCatalogFilters: React.FC<CourseCatalogFiltersProps> = ({ categories, value, onChange }) => {
  const update = (key: keyof CatalogFiltersState, nextValue: string) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
      <label className="text-xs text-gray-300">
        Difficulty
        <select
          className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
          value={value.difficulty}
          onChange={(event) => update('difficulty', event.target.value)}
        >
          <option value="all">All</option>
          <option value="Foundational">Foundational</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </label>
      <label className="text-xs text-gray-300">
        Duration
        <select
          className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
          value={value.duration}
          onChange={(event) => update('duration', event.target.value)}
        >
          <option value="all">All</option>
          <option value="short">Under 30 min</option>
          <option value="medium">30-60 min</option>
          <option value="long">60-120 min</option>
          <option value="extended">120+ min</option>
        </select>
      </label>
      <label className="text-xs text-gray-300">
        Category
        <select
          className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
          value={value.category}
          onChange={(event) => update('category', event.target.value)}
        >
          <option value="all">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-gray-300">
        Status
        <select
          className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
          value={value.status}
          onChange={(event) => update('status', event.target.value)}
        >
          <option value="all">All</option>
          <option value="not-started">Not started</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <label className="text-xs text-gray-300">
        Required
        <select
          className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
          value={value.requirement}
          onChange={(event) => update('requirement', event.target.value)}
        >
          <option value="all">All</option>
          <option value="required">Required</option>
          <option value="optional">Optional</option>
        </select>
      </label>
      <label className="text-xs text-gray-300">
        Sort
        <select
          className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
          value={value.sort}
          onChange={(event) => update('sort', event.target.value)}
        >
          <option value="recommended">Recommended</option>
          <option value="newest">Newest</option>
          <option value="shortest">Shortest</option>
          <option value="relevant">Most relevant</option>
        </select>
      </label>
    </div>
  );
};

export default CourseCatalogFilters;
