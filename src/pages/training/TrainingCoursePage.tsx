import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import catalog from '../../data/training/exports/courseCatalog.builder.json';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import DayStepper from '../../components/training/DayStepper';
import CourseStepper from '../../components/training/CourseStepper';
import { useTrainingProgress } from '../../components/training/useTrainingProgress';

const TrainingCoursePage: React.FC = () => {
  const { courseId } = useParams();
  const course = useMemo(() => (catalog as any).courses?.find((c: any) => c.id === courseId), [courseId]);
  const [activeDay, setActiveDay] = useState(1);
  const { loading: progressLoading, error: progressError, refresh, progressByCourse, progressByStep } =
    useTrainingProgress({ courseId });

  if (!course) return <div className="text-gray-200">Course not found.</div>;
  const day = course.days.find((d: any) => d.dayNumber === activeDay) || course.days[0];
  const courseProgress = progressByCourse.get(course.id);
  const completedLessons = courseProgress?.lessons?.filter((lesson) => lesson.completed).length ?? 0;
  const totalLessons = courseProgress?.lessons?.length ?? day.steps.length;
  const percent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="space-y-4">
      <TrainingNoIndexHelmet />
      <header className="space-y-2">
        <h2 className="text-2xl font-bold">{course.title}</h2>
        <p className="text-gray-300">{course.summary}</p>
        <div className="text-xs text-gray-400">Roles: {course.roles.join(', ')} | Tags: {course.tags.join(', ')}</div>
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
      <DayStepper days={course.days} activeDay={day.dayNumber} onSelect={setActiveDay} />
      <div id={`day-panel-${day.dayNumber}`} role="tabpanel">
        <CourseStepper
          courseId={course.id}
          dayNumber={day.dayNumber}
          steps={day.steps}
          stepProgress={progressByStep}
          onComplete={() => refresh()}
        />
      </div>
    </div>
  );
};

export default TrainingCoursePage;
