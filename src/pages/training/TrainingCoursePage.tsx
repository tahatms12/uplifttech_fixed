import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import curriculum from '../../data/training/exports/curriculum.generated.json';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import ModuleStepper from '../../components/training/ModuleStepper';
import CourseStepper from '../../components/training/CourseStepper';
import { useTrainingProgress } from '../../components/training/useTrainingProgress';
import { buildModuleObjectives } from '../../lib/trainingPolicy';
import { trainingApi } from '../../lib/trainingApi';
import { useTrainingRole } from '../../hooks/useTrainingRole';

const TrainingCoursePage: React.FC = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { role } = useTrainingRole();
  const course = useMemo(() => (curriculum as any).courses?.find((c: any) => c.id === courseId), [courseId]);
  const { progressByCourse, progressByStep, curriculumVersion, catalogVersion } = useTrainingProgress({ courseId });

  if (!course) return <div className="text-gray-200">Course not found.</div>;
  const modules = course.modules || [];
  if (!modules.length) {
    return <div className="text-gray-200">Course modules not available.</div>;
  }

  const activeModule =
    modules.find((module: any) => module.id === moduleId) || modules[0];
  const activeLesson =
    activeModule?.lessons?.find((lesson: any) => lesson.id === lessonId) || activeModule?.lessons?.[0];

  useEffect(() => {
    if (!courseId || !activeModule || !activeLesson) return;
    if (!moduleId || !lessonId) {
      navigate(`/training/course/${courseId}/module/${activeModule.id}/lesson/${activeLesson.id}`, { replace: true });
    }
  }, [courseId, moduleId, lessonId, activeModule, activeLesson, navigate]);

  const courseProgress = progressByCourse.get(course.id);
  const completedLessons = courseProgress?.lessons?.filter((lesson) => lesson.completed).length ?? 0;
  const totalLessons =
    courseProgress?.lessons?.length ??
    modules.reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0);

  const objectives = buildModuleObjectives(activeModule?.title || 'this module');

  const moduleLockMap = new Map<string, { locked: boolean; reason?: string }>();
  modules.forEach((module: any, index: number) => {
    if (index === 0) {
      moduleLockMap.set(module.id, { locked: false });
      return;
    }
    const previous = modules[index - 1];
    const previousLessons = previous?.lessons || [];
    const allPreviousComplete = previousLessons.every(
      (lesson: any) => progressByStep.get(lesson.id)?.completed
    );
    moduleLockMap.set(module.id, {
      locked: !allPreviousComplete,
      reason: !allPreviousComplete ? 'Complete the previous module to unlock.' : undefined,
    });
  });

  const hasRoleAccess = !role || (course.audience || course.roleTags || []).includes(role);

  const handleModuleSelect = (nextModuleId: string) => {
    const nextModule = modules.find((module: any) => module.id === nextModuleId) || modules[0];
    const nextLesson = nextModule?.lessons?.[0];
    if (!nextLesson) return;
    navigate(`/training/course/${course.id}/module/${nextModule.id}/lesson/${nextLesson.id}`);
  };

  const handleLessonChange = (nextLessonId: string) => {
    navigate(`/training/course/${course.id}/module/${activeModule.id}/lesson/${nextLessonId}`);
  };

  const quizProgressMap = useMemo(() => {
    const map = new Map<string, any>();
    courseProgress?.quizzes?.forEach((quiz) => map.set(quiz.quizId, quiz));
    return map;
  }, [courseProgress]);

  const handleCertificate = async () => {
    const res = await trainingApi.issueCertificate({
      courseId: course.id,
      curriculumVersion,
      catalogVersion,
      idempotencyKey: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    });
    if (res.status !== 200) return;
    await trainingApi.events({
      eventType: 'certificate_issued',
      courseId: course.id,
      moduleId: activeModule.id,
      lessonId: activeLesson.id,
      curriculumVersion,
      catalogVersion,
      idempotencyKey: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    });
    window.open(`/api/training/certificates/pdf?courseId=${encodeURIComponent(course.id)}`, '_blank');
  };

  if (!hasRoleAccess) {
    return (
      <div className="space-y-4">
        <TrainingNoIndexHelmet />
        <h1 className="text-2xl font-bold">Course access restricted</h1>
        <p className="text-sm text-gray-300">
          Your current role does not include access to this course. Update your role selection on the dashboard to
          continue.
        </p>
        <Link to="/training/dashboard" className="inline-flex underline text-indigo-300">
          Return to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TrainingNoIndexHelmet />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-300">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/training/dashboard" className="underline text-indigo-300">
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>{course.title}</li>
          <li aria-hidden="true">/</li>
          <li>{activeModule?.title}</li>
          <li aria-hidden="true">/</li>
          <li>{activeLesson?.title}</li>
        </ol>
      </nav>
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-gray-300">{course.description || 'Not specified.'}</p>
        <div className="text-xs text-gray-400">
          Audience: {(course.audience || course.roleTags || []).join(', ') || 'Not specified'}
        </div>
        <div className="text-xs text-amber-300">
          Completion of this training does not confer HIPAA certification. Training uses fictional or de-identified examples only.
        </div>
      </header>

      <div className="text-sm text-gray-300">
        {courseProgress ? (
          <span>
            Progress: {completedLessons}/{totalLessons}
            {courseProgress.completed ? ' • Completed' : ''}
          </span>
        ) : null}
      </div>

      <section className="bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Module objectives</h2>
        <ul className="list-disc list-inside text-sm text-gray-200">
          {objectives.map((objective) => (
            <li key={objective.id}>{objective.text}</li>
          ))}
        </ul>
      </section>

      <ModuleStepper
        modules={modules.map((module: any) => {
          const lock = moduleLockMap.get(module.id);
          return {
            id: module.id,
            title: module.title,
            locked: lock?.locked,
            lockedReason: lock?.reason,
          };
        })}
        activeModuleId={activeModule?.id || modules[0].id}
        onSelect={handleModuleSelect}
      />

      {moduleLockMap.get(activeModule?.id || '')?.locked ? (
        <div className="bg-gray-800 p-4 rounded border border-amber-500 text-amber-200">
          {moduleLockMap.get(activeModule?.id || '')?.reason}
        </div>
      ) : null}

      {!moduleLockMap.get(activeModule?.id || '')?.locked ? (
        <div id={`module-panel-${activeModule?.id || 'module'}`} role="tabpanel">
          <CourseStepper
            courseId={course.id}
            moduleId={activeModule?.id || ''}
            moduleTitle={activeModule?.title || ''}
            lessons={activeModule?.lessons || []}
            activeLessonId={activeLesson?.id}
            lessonProgress={progressByStep}
            quizProgress={quizProgressMap}
            curriculumVersion={curriculumVersion || undefined}
            catalogVersion={catalogVersion || undefined}
            onLessonChange={handleLessonChange}
          />
        </div>
      ) : null}

      {courseProgress?.completed ? (
        <section className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Certificate</h2>
          <p className="text-sm text-gray-300">
            Download your certificate of completion. This certificate does not indicate HIPAA certification.
          </p>
          <button
            type="button"
            className="mt-3 px-4 py-2 rounded bg-indigo-600 text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
            onClick={handleCertificate}
          >
            Download certificate
          </button>
        </section>
      ) : null}
    </div>
  );
};

export default TrainingCoursePage;
