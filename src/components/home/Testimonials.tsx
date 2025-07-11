import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Section from '../ui/Section';

interface Testimonial {
  quote: string;
  author: string;
  position: string;
  company: string;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "UPLIFT's team seamlessly integrated with our operations, providing 24/7 coverage that increased our customer satisfaction rates by 35% while reducing our operational costs.",
      author: "Sarah Johnson",
      position: "COO",
      company: "HealthTech Solutions"
    },
    {
      quote: "Their collections team recovered $2M in outstanding accounts receivable that we had almost written off. Within the first month, they brought in $25K and continued to deliver exceptional results.",
      author: "Michael Chen",
      position: "CFO",
      company: "Meridian Healthcare"
    },
    {
      quote: "The AI voice and text agents UPLIFT implemented revolutionized our scheduling system. We've seen dramatic improvements in response times and patient satisfaction.",
      author: "David Williams",
      position: "Director of Operations",
      company: "Cirrus Software"
    }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <Section className="bg-gradient-to-b from-deep-purple/10 to-rich-black">
      <motion.div 
        className="max-w-xl sm:max-w-2xl md:max-w-4xl mx-auto text-center relative px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 text-electric-violet opacity-20">
          <Quote size={120} />
        </div>
        
        <div className="relative z-10">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl sm:text-2xl md:text-3xl font-poppins font-medium leading-relaxed mb-6 sm:mb-8">
              "{testimonials[currentIndex].quote}"
            </p>
            
            <div>
              <p className="font-medium text-electric-violet">
                {testimonials[currentIndex].author}
              </p>
              <p className="text-white/70">
                {testimonials[currentIndex].position}, {testimonials[currentIndex].company}
              </p>
            </div>
          </motion.div>
          
          <div className="flex justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full border border-neutral-700 hover:border-electric-violet hover:bg-deep-purple/20 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    currentIndex === index 
                      ? 'bg-electric-violet w-6 sm:w-8' 
                      : 'bg-neutral-700 hover:bg-neutral-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full border border-neutral-700 hover:border-electric-violet hover:bg-deep-purple/20 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default Testimonials;