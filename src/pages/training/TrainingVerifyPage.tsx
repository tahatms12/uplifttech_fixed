import React, { useState } from 'react';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import { trainingApi } from '../../lib/trainingApi';

const TrainingVerifyPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await trainingApi.certificateVerify(code);
    setResult(res.data || { status: res.status });
  };

  return (
    <div className="space-y-4">
      <TrainingNoIndexHelmet />
      <h2 className="text-2xl font-bold">Verify training code</h2>
      <form className="space-y-3" onSubmit={submit}>
        <label className="block text-sm">Verification code
          <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
        </label>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded focus-visible:ring-2 focus-visible:ring-indigo-400">Verify</button>
      </form>
      {result && <pre className="bg-gray-800 p-3 rounded text-xs whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

export default TrainingVerifyPage;
