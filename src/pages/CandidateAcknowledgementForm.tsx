import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

const CandidateAcknowledgementForm: React.FC = () => {
  const [formData, setFormData] = useState({
    technicalRequirements: false,
    interviewFormat: false,
    nextSteps: false,
    nonCompliance: false,
    candidateName: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleCheckboxChange = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all checkboxes are checked
    if (
      formData.technicalRequirements &&
      formData.interviewFormat &&
      formData.nextSteps &&
      formData.nonCompliance &&
      formData.candidateName.trim()
    ) {
      setIsSubmitting(true);
      setSubmitError(false);

      try {
        // Replace these with your actual EmailJS credentials
        const serviceId = 'service_04ty7fg'; // e.g., 'service_abc123'
        const templateId = 'template_znsp7eh'; // e.g., 'template_xyz789'
        const publicKey = 'aJW8lljt4LFwOzyor'; // e.g., 'abcdefghijklmnop'

        // Send email using EmailJS
        const result = await emailjs.send(
          serviceId,
          templateId,
          {
            candidate_name: formData.candidateName,
            technical_requirements: formData.technicalRequirements ? 'Agreed' : 'Not Agreed',
            interview_format: formData.interviewFormat ? 'Agreed' : 'Not Agreed',
            next_steps: formData.nextSteps ? 'Agreed' : 'Not Agreed',
            non_compliance: formData.nonCompliance ? 'Agreed' : 'Not Agreed',
            submission_date: new Date().toLocaleString('en-US', {
              dateStyle: 'full',
              timeStyle: 'short'
            }),
            to_name: 'UPLIFT Technologies HR Team',
          },
          publicKey
        );

        console.log('Acknowledgement sent successfully:', result);
        setSubmitted(true);

      } catch (error) {
        console.error('Failed to send acknowledgement:', error);
        setSubmitError(true);
        setTimeout(() => {
          setSubmitError(false);
        }, 5000);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Please complete all required fields.');
    }
  };

  const isFormValid = 
    formData.technicalRequirements &&
    formData.interviewFormat &&
    formData.nextSteps &&
    formData.nonCompliance &&
    formData.candidateName.trim().length > 0;

  if (submitted) {
    return (
      <main className="min-h-screen bg-rich-black px-4 py-12 text-white">
        <Helmet>
          <title>Acknowledgement Submitted | UPLIFT Technologies</title>
        </Helmet>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
          </div>
          <h1 className="mb-4 text-3xl font-semibold">Thank You!</h1>
          <p className="text-lg text-gray-400">
            Your acknowledgement has been successfully submitted. We look forward to your interview.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-rich-black px-4 py-12 text-white">
      <Helmet>
        <title>Candidate Acknowledgement Form | UPLIFT Technologies</title>
        <meta
          name="description"
          content="Review and confirm your understanding of interview guidelines and requirements."
        />
      </Helmet>

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Candidate Acknowledgement Form
          </h1>
          <p className="mt-3 text-lg text-gray-400">
            Please review and confirm your understanding of the following guidelines before proceeding with your interview.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Technical Requirements */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Availability and Technical Requirements
              <span className="text-red-500">*</span>
            </h2>
            <p className="mb-4 text-gray-300">
              I confirm that I will attend the interview via video on a computer or laptop at the scheduled time. 
              I understand that mobile phones are not permitted for interviews. I will also ensure that I have 
              reliable backup options available in case of technical difficulties such as internet, device, 
              webcam, or microphone issues.
            </p>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={formData.technicalRequirements}
                onChange={() => handleCheckboxChange('technicalRequirements')}
                disabled={isSubmitting}
                className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-700 bg-gray-800 text-electric-violet focus:ring-2 focus:ring-electric-violet focus:ring-offset-2 focus:ring-offset-rich-black disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-sm font-medium text-white">I understand and agree</span>
            </label>
          </div>

          {/* Section 2: Interview Format */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Interview Format
              <span className="text-red-500">*</span>
            </h2>
            <div className="mb-4 space-y-3 text-gray-300">
              <p>
                I acknowledge that UPLIFT Technologies functions as a staffing partner and that representatives 
                of the client will not discuss employment-related matters (e.g., pay rates, benefits, or leave 
                policies) during the interview. Any such questions should be directed to my UPLIFT representative 
                after the meeting.
              </p>
              <p>
                I understand that the client's representative(s) will conduct the interview, focusing solely on 
                my skills, experience, and role-related qualifications.
              </p>
            </div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={formData.interviewFormat}
                onChange={() => handleCheckboxChange('interviewFormat')}
                disabled={isSubmitting}
                className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-700 bg-gray-800 text-electric-violet focus:ring-2 focus:ring-electric-violet focus:ring-offset-2 focus:ring-offset-rich-black disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-sm font-medium text-white">I understand and agree</span>
            </label>
          </div>

          {/* Section 3: Next Steps */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Next Steps
              <span className="text-red-500">*</span>
            </h2>
            <p className="mb-4 text-gray-300">
              I understand that UPLIFT Technologies will communicate any updates or outcomes following the 
              interview once a decision has been made. I will not contact the client's representative(s) 
              directly after the interview.
            </p>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={formData.nextSteps}
                onChange={() => handleCheckboxChange('nextSteps')}
                disabled={isSubmitting}
                className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-700 bg-gray-800 text-electric-violet focus:ring-2 focus:ring-electric-violet focus:ring-offset-2 focus:ring-offset-rich-black disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-sm font-medium text-white">I understand and agree</span>
            </label>
          </div>

          {/* Section 4: Non-Compliance */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Non-Compliance
              <span className="text-red-500">*</span>
            </h2>
            <p className="mb-4 text-gray-300">
              I acknowledge that failure to adhere to the above guidelines may harm UPLIFT Technologies' 
              professional reputation and its relationship with clients. In such cases, UPLIFT Technologies 
              reserves the right to remove my profile from its pool of potential candidates and discontinue 
              future opportunities.
            </p>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={formData.nonCompliance}
                onChange={() => handleCheckboxChange('nonCompliance')}
                disabled={isSubmitting}
                className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-700 bg-gray-800 text-electric-violet focus:ring-2 focus:ring-electric-violet focus:ring-offset-2 focus:ring-offset-rich-black disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-sm font-medium text-white">I understand and agree</span>
            </label>
          </div>

          {/* Section 5: Candidate Name */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <label htmlFor="candidateName" className="mb-3 block text-xl font-semibold text-white">
              Candidate Name
              <span className="text-red-500">*</span>
            </label>
            <p className="mb-4 text-sm text-gray-400">Please type your full name below:</p>
            <input
              type="text"
              id="candidateName"
              value={formData.candidateName}
              onChange={(e) => setFormData(prev => ({ ...prev, candidateName: e.target.value }))}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-electric-violet focus:outline-none focus:ring-2 focus:ring-electric-violet disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/40 px-4 py-3 text-red-400">
              <p className="text-sm font-medium">Failed to submit acknowledgement. Please try again or contact HR directly.</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full rounded-lg bg-electric-violet px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-electric-violet/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-electric-violet focus:outline-none focus:ring-2 focus:ring-electric-violet focus:ring-offset-2 focus:ring-offset-rich-black flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <p className="mt-6 text-center text-sm text-gray-500">
          All fields marked with <span className="text-red-500">*</span> are required
        </p>
      </div>
    </main>
  );
};

export default CandidateAcknowledgementForm;
