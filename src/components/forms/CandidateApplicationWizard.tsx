import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import Button from '../ui/Button';
import { parseResume } from '../../utils/resumeParser';
import { trackFormSubmission } from '../../lib/analytics';

interface ApplicationData {
  fullName: string;
  email: string;
  phone: string;
  resumeFile?: File;
  linkedIn: string;
  experienceYears: string;
  topSkills: string;
  educationLevel: string;
  fitReason: string;
  availability: string;
  coverLetter: string;
  consent: boolean;
}

type StepKey = 'personal' | 'experience' | 'final';

const steps: { id: StepKey; title: string; description: string }[] = [
  { id: 'personal', title: 'Personal & Resume', description: 'Upload your resume so we can auto-fill your details.' },
  { id: 'experience', title: 'Experience & Skills', description: 'Share your background and top strengths.' },
  { id: 'final', title: 'Final Details', description: 'Confirm availability and submit your application.' }
];

const educationOptions = ['High School', 'Associate Degree', 'Bachelor’s Degree', 'Master’s Degree', 'Doctorate'];

const CandidateApplicationWizard: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    experienceYears: '',
    topSkills: '',
    educationLevel: '',
    fitReason: '',
    availability: '',
    coverLetter: '',
    consent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [parsedFields, setParsedFields] = useState<Set<keyof ApplicationData>>(new Set());
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const isDirty = useMemo(
    () =>
      Object.values(touched).some(Boolean) ||
      !!formData.resumeFile ||
      Boolean(formData.linkedIn || formData.coverLetter || formData.topSkills),
    [touched, formData.resumeFile, formData.linkedIn, formData.coverLetter, formData.topSkills]
  );

  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [stepIndex]);

  useEffect(() => {
    if (isComplete) {
      trackFormSubmission('candidate_application');
    }
  }, [isComplete]);

  const validate = (currentStep: StepKey) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 'personal' || currentStep === 'experience' || currentStep === 'final') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Please enter your full name.';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Please enter a valid email.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email.';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Please add a phone number.';
      }
      if (!formData.resumeFile) {
        newErrors.resumeFile = 'Please upload your resume (PDF or DOCX).';
      }
    }
    if (currentStep === 'experience' || currentStep === 'final') {
      if (!formData.experienceYears.trim()) {
        newErrors.experienceYears = 'Please add your years of experience.';
      }
      if (!formData.topSkills.trim()) {
        newErrors.topSkills = 'Please list your top skills.';
      }
    }
    if (currentStep === 'final') {
      if (!formData.availability.trim()) {
        newErrors.availability = 'Please share your availability.';
      }
      if (!formData.consent) {
        newErrors.consent = 'Please provide your consent.';
      }
    }
    return newErrors;
  };

  const handleInputChange = (key: keyof ApplicationData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlur = (key: keyof ApplicationData) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const step = steps[stepIndex].id;
    const newErrors = validate(step);
    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('Please upload a file smaller than 5MB.');
      return;
    }
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isDocx =
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.toLowerCase().endsWith('.docx');
    if (!isPdf && !isDocx) {
      setResumeError('Please upload a PDF or DOCX file.');
      return;
    }
    setResumeError(null);
    setFormData((prev) => ({ ...prev, resumeFile: file }));
    setTouched((prev) => ({ ...prev, resumeFile: true }));

    try {
      setIsProcessing(true);
      const parsed = await parseResume(file);
      const newParsedFields = new Set<keyof ApplicationData>(parsedFields);
      const updates: Partial<ApplicationData> = {};
      if (parsed.fullName && !formData.fullName) {
        updates.fullName = parsed.fullName;
        newParsedFields.add('fullName');
      }
      if (parsed.email && !formData.email) {
        updates.email = parsed.email;
        newParsedFields.add('email');
      }
      if (parsed.phone && !formData.phone) {
        updates.phone = parsed.phone;
        newParsedFields.add('phone');
      }
      setFormData((prev) => ({ ...prev, ...updates }));
      setParsedFields(newParsedFields);
    } catch (error) {
      setResumeError('Please review your resume upload. We were unable to parse contact details.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = async () => {
    const currentStep = steps[stepIndex].id;
    const validationErrors = validate(currentStep);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const touchedUpdates: Record<string, boolean> = {};
      Object.keys(validationErrors).forEach((key) => {
        touchedUpdates[key] = true;
      });
      setTouched((prev) => ({ ...prev, ...touchedUpdates }));
      return;
    }
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsProcessing(false);
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const renderError = (key: keyof ApplicationData | 'resumeFile') => {
    const errorMessage = errors[key as string];
    if (!touched[key as string] || !errorMessage) {
      return null;
    }
    return (
      <p className="mt-2 flex items-center gap-2 text-sm text-red-400" role="alert">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        {errorMessage}
      </p>
    );
  };

  const renderBadge = (key: keyof ApplicationData) =>
    parsedFields.has(key) ? (
      <span className="ml-2 inline-flex items-center rounded-full bg-electric-violet/15 px-2 py-1 text-xs text-electric-violet">
        From resume – please verify
      </span>
    ) : null;

  const renderStepContent = () => {
    const currentStep = steps[stepIndex].id;
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white">
                Full Name <span className="text-red-300">*</span>
                {renderBadge('fullName')}
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Jane Candidate"
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                onBlur={handleBlur('fullName')}
                className="mt-2 w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-3 text-sm text-white placeholder:text-text-muted/80 focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
              />
              {renderError('fullName')}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email <span className="text-red-300">*</span>
                {renderBadge('email')}
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                onBlur={handleBlur('email')}
                className="mt-2 w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-3 text-sm text-white placeholder:text-text-muted/80 focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
              />
              {renderError('email')}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white">
                Phone <span className="text-red-300">*</span>
                {renderBadge('phone')}
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8901"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                onBlur={handleBlur('phone')}
                className="mt-2 w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-3 text-sm text-white placeholder:text-text-muted/80 focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
              />
              {renderError('phone')}
            </div>
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-white">
                Resume Upload <span className="text-red-300">*</span>
              </label>
              <label
                htmlFor="resume"
                className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border-muted/60 bg-surface-alt/80 p-6 text-center text-sm text-text-muted transition-colors hover:border-electric-violet"
              >
                <FileText className="mb-2 h-8 w-8 text-electric-violet" aria-hidden="true" />
                <span>{formData.resumeFile ? formData.resumeFile.name : 'Drag & drop or browse your PDF/DOCX resume (max 5MB)'}</span>
                <input id="resume" type="file" accept=".pdf,.docx" className="sr-only" onChange={handleResumeUpload} />
              </label>
              {resumeError && (
                <p className="mt-2 flex items-center gap-2 text-sm text-red-400" role="alert">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  {resumeError}
                </p>
              )}
              {renderError('resumeFile')}
            </div>
            <div>
              <label htmlFor="linkedIn" className="block text-sm font-medium text-white">
                LinkedIn URL
              </label>
              <input
                id="linkedIn"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedIn}
                onChange={handleInputChange('linkedIn')}
                onBlur={handleBlur('linkedIn')}
                className="mt-2 w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-3 text-sm text-white placeholder:text-text-muted/80 focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
              />
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="experienceYears" className="block text-sm font-medium text-white">
                Years of Experience <span className="text-red-300">*</span>
              </label>
              <input
                id="experienceYears"
                type="number"
                min={0}
                placeholder="5"
                value={formData.experienceYears}
                onChange={handleInputChange('experienceYears')}
                onBlur={handleBlur('experienceYears')}
                className="mt-2 w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-3 text-sm text-white placeholder:text-text-muted/80 focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
              />
              {renderError('experienceYears')}
            </div>
            <div>
              <label htmlFor="topSkills" className="block text-sm font-medium text-white">
                Top Skills <span className="text-red-300">*</span>
              </label>
              <input
                id="topSkills"
                type="text"
                placeholder="e.g., CRM, Excel, Graphic Design"
                value={formData.topSkills}
                onChange={handleInputChange('topSkills')}
                onBlur={handleBlur('topSkills')}
                className="mt-2 w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-3 text-sm text-white focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
              />
              {renderError('topSkills')}
            </div>
            <div>
              <label htmlFor="educationLevel" className="block text-sm font-medium text-white">
                Education Level
              </label>
              <select
                id="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange('educationLevel')}
                onBlur={handleBlur('educationLevel')}
                className="mt-2 w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-3 text-sm text-white placeholder:text-text-muted/80 focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
              >
                <option value="">Select education level</option>
                {educationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="fitReason" className="block text-sm font-medium text-white">
                Why are you a good fit?
              </label>
              <textarea
                id="fitReason"
                rows={4}
                placeholder="Share a quick example of your impact."
                value={formData.fitReason}
                onChange={handleInputChange('fitReason')}
                onBlur={handleBlur('fitReason')}
                className="mt-2 w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-3 text-sm text-white placeholder:text-text-muted/80 focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
              />
            </div>
          </div>
        );
      case 'final':
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-white">
                Availability / Start Date <span className="text-red-300">*</span>
              </label>
              <input
                id="availability"
                type="text"
                placeholder="Available to start on May 6"
                value={formData.availability}
                onChange={handleInputChange('availability')}
                onBlur={handleBlur('availability')}
                className="mt-2 w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-3 text-sm text-white placeholder:text-text-muted/80 focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
              />
              {renderError('availability')}
            </div>
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-white">
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                rows={5}
                placeholder="Include any additional details you'd like us to know."
                value={formData.coverLetter}
                onChange={handleInputChange('coverLetter')}
                onBlur={handleBlur('coverLetter')}
                className="mt-2 w-full rounded-md border border-border-muted/60 bg-surface-alt/80 px-3 py-3 text-sm text-white placeholder:text-text-muted/80 focus-visible:border-electric-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-violet/40"
              />
            </div>
            <label className="flex items-start gap-3 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={handleInputChange('consent')}
                onBlur={handleBlur('consent')}
                className="mt-1 h-5 w-5 rounded border border-border-muted/60 bg-surface-alt/80 text-electric-violet focus-visible:ring-electric-violet"
              />
              <span>I consent to have my information stored for recruitment purposes.</span>
            </label>
            {renderError('consent')}
            <div className="rounded-2xl border border-border-muted/60 bg-surface-alt/80 p-5 text-sm text-text-muted">
              <h3 className="text-base font-semibold text-white">Review summary</h3>
              <ul className="mt-3 space-y-2">
                <li><strong className="font-semibold text-white">Name:</strong> {formData.fullName || '—'}</li>
                <li><strong className="font-semibold text-white">Email:</strong> {formData.email || '—'}</li>
                <li><strong className="font-semibold text-white">Phone:</strong> {formData.phone || '—'}</li>
                <li><strong className="font-semibold text-white">Experience:</strong> {formData.experienceYears || '—'} years</li>
                <li><strong className="font-semibold text-white">Top skills:</strong> {formData.topSkills || '—'}</li>
                <li><strong className="font-semibold text-white">Availability:</strong> {formData.availability || '—'}</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isComplete) {
    return (
      <div
        className="rounded-3xl border border-electric-violet/40 bg-electric-violet/10 p-8 text-center shadow-card"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-electric-violet" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-semibold text-white">✅ Application submitted!</h2>
        <p className="mt-3 text-text-muted">You will receive an email confirmation shortly.</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl border border-border-muted/60 bg-surface/80 p-6 shadow-card sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Step {stepIndex + 1} of {steps.length}</p>
          <h2 ref={stepHeadingRef} tabIndex={-1} className="mt-2 text-2xl font-semibold text-white focus:outline-none">
            {steps[stepIndex].title}
          </h2>
          <p className="text-sm text-text-muted">{steps[stepIndex].description}</p>
        </div>
        <div className="flex w-full max-w-sm items-center gap-2" aria-hidden="true">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={`h-2 flex-1 rounded-full ${index <= stepIndex ? 'bg-electric-violet' : 'bg-surface-alt/60'}`}
            />
          ))}
        </div>
      </div>

      <form
        className="mt-8 space-y-6"
        onSubmit={(event) => event.preventDefault()}
        noValidate
        data-analytics-form={isComplete ? 'completed' : isDirty ? 'active' : undefined}
        data-form-name="candidate_application"
        data-form-step={stepIndex + 1}
      >
        {renderStepContent()}

        <div className="flex flex-col-reverse gap-4 pt-4 sm:flex-row sm:justify-between">
          <Button type="button" variant="ghost" onClick={handleBack} disabled={stepIndex === 0}>
            Back
          </Button>
          <Button type="button" onClick={handleNext} loading={isProcessing} disabled={isProcessing}>
            {stepIndex === steps.length - 1 ? 'Submit application' : 'Next'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CandidateApplicationWizard;
