import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
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
  useEffect(() => {
    document.title = 'Case Studies | UPLIFT Technologies';
  }, []);
  
   const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const caseStudies: CaseStudy[] = [
    {
      id: 1,
      title: "Accounts Receivable Team Gap",
      category: "Revenue Cycle",
      description: "Providing a structured AR team for a Dental Company with no formal processes.",
      challenge: "A company using outdated technology and lacking a formal AR team. They relied on their admin to do the work without structured enforcement. No optimized systems meant missed deadlines and undocumented receivables.",
      solution: "We implemented a structured process with proper documentation standards, established QA protocols, and provided a team familiar with modern technologies.",
      results: [
        "85% improvement in process efficiency",
        "100% adherence to deadlines after implementation",
        "Comprehensive documentation allowing for knowledge transfer",
        "Reduced rejection rate to 3% from 11% through formalized QA"
      ],
      imageSrc: "https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48umk0e7rzSVUAW58LFw0OdkaCEGun9vJTQ37M",
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
      category: "Revenue Cycle",
      description: "Structured collection strategies recovering $2M in outstanding accounts receivable for a healthcare provider.",
      challenge: "A healthcare business had $2M outstanding in accounts receivable, with limited internal resources to pursue collections and no structured follow up process for unpaid invoices.",
      solution: "We implemented a systematic collections approach with tiered strategies based on account age, deployed a dedicated team of collection specialists, and integrated with the client's billing system for seamless information flow.",
      results: [
        "Recovered $25K within the first month",
        "Full recovery of $2M in previously written off AR",
        "Established ongoing collection protocols reducing future AR aging",
        "Maintained positive patient relationships through professional communication"
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
      category: "Front Office",
      description: "Optimizing scheduling and call management for a busy clinic to maximize efficiency and customer satisfaction.",
      challenge: "A medical clinic struggled with managing both inbound scheduling calls and performing necessary outbound recall calls, resulting in missed appointments and scheduling inefficiencies.",
      solution: "We implemented a dedicated virtual front desk team handling inbound calls while performing systematic outbound recall calls, optimized scheduling protocols, and introduced a quality retention program.",
      results: [
        "42% reduction in no show appointments",
        "95% answer rate for all incoming calls",
        "Full schedule utilization, maximizing provider productivity",
        "Improved patient satisfaction scores by 38%"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrgCOWBl9pUNhrWouxqs4lZ1DIam2i9Jv0zHyt"
    },
    {
      id: 4,
      title: "Professional Clinical Assistance",
      category: "Clinical Coordination",
      description: "Deploying professional medical agents to handle internal scheduling, reminders, and follow ups across departments.",
      challenge: "A multi location dental organization struggled with internal staff for routine communication tasks, resulting in inconsistent customer follow up and after hours coverage gaps.",
      solution: "We deployed Clinical Nursing Coordinators and Patient Coordination Agents to integrate with their existing systems to remove guesswork from scheduling, reminders, and follow ups across all departments, with seamless escalation to onsite staff when needed.",
      results: [
        "95% reduction in response times for routine inquiries",
        "24/7 coverage for basic customer bookings",
        "73% of routine scheduling handled automatically",
        "50% reduction in staff time spent on repetitive communication tasks"
      ],
      imageSrc: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
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
      category: "Front Desk",
      description: "Building and managing an outbound operation for a dental office opening in new markets.",
      challenge: "A growing healthcare company needed to expand into 3 new locations at once, and they lacked the staff and training to effectively reach and convert these prospects.",
      solution: "We created a dedicated outbound unit with healthcare booking expertise, implemented a structured process from prospecting to closing, and integrated with the client's EMR system for seamless lead management.",
      results: [
        "127% increase in qualified patients booked within 90 days",
        "78% reduction in customer acquisition cost",
        "35% higher conversion rate than previous internal efforts",
        "Successful entry into 3 new zip codes simultaneously"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhr1nZS9eKKpXVWvs9SzonqPt04iFJaeUgRD85u"
    },
    {
      id: 6,
      title: "Training Optimization",
      category: "Admin",
      description: "Restructuring training for operations for an endocrinology and infusion clinic to improve efficiency and reduce costs.",
      challenge: "A clinic struggled with staff management, treatment delays, and high churn costs due to disorganized processes and limited visibility into their supply chain.",
      solution: "We implemented end to end management training and staff training, optimized processes through data analysis, streamlined communication channels, and introduced real time reporting systems.",
      results: [
        "32% reduction in overall management costs",
        "Employee retention costs decreased by 28%",
        "On time delivery improved from 79% to 97%",
        "Patient processing time reduced by 40%"
      ],
      imageSrc: "https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48M2OOvk6PEBiI3RJApQHa7gjDUWtV6dYsv1l4"
    },
    {
      id: 7,
      title: "Brand Evolution & Creative Strategy",
      category: "Creative Direction",
      description: "Complete brand transformation and creative strategy development for a technology startup.",
      challenge: "A growing tech startup needed to evolve their brand identity and creative direction to better reflect their market position and attract enterprise clients.",
      solution: "We developed a comprehensive brand strategy, including new visual identity, brand voice, and creative guidelines. This was followed by a series of targeted campaigns that showcased their new positioning.",
      results: [
        "48% increase in enterprise lead generation",
        "Brand recognition improved by 65%",
        "Marketing campaign engagement up 83%",
        "Successfully entered 2 new market segments"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhr29eCfrOIXq0JBeTNSsrEFDjm8bYxAHK13tzV",
      testimonial: {
        quote: "The creative direction and brand strategy provided by Uplift Technologies transformed how our market perceives us. We've seen immediate impact in both lead quality and customer engagement.",
        author: "Sarah Chen",
        position: "CMO",
        company: "TechVision Solutions"
      }
    },
    {
      id: 8,
      title: "Integrated Marketing Campaign",
      category: "Marketing",
      description: "Multi channel marketing campaign combining traditional and digital strategies for maximum impact.",
      challenge: "A dental lab struggled to stand out in a crowded market and needed a comprehensive marketing approach to increase market share.",
      solution: "We created an integrated marketing campaign that combined content marketing, social media, email automation, and targeted advertising, all unified by strong creative direction.",
      results: [
        "156% increase in qualified leads",
        "89% improvement in social engagement",
        "43% reduction in customer acquisition cost",
        "12 major B2B relationships formed"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrrIXNSKFdfMxj3N4Ltv1KoiqPgbEIWwUAFmSh",
      testimonial: {
        quote: "The marketing and creative team at Uplift Technologies delivered beyond our expectations. Their integrated approach not only increased our leads but also established us as a market leader in our space.",
        author: "Michael Roberts",
        position: "VP Marketing",
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
        description="Discover how UPLIFT Technologies transforms businesses through expert outsourcing solutions. Real results, real impact across sales, marketing, collections and more."
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
            <h1 className="font-poppins font-semibold mb-6">
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
          <h2 className="text-3xl font-poppins font-semibold mb-4">
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
