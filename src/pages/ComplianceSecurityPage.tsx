import React from 'react';
import { motion } from 'framer-motion';
import Section from '../components/ui/Section';
import MetaTags from '../components/seo/MetaTags';

const ComplianceSecurityPage: React.FC = () => {
  return (
    <>
      <MetaTags
        title="Compliance and Security"
        description="See how Uplift Technologies approaches HIPAA-aligned controls, access management, logging, and shared responsibilities with clients."
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
            <h1 className="font-sans font-semibold mb-6">
              Compliance &amp; <span className="gradient-text">Security</span>
            </h1>
            <p className="text-xl text-white/80">
              Uplift Technologies maintains a licensed and HIPAA compliant workforce and a 12 step HIPAA compliance program aligned with HIPAA, PIPEDA, and GDPR.
            </p>
          </motion.div>
        </div>
      </div>

      <Section>
        <div className="glass-card p-8 md:p-10 space-y-8">
          <div className="prose prose-invert max-w-none space-y-6">
            <h2 className="text-2xl font-semibold text-electric-violet">Program Overview</h2>
            <p>
              We operate with layered safeguards across our 12 step HIPAA compliance program, combining workforce training, access management, encryption in transit, incident response runbooks, vendor oversight, and device requirements for team members.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access control with granular permissions and minimum necessary assignments.</li>
              <li>Encrypted communications and data handling standards.</li>
              <li>Workforce training and standardized policies and workflows.</li>
              <li>Monitoring, audits, and incident response playbooks.</li>
              <li>Weekly reporting to keep clients informed and aligned.</li>
            </ul>

            <h3 className="text-xl font-semibold text-electric-violet">Access Controls</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Role-based access with minimum necessary assignments and periodic reviews.</li>
              <li>MFA and secure credential storage for systems that support it.</li>
              <li>Session timeout expectations and account revocation when roles change.</li>
            </ul>

            <h3 className="text-xl font-semibold text-electric-violet">Logging and Monitoring</h3>
            <p>
              Activity is logged where client platforms enable it. We support client-led monitoring and respond to alerts following documented procedures.
            </p>

            <h3 className="text-xl font-semibold text-electric-violet">Incident Response</h3>
            <p>
              We maintain escalation paths, notification templates, and containment steps. Incidents are documented, and learnings inform playbook updates.
            </p>

            <h3 className="text-xl font-semibold text-electric-violet">Subcontractors and Vendors</h3>
            <p>
              Vendors supporting services are required to follow confidentiality and security obligations. When subcontractors handle client data, we confirm role-based access, training, and contractual safeguards.
            </p>

            <h3 className="text-xl font-semibold text-electric-violet">Device and Network Expectations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encrypted devices with strong authentication and screen lock enabled.</li>
              <li>Patched operating systems and approved endpoint protections where applicable.</li>
              <li>Secure network use with avoidance of untrusted Wi-Fi for client work.</li>
            </ul>

            <h3 className="text-xl font-semibold text-electric-violet">Communication Practices</h3>
            <p>
              Team members use approved channels for client communications and avoid sharing PHI in unapproved tools. Secure alternatives are used where available.
            </p>

            <h3 className="text-xl font-semibold text-electric-violet">Shared Responsibility</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Uplift-managed:</strong> workforce training, background processes, device expectations, user access reviews, and operational playbooks.</li>
              <li><strong>Client-managed:</strong> system configuration, permission grants, PHI storage locations, logging retention, and data retention settings.</li>
              <li><strong>Collaborative:</strong> incident response coordination, change management, and periodic security reviews.</li>
            </ul>

            <h3 className="text-xl font-semibold text-electric-violet">Certifications</h3>
            <p>
              We do not represent any formal certifications. Controls described here focus on HIPAA-aligned practices tailored to each engagement.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
};

export default ComplianceSecurityPage;
