import React from 'react';
import { motion } from 'framer-motion';
import Section from '../components/ui/Section';
import MetaTags from '../components/seo/MetaTags';

const PrivacyPage: React.FC = () => {
  const policyUpdated = new Date().toISOString().split('T')[0];

  return (
    <>
      <MetaTags
        title="Privacy Policy"
        description="Learn how Uplift Technologies handles visitor, client, and candidate data with a focus on data minimization and HIPAA-aligned safeguards."
      />

      <div className="pt-32 pb-20 gradient-bg relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric-violet/20 rounded-full filter blur-[100px] animate-glow"></div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-sm text-white/60">Effective: {policyUpdated}</p>
            <h1 className="font-poppins font-semibold mb-6">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-xl text-white/80">
              This policy describes how Uplift Technologies processes personal data for website visitors, prospective clients, and prospective candidates.
            </p>
          </motion.div>
        </div>
      </div>

      <Section>
        <div className="glass-card p-8 md:p-10 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-electric-violet">Scope and Data Minimization</h2>
            <p>
              We collect only the information needed to respond to inquiries, provide requested services, or progress recruiting conversations. Do not submit medical or sensitive information through website forms.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Data We Collect</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact details shared by visitors and prospective clients (name, company, email, phone, message).</li>
              <li>Candidate materials such as resumes, experience summaries, skills, and availability submitted through careers pages.</li>
              <li>Technical data from site usage including IP address, browser type, device information, and pages viewed.</li>
              <li>Service usage metadata generated when we deliver work for clients under contract.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">How We Use Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respond to contact requests, schedule consultations, and share requested materials.</li>
              <li>Evaluate candidate fit for open roles, coordinate interviews, and maintain recruiting records for up to 24 months unless law requires longer retention.</li>
              <li>Deliver contracted services for clients following written instructions and applicable agreements.</li>
              <li>Improve site experience, maintain security, and detect abuse.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">PHI Handling</h3>
            <p>
              Website forms are not intended for protected health information. For client projects, Uplift processes PHI only as instructed by client organizations under written agreements. Access is role-based and limited to the minimum necessary. Activity is logged and monitored where supported by client systems.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Safeguards</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption in transit using TLS and secure credential management.</li>
              <li>Role-based access controls with least-privilege assignments and workforce training.</li>
              <li>Device and network protections expected for all team members with secure configurations.</li>
              <li>Audit and logging practices aligned to client environments with defined incident response procedures.</li>
              <li>Vendor management and confidentiality requirements for subcontractors supporting service delivery.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Third Parties and Cookies</h3>
            <p>
              We use HubSpot for site analytics and forms. Google Analytics loads only when enabled through a public environment variable configured on the site. EmailJS is used to route form submissions by email. We do not deploy other tracking pixels.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Candidate Data</h3>
            <p>
              Candidate information is used to assess fit, coordinate interviews, and comply with applicable hiring requirements. We retain candidate records for up to 24 months or longer if legally required. Candidates may request updates or deletion by contacting hr@uplift-technologies.com.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Client Data and PHI Scope</h3>
            <p>
              For client work, we follow client instructions and contractual terms. PHI processing is limited to defined engagements, and clients control their systems, access provisioning, and retention settings. We support audits and reasonable security reviews tied to the services provided.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">International Transfers</h3>
            <p>
              Data may be accessed by authorized team members in the United States or other locations needed to deliver services. When required, we implement appropriate safeguards such as data protection agreements and role-based controls.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Your Rights</h3>
            <p>
              You may request access, correction, or deletion of your personal data, or object to certain processing where applicable. Contact business@uplift-technologies.com or hr@uplift-technologies.com to exercise these rights.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Contact</h3>
            <p className="space-y-2">
              <span className="block">General inquiries: business@uplift-technologies.com</span>
              <span className="block">Careers inquiries: hr@uplift-technologies.com</span>
              <span className="block">Privacy questions: privacy@uplift-technologies.com</span>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
};

export default PrivacyPage;
