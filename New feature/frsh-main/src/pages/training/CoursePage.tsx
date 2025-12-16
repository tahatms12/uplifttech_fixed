import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { catalog, issueCertificate, sendEvent, submitQuiz } from '../../lib/trainingApi';
import { useTrainingUser } from '../../lib/useTrainingUser';

const CoursePage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useTrainingUser();
  const [status, setStatus] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [certCode, setCertCode] = useState('');
  const course = useMemo(() => catalog.find((c) => c.slug === courseId || c.id === courseId), [courseId]);

  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      const m = document.createElement('meta');
      m.name = 'robots';
      m.content = 'noindex,nofollow';
      document.head.appendChild(m);
    } else {
      meta.content = 'noindex,nofollow';
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate('/training');
  }, [user, loading, navigate]);

  if (!course) return <div className="max-w-3xl mx-auto py-10 text-white">Course not found</div>;
  if (!user) return null;

  const handleComplete = async (lessonId: string) => {
    await sendEvent({ courseId: course.id, lessonId, eventType: 'complete' });
    setStatus('Lesson marked complete.');
  };

  const handleQuiz = async (quizId: string) => {
    const answers = ['placeholder'];
    const result = await submitQuiz(course.id, quizId, answers);
    setScore(result.score);
    setStatus(result.passed ? 'Quiz passed' : 'Quiz attempt recorded');
  };

  const handleCertificate = async () => {
    const result = await issueCertificate(course.id, score || undefined);
    setCertCode(result.code);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-white">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-300 text-sm mb-4">Progressive learning with stepper navigation.</p>
      {status && <div className="text-sm text-green-400 mb-4">{status}</div>}
      {course.days.map((day) => (
        <div key={day.dayNumber} className="mb-6 border border-gray-700 rounded p-4">
          <h2 className="text-xl font-semibold mb-2">
            Module {day.dayNumber}: {day.dayTitle}
          </h2>
          <div className="space-y-3">
            {day.steps.map((step, index) => (
              <div key={step.stepId} className="p-3 border border-gray-600 rounded">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm uppercase text-gray-400">Lesson {index + 1}</div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>
                  <button
                    className="text-xs underline"
                    onClick={() => handleComplete(step.stepId)}
                    aria-label={`Mark lesson ${step.title} complete`}
                  >
                    Mark complete
                  </button>
                </div>
                <p className="text-sm text-gray-300 mt-2">{step.contentBlocks.join(' ')}</p>
              </div>
            ))}
          </div>
          <button
            className="mt-3 text-sm text-primary underline"
            onClick={() => handleQuiz(`module-${day.dayNumber}-quiz`)}
          >
            Take module quiz
          </button>
        </div>
      ))}
      <div className="border border-gray-700 rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Certificate</h3>
        <p className="text-sm text-gray-300 mb-2">Complete lessons and quizzes to unlock a certificate.</p>
        <button className="btn bg-primary text-bg" onClick={handleCertificate}>
          Generate certificate
        </button>
        {certCode && <div className="text-xs text-green-300 mt-2">Verification code: {certCode}</div>}
      </div>
    </div>
  );
};

export default CoursePage;
