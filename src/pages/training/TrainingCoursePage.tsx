import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import catalog from '../../data/training/exports/courseCatalog.builder.json';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import DayStepper from '../../components/training/DayStepper';
import CourseStepper from '../../components/training/CourseStepper';

const TrainingCoursePage: React.FC = () => {
  const { courseId } = useParams();
  const course = useMemo(() => (catalog as any).courses?.find((c: any) => c.id === courseId), [courseId]);
  const [activeDay, setActiveDay] = useState(1);

  if (!course) return <div className="text-gray-200">Course not found.</div>;
  const day = course.days.find((d: any) => d.dayNumber === activeDay) || course.days[0];

  return (
    <div className="space-y-4">
      <TrainingNoIndexHelmet />
      <header className="space-y-2">
        <h2 className="text-2xl font-bold">{course.title}</h2>
        <p className="text-gray-300">{course.summary}</p>
        <div className="text-xs text-gray-400">Roles: {course.roles.join(', ')} | Tags: {course.tags.join(', ')}</div>
      </header>
      <DayStepper days={course.days} activeDay={day.dayNumber} onSelect={setActiveDay} />
      <div id={`day-panel-${day.dayNumber}`} role="tabpanel">
        <CourseStepper courseId={course.id} dayNumber={day.dayNumber} steps={day.steps} />
      </div>
    </div>
  );
};

export default TrainingCoursePage;
