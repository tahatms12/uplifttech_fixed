import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ChevronsUpDown, X, Check, ArrowRight } from 'lucide-react';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface JobPosition {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

const CareersPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Careers | UPLIFT Technologies';
  }, []);
  
  const [activeJob, setActiveJob] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const jobPositions: JobPosition[] = [
    {
      id: 1,
      title: "Sales Development Representative",
      department: "Sales",
      location: "Remote",
      type: "Full-time",
      description: "We're looking for ambitious Sales Development Representatives to help drive our business growth. In this role, you'll identify and qualify new business opportunities through outbound prospecting and lead qualification.",
      responsibilities: [
        "Conduct outbound calls and emails to potential clients",
        "Qualify leads and schedule appointments for Account Executives",
        "Research accounts, identify key decision makers, and generate interest",
        "Maintain accurate records in our CRM system",
        "Meet or exceed monthly quotas for calls, emails, and appointments"
      ],
      requirements: [
        "Previous sales or customer service experience preferred",
        "Excellent communication skills in English",
        "Self-motivated with a strong desire to succeed",
        "Ability to work independently in a remote environment",
        "Comfortable with technology and learning new systems"
      ]
    },
    {
      id: 2,
      title: "Collections Specialist",
      department: "Collections",
      location: "Remote",
      type: "Full-time",
      description: "We're seeking detail-oriented Collections Specialists to help our clients recover outstanding accounts receivable. This role requires excellent communication skills and a professional approach to collections.",
      responsibilities: [
        "Contact customers regarding past-due accounts via phone and email",
        "Negotiate payment arrangements and follow up on commitments",
        "Document all collection activities in the system",
        "Adhere to all compliance requirements including HIPAA, FDCPA, and TCPA",
        "Meet or exceed monthly collection targets"
      ],
      requirements: [
        "Previous collections or accounts receivable experience preferred",
        "Strong negotiation and communication skills",
        "Detail-oriented with excellent record-keeping abilities",
        "Knowledge of collections regulations and compliance requirements",
        "Ability to maintain professionalism in challenging conversations"
      ]
    },
    {
      id: 3,
      title: "Front Desk Coordinator",
      department: "Front Desk",
      location: "Remote",
      type: "Part-time",
      description: "Join our virtual front desk team and be the voice of our clients' businesses. You'll handle incoming calls, schedule appointments, and ensure exceptional customer service for various industries.",
      responsibilities: [
        "Answer incoming calls professionally according to client scripts",
        "Schedule and manage appointments using various systems",
        "Respond to customer inquiries and provide information",
        "Take detailed messages and route to appropriate departments",
        "Maintain accurate records of all interactions"
      ],
      requirements: [
        "Previous customer service or receptionist experience",
        "Excellent phone etiquette and communication skills",
        "Ability to learn multiple scheduling systems",
        "Strong attention to detail and multitasking abilities",
        "Quiet home office environment with reliable internet"
      ]
    },
    {
      id: 4,
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "We're looking for a creative Digital Marketing Specialist to join our team. You'll help create and implement marketing strategies across multiple channels for our clients.",
      responsibilities: [
        "Create and schedule content for social media platforms",
        "Develop and execute email marketing campaigns",
        "Monitor and report on campaign performance metrics",
        "Optimize campaigns based on data and client feedback",
        "Collaborate with cross-functional teams on integrated marketing efforts"
      ],
      requirements: [
        "1-3 years of digital marketing experience",
        "Proficiency with social media platforms and marketing tools",
        "Experience with email marketing and content creation",
        "Basic understanding of SEO and analytics",
        "Strong written and verbal communication skills"
      ]
    },
    {
      id: 5,
      title: "Software Developer",
      department: "Software Development",
      location: "Remote",
      type: "Full-time",
      description: "Join our development team to build innovative solutions for our clients. You'll work on a variety of projects across different industries, focusing on creating efficient and scalable applications.",
      responsibilities: [
        "Develop and maintain web applications using modern frameworks",
        "Collaborate with cross-functional teams to define and implement new features",
        "Write clean, maintainable, and well-documented code",
        "Participate in code reviews and contribute to technical discussions",
        "Troubleshoot and resolve software defects"
      ],
      requirements: [
        "2+ years of experience in web development",
        "Proficiency in JavaScript/TypeScript and modern frameworks (React, Angular, etc.)",
        "Experience with backend technologies (Node.js, Python, etc.)",
        "Understanding of database design and query optimization",
        "Strong problem-solving skills and attention to detail"
      ]
    }
  ];
  
  const departments = ['all', ...Array.from(new Set(jobPositions.map(job => job.department)))];
  
  const filteredJobs = activeFilter === 'all'
    ? jobPositions
    : jobPositions.filter(job => job.department === activeFilter);
  
  const toggleJob = (id: number) => {
    setActiveJob(activeJob === id ? null : id);
  };
  
  return (
    <>
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
              Join Our <span className="gradient-text">Team</span>
            </h1>
            <p className="text-xl text-white/80">
              Build your career with UPLIFT Technologies. We're looking for talented individuals to help drive our mission of providing exceptional outsourcing services.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Why Join Us */}
      <Section
        title="Why Join UPLIFT"
        subtitle="Discover the benefits of building your career with our global team."
        centered
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Remote-First Culture",
              description: "Work from anywhere with our flexible, results-oriented approach that prioritizes your work-life balance.",
              icon: "🌎"
            },
            {
              title: "Growth & Development",
              description: "Access ongoing training, mentorship, and clear career advancement pathways as you grow with us.",
              icon: "📈"
            },
            {
              title: "Global Impact",
              description: "Be part of innovative solutions that help businesses across industries achieve their goals.",
              icon: "🚀"
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-medium mb-3">{benefit.title}</h3>
              <p className="text-white/70">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>
      
      {/* Open Positions */}
      <Section
        title="Open Positions"
        subtitle="Find your next opportunity with UPLIFT Technologies."
        centered
        className="bg-deep-purple/5"
      >
        {/* Department Filters */}
        <div className="mb-10 flex flex-wrap gap-4 justify-center">
          {departments.map((department) => (
            <button
              key={department}
              onClick={() => setActiveFilter(department)}
              className={`px-4 py-2 rounded-full transition-all ${
                activeFilter === department
                  ? 'bg-electric-violet text-white'
                  : 'bg-neutral-800/50 text-white/70 hover:bg-neutral-700'
              }`}
            >
              {department === 'all' ? 'All Departments' : department}
            </button>
          ))}
        </div>
        
        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden">
                  <button 
                    className="w-full flex flex-col md:flex-row md:items-center justify-between"
                    onClick={() => toggleJob(job.id)}
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-white/70">
                          <Briefcase size={16} className="mr-2" />
                          {job.department}
                        </div>
                        <div className="flex items-center text-white/70">
                          <MapPin size={16} className="mr-2" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-white/70">
                          <Clock size={16} className="mr-2" />
                          {job.type}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      {activeJob === job.id ? (
                        <X size={24} className="text-electric-violet" />
                      ) : (
                        <ChevronsUpDown size={24} className="text-electric-violet" />
                      )}
                    </div>
                  </button>
                  
                  {activeJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-neutral-800"
                    >
                      <p className="mb-6">{job.description}</p>
                      
                      <div className="mb-6">
                        <h4 className="text-lg font-medium mb-3">Responsibilities:</h4>
                        <ul className="space-y-2">
                          {job.responsibilities.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <Check size={18} className="text-electric-violet mt-1 mr-2 flex-shrink-0" />
                              <span className="text-white/80">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-8">
                        <h4 className="text-lg font-medium mb-3">Requirements:</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <Check size={18} className="text-electric-violet mt-1 mr-2 flex-shrink-0" />
                              <span className="text-white/80">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button to="/apply" className="group">
                        Apply Now
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-white/70">No positions available in this department currently. Check back later!</p>
          )}
        </div>
      </Section>
      
      {/* Application Process */}
      <Section
        title="Our Application Process"
        subtitle="What to expect when you apply for a position at UPLIFT Technologies."
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "Apply",
              description: "Submit your application through our careers portal with your resume and any required assessments."
            },
            {
              step: "Initial Interview",
              description: "If your profile matches our requirements, we'll schedule a video call to discuss your experience and expectations."
            },
            {
              step: "Skills Assessment",
              description: "Depending on the role, you may be asked to complete a brief task or assessment related to your skills."
            },
            {
              step: "Final Interview",
              description: "Meet with the team leader and discuss specifics of the role, culture fit, and next steps."
            }
          ].map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <Card>
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-electric-violet flex items-center justify-center text-xl font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-medium mb-3 mt-4">{phase.step}</h3>
                <p className="text-white/70">{phase.description}</p>
              </Card>
              
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-electric-violet/50"></div>
              )}
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
            Don't See the Right Fit?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Submit your resume for future opportunities.
          </p>
          <Button to="/apply" size="lg">
            Submit Your Resume
          </Button>
        </motion.div>
      </Section>
    </>
  );
};

export default CareersPage;