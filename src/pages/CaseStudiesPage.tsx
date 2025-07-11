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
      title: "Development Team Gap",
      category: "Software Development",
      description: "Providing a structured development team for a company using outdated technology with no formal processes.",
      challenge: "A company using outdated tech lacked a formal dev team. They relied on old-school methods like Agile/Waterfall without structured enforcement. No optimized systems meant missed deadlines and undocumented QA.",
      solution: "We implemented a structured development process with proper Agile methodology, introduced documentation standards, established QA protocols, and provided a skilled development team familiar with modern technologies.",
      results: [
        "85% improvement in process efficiency",
        "100% adherence to deadlines after implementation",
        "Comprehensive documentation allowing for knowledge transfer",
        "Reduced bug rate by 67% through formalized QA"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhr1nZS9eKKpXVWvs9SzonqPt04iFJaeUgRD85u",
      testimonial: {
        quote: "UPLIFT transformed our development process from chaotic to structured. Their team didn't just write code—they implemented systems that fundamentally changed how we approach software development.",
        author: "Thomas Wright",
        position: "CTO",
        company: "TechSolutions Inc."
      }
    },
    {
      id: 2,
      title: "Accounts Receivable Recovery",
      category: "Collections",
      description: "Structured collection strategies recovering $2M in outstanding accounts receivable for a healthcare provider.",
      challenge: "A healthcare business had $2M outstanding in accounts receivable, with limited internal resources to pursue collections and no structured follow-up process for unpaid invoices.",
      solution: "We implemented a systematic collections approach with tiered strategies based on account age, deployed a dedicated team of collection specialists, and integrated with the client's billing system for seamless information flow.",
      results: [
        "Recovered $25K within the first month",
        "Full recovery of $2M in previously written-off AR",
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
      category: "Front Desk",
      description: "Optimizing scheduling and call management for a busy clinic to maximize efficiency and customer satisfaction.",
      challenge: "A medical clinic struggled with managing both inbound scheduling calls and performing necessary outbound recall calls, resulting in missed appointments and scheduling inefficiencies.",
      solution: "We implemented a dedicated virtual front desk team handling inbound calls while performing systematic outbound recall calls, optimized scheduling protocols, and introduced a quality retention program.",
      results: [
        "42% reduction in no-show appointments",
        "95% answer rate for all incoming calls",
        "Full schedule utilization, maximizing provider productivity",
        "Improved patient satisfaction scores by 38%"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrgCOWBl9pUNhrWouxqs4lZ1DIam2i9Jv0zHyt"
    },
    {
      id: 4,
      title: "AI Voice and Text Agent Integration",
      category: "Automation",
      description: "Deploying AI-powered agents to automate scheduling, reminders, and follow-ups across departments.",
      challenge: "A multi-location business struggled with staffing for routine communication tasks, resulting in inconsistent customer follow-up and after-hours coverage gaps.",
      solution: "We deployed AI-powered voice and text agents integrated with their existing systems to automate scheduling, reminders, and follow-ups across all departments, with seamless escalation to human agents when needed.",
      results: [
        "65% reduction in response times for routine inquiries",
        "24/7 coverage for basic customer interactions",
        "73% of routine scheduling handled automatically",
        "50% reduction in staff time spent on repetitive communication tasks"
      ],
      imageSrc: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      testimonial: {
        quote: "The AI integration UPLIFT implemented has been transformative. Our customers receive immediate responses at any hour, and our team can focus on complex interactions that truly require the human touch.",
        author: "James Chen",
        position: "Operations Director",
        company: "Velocity Services Group"
      }
    },
    {
      id: 5,
      title: "Sales Pipeline Expansion",
      category: "Sales",
      description: "Building and managing an outbound sales operation for a SaaS company entering new markets.",
      challenge: "A growing SaaS company needed to expand into new market segments but lacked the sales team and expertise to effectively reach and convert these prospects.",
      solution: "We created a dedicated outbound sales unit with industry-specific expertise, implemented a structured sales process from prospecting to closing, and integrated with the client's CRM for seamless lead management.",
      results: [
        "127% increase in qualified sales pipeline within 90 days",
        "42% reduction in customer acquisition cost",
        "35% higher conversion rate than previous internal efforts",
        "Successful entry into 3 new vertical markets"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrYamlY1VvGagiQPkZIS78eT2lbXDK1sjz5c3t"
    },
    {
      id: 6,
      title: "Supply Chain Optimization",
      category: "Logistics",
      description: "Restructuring logistics operations for a manufacturing company to improve efficiency and reduce costs.",
      challenge: "A manufacturing business struggled with inventory management, shipping delays, and high logistics costs due to disorganized processes and limited visibility into their supply chain.",
      solution: "We implemented end-to-end supply chain management, optimized inventory levels through data analysis, streamlined shipping processes, and introduced real-time tracking and reporting systems.",
      results: [
        "32% reduction in overall logistics costs",
        "Inventory holding costs decreased by 28%",
        "On-time delivery improved from 79% to 97%",
        "Order processing time reduced by 40%"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhr8Hyh7FSpA1R97OPT6CrtFKfNDeZcxaImnYuB"
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
      description: "Multi-channel marketing campaign combining traditional and digital strategies for maximum impact.",
      challenge: "A B2B software company struggled to stand out in a crowded market and needed a comprehensive marketing approach to increase market share.",
      solution: "We created an integrated marketing campaign that combined content marketing, social media, email automation, and targeted advertising, all unified by strong creative direction.",
      results: [
        "156% increase in qualified leads",
        "89% improvement in social engagement",
        "43% reduction in customer acquisition cost",
        "12 major industry awards won"
      ],
      imageSrc: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrrIXNSKFdfMxj3N4Ltv1KoiqPgbEIWwUAFmSh",
      testimonial: {
        quote: "The marketing and creative team at Uplift Technologies delivered beyond our expectations. Their integrated approach not only increased our leads but also established us as a thought leader in our space.",
        author: "Michael Roberts",
        position: "VP Marketing",
        company: "CloudSphere Solutions"
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
        description="Discover how UPLIFT Technologies transforms businesses through expert outsourcing solutions. Real results, real impact across sales, marketing, collections & more."
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
          <Button to="/contact" size="lg" className="group">
            Book a Meeting
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </Section>
    </>
  );
};

export default CaseStudiesPage;