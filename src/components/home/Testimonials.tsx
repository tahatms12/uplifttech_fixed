import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Section from '../ui/Section';

interface Testimonial {
  quote: string;
  author: string;
  position: string;
  company: string;
  photo: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "UPLIFT's team seamlessly integrated with our operations, providing 24/7 coverage that increased our customer satisfaction rates by 35% while reducing our operational costs.",
    author: 'Ashley S.',
    position: 'Managing Director',
    company: 'Confidential Dental Centres',
    photo: '/images/testimonial-ashley.svg'
  },
  {
    quote:
      'Their collections team recovered $2M in outstanding accounts receivable that we had almost written off. Within the first month, they brought in $25K and continued to deliver exceptional results.',
    author: 'Dr A. Porcina',
    position: 'President',
    company: 'Confidential Dental',
    photo: '/images/testimonial-dr-porcina.svg'
  },
  {
    quote:
      'The AI chat agents UPLIFT implemented revolutionized our scheduling system, reducing lost leads. We have seen dramatic improvements in response times and patient satisfaction.',
    author: 'Z. Amiri',
    position: 'Director of Operations',
    company: 'Auto Enhance Hub',
    photo: '/images/testimonial-amiri.svg'
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <Section className="bg-gradient-to-b from-transparent via-white/[0.05] to-transparent">
      <motion.div
        className="mx-auto flex max-w-5xl flex-col items-center text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <Quote className="h-12 w-12 text-brand-blue/70" aria-hidden="true" />
        <motion.article
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-left shadow-[0_24px_48px_-32px_rgba(11,99,246,0.45)]"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <img
              src={testimonials[currentIndex].photo}
              alt={`Photo of ${testimonials[currentIndex].author}`}
              className="h-24 w-24 flex-none rounded-2xl border border-white/20 bg-white/10"
              width={96}
              height={96}
              loading="lazy"
            />
            <div>
              <p className="text-xl font-medium text-white/90 lg:text-2xl">“{testimonials[currentIndex].quote}”</p>
              <div className="mt-6 text-sm text-white/70">
                <p className="font-semibold text-white">{testimonials[currentIndex].author}</p>
                <p>
                  {testimonials[currentIndex].position}, {testimonials[currentIndex].company}
                </p>
              </div>
            </div>
          </div>
        </motion.article>

        <div className="mt-8 flex items-center justify-center gap-4" aria-label="Testimonial controls">
          <button
            onClick={prevTestimonial}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-brand-blue hover:text-brand-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            aria-label="Show previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-8 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-brand-blue' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Show testimonial ${index + 1}`}
                aria-pressed={currentIndex === index}
              />
            ))}
          </div>
          <button
            onClick={nextTestimonial}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-brand-blue hover:text-brand-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            aria-label="Show next testimonial"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </Section>
  );
};

export default Testimonials;
