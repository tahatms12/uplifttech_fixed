import React from 'react';
import { motion } from 'framer-motion';
import Section from '../components/ui/Section';
import MetaTags from '../components/seo/MetaTags';

const TermsOfServicePage: React.FC = () => {
  return (
    <>
      <MetaTags
        title="Terms of Service"
        description="Review the terms for using the Uplift Technologies website, intellectual property notices, acceptable use, and legal disclaimers."
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
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-xl text-white/80">
              These terms govern your use of uplift-technologies.com. By continuing to browse or submit information, you accept these terms.
            </p>
          </motion.div>
        </div>
      </div>

      <Section>
        <div className="glass-card p-8 md:p-10 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-electric-violet">Website Use</h2>
            <p>
              You may use this site to learn about our services or submit inquiries. Do not upload malicious code, interfere with site availability, or submit protected health information through forms.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Intellectual Property</h3>
            <p>
              All site content, logos, graphics, and copy are owned by Uplift Technologies or its licensors. You may not copy, modify, distribute, or republish content without written consent.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">No Medical Advice</h3>
            <p>
              Information on this site is for general background only and is not medical advice. Clinical decisions must be made by qualified professionals following applicable standards.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Acceptable Use</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Do not attempt to gain unauthorized access to systems or data.</li>
              <li>Do not impersonate others or misrepresent your affiliation.</li>
              <li>Do not use the site to transmit unlawful, harmful, or infringing content.</li>
              <li>Do not attempt to reverse engineer or bypass security features.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Disclaimers and Limitation of Liability</h3>
            <p>
              The site is provided on an "as is" and "as available" basis. To the fullest extent permitted by law, Uplift Technologies disclaims warranties of any kind related to the site and is not liable for indirect, incidental, or consequential damages arising from its use.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Governing Law</h3>
            <p>
              These terms are governed by applicable state and federal laws in the United States. Disputes will be resolved in a competent court of jurisdiction unless otherwise agreed in writing.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Updates</h3>
            <p>
              We may update these terms periodically. Continued use of the site after changes take effect constitutes acceptance of the revised terms.
            </p>

            <h3 className="text-xl font-semibold mt-8 text-electric-violet">Contact</h3>
            <p className="space-y-2">
              <span className="block">General inquiries: business@uplift-technologies.com</span>
              <span className="block">Careers inquiries: hr@uplift-technologies.com</span>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
};

export default TermsOfServicePage;
