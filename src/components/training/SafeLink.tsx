import React from 'react';
import { Link } from 'react-router-dom';

const allowedExternalDomains = new Set<string>(['uplift-technologies.com']);

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function isAllowedExternal(href: string): boolean {
  try {
    const url = new URL(href);
    return allowedExternalDomains.has(url.hostname);
  } catch {
    return false;
  }
}

interface SafeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

const SafeLink: React.FC<SafeLinkProps> = ({ href, children, ...rest }) => {
  if (!href) {
    return <span className="text-gray-200">{children}</span>;
  }

  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link to={href} className="underline text-indigo-300" {...rest}>
        {children}
      </Link>
    );
  }

  if (isExternal(href)) {
    if (!isAllowedExternal(href)) {
      return <span className="text-gray-200">{children}</span>;
    }
    return (
      <a href={href} rel="noopener noreferrer" target="_blank" className="underline text-indigo-300" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} className="underline text-indigo-300" {...rest}>
      {children}
    </a>
  );
};

export default SafeLink;
