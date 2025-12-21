import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import curriculum from '../../data/training/exports/curriculum.generated.json';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import ModuleStepper from '../../components/training/ModuleStepper';
import CourseStepper from '../../components/training/CourseStepper';
import { useTrainingProgress } from '../../components/training/useTrainingProgress';

const TrainingCoursePage: React.FC = () => {
  const { courseId } = useParams();
  const course = useMemo(() => (curriculum as any).courses?.find((c: any) => c.id === courseId), [courseId]);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(course?.modules?.[0]?.id || null);
  const { loading: progressLoading, error: progressError, refresh, progressByCourse, progressByStep } =
    useTrainingProgress({ courseId });

  useEffect(() => {
    setActiveModuleId(course?.modules?.[0]?.id || null);
  }, [courseId, course]);

  if (!course) return <div className="text-gray-200">Course not found.</div>;
  const modules = course.modules || [];
  const activeModule = modules.find((module: any) => module.id === activeModuleId) || modules[0];
  if (!modules.length) {
    return <div className="text-gray-200">Course modules not available.</div>;
  }
  const courseProgress = progressByCourse.get(course.id);
  const completedLessons = courseProgress?.lessons?.filter((lesson) => lesson.completed).length ?? 0;
  const totalLessons =
    courseProgress?.lessons?.length ??
    modules.reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0);
  const percent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="space-y-4">
      <TrainingNoIndexHelmet />
      <header className="space-y-2">
        <h2 className="text-2xl font-bold">{course.title}</h2>
        <p className="text-gray-300">{course.description || 'Not specified.'}</p>
        <div className="text-xs text-gray-400">
          Audience: {(course.audience || course.roleTags || []).join(', ') || 'Not specified'}
        </div>
        {progressLoading ? <p className="text-xs text-gray-400">Loading progress...</p> : null}
        {progressError && !progressLoading ? <p className="text-xs text-red-400">Progress unavailable.</p> : null}
        {courseProgress ? (
          <div className="text-xs text-gray-300">
            {courseProgress.completed ? (
              <span className="text-green-400">Completed {courseProgress.completedAt ? `on ${courseProgress.completedAt}` : ''}</span>
            ) : (
              <span>
                Completion: {completedLessons}/{totalLessons} ({percent}%)
              </span>
            )}
            {courseProgress.totalTimeSeconds ? (
              <span className="ml-2">• {Math.round(courseProgress.totalTimeSeconds / 60)} min active</span>
            ) : null}
          </div>
        ) : null}
      </header>
      <ModuleStepper
        modules={modules.map((module: any) => ({ id: module.id, title: module.title }))}
        activeModuleId={activeModule?.id}
        onSelect={setActiveModuleId}
      />
      <div id={`module-panel-${activeModule?.id || 'module'}`} role="tabpanel">
        <CourseStepper
          courseId={course.id}
          moduleId={activeModule?.id || ''}
          lessons={activeModule?.lessons || []}
          stepProgress={progressByStep}
          curriculumVersion={(curriculum as any).curriculumVersion}
          catalogVersion={(curriculum as any).generatedAt}
          onComplete={() => refresh()}
        />
      </div>
    </div>
  );
};

export default TrainingCoursePage;
