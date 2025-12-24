import React, { useMemo, useState } from 'react';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import { useTrainingRole } from '../../hooks/useTrainingRole';
import { trainingCatalog, flattenLessons } from '../../data/training/trainingCatalog';
import RoleSelector from '../../components/training/RoleSelector';
import CourseCatalogFilters, { CatalogFiltersState } from '../../components/training/CourseCatalogFilters';
import CourseCard from '../../components/training/CourseCard';
import { progressService } from '../../components/training/ProgressService';
import { useTrainingProgressState } from '../../components/training/useTrainingProgressState';

const defaultFilters: CatalogFiltersState = {
  difficulty: 'all',
  duration: 'all',
  category: 'all',
  status: 'all',
  requirement: 'all',
  sort: 'recommended',
};

const TrainingCoursesPage: React.FC = () => {
  const { role, setRole } = useTrainingRole();
  const { state } = useTrainingProgressState();
  const [filters, setFilters] = useState<CatalogFiltersState>(defaultFilters);
  const [query, setQuery] = useState('');

  const categories = useMemo(
    () => Array.from(new Set(trainingCatalog.courses.map((course) => course.category))),
    []
  );

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const roleId = role;
    let filtered = trainingCatalog.courses.filter((course) => {
      const matchesQuery = normalizedQuery
        ? course.title.toLowerCase().includes(normalizedQuery) || course.description.toLowerCase().includes(normalizedQuery)
        : true;
      const matchesDifficulty = filters.difficulty === 'all' ? true : course.difficulty === filters.difficulty;
      const matchesCategory = filters.category === 'all' ? true : course.category === filters.category;
      const matchesRequirement =
        filters.requirement === 'all'
          ? true
          : roleId
            ? filters.requirement === 'required'
              ? course.roleMappings[roleId]?.required
              : !course.roleMappings[roleId]?.required
            : true;

      const matchesDuration = (() => {
        if (filters.duration === 'all') return true;
        if (filters.duration === 'short') return course.estMinutes <= 30;
        if (filters.duration === 'medium') return course.estMinutes > 30 && course.estMinutes <= 60;
        if (filters.duration === 'long') return course.estMinutes > 60 && course.estMinutes <= 120;
        return course.estMinutes > 120;
      })();

      const statusMatch = (() => {
        if (filters.status === 'all') return true;
        const lessonIds = flattenLessons(course).map((lesson) => lesson.id);
        const percent = progressService.getProgressPercent(course.id, lessonIds);
        if (filters.status === 'not-started') return percent === 0;
        if (filters.status === 'completed') return percent === 100;
        return percent > 0 && percent < 100;
      })();

      return matchesQuery && matchesDifficulty && matchesCategory && matchesRequirement && matchesDuration && statusMatch;
    });

    const roleOrder = (course: typeof filtered[number]) =>
      roleId && course.roleMappings[roleId] ? course.roleMappings[roleId].order : 999;

    filtered = filtered.sort((a, b) => {
      if (filters.sort === 'newest') return (b.roleMappings[roleId]?.order ?? 0) - (a.roleMappings[roleId]?.order ?? 0);
      if (filters.sort === 'shortest') return a.estMinutes - b.estMinutes;
      if (filters.sort === 'relevant') return roleOrder(a) - roleOrder(b);
      return roleOrder(a) - roleOrder(b);
    });

    return filtered;
  }, [query, filters, role, state]);

  return (
    <div className="space-y-6">
      <TrainingNoIndexHelmet />
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Course catalog</h1>
        <p className="text-sm text-gray-300">Filter by role, requirement, or duration to find the right training.</p>
        <div className="text-xs text-amber-300">
          Completion does not confer HIPAA certification. Training content uses fictional or de-identified examples only.
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <RoleSelector roles={trainingCatalog.roles} value={role} onChange={setRole} />
        <label className="md:col-span-2 text-sm text-gray-200">
          Search courses
          <input
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, skills, or outcomes"
          />
        </label>
      </section>

      <CourseCatalogFilters categories={categories} value={filters} onChange={setFilters} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course) => {
          const lessonIds = flattenLessons(course).map((lesson) => lesson.id);
          const progressPercent = progressService.getProgressPercent(course.id, lessonIds);
          const nextLessonId = progressService.getNextLessonId(course.id, lessonIds);
          const nextLessonTitle = flattenLessons(course).find((lesson) => lesson.id === nextLessonId)?.title;
          const required = role ? course.roleMappings[role]?.required : undefined;
          return (
            <CourseCard
              key={course.id}
              course={course}
              progressPercent={progressPercent}
              nextLessonTitle={nextLessonTitle}
              required={required}
            />
          );
        })}
      </section>
    </div>
  );
};

export default TrainingCoursesPage;
