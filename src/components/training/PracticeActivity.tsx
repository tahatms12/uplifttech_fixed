import React, { useMemo, useState } from 'react';
import type { PracticeActivityData } from '../../lib/trainingPolicy';

interface PracticeActivityProps {
  activity: PracticeActivityData;
  onComplete?: () => void;
}

const PracticeActivity: React.FC<PracticeActivityProps> = ({ activity, onComplete }) => {
  const options = useMemo(
    () => activity.matchingPairs.map((pair) => pair.match),
    [activity.matchingPairs]
  );
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  const [matchingChecked, setMatchingChecked] = useState(false);
  const [scenarioChoice, setScenarioChoice] = useState<string>('');
  const [scenarioChecked, setScenarioChecked] = useState(false);

  const matchingComplete = useMemo(() => {
    if (!matchingChecked) return false;
    return activity.matchingPairs.every((pair) => matchingAnswers[pair.prompt] === pair.match);
  }, [activity.matchingPairs, matchingAnswers, matchingChecked]);

  const scenarioComplete = scenarioChecked && scenarioChoice === activity.scenario.correctOptionId;
  const complete = matchingComplete && scenarioComplete;

  const handleCheck = () => {
    const nextMatchingComplete = activity.matchingPairs.every(
      (pair) => matchingAnswers[pair.prompt] === pair.match
    );
    const nextScenarioComplete = scenarioChoice === activity.scenario.correctOptionId;
    setMatchingChecked(true);
    setScenarioChecked(true);
    if (nextMatchingComplete && nextScenarioComplete) {
      onComplete?.();
    }
  };

  return (
    <div className="space-y-6">
      <section aria-labelledby="practice-matching">
        <h4 id="practice-matching" className="text-lg font-semibold mb-2">
          Matching drill
        </h4>
        <div className="space-y-3">
          {activity.matchingPairs.map((pair) => {
            const selected = matchingAnswers[pair.prompt] || '';
            const isCorrect = matchingChecked && selected === pair.match;
            return (
              <div key={pair.prompt} className="flex flex-col gap-2 bg-gray-900 p-3 rounded">
                <label className="text-sm text-gray-200">
                  {pair.prompt}
                  <select
                    className="mt-1 w-full bg-gray-800 p-2 rounded border border-gray-700"
                    value={selected}
                    onChange={(event) =>
                      setMatchingAnswers((prev) => ({ ...prev, [pair.prompt]: event.target.value }))
                    }
                  >
                    <option value="">Select a match</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                {matchingChecked ? (
                  <p className={`text-xs ${isCorrect ? 'text-green-400' : 'text-red-300'}`}>
                    {isCorrect ? 'Correct match.' : `Correct answer: ${pair.match}`}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="practice-scenario" className="space-y-3">
        <h4 id="practice-scenario" className="text-lg font-semibold">
          Scenario response
        </h4>
        <p className="text-sm text-gray-200">{activity.scenario.prompt}</p>
        <div className="space-y-2">
          {activity.scenario.options.map((option) => (
            <label key={option.id} className="flex items-start gap-2 text-sm text-gray-200">
              <input
                type="radio"
                name="scenario"
                value={option.id}
                checked={scenarioChoice === option.id}
                onChange={(event) => setScenarioChoice(event.target.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {scenarioChecked && scenarioChoice ? (
          <p className={`text-xs ${scenarioComplete ? 'text-green-400' : 'text-red-300'}`}>
            {activity.scenario.options.find((option) => option.id === scenarioChoice)?.feedback}
          </p>
        ) : null}
      </section>

      <button
        type="button"
        className="px-4 py-2 rounded bg-indigo-600 text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
        onClick={handleCheck}
      >
        Check activity
      </button>
      {complete ? <p className="text-sm text-green-400">Practice activity complete.</p> : null}
    </div>
  );
};

export default PracticeActivity;
