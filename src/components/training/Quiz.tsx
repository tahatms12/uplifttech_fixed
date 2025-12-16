import React from 'react';

interface QuizProps {
  questions: { question: string }[];
  onSubmit?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = React.useState<Record<number, string>>({});

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      {questions.map((q, idx) => (
        <div key={idx} className="p-3 bg-gray-800 rounded">
          <p className="font-medium">{q.question}</p>
          <textarea
            className="w-full mt-2 p-2 rounded bg-gray-900 border border-gray-700"
            value={answers[idx] || ''}
            onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
            required
          />
        </div>
      ))}
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded focus-visible:ring-2 focus-visible:ring-indigo-400">
        Submit answers
      </button>
    </form>
  );
};

export default Quiz;
