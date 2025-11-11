import React from 'react';
import { Helmet } from 'react-helmet';
import CandidateApplicationWizard from '../components/forms/CandidateApplicationWizard';

const ApplyPage: React.FC = () => {
  return (
    <main className="bg-rich-black text-white">
      <Helmet>
        <title>Apply for Remote Roles | UPLIFT Technologies</title>
        <meta
          name="description"
          content="Submit your resume for remote roles at UPLIFT Technologies. Upload a PDF or DOCX resume and complete our quick three-step application."
        />
      </Helmet>

      <section className="bg-[radial-gradient(circle_at_top,_rgba(11,99,246,0.35),_transparent_60%)] pt-32 pb-16">
        <div className="container-custom max-w-5xl">
          <h1 className="text-4xl font-semibold text-white">Join our remote talent bench</h1>
          <p className="mt-4 text-lg text-white/80">
            We build people-powered teams for sales, marketing, collections, and operations. Complete the three-step application
            to be considered for upcoming roles with our clients.
          </p>
          <ul className="mt-6 grid gap-3 text-sm text-white/70 sm:grid-cols-3">
            <li className="rounded-2xl border border-white/10 bg-white/5 p-4">Resume parsing highlights key details automatically.</li>
            <li className="rounded-2xl border border-white/10 bg-white/5 p-4">Save-as-you-go with persistent fields across steps.</li>
            <li className="rounded-2xl border border-white/10 bg-white/5 p-4">Mobile-friendly upload with 5MB file limit.</li>
          </ul>
        </div>
      </section>

      <section className="container-custom pb-20">
        <CandidateApplicationWizard />
      </section>
    </main>
  );
};

export default ApplyPage;
