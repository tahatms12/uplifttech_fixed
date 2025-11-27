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
  segmentLabel: string;
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
    'revenue-cycle': {
      title: 'Revenue Cycle',
      segmentLabel: 'Revenue Cycle',
      icon: <BadgeDollarSign size={32} />,
      description:
        'Outsourced revenue cycle teams that bring structure, documentation, and disciplined follow up to your claims and accounts receivable.',
      longDescription:
        'Our revenue cycle units are built around the work we did for multi location dental and healthcare providers that were sitting on millions in aging receivables. We deploy dedicated claims and AR specialists who introduce formal documentation standards, QA protocols, and tiered recovery strategies. This combination reduces denials, accelerates cash collection, and makes your revenue cycle predictable instead of reactive.',
      features: [
        'Dedicated claims and accounts receivable specialists for healthcare and dental providers',
        'Structured AR workflows with documentation standards and escalation paths',
        'Tiered collection strategies based on account age and balance size',
        'Integration with existing billing and practice management systems',
        'Formal QA review to reduce rejections and rework',
        'Detailed reporting covering recovery rates, rejection reasons, and process bottlenecks'
      ],
      benefits: [
        {
          title: 'Higher Recovery',
          description:
            'Clients have recovered full multi million dollar AR backlogs and unlocked working capital that was written off as unlikely to collect.'
        },
        {
          title: 'Lower Denials',
          description:
            'Formal QA and documentation cut rejection rates from double digits to low single digits while protecting payer relationships.'
        },
        {
          title: 'Predictable Cash Flow',
          description:
            'Consistent follow up and structured processes replace ad hoc chasing so leadership can forecast collection timelines with confidence.'
        },
        {
          title: 'Less Burden On Admins',
          description:
            'Front office and admin staff are freed from chasing claims and can focus on patient facing work.'
        }
      ],
      process: [
        {
          title: 'Revenue Cycle Assessment',
          description:
            'We review your current AR aging, denial reasons, and workflows to identify gaps in process, documentation, and follow up.'
        },
        {
          title: 'Playbook And Team Design',
          description:
            'A tailored playbook defines contact cadence, QA standards, documentation templates, and performance targets for the remote team.'
        },
        {
          title: 'Deployment And Integration',
          description:
            'Claims and AR specialists are onboarded into your billing stack and begin working live queues under tight monitoring.'
        },
        {
          title: 'Continuous Recovery And QA',
          description:
            'We run ongoing recovery cycles, refine strategies based on results, and provide regular reporting to operations and finance.'
        }
      ],
      imageSrc: 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48KsDMQ73cbMY8IewBXDN1uCftWjJZ5Rlhyg0G'
    },
    'clinical-coordination': {
      title: 'Clinical Coordination',
      segmentLabel: 'Clinical Coordination',
      icon: <Users size={32} />,
      description:
        'Clinical coordination pods that manage scheduling, reminders, and routine patient communication across locations and time zones.',
      longDescription:
        'Clinical coordination pods grew out of work with multi location dental and healthcare organizations that struggled to keep on top of internal communication and post visit follow up. We deploy Clinical Nursing Coordinators and Patient Coordination Agents who live inside your EMR and communication stack. The result is faster responses for routine questions, reliable reminders, and fewer scheduling gaps without burning out onsite teams.',
      features: [
        'Clinical Nursing Coordinators who understand healthcare workflows and terminology',
        'Patient Coordination Agents handling scheduling, reminders, and follow ups',
        '24/7 coverage for routine booking and information requests',
        'Standard operating procedures for escalation to onsite clinical staff',
        'Template driven messaging that matches your brand and compliance policies',
        'Measurement of response times, completion rates, and patient touch points'
      ],
      benefits: [
        {
          title: 'Faster Patient Responses',
          description:
            'Response times for routine inquiries drop sharply which improves patient satisfaction and reduces inbound call spikes.'
        },
        {
          title: 'Stronger Appointment Adherence',
          description:
            'Proactive reminders and follow ups reduce no shows and late cancellations in high volume environments.'
        },
        {
          title: 'Protected Clinical Time',
          description:
            'Providers and onsite nurses spend more time on clinical work and less on chasing reminders or rescheduling.'
        },
        {
          title: 'Scalable Coverage',
          description:
            'Remote coordinators make it possible to support multiple locations and extended hours without local hiring cycles.'
        }
      ],
      process: [
        {
          title: 'Workflow Mapping',
          description:
            'We document how patients move through your existing scheduling and follow up flows and identify friction points.'
        },
        {
          title: 'Coordinator Playbook',
          description:
            'A detailed playbook governs which tasks stay onsite, which move to the coordination pod, and how escalation works.'
        },
        {
          title: 'Pilot Launch',
          description:
            'We start with a subset of locations or queues, measure impact on response times and completion rates, and refine the model.'
        },
        {
          title: 'Network Rollout',
          description:
            'Once metrics stabilize, we expand coverage across locations and add new coordination tasks into the pod.'
        }
      ],
      imageSrc: 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48umk0e7rzSVUAW58LFw0OdkaCEGun9vJTQ37M'
    },
    'front-office': {
      title: 'Front Office',
      segmentLabel: 'Front Office',
      icon: <PhoneCall size={32} />,
      description:
        'Front office pods that absorb inbound calls and outbound recall so providers see full, well structured schedules.',
      longDescription:
        'Front office pods were designed for clinics that were missing calls, leaving voicemail backlogs, and struggling to keep recall programs alive while opening new locations. Our virtual front desk and outbound recall specialists answer, triage, and book patients while running systematic outreach to fill schedules. They integrate with your practice management system so your team gets the benefit of a high functioning call center without building one from scratch.',
      features: [
        'Virtual front desk specialists handling inbound scheduling and general inquiries',
        'Outbound recall teams focused on reactivating overdue and lapsed patients',
        'Call handling standards for greeting, triage, and warm transfers',
        'Real time schedule visibility to maximize provider utilisation',
        'Structured recall campaigns for new locations and service lines',
        'Quality monitoring across answer rate, handle time, and booking outcomes'
      ],
      benefits: [
        {
          title: 'Higher Schedule Utilisation',
          description:
            'Clinics move toward full calendars through better call capture and disciplined recall instead of sporadic outbound pushes.'
        },
        {
          title: 'Reduced No Shows',
          description:
            'Coordinated reminders and confirmations cut missed appointments and empty chair time.'
        },
        {
          title: 'Consistent Caller Experience',
          description:
            'Patients receive the same professional experience whether they call at 9am or 7pm which strengthens brand trust.'
        },
        {
          title: 'Faster Expansion',
          description:
            'Opening into new zip codes becomes easier when recall and booking are handled by an experienced remote unit.'
        }
      ],
      process: [
        {
          title: 'Call Flow Design',
          description:
            'We map how calls should be answered, triaged, and booked across each location and provider type.'
        },
        {
          title: 'System Integration',
          description:
            'Front office pods are connected to your phone system and scheduling tools with clear permissions and audit trails.'
        },
        {
          title: 'Live Operations',
          description:
            'Specialists begin taking inbound calls and running outbound recalls with close supervision and daily reporting.'
        },
        {
          title: 'Refinement And Scale',
          description:
            'We refine scripts, schedules, and outreach cadences based on actual booking and answer rate data.'
        }
      ],
      imageSrc: 'https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrgCOWBl9pUNhrWouxqs4lZ1DIam2i9Jv0zHyt'
    },
    'administration': {
      title: 'Administration',
      segmentLabel: 'Administration',
      icon: <TrendingUp size={32} />,
      description:
        'Administrative pods that reorganise training, reporting, and operational support so clinics run on documented systems instead of tribal knowledge.',
      longDescription:
        'Administration pods grew out of work with endocrinology and infusion clinics that were losing money to delays, churn, and poor visibility. We deploy operations training leads and process analysts who rebuild how work is assigned, tracked, and trained. The outcome is lower management cost, better retention, and reliable reporting for leadership without adding layers of local management.',
      features: [
        'Operations training leads to rebuild onboarding and cross training programs',
        'Process improvement analysts to map, measure, and simplify daily workflows',
        'Creation of clear SOPs, checklists, and training materials for key roles',
        'Implementation of simple reporting that surfaces delays and bottlenecks',
        'Coordination with clinical and front office pods to align responsibilities',
        'Support for change management as new processes roll into live operations'
      ],
      benefits: [
        {
          title: 'Lower Management Overhead',
          description:
            'Structured training and documentation reduce the time leaders spend firefighting and retraining staff.'
        },
        {
          title: 'Less Churn',
          description:
            'Clear expectations and repeatable processes improve staff retention and reduce backfill spend.'
        },
        {
          title: 'Faster Patient Throughput',
          description:
            'Tighter coordination between admin, clinical, and front office teams reduces delays in the patient journey.'
        },
        {
          title: 'Better Visibility',
          description:
            'Leadership gains real time reporting on key operational indicators instead of relying on anecdotal updates.'
        }
      ],
      process: [
        {
          title: 'Operational Diagnostic',
          description:
            'We run structured interviews and data reviews to understand how administration, training, and reporting currently function.'
        },
        {
          title: 'Blueprint And Roadmap',
          description:
            'A practical plan outlines the new process design, training updates, and supporting tooling required.'
        },
        {
          title: 'Pod Deployment',
          description:
            'Administrative pods are assigned to specific workstreams and begin rebuilding training, documentation, and reporting habits.'
        },
        {
          title: 'Stabilisation And Handover',
          description:
            'Once new rhythms are stable, we shift into a lighter support mode while your internal team runs the system.'
        }
      ],
      imageSrc: 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48M2OOvk6PEBiI3RJApQHa7gjDUWtV6dYsv1l4'
    }
  };

  const key = service ? service.toLowerCase() : '';
  const serviceData = servicesData[key];

  useEffect(() => {
    if (serviceData) {
      document.title = `${serviceData.title} Services | UPLIFT Technologies`;
    } else {
      document.title = 'Service | UPLIFT Technologies';
    }
  }, [serviceData]);

  const serviceSchema = serviceData
    ? {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `${serviceData.title} Services - UPLIFT Technologies`,
        description: serviceData.longDescription,
        provider: {
          '@type': 'Organization',
          name: 'UPLIFT Technologies',
          url: 'https://uplift-technologies.com'
        },
        areaServed: [
          {
            '@type': 'Country',
            name: 'United States'
          },
          {
            '@type': 'Country',
            name: 'Canada'
          }
        ],
        serviceType: serviceData.title,
        image: serviceData.imageSrc
      }
    : null;

  if (!serviceData) {
    return (
      <div className="pt-32 pb-20">
        <div className="container-custom">
          <h1 className="font-poppins font-semibold text-3xl mb-4">
            Service Not Found
          </h1>
          <p className="text-white/80 mb-4">
            The service you are looking for is not available.
          </p>
          <Link
            to="/services"
            className="text-electric-violet hover:underline font-medium"
          >
            Return to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={`Outsourced Support for Healthcare Operations; ${serviceData.title}`}
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
              <div className="flex flex-col gap-4 mb-6">
                <h1 className="font-poppins font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  Outsourced Support for Healthcare Operations;{' '}
                  <span className="gradient-text">
                    {serviceData.segmentLabel}
                  </span>
                </h1>
                <div className="flex items-center gap-3">
                  <div className="text-electric-violet bg-electric-violet/10 p-3 rounded-lg">
                    {serviceData.icon}
                  </div>
                  <p className="text-sm uppercase tracking-wide text-white/60">
                    UPLIFT Healthcare Operations Pod
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/80 mb-8">
                {serviceData.longDescription}
              </p>
              <Button to="/book" size="lg" className="group">
                Book a consultation
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
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
        title={`${serviceData.title} Pod Capabilities`}
        subtitle="What this pod takes off your local team and how it plugs into existing systems."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceData.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex items-start gap-3 glass-card p-5"
            >
              <CheckCircle
                size={22}
                className="text-electric-violet mt-1 flex-shrink-0"
              />
              <p className="text-white/90">{feature}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Benefits Section */}
      <Section
        title="Pod Outcomes"
        subtitle="Direct outcomes measured in live clinics and health systems using this pod model."
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
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-medium mb-3 text-electric-violet">
                {benefit.title}
              </h3>
              <p className="text-white/80">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Process Section */}
      <Section
        title="Implementation Approach"
        subtitle="How we deploy, stabilise, and then scale each pod into your organisation."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceData.process.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative"
            >
              <div className="glass-card p-6">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-electric-violet flex items-center justify-center text-xl font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-medium mb-3 mt-4">
                  {step.title}
                </h3>
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
