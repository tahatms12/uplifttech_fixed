import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import { trackFormSubmission } from '../../lib/analytics';

interface FormData {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  roleNeeded: string;
  notes: string;
  scheduleDate: string;
  scheduleTime: string;
}

type StepKey = 'contact' | 'service' | 'schedule';

const steps: { id: StepKey; title: string; description: string }[] = [
  { id: 'contact', title: 'Contact Info', description: 'Tell us who to connect with.' },
  { id: 'service', title: 'Service Details', description: 'Help us tailor the right team.' },
  { id: 'schedule', title: 'Schedule', description: 'Pick a 15-minute discovery call.' }
];

const roleOptions = ['Sales Rep', 'Marketing VA', 'Collections Specialist', 'Admin', 'Other'];

const LeadFormWizard: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    roleNeeded: '',
    notes: '',
    scheduleDate: '',
    scheduleTime: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [companyManuallyEdited, setCompanyManuallyEdited] = useState(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const isDirty = useMemo(() => Object.values(touched).some(Boolean), [touched]);

  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [stepIndex]);

  useEffect(() => {
    if (companyManuallyEdited) {
      return;
    }
    const emailDomain = formData.email.split('@')[1];
    if (!emailDomain) {
      return;
    }
    const suggestion = emailDomain
      .split('.')[0]
      ?.replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    if (suggestion && formData.company.trim() === '') {
      setFormData((prev) => ({ ...prev, company: suggestion }));
    }
  }, [formData.email, companyManuallyEdited, formData.company]);

  const validate = (currentStep: StepKey) => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (currentStep === 'contact' || currentStep === 'service' || currentStep === 'schedule') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Please add your full name.';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Please add a valid work email.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }
    if (currentStep === 'service' || currentStep === 'schedule') {
      if (!formData.roleNeeded) {
        newErrors.roleNeeded = 'Please select the role you need.';
      }
    }
    if (currentStep === 'schedule') {
      if (!formData.scheduleDate) {
        newErrors.scheduleDate = 'Please choose a date.';
      }
      if (!formData.scheduleTime) {
        newErrors.scheduleTime = 'Please choose a time.';
      }
    }
    return newErrors;
  };

  const handleInputChange = (key: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = event.target.value;
    if (key === 'company') {
      setCompanyManuallyEdited(true);
    }
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlur = (key: keyof FormData) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const step = steps[stepIndex].id;
    const newErrors = validate(step);
    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  const handleNext = async () => {
    const currentStep = steps[stepIndex].id;
    const validationErrors = validate(currentStep);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched((prev) => ({
        ...prev,
        ...Object.keys(validationErrors).reduce<Record<string, boolean>>((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      }));
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

  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const timeSlots = useMemo(() => {
    const slots: { value: string; label: string }[] = [];
    for (let hour = 9; hour <= 17; hour += 1) {
      for (const minute of [0, 30]) {
        const date = new Date();
        date.setHours(hour, minute, 0, 0);
        const label = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        const value = `${String(hour).padStart(2, '0')}:${minute === 0 ? '00' : '30'}`;
        slots.push({ value, label });
      }
    }
    return slots;
  }, []);

  useEffect(() => {
    if (isComplete) {
      trackFormSubmission('lead_form');
    }
  }, [isComplete]);

  if (isComplete) {
    const scheduledDateTime = new Date(`${formData.scheduleDate}T${formData.scheduleTime}`);
    const formattedDateTime = Number.isNaN(scheduledDateTime.getTime())
      ? `${formData.scheduleDate} ${formData.scheduleTime}`
      : scheduledDateTime.toLocaleString([], { dateStyle: 'long', timeStyle: 'short' });
    return (
      <div className="rounded-3xl border border-brand-blue/30 bg-brand-blue/10 p-8 text-center" role="status" aria-live="polite">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-blue" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-semibold text-white">✅ Your request is received!</h2>
        <p className="mt-3 text-white/80">
          We've scheduled your call on {formattedDateTime}. You will receive a calendar invite shortly.
        </p>
      </div>
    );
  }

  const renderError = (key: keyof FormData) => {
    if (!touched[key] || !errors[key]) {
      return null;
    }
    return (
      <p className="mt-2 flex items-center gap-2 text-sm text-red-400" role="alert">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        {errors[key]}
      </p>
    );
  };

  const renderStepContent = () => {
    const currentStep = steps[stepIndex].id;
    switch (currentStep) {
      case 'contact':
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white">
                Full Name <span className="text-red-300">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Jane Doe"
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                onBlur={handleBlur('fullName')}
                required
                className="mt-2 w-full rounded-md border border-white/15 bg-rich-black px-3 py-3 text-sm text-white focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
                autoComplete="name"
              />
              {renderError('fullName')}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Work Email <span className="text-red-300">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                onBlur={handleBlur('email')}
                required
                className="mt-2 w-full rounded-md border border-white/15 bg-rich-black px-3 py-3 text-sm text-white focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
                autoComplete="email"
              />
              {renderError('email')}
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-white">
                Company Name
              </label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="UPLIFT Technologies"
                value={formData.company}
                onChange={handleInputChange('company')}
                onBlur={handleBlur('company')}
                className="mt-2 w-full rounded-md border border-white/15 bg-rich-black px-3 py-3 text-sm text-white focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
                autoComplete="organization"
              />
              <p className="mt-2 text-xs text-white/60">We suggest a company name based on your email domain.</p>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 234 567 8901"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                onBlur={handleBlur('phone')}
                className="mt-2 w-full rounded-md border border-white/15 bg-rich-black px-3 py-3 text-sm text-white focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
                autoComplete="tel"
              />
            </div>
          </div>
        );
      case 'service':
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="roleNeeded" className="block text-sm font-medium text-white">
                Role Needed <span className="text-red-300">*</span>
              </label>
              <select
                id="roleNeeded"
                name="roleNeeded"
                value={formData.roleNeeded}
                onChange={handleInputChange('roleNeeded')}
                onBlur={handleBlur('roleNeeded')}
                required
                className="mt-2 w-full rounded-md border border-white/15 bg-rich-black px-3 py-3 text-sm text-white focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
              >
                <option value="" disabled>
                  Select a role
                </option>
                {roleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {renderError('roleNeeded')}
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-white">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Any specific skills or requirements"
                value={formData.notes}
                onChange={handleInputChange('notes')}
                onBlur={handleBlur('notes')}
                rows={4}
                className="mt-2 w-full rounded-md border border-white/15 bg-rich-black px-3 py-3 text-sm text-white focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
              />
              <p className="mt-2 text-xs text-white/60">Include languages, tools, or preferred shift coverage.</p>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="scheduleDate" className="block text-sm font-medium text-white">
                Choose a date <span className="text-red-300">*</span>
              </label>
              <input
                id="scheduleDate"
                name="scheduleDate"
                type="date"
                min={minDate}
                value={formData.scheduleDate}
                onChange={handleInputChange('scheduleDate')}
                onBlur={handleBlur('scheduleDate')}
                required
                className="mt-2 w-full rounded-md border border-white/15 bg-rich-black px-3 py-3 text-sm text-white focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
              />
              {renderError('scheduleDate')}
            </div>
            <div>
              <label htmlFor="scheduleTime" className="block text-sm font-medium text-white">
                Choose a time <span className="text-red-300">*</span>
              </label>
              <select
                id="scheduleTime"
                name="scheduleTime"
                value={formData.scheduleTime}
                onChange={handleInputChange('scheduleTime')}
                onBlur={handleBlur('scheduleTime')}
                required
                className="mt-2 w-full rounded-md border border-white/15 bg-rich-black px-3 py-3 text-sm text-white focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
              >
                <option value="" disabled>
                  Select a slot ({timezone})
                </option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label} ({timezone})
                  </option>
                ))}
              </select>
              {renderError('scheduleTime')}
            </div>
            <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Discovery calls last 15 minutes. We will confirm the invite immediately after you submit.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Step {stepIndex + 1} of {steps.length}</p>
          <h2 ref={stepHeadingRef} tabIndex={-1} className="mt-2 text-2xl font-semibold text-white focus:outline-none">
            {steps[stepIndex].title}
          </h2>
          <p className="text-sm text-white/70">{steps[stepIndex].description}</p>
        </div>
        <div className="flex w-full max-w-sm items-center gap-2" aria-hidden="true">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={`h-2 flex-1 rounded-full ${index <= stepIndex ? 'bg-brand-blue' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      <form
        className="mt-8 space-y-6"
        onSubmit={(event) => event.preventDefault()}
        noValidate
        data-analytics-form={isComplete ? 'completed' : isDirty ? 'active' : undefined}
        data-form-name="lead_form"
        data-form-step={stepIndex + 1}
      >
        {renderStepContent()}

        <div className="flex flex-col-reverse gap-4 pt-4 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={stepIndex === 0}
            className="sm:w-auto"
          >
            Back
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={handleNext}
              loading={isProcessing}
              disabled={isProcessing}
            >
              {stepIndex === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LeadFormWizard;
