import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface CaseStudyCardProps {
  title: string;
  category: string;
  description: string;
  stats: { label: string; value: string }[];
  imageUrl: string;
  delay: number;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  title,
  category,
  description,
  stats,
  imageUrl,
  delay,
}) => {
  return (
    <Card className="overflow-hidden p-0 flex flex-col h-full" delay={delay}>
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-electric-violet/90 text-white text-xs font-medium px-2 py-1 sm:px-3 sm:py-1 rounded-full">
          {category}
        </div>
      </div>
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-medium mb-3">{title}</h3>
        <p className="text-white/70 mb-6">{description}</p>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-lg sm:text-xl font-medium text-electric-violet">{stat.value}</p>
              <p className="text-sm text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-auto">
          <Button to="/case-studies" variant="outline" className="w-full">
          View Case Study
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CaseStudies: React.FC = () => {
  const caseStudies = [
    {
      title: "Brand Evolution & Strategy",
      category: "Creative Direction",
      description: "Complete brand transformation and creative strategy development for a technology startup.",
      stats: [
        { label: "Brand Recognition", value: "+65%" },
        { label: "Lead Generation", value: "+48%" }
      ],
      imageUrl: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhr29eCfrOIXq0JBeTNSsrEFDjm8bYxAHK13tzV"
    },
    {
      title: "Accounts Receivable Recovery",
      category: "Collections",
      description: "Structured collection strategies recovering $2M in outstanding accounts receivable.",
      stats: [
        { label: "First Month", value: "$25K" },
        { label: "Total Recovered", value: "$2M" }
      ],
      imageUrl: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhr1nZS9eKKpXVWvs9SzonqPt04iFJaeUgRD85u"
    },
    {
      title: "Integrated Marketing Campaign",
      category: "Marketing",
      description: "Multi-channel marketing campaign combining traditional and digital strategies for maximum impact.",
      stats: [
        { label: "Qualified Leads", value: "+156%" },
        { label: "Social Engagement", value: "+89%" }
      ],
      imageUrl: "https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhr70PfYCJoqhwKnVTQZaEAGCsP4eUcDWl2dOm1"
    }
  ];

  return (
    <Section
      title="Case Studies"
      subtitle="Real results for real businesses. See how our services have transformed operations and driven growth."
      centered
      className="bg-deep-purple/5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {caseStudies.map((study, index) => (
          <CaseStudyCard
            key={study.title}
            title={study.title}
            category={study.category}
            description={study.description}
            stats={study.stats}
            imageUrl={study.imageUrl}
            delay={index}
          />
        ))}
      </div>
      
      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Button to="/case-studies" size="lg" className="group w-full sm:w-auto">
          View All Case Studies
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </Section>
  );
};

export default CaseStudies;