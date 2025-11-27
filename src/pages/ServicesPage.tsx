// HealthcareOperationsPages.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface Role {
  id: number;
  title: string;
  description: string;
}

interface Metric {
  value: string;
  label: string;
}

interface OperationsPageProps {
  segment: string;
  roles: Role[];
  metrics: Metric[];
}

const OperationsPageTemplate: React.FC<OperationsPageProps> = ({
  segment,
  roles,
  metrics
}) => {
  return (
    <div className="min-h-screen bg-rich-black text-white relative overflow-hidden flex items-center">
      {/* Left glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[130%] w-[55%] bg-gradient-to-b from-electric-violet/60 via-electric-violet/30 to-transparent blur-3xl opacity-80" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start"
        >
          {/* Heading */}
          <div>
            <h1 className="font-poppins font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-10">
              Outsourced Support for Healthcare Operations;{' '}
              <span className="text-electric-violet">{segment}</span>
            </h1>
          </div>

          {/* Roles */}
          <div className="space-y-8">
            {roles.map((role) => (
              <div key={role.id} className="flex items-start gap-4">
                <div className="text-electric-violet text-3xl font-semibold leading-none mt-1">
                  {role.id}
                </div>
                <div>
                  <div className="font-semibold text-base sm:text-lg mb-1">
                    {role.title}
                  </div>
                  <p className="text-sm sm:text-base text-white/75">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Metrics row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-14 flex flex-wrap gap-10 md:gap-14 items-center"
        >
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full border border-electric-violet/70 bg-electric-violet/10">
                <CheckCircle className="h-6 w-6 text-electric-violet" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-electric-violet">
                  {metric.value}
                </div>
                <div className="text-sm text-white/75">{metric.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

/* 1. Revenue Cycle page */

export const RevenueCyclePage: React.FC = () => {
  const roles: Role[] = [
    {
      id: 1,
      title: 'Accounts Receivable Specialist',
      description:
        'Implements structured AR workflows, documentation standards, and QA to bring order to scattered receivables and missed deadlines.'
    },
    {
      id: 2,
      title: 'Insurance Collections Specialist',
      description:
        'Manages claim follow up and patient friendly collections using tiered strategies based on account age and integrated billing data.'
    }
  ];

  const metrics: Metric[] = [
    {
      value: '85%',
      label: 'Improvement in process efficiency for AR teams'
    },
    {
      value: '$2M',
      label: 'Recovered in outstanding and previously written off accounts receivable'
    },
    {
      value: '3%',
      label: 'Rejection rate after QA, down from 11 percent'
    }
  ];

  return (
    <OperationsPageTemplate
      segment="Revenue Cycle"
      roles={roles}
      metrics={metrics}
    />
  );
};

/* 2. Clinical Coordination page */

export const ClinicalCoordinationPage: React.FC = () => {
  const roles: Role[] = [
    {
      id: 1,
      title: 'Clinical Nursing Coordinator',
      description:
        'Handles internal scheduling, reminders, and follow ups across locations so providers see a clean, accurate calendar.'
    },
    {
      id: 2,
      title: 'Patient Coordination Agent',
      description:
        'Provides round the clock coverage for routine bookings and escalates complex needs to onsite staff without friction.'
    }
  ];

  const metrics: Metric[] = [
    {
      value: '95%',
      label: 'Reduction in response times for routine inquiries'
    },
    {
      value: '73%',
      label: 'Routine scheduling handled by remote coordination teams'
    },
    {
      value: '24/7',
      label: 'Coverage for basic customer bookings and follow ups'
    }
  ];

  return (
    <OperationsPageTemplate
      segment="Clinical Coordination"
      roles={roles}
      metrics={metrics}
    />
  );
};

/* 3. Front Office page */

export const FrontOfficePage: React.FC = () => {
  const roles: Role[] = [
    {
      id: 1,
      title: 'Virtual Front Desk Specialist',
      description:
        'Owns inbound scheduling, triage, and recall calls so providers see full calendars and fewer gaps in the day.'
    },
    {
      id: 2,
      title: 'Outbound Recall Specialist',
      description:
        'Builds and manages recall pipelines for new and existing locations, from prospect outreach to confirmed bookings.'
    }
  ];

  const metrics: Metric[] = [
    {
      value: '42%',
      label: 'Reduction in no show appointments with structured outreach'
    },
    {
      value: '95%',
      label: 'Answer rate for inbound calls across busy clinics'
    },
    {
      value: '127%',
      label: 'Increase in qualified patients booked in new markets'
    }
  ];

  return (
    <OperationsPageTemplate
      segment="Front Office"
      roles={roles}
      metrics={metrics}
    />
  );
};

/* 4. Administration page */

export const AdministrationPage: React.FC = () => {
  const roles: Role[] = [
    {
      id: 1,
      title: 'Operations Training Lead',
      description:
        'Delivers end to end management and staff training that replaces ad hoc processes with documented, repeatable playbooks.'
    },
    {
      id: 2,
      title: 'Process Improvement Analyst',
      description:
        'Uses data from the clinic and supply chain to streamline workflows, reduce delays, and surface real time reporting.'
    }
  ];

  const metrics: Metric[] = [
    {
      value: '32%',
      label: 'Reduction in overall management costs after restructuring'
    },
    {
      value: '28%',
      label: 'Lower employee retention costs after stabilizing operations'
    },
    {
      value: '97%',
      label: 'On time delivery for treatments after process optimization'
    }
  ];

  return (
    <OperationsPageTemplate
      segment="Administration"
      roles={roles}
      metrics={metrics}
    />
  );
};
