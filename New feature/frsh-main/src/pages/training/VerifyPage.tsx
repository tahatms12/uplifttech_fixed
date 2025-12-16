import React, { useEffect, useState } from 'react';
import { verifyCertificate } from '../../lib/trainingApi';
import { useSearchParams } from 'react-router-dom';

const VerifyPage: React.FC = () => {
  const [params] = useSearchParams();
  const [result, setResult] = useState<any>(null);
  const code = params.get('code') || '';

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
    if (code) {
      verifyCertificate(code).then(setResult).catch(() => setResult({ valid: false }));
    }
  }, [code]);

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-white">
      <h1 className="text-3xl font-bold mb-3">Certificate Verification</h1>
      <p className="text-sm text-gray-300 mb-4">Enter the verification link to confirm authenticity.</p>
      {!code && <div className="text-yellow-300">Provide a verification code.</div>}
      {code && result && (
        <div className="mt-4 border border-gray-700 rounded p-4">
          {result.valid ? (
            <>
              <div className="text-green-400 font-semibold">Valid certificate</div>
              <div className="text-sm text-gray-300 mt-2">Holder: {result.user}</div>
              <div className="text-sm text-gray-300">Course: {result.courseId}</div>
              <div className="text-sm text-gray-300">Issued: {result.issued_at}</div>
            </>
          ) : (
            <div className="text-red-400">Certificate not found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
