import React from 'react';
import { useParams } from 'react-router-dom';
import CandidateDetailTemplate from '../components/candidates/CandidateDetailTemplate';
import { candidatesById } from '../data/candidates';
import MetaTags from '../components/seo/MetaTags';

const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const candidate = id ? candidatesById[id] : undefined;

  if (!candidate) {
    return (
      <div className="container-custom pt-24 pb-16">
        <MetaTags title="Candidate not found" description="The requested candidate profile could not be found." />
        <div className="p-10 rounded-xl border border-neutral-800 bg-gray-900 text-center space-y-4">
          <h1 className="text-3xl font-semibold">Candidate not found</h1>
          <p className="text-white/70">The requested candidate does not exist. Return to the candidates directory to browse available profiles.</p>
          <a href="/candidates" className="text-electric-violet font-semibold underline">Back to candidates</a>
        </div>
      </div>
    );
  }

  const pageDescription = `${candidate.fullName} is a ${candidate.seniority.toLowerCase()} ${candidate.title} with ${candidate.yearsExp} years of experience and availability ${candidate.availabilityLeadTime}.`;

  return (
    <>
      <MetaTags title={`${candidate.fullName} - ${candidate.title}`} description={pageDescription} />
      <CandidateDetailTemplate candidate={candidate} />
    </>
  );
};

export default CandidateDetailPage;
