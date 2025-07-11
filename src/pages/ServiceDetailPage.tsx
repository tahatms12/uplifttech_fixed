import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, TrendingUp, BadgeDollarSign, Megaphone, PhoneCall, ArrowRight, CheckCircle } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import CallToAction from '../components/home/CallToAction';
import MetaTags from '../components/seo/MetaTags';
import StructuredData from '../components/seo/StructuredData';

interface ServiceDetail {
  title: string;
  icon: React.ReactNode;
  description: string;
  longDescription: string;
  features: string[];
  benefits: { title: string; description: string }[];
  process: { title: string; description: string }[];
  imageSrc: string;
}

const ServiceDetailPage: React.FC = () => {
  const { service } = useParams<{ service: string }>();
  
  const servicesData: Record<string, ServiceDetail> = {
    'sales': {
      title: 'Sales',
      icon: <Users size={32} />,
      description: 'Drive revenue growth with our specialized sales teams trained in your products and services.',
      longDescription: 'Our sales outsourcing services provide your business with expert teams trained in your products, driving revenue through personalized outreach and relationship building. We handle everything from lead generation to closing deals, allowing you to focus on core business activities while achieving sustainable growth.',
      features: [
        'Dedicated sales representatives trained specifically in your products and services',
        'Comprehensive lead generation and qualification processes',
        'Full pipeline management from prospecting to closing',
        'CRM implementation and management',
        'Detailed performance analytics and reporting',
        'Sales process optimization and continuous improvement'
      ],
      benefits: [
        {
          title: 'Cost Efficiency',
          description: 'Reduce overhead by eliminating the need for in-house hiring, training, and management of sales teams.'
        },
        {
          title: 'Scalability',
          description: 'Easily scale your sales operations up or down based on business needs without the complexities of hiring or layoffs.'
        },
        {
          title: 'Expertise Access',
          description: 'Leverage our experienced sales professionals who bring best practices and proven strategies.'
        },
        {
          title: 'Faster Market Entry',
          description: 'Accelerate your go-to-market timeline with ready-to-deploy sales resources.'
        }
      ],
      process: [
        {
          title: 'Discovery',
          description: 'We analyze your current sales processes, goals, and challenges to create a tailored strategy.'
        },
        {
          title: 'Implementation',
          description: 'Our team integrates with your systems and undergoes comprehensive training on your products and services.'
        },
        {
          title: 'Execution',
          description: 'Dedicated sales representatives begin outreach activities, following established processes and best practices.'
        },
        {
          title: 'Optimization',
          description: 'Continuous performance monitoring and process refinement to maximize results and ROI.'
        }
      ],
      imageSrc: 'https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrOwsfWsPtf5tLxrJBKGIUXpzSWP3AO9Qwhg1N'
    },
    'logistics': {
      title: 'Logistics',
      icon: <TrendingUp size={32} />,
      description: 'Streamline operations with end-to-end logistics and supply chain management solutions.',
      longDescription: 'Our logistics outsourcing services help streamline your supply chain with dedicated professionals managing tracking, coordination, and optimization. From inventory management to distribution logistics, we ensure your operations run smoothly and efficiently while reducing costs.',
      features: [
        'End-to-end supply chain management',
        'Order processing and fulfillment tracking',
        'Inventory management and optimization',
        'Shipping and distribution coordination',
        'Vendor management and procurement support',
        'Logistics analytics and performance reporting'
      ],
      benefits: [
        {
          title: 'Operational Efficiency',
          description: 'Streamline processes and eliminate bottlenecks in your supply chain operations.'
        },
        {
          title: 'Cost Reduction',
          description: 'Optimize inventory levels and shipping costs through data-driven management.'
        },
        {
          title: 'Improved Visibility',
          description: 'Gain comprehensive insights into your entire supply chain with detailed tracking and reporting.'
        },
        {
          title: 'Focus on Core Business',
          description: 'Delegate logistics complexities to experts while concentrating on your core competencies.'
        }
      ],
      process: [
        {
          title: 'Assessment',
          description: 'We evaluate your current logistics operations, identifying inefficiencies and improvement opportunities.'
        },
        {
          title: 'Strategy Development',
          description: 'Our team creates a customized logistics management plan aligned with your business objectives.'
        },
        {
          title: 'Implementation',
          description: 'We integrate with your systems and begin managing specified logistics functions.'
        },
        {
          title: 'Continuous Improvement',
          description: 'Ongoing analysis and optimization of processes to achieve greater efficiency and cost savings.'
        }
      ],
      imageSrc: 'https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhr7Adl4MJoqhwKnVTQZaEAGCsP4eUcDWl2dOm1'
    },
    'collections': {
      title: 'Collections',
      icon: <BadgeDollarSign size={32} />,
      description: 'Recover outstanding accounts receivable with our compliant, respectful approach.',
      longDescription: 'Our collections services help businesses recover outstanding accounts receivable through structured, compliant strategies that preserve customer relationships. We\'ve successfully recovered millions in AR for clients while maintaining professional standards and regulatory compliance.',
      features: [
        'Customized collection strategies based on account age and value',
        'Professional, respectful communication with debtors',
        'HIPAA, GDPR, and PIPEDA compliant processes',
        'Detailed reporting on recovery rates and performance',
        'Integration with your existing accounting systems',
        'Payment plan negotiation and management'
      ],
      benefits: [
        {
          title: 'Improved Cash Flow',
          description: 'Accelerate the recovery of outstanding receivables to improve your working capital.'
        },
        {
          title: 'Reduced Bad Debt',
          description: 'Minimize write-offs through systematic follow-up and professional collection practices.'
        },
        {
          title: 'Compliance Assurance',
          description: 'Rest easy knowing all collection activities adhere to relevant regulations and standards.'
        },
        {
          title: 'Customer Relationship Preservation',
          description: 'Our respectful approach helps maintain positive relationships even during collections.'
        }
      ],
      process: [
        {
          title: 'Account Analysis',
          description: 'We review your accounts receivable aging to identify recovery opportunities and prioritize accounts.'
        },
        {
          title: 'Strategy Implementation',
          description: 'Our team deploys customized collection strategies based on account characteristics.'
        },
        {
          title: 'Active Management',
          description: 'Systematic follow-up and communication with debtors following best practices.'
        },
        {
          title: 'Reporting & Refinement',
          description: 'Regular performance reviews and strategy adjustments to maximize recovery rates.'
        }
      ],
      imageSrc: 'https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrkd1LlTf7QUG3gos5DHvRIOeTxSVCiYqEJwZA'
    },
    'marketing': {
      title: 'Marketing',
      icon: <Megaphone size={32} />,
      description: 'Amplify your brand with full-service marketing operations and campaign management.',
      longDescription: 'Our marketing services provide full-service solutions from content creation to campaign management and performance tracking. We help businesses establish strong market presence, engage target audiences, and drive measurable results through integrated marketing strategies.',
      features: [
        'Comprehensive marketing strategy development',
        'Content creation and management across channels',
        'Digital advertising campaign planning and execution',
        'Social media management and community building',
        'Email marketing campaigns and automation',
        'Analytics and performance optimization'
      ],
      benefits: [
        {
          title: 'Brand Growth',
          description: 'Enhance your market presence and brand recognition through consistent, strategic messaging.'
        },
        {
          title: 'Lead Generation',
          description: 'Drive qualified leads through targeted campaigns and content strategies.'
        },
        {
          title: 'Marketing Expertise',
          description: 'Access specialized skills across multiple marketing disciplines without hiring specialists.'
        },
        {
          title: 'Data-Driven Results',
          description: 'Leverage analytics and testing to continuously improve campaign performance and ROI.'
        }
      ],
      process: [
        {
          title: 'Discovery & Strategy',
          description: 'We analyze your current marketing efforts, audience, and objectives to develop a tailored strategy.'
        },
        {
          title: 'Content Development',
          description: 'Our team creates engaging content aligned with your brand voice and strategic goals.'
        },
        {
          title: 'Campaign Execution',
          description: 'We implement marketing campaigns across appropriate channels to reach your target audience.'
        },
        {
          title: 'Analysis & Optimization',
          description: 'Continuous performance monitoring and campaign refinement to maximize results.'
        }
      ],
      imageSrc: 'https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhriqLUaVAGx5GHot7PpSj1Nqiscbey38YkwXh2'
    },
    'front-desk': {
      title: 'Front Desk',
      icon: <PhoneCall size={32} />,
      description: 'Provide exceptional customer service with virtual receptionists available 24/7.',
      longDescription: 'Our front desk services provide virtual reception and customer support available 24/7, ensuring your business never misses an opportunity. From appointment scheduling to customer inquiries, our professional team delivers exceptional service while maintaining your brand standards.',
      features: [
        'Live call answering by professional virtual receptionists',
        'Appointment scheduling and management',
        '24/7 availability including weekends and holidays',
        'Customer inquiry handling and information provision',
        'Message taking and routing to appropriate departments',
        'Integration with your scheduling and CRM systems'
      ],
      benefits: [
        {
          title: 'Always Available',
          description: 'Never miss a call or opportunity with around-the-clock professional coverage.'
        },
        {
          title: 'Cost Savings',
          description: 'Eliminate the expense of full-time receptionists while maintaining service quality.'
        },
        {
          title: 'Professional Image',
          description: 'Present a polished, professional first impression to all callers and visitors.'
        },
        {
          title: 'Operational Efficiency',
          description: 'Free your core team from interruptions while ensuring customer needs are met.'
        }
      ],
      process: [
        {
          title: 'Onboarding',
          description: 'We learn about your business, services, and specific handling requirements.'
        },
        {
          title: 'Integration',
          description: 'Our team sets up connections with your scheduling and communication systems.'
        },
        {
          title: 'Service Delivery',
          description: 'Professional virtual receptionists begin handling calls and appointments according to your preferences.'
        },
        {
          title: 'Ongoing Support',
          description: 'Regular reviews and adjustments to ensure service delivery meets your evolving needs.'
        }
      ],
      imageSrc: 'https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrffylYS3u4vE1XnCFZWHLb5YdoJeqV2ijy6fI'
    }
  };
  
  const serviceData = service ? servicesData[service] : null;
  
  useEffect(() => {
    if (serviceData) {
      document.title = `${serviceData.title} Services | UPLIFT Technologies`;
    } else {
      document.title = 'Service | UPLIFT Technologies';
    }
  }, [serviceData]);

  const serviceSchema = serviceData ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${serviceData.title} Services - UPLIFT Technologies`,
    "description": serviceData.longDescription,
    "provider": {
      "@type": "Organization",
      "name": "UPLIFT Technologies",
      "url": "https://uplift-technologies.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": ["United States", "United Kingdom", "Canada"]
    },
    "serviceType": serviceData.title,
    "image": serviceData.imageSrc,
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": "Contact for pricing",
        "priceCurrency": "USD"
      }
    }
  } : null;
  
  if (!serviceData) {
    return (
      <div className="pt-32 pb-20">
        <div className="container-custom">
          <h1>Service Not Found</h1>
          <p>The service you're looking for doesn't exist.</p>
          <Link to="/services">Return to Services</Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <MetaTags 
        title={`${serviceData.title} Services - Expert ${serviceData.title} Solutions`}
        description={serviceData.longDescription.slice(0, 155) + '...'}
        image={serviceData.imageSrc}
        type="service"
      />
      {serviceSchema && <StructuredData data={serviceSchema} />}
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 gradient-bg relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric-violet/20 rounded-full filter blur-[100px] animate-glow"></div>
        
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-electric-violet bg-electric-violet/10 p-3 rounded-lg">
                  {serviceData.icon}
                </div>
                <h1 className="font-poppins font-semibold">
                  {serviceData.title} <span className="gradient-text">Services</span>
                </h1>
              </div>
              <p className="text-xl text-white/80 mb-8">
                {serviceData.longDescription}
              </p>
              <Button to="/contact" size="lg" className="group">
                Book a Consultation
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src={serviceData.imageSrc}
                  alt={serviceData.title}
                  className="w-full object-cover aspect-video"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <Section
        title={`${serviceData.title} Service Features`}
        subtitle="Our comprehensive solution includes everything you need for successful implementation."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceData.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-3 glass-card p-5"
            >
              <CheckCircle size={22} className="text-electric-violet mt-1 flex-shrink-0" />
              <p className="text-white/90">{feature}</p>
            </motion.div>
          ))}
        </div>
      </Section>
      
      {/* Benefits Section */}
      <Section
        title="Key Benefits"
        subtitle={`Why businesses choose our ${serviceData.title} services to drive growth and efficiency.`}
        centered
        className="bg-deep-purple/5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {serviceData.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-medium mb-3 text-electric-violet">{benefit.title}</h3>
              <p className="text-white/80">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>
      
      {/* Process Section */}
      <Section
        title="Our Process"
        subtitle="How we implement and manage our services to ensure optimal results."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceData.process.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="glass-card p-6">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-electric-violet flex items-center justify-center text-xl font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-medium mb-3 mt-4">{step.title}</h3>
                <p className="text-white/80">{step.description}</p>
              </div>
              {index < serviceData.process.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-electric-violet/50"></div>
              )}
            </motion.div>
          ))}
        </div>
      </Section>
      
      <CallToAction />
    </>
  );
};

export default ServiceDetailPage;