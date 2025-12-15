import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import CandidateDetailTemplate from '../components/candidates/CandidateDetailTemplate';
import { candidatesById } from '../data/candidates';

const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const candidate = id ? candidatesById[id] : undefined;

  if (!candidate) {
    return (
      <div className="container-custom pt-24 pb-16">
        <Helmet>
          <title>Candidate not found | UPLIFT Technologies</title>
          <meta name="description" content="The requested candidate profile could not be found." />
        </Helmet>
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
      <Helmet>
        <title>{`${candidate.fullName} - ${candidate.title} Candidate | UPLIFT Technologies`}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <CandidateDetailTemplate candidate={candidate} />
    </>
  );
};

export default CandidateDetailPage;
