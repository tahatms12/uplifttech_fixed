import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/ui/Section';
import MetaTags from '../components/seo/MetaTags';

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | UPLIFT Technologies';
  }, []);

  return (
    <>
      <MetaTags
        title="Privacy Policy"
        description="UPLIFT Technologies privacy policy covering GDPR, HIPAA, and PIPEDA compliance."
      />
      
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
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-xl text-white/80">
              Our commitment to protecting your privacy and ensuring compliance with global data protection regulations.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Policy Content */}
      <Section>
        <div className="glass-card p-8 md:p-10">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-6 text-electric-violet">GDPR Privacy Policy</h2>
            
            <h3 className="text-xl font-medium mt-8 mb-4">1. Controller</h3>
            <p>
              Uplift Technologies<br />
              571 East Ave, Gulberg Residencia, Islamabad<br />
              Data Protection Officer: <a href="mailto:taha@uplift-technologies.com" className="text-electric-violet hover:underline">taha@uplift-technologies.com</a>
            </p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">2. Scope</h3>
            <p>Applies to all personal data processed via uplift-technologies.com and related services.</p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">3. Data Categories</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identifiers: name, email, phone, company.</li>
              <li>Device & Usage: IP, cookies, browser, OS, timestamps, referrers, page interactions.</li>
              <li>Transactional: invoices, contracts, support tickets, audit logs.</li>
              <li>Special categories: none intentionally collected.</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-8 mb-4">4. Purposes & Legal Bases</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-neutral-700 mt-4">
                <thead>
                  <tr className="bg-deep-purple/20">
                    <th className="border border-neutral-700 px-4 py-2 text-left">Purpose</th>
                    <th className="border border-neutral-700 px-4 py-2 text-left">Legal Basis (Art. 6)</th>
                    <th className="border border-neutral-700 px-4 py-2 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-neutral-700 px-4 py-2">Service provision, account setup</td>
                    <td className="border border-neutral-700 px-4 py-2">1(b) contract</td>
                    <td className="border border-neutral-700 px-4 py-2">Authentication, user management, invoicing</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-700 px-4 py-2">Support, incident response</td>
                    <td className="border border-neutral-700 px-4 py-2">1(b) contract</td>
                    <td className="border border-neutral-700 px-4 py-2">Ticket tracking, troubleshooting</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-700 px-4 py-2">Marketing communications</td>
                    <td className="border border-neutral-700 px-4 py-2">1(a) consent</td>
                    <td className="border border-neutral-700 px-4 py-2">Opt-in newsletters, product updates</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-700 px-4 py-2">Analytics, UX optimisation</td>
                    <td className="border border-neutral-700 px-4 py-2">1(f) legitimate interest</td>
                    <td className="border border-neutral-700 px-4 py-2">Pseudonymised statistics, conversion metrics</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-700 px-4 py-2">Security, fraud prevention</td>
                    <td className="border border-neutral-700 px-4 py-2">1(f) legitimate interest</td>
                    <td className="border border-neutral-700 px-4 py-2">Access logs, anomaly detection</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-700 px-4 py-2">Compliance, tax, audit</td>
                    <td className="border border-neutral-700 px-4 py-2">1(c) legal obligation</td>
                    <td className="border border-neutral-700 px-4 py-2">Statutory record-keeping</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-medium mt-8 mb-4">5. Data Retention</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentication logs: 12 months.</li>
              <li>Financial records: 5 years from fiscal year-end.</li>
              <li>Marketing lists: until consent withdrawn.</li>
              <li>Support data: 3 years after resolution.</li>
            </ul>
            <p>Data are deleted or irreversibly anonymised on expiry.</p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">6. Recipients</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Hosting, CDN, email, CRM, payment, analytics providers under GDPR-compliant DPAs.</li>
              <li>Courts, regulators, law-enforcement if legally compelled.</li>
            </ul>
            <p>No sale or rental of data.</p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">7. International Transfers</h3>
            <p>Data stored in EU datacentres or transferred under Standard Contractual Clauses / adequacy decisions.</p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">8. Data Subject Rights</h3>
            <p>Access, rectification, erasure, restriction, portability, objection, and consent withdrawal. Exercise via <a href="mailto:taha@uplift-technologies.com" className="text-electric-violet hover:underline">taha@uplift-technologies.com</a>. Response within 30 days.</p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">9. Security</h3>
            <p>TLS 1.3, AES-256 at rest, MFA for admin, role-based access, least privilege, network segmentation, quarterly penetration tests.</p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">10. Changes</h3>
            <p>Policy version and date posted on this page; continued use constitutes acceptance.</p>
            
            <hr className="my-12 border-neutral-700" />
            
            <h2 className="text-2xl font-semibold mb-6 text-electric-violet">HIPAA Compliance Policy</h2>
            
            <h3 className="text-xl font-medium mt-8 mb-4">1. Covered Entity</h3>
            <p>
              Uplift Technologies<br />
              30 N Gould St, Sheridan, WY 82801, USA<br />
              Privacy & Security Officer: <a href="mailto:taha@uplift-technologies.com" className="text-electric-violet hover:underline">taha@uplift-technologies.com</a>
            </p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">2. PHI Definition</h3>
            <p>Any individually identifiable health information received, stored, or transmitted in electronic, paper, or verbal form.</p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">3. Administrative Safeguards</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Annual risk analysis and mitigation plan.</li>
              <li>Workforce HIPAA training on hire and yearly thereafter.</li>
              <li>Role-based access assignments; sanction policy for violations.</li>
              <li>Business Associate Agreements (BAAs) with all vendors handling PHI.</li>
              <li>Disaster-recovery and emergency-mode operation plan tested semi-annually.</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-8 mb-4">4. Physical Safeguards</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tier III datacentres with biometric access control and 24/7 surveillance.</li>
              <li>Device encryption, locked cabinets for paper media, secure disposal (NAID-certified shredding).</li>
              <li>Facility security plan reviewed yearly.</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-8 mb-4">5. Technical Safeguards</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Unique user IDs, automatic logoff, password rotation, MFA.</li>
              <li>AES-256 encryption at rest; TLS 1.2+ in transit.</li>
              <li>Audit logs retained 6 years; real-time intrusion detection.</li>
              <li>Integrity checksums on stored PHI.</li>
              <li>Emergency access procedures with break-glass accounts.</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-8 mb-4">6. Minimum Necessary Standard</h3>
            <p>Access to PHI limited to workforce members needing it for job duties; periodic audits verify compliance.</p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">7. Breach Notification</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Discovery triggers internal incident response within 24 h.</li>
              <li>Notification to affected individuals and HHS within 60 days (≤ 500) or without unreasonable delay ({'>'} 500).</li>
              <li>Annual breach log of incidents {'<'} 500 individuals submitted to HHS.</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-8 mb-4">8. Documentation & Review</h3>
            <p>All policies, training records, risk assessments retained 6 years from date of creation or last effective date and reviewed annually.</p>
            
            <hr className="my-12 border-neutral-700" />
            
            <h2 className="text-2xl font-semibold mb-6 text-electric-violet">PIPEDA Compliance Policy</h2>
            
            <h3 className="text-xl font-medium mt-8 mb-4">1. Organization</h3>
            <p>
              Uplift Technologies<br />
              571 East Ave, Gulberg Residencia, Islamabad<br />
              Privacy Officer: <a href="mailto:taha@uplift-technologies.com" className="text-electric-violet hover:underline">taha@uplift-technologies.com</a>
            </p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">2. Application</h3>
            <p>Covers collection, use, disclosure, and storage of personal information about Canadian individuals, whether processed directly or through service providers.</p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">3. Ten Fair Information Principles</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Accountability</strong> – Privacy Officer oversees compliance; contracts impose equivalent obligations on third parties.</li>
              <li><strong>Identifying Purposes</strong> – Purposes stated at or before collection; documented in data inventory.</li>
              <li><strong>Consent</strong> – Express or implied depending on sensitivity and context; records of consent maintained.</li>
              <li><strong>Limiting Collection</strong> – Gather only information necessary to fulfil stated purposes.</li>
              <li><strong>Limiting Use, Disclosure & Retention</strong> – Secondary use requires fresh consent; retention schedules mirror GDPR periods above.</li>
              <li><strong>Accuracy</strong> – Data verified on input and periodically reviewed for currency.</li>
              <li><strong>Safeguards</strong> – Encryption, access controls, staff confidentiality agreements, vendor due diligence.</li>
              <li><strong>Openness</strong> – Privacy practices published on website; updated policy history retained.</li>
              <li><strong>Individual Access</strong> – Written requests answered within 30 days; corrections made promptly.</li>
              <li><strong>Challenging Compliance</strong> – Complaints routed to Privacy Officer; unresolved issues may be escalated to OPC.</li>
            </ol>
            
            <h3 className="text-xl font-medium mt-8 mb-4">4. Cross-Border Processing</h3>
            <p>Contractual clauses require service providers outside Canada to protect information to PIPEDA standards; individuals informed of foreign storage.</p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">5. Data Breach Response</h3>
            <p>Breaches posing real risk of significant harm reported to OPC and affected individuals as soon as feasible; log of all breaches retained for 24 months.</p>
            
            <h3 className="text-xl font-medium mt-8 mb-4">6. Policy Review</h3>
            <p>Annual reassessment or upon legislative change; documented revision history.</p>
            
            <div className="mt-12 text-center">
              <p className="text-sm text-white/60">Last updated: June 19, 2025</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default PrivacyPolicyPage;