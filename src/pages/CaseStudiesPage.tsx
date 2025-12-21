import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import MetaTags from '../components/seo/MetaTags';
import StructuredData from '../components/seo/StructuredData';

interface CaseStudy {
  id: number;
  title: string;
  category: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  imageSrc: string;
  testimonial?: {
    quote: string;
    author: string;
    position: string;
    company: string;
  };
}

const CaseStudiesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const caseStudies: CaseStudy[] = [
    {
      id: 1,
      title: "Accounts Receivable Team Gap",
      category: "Revenue Cycle Support",
      description: "Providing a structured revenue cycle team for a dental company with limited formal processes.",
      challenge: "A company lacked consistent AR workflows and documentation, which led to delayed follow-ups and limited visibility into receivables.",
      solution: "We established structured documentation standards, QA protocols, and payer follow-up routines inside the client’s billing system.",
      results: [
        "Denial reduction from 32 percent to 15 percent in revenue cycle activities",
        "Clean claim rate of 98 percent for claims processing",
        "Resolution of messages within 24 hours in 98 percent of cases"
      ],
      imageSrc: "https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48KsDMQ73cbMY8IewBXDN1uCftWjJZ5Rlhyg0G",
      testimonial: {
        quote: "UPLIFT transformed our collections process from chaotic to structured. Their team didn't just expedite our DSO collection rate, they implemented systems that fundamentally changed how we approach AR.",
        author: "Thomas Wright",
        position: "CEO and Co-Founder",
        company: "Confidential Inc."
      }
    },
    {
      id: 2,
      title: "Accounts Receivable Recovery",
      category: "Revenue Cycle Support",
      description: "Structured collection strategies for a healthcare provider with aging accounts receivable.",
      challenge: "A healthcare business needed help with payer follow-ups and consistent documentation for unpaid balances.",
      solution: "We implemented systematic follow-up workflows, deployed a dedicated billing team, and aligned updates inside the client’s billing system.",
      results: [
        "Denial reduction from 32 percent to 15 percent in revenue cycle activities",
        "Clean claim rate of 98 percent for claims processing",
        "Resolution of messages within 24 hours in 98 percent of cases"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrGaIbJrUXE8YTvI5L6NyoCA41xG0KlrumqD3P",
      testimonial: {
        quote: "The AR recovery results were immediate and impressive. UPLIFT's team approached collections with the perfect balance of persistence and professionalism. They recovered funds we had almost written off completely.",
        author: "Michelle Rivera",
        position: "CFO",
        company: "Midwest Health Partners"
      }
    },
    {
      id: 3,
      title: "Call Center Optimization",
      category: "Front Office Support",
      description: "Optimizing scheduling and call management for a busy clinic to improve patient access.",
      challenge: "A medical clinic struggled to manage inbound scheduling calls alongside outbound recall outreach.",
      solution: "We implemented a dedicated virtual front desk team, optimized scheduling protocols, and introduced quality checks.",
      results: [
        "Schedule adherence of 95 percent in front office operations",
        "Average speed of answer of 22 seconds for inbound calls or contacts",
        "Resolution of messages within 24 hours in 98 percent of cases"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrgCOWBl9pUNhrWouxqs4lZ1DIam2i9Jv0zHyt"
    },
    {
      id: 4,
      title: "Professional Clinical Assistance",
      category: "Clinical and Care Coordination Support",
      description: "Deploying clinical support to manage scheduling reminders and follow-ups across departments.",
      challenge: "A multi-location dental organization needed consistent outreach and follow-up documentation across clinical teams.",
      solution: "We deployed Clinical Nurse Coordinators and Medical Scribes to work inside existing systems and escalate to onsite staff when needed.",
      results: [
        "Reduction of no show rates from 27 percent to 15 percent in clinical or coordination workflows",
        "Resolution of messages within 24 hours in 98 percent of cases"
      ],
      imageSrc: "https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48umk0e7rzSVUAW58LFw0OdkaCEGun9vJTQ37M",
      testimonial: {
        quote: "The Clinical Coordination Team UPLIFT implemented has been transformative. Our patients receive immediate responses at any hour, and our team can focus on onsite interactions with seamless scheduling and confirmations.",
        author: "James Chen",
        position: "Operations Director",
        company: "Confidential Services Group"
      }
    },
    {
      id: 5,
      title: "Recall Pipeline Expansion",
      category: "Front Office Support",
      description: "Building and managing an outbound recall operation for a growing dental office network.",
      challenge: "A healthcare company needed support to expand recall outreach while maintaining consistent documentation.",
      solution: "We created a dedicated outbound unit, standardized scripts, and integrated with the client’s EMR system for seamless tracking.",
      results: [
        "Schedule adherence of 95 percent in front office operations",
        "Average speed of answer of 22 seconds for inbound calls or contacts"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhr1nZS9eKKpXVWvs9SzonqPt04iFJaeUgRD85u"
    },
    {
      id: 6,
      title: "Training Optimization",
      category: "Front Office Support",
      description: "Restructuring training operations for an endocrinology and infusion clinic to improve consistency.",
      challenge: "A clinic needed better visibility into intake workflows and staff handoffs across departments.",
      solution: "We implemented end-to-end workflow training, standardized documentation, and shared reporting updates.",
      results: [
        "Schedule adherence of 95 percent in front office operations",
        "Resolution of messages within 24 hours in 98 percent of cases"
      ],
      imageSrc: "https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48M2OOvk6PEBiI3RJApQHa7gjDUWtV6dYsv1l4"
    },
    {
      id: 7,
      title: "Brand Evolution & Experience Strategy",
      category: "Front Office Support",
      description: "Refreshing communication workflows to improve intake experiences for a technology startup’s healthcare clients.",
      challenge: "A growing organization needed clearer patient-facing communication and intake guidance.",
      solution: "We aligned messaging, intake scripts, and scheduling workflows across teams to improve consistency.",
      results: [
        "Schedule adherence of 95 percent in front office operations",
        "Average speed of answer of 22 seconds for inbound calls or contacts"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhr29eCfrOIXq0JBeTNSsrEFDjm8bYxAHK13tzV",
      testimonial: {
        quote: "The updated brand system and clear positioning from Uplift Technologies transformed how our market perceives us. We've seen immediate impact in both lead quality and customer engagement.",
        author: "Sarah Chen",
        position: "CMO",
        company: "TechVision Solutions"
      }
    },
    {
      id: 8,
      title: "Integrated Outreach Program",
      category: "Front Office Support",
      description: "Multi-channel outreach to improve scheduling access and follow-up consistency.",
      challenge: "A dental lab needed a unified outreach approach to keep patient communication consistent.",
      solution: "We built an integrated outreach program with scripts, follow-ups, and tracking inside the client’s communication stack.",
      results: [
        "Schedule adherence of 95 percent in front office operations",
        "Resolution of messages within 24 hours in 98 percent of cases"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrrIXNSKFdfMxj3N4Ltv1KoiqPgbEIWwUAFmSh",
      testimonial: {
        quote: "The integrated outreach team at Uplift Technologies delivered beyond our expectations. Their cohesive approach increased our leads and positioned us as a leader in our space.",
        author: "Michael Roberts",
        position: "VP Growth",
        company: "Confidential Dental Labs"
      }
    }
  ];
  
  const filteredCaseStudies = activeFilter === 'all' 
    ? caseStudies 
    : caseStudies.filter(study => study.category === activeFilter);
  
  const categories = ['all', ...Array.from(new Set(caseStudies.map(study => study.category)))];

  const caseStudiesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": caseStudies.map((study, index) => ({
      "@type": "Article",
      "position": index + 1,
      "headline": study.title,
      "description": study.description,
      "image": study.imageSrc,
      "author": {
        "@type": "Organization",
        "name": "UPLIFT Technologies"
      },
      "publisher": {
        "@type": "Organization",
        "name": "UPLIFT Technologies",
        "logo": {
          "@type": "ImageObject",
          "url": "https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48iMxthOcE6roLUaYdk7D4P8Ocip153HeJWKBG"
        }
      },
      "datePublished": "2024-01-01",
      "articleBody": `${study.challenge} ${study.solution}`,
      "articleSection": study.category
    }))
  };
  
  return (
    <>
      <MetaTags 
        title="Case Studies - Client Success Stories"
        description="Discover how UPLIFT Technologies transforms businesses through expert outsourcing solutions. Real results across sales, collections, and more."
        image="https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48gUJycDW4KQobNdljuvhf3x8ZICL0FDiO2aUY"
        type="article"
      />
      {caseStudiesSchema && <StructuredData data={caseStudiesSchema} />}
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 gradient-bg relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric-violet/20 rounded-full filter blur-[100px] animate-glow"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-sans font-semibold mb-6">
              Our <span className="gradient-text">Case Studies</span>
            </h1>
            <p className="text-xl text-white/80">
              Real results for real businesses. Explore how our services have transformed operations and driven growth across industries.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="py-8 border-b border-neutral-800">
        <div className="container-custom overflow-x-auto px-2">
          <div className="flex flex-nowrap sm:flex-wrap gap-2 sm:gap-4 justify-start sm:justify-center min-w-full pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-3 py-2 text-sm whitespace-nowrap rounded-full transition-all ${
                  activeFilter === category
                    ? 'bg-electric-violet text-white'
                    : 'bg-neutral-800/50 text-white/70 hover:bg-neutral-700'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Case Studies Grid */}
      <Section className="px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {filteredCaseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="flex flex-col h-full">
                <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
                  <img 
                    src={study.imageSrc}
                    alt={study.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-electric-violet/90 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {study.category}
                  </div>
                </div>
                
                <h2 className="text-2xl font-medium mb-3">{study.title}</h2>
                <p className="text-white/80 mb-5">{study.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Challenge:</h3>
                  <p className="text-white/70 mb-4">{study.challenge}</p>
                  
                  <h3 className="text-lg font-medium mb-2">Solution:</h3>
                  <p className="text-white/70 mb-4">{study.solution}</p>
                  
                  <h3 className="text-lg font-medium mb-2">Results:</h3>
                  <p className="text-sm text-white/70 mb-2">
                    These figures are examples from our operations and are not guarantees for every engagement.
                  </p>
                  <ul className="space-y-2">
                    {study.results.map((result, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={18} className="text-electric-violet mt-1 mr-2 flex-shrink-0" />
                        <span className="text-white/80">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {study.testimonial && (
                  <div className="mt-auto">
                    <div className="border-t border-neutral-700 pt-6 mt-6">
                      <p className="text-white/90 italic mb-4">"{study.testimonial.quote}"</p>
                      <div>
                        <p className="font-medium text-electric-violet">
                          {study.testimonial.author}
                        </p>
                        <p className="text-sm text-white/60">
                          {study.testimonial.position}, {study.testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>
      
      {/* CTA Section */}
      <Section className="bg-deep-purple/5">
        <motion.div 
          className="bg-gradient-to-r from-deep-purple/30 to-rich-black border border-neutral-800 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-sans font-semibold mb-4">
            Ready to Achieve Similar Results?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Schedule a consultation to discuss your specific needs and discover how our services can transform your business operations.
          </p>
          <Button to="/book" size="lg" analyticsLabel="pricing_footer_schedule">
            Schedule discovery call
          </Button>
        </motion.div>
      </Section>
    </>
  );
};

export default CaseStudiesPage;
