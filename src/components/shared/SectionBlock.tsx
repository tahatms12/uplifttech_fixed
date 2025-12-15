import React from 'react';

interface SectionBlockProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const SectionBlock: React.FC<SectionBlockProps> = ({ id, title, subtitle, children, className = '' }) => {
  return (
    <section id={id} className={`py-10 sm:py-14 ${className}`}>
      <div className="container-custom">
        {(title || subtitle) && (
          <div className="mb-6 sm:mb-8 max-w-3xl">
            {title ? <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-white">{title}</h2> : null}
            {subtitle ? <p className="text-base sm:text-lg text-white/75">{subtitle}</p> : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default SectionBlock;
