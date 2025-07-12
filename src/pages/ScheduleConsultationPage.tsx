import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Container from '../components/ui/Section';

interface FormData {
  fullName: string;
  workEmail: string;
  phone: string;
  preferredDate: string;
}

interface FormErrors {
  fullName?: string;
  workEmail?: string;
  phone?: string;
  preferredDate?: string;
}

const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        return value.trim().length < 2 ? 'Full name must be at least 2 characters' : undefined;
      case 'workEmail':
        return !/^[^
@]+@[^
@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : undefined;
      case 'phone':
        return !/^\+?[\d\s\-\(]{10,}$/.test(value) ? 'Invalid phone number' : undefined;
      case 'preferredDate':
        return !value ? 'Please select a preferred date' : undefined;
      default:
        return undefined;
    }
  };

  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key as keyof FormErrors] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validateForm, setErrors };
};

const SuccessBanner: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-accent-green text-white p-4 rounded-2xl text-center font-medium"
  >
    Consultation request submitted successfully. You'll receive a confirmation email shortly.
  </motion.div>
);

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded-lg"></div>
    <div className="h-12 bg-gray-200 rounded-lg"></div>
    <div className="h-32 bg-gray-200 rounded-lg"></div>
    <div className="h-8 bg-gray-200 rounded-lg"></div>
  </div>
);

const ScheduleConsultation: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    workEmail: '',
    phone: '',
    preferredDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  const [calendlyError, setCalendlyError] = useState(false);
  const { errors, validateForm } = useFormValidation();

  const zohoCalendarUrl = import.meta.env.VITE_ZOHO_CALENDAR_URL || '';

  useEffect(() => {
    // Preconnect to Zoho Calendar
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://calendar.zoho.com';
    document.head.appendChild(link);

    // Zoho Calendar doesn't require external scripts, just iframe embedding
    if (zohoCalendarUrl) {
      setCalendlyLoaded(true);
    } else {
      setCalendlyError(true);
    }

    // Load reCAPTCHA if in production
    if (import.meta.env.PROD) {
      const recaptchaScript = document.createElement('script');
      recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?render=6LcYourSiteKey';
      recaptchaScript.async = true;
      document.head.appendChild(recaptchaScript);
    }
      }, [zohoCalendarUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(formData)) return;

    setIsSubmitting(true);
    try {
      let recaptchaToken = '';
      if (import.meta.env.PROD && window.grecaptcha) {
        recaptchaToken = await window.grecaptcha.execute('6LcYourSiteKey', { action: 'submit' });
      }

      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Recaptcha-Token': recaptchaToken
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ fullName: '', workEmail: '', phone: '', preferredDate: '' });
      }
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    'Strategic technology roadmap assessment',
    'Custom digital transformation plan',
    'ROI projections for proposed solutions',
    'Risk analysis and mitigation strategies',
    'Implementation timeline and resource planning'
  ];

  const faqs = [
    {
      question: 'How long is the consultation?',
      answer: 'Initial consultations are 30-45 minutes, focused on understanding your business needs and technology challenges.'
    },
    {
      question: 'Is there a cost for the consultation?',
      answer: 'The initial discovery consultation is complimentary. We provide this to understand your requirements and determine fit.'
    },
    {
      question: 'What should I prepare for the call?',
      answer: 'Bring an overview of your current technology stack, key business challenges, and any specific goals or timeline requirements.'
    },
    {
      question: 'Who will be on the call?',
      answer: 'You\'ll speak directly with one of our senior solution architects who specializes in your industry vertical.'
    }
  ];

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Schedule Technology Consultation | Uplift Technologies</title>
        <meta name="description" content="Book a free 30-minute consultation with our technology experts. Get strategic insights for your digital transformation initiatives." />
        <link rel="canonical" href="https://uplift-technologies.com/schedule-consultation" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLdFaq)}
        </script>
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-accent-brand via-blue-700 to-blue-900">
          <div className="absolute inset-0 bg-black/20"></div>
          <Container className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                Book a Consultation
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl font-light opacity-90 leading-relaxed">
                Transform your business with strategic technology solutions. 
                Get expert guidance tailored to your specific challenges.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Main Content */}
        <section className="py-16 lg:py-24">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                  What You'll Get
                </h2>
                <motion.ul 
                  className="space-y-6"
                  variants={{
                    animate: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  initial="initial"
                  animate="animate"
                >
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      variants={{
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 }
                      }}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-2 h-2 rounded-full bg-accent-green flex-shrink-0 mt-3"></div>
                      <span className="text-lg text-gray-700 leading-relaxed">{benefit}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              {/* Booking Module */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg/10 p-8"
              >
                {isSuccess ? (
                  <SuccessBanner />
                ) : calendlyLoaded && !calendlyError && zohoCalendarUrl ? (
                  <iframe
                    src={zohoCalendarUrl}
                    width="100%"
                    height="700"
                    frameBorder="0"
                    scrolling="no"
                    loading="lazy"
                    title="Schedule Consultation"
                    className="rounded-2xl min-w-full"
                    allowTransparency="true"
                  ></iframe>
                ) : calendlyError || !zohoCalendarUrl ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Call</h3>
                    
                    <div>
                      <label htmlFor="fullName" className="sr-only">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        aria-describedby={errors.fullName ? "fullName-error" : undefined}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-brand ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.fullName && (
                        <p id="fullName-error" className="text-sm text-red-600 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="workEmail" className="sr-only">Work Email</label>
                      <input
                        type="email"
                        id="workEmail"
                        name="workEmail"
                        value={formData.workEmail}
                        onChange={handleInputChange}
                        placeholder="Work Email"
                        aria-describedby={errors.workEmail ? "workEmail-error" : undefined}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-brand ${
                          errors.workEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.workEmail && (
                        <p id="workEmail-error" className="text-sm text-red-600 mt-1">{errors.workEmail}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="sr-only">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-brand ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.phone && (
                        <p id="phone-error" className="text-sm text-red-600 mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="preferredDate" className="sr-only">Preferred Date</label>
                      <select
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        aria-describedby={errors.preferredDate ? "preferredDate-error" : undefined}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-brand ${
                          errors.preferredDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Select Preferred Timeframe</option>
                        <option value="This Week">This Week</option>
                        <option value="Next Week">Next Week</option>
                        <option value="Within 2 Weeks">Within 2 Weeks</option>
                        <option value="Within 1 Month">Within 1 Month</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                      {errors.preferredDate && (
                        <p id="preferredDate-error" className="text-sm text-red-600 mt-1">{errors.preferredDate}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-accent-brand text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-accent-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Consultation'}
                    </button>
                  </form>
                ) : (
                  <SkeletonLoader />
                )}
              </motion.div>
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="bg-white rounded-2xl shadow-lg/10 p-6 group"
                  >
                    <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                      {faq.question}
                      <span className="ml-4 transition-transform group-open:rotate-180">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-4 text-gray-700 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </motion.div>
          </Container>
        </section>

        {/* WhatsApp CTA */}
        <section className="py-8 bg-accent-green">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="text-white text-lg mb-4">
                Need immediate assistance?
              </p>
              <a
                href="https://wa.me/1234567890?text=Hi%2C%20I%27d%20like%20to%20schedule%20an%20urgent%20consultation"
                className="inline-flex items-center bg-white text-accent-green px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accent-green transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp for Urgent Cases
              </a>
            </motion.div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ScheduleConsultation;
