import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const formatSegment = (segment: string) =>
  segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const crumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    const isCurrent = index === segments.length - 1;
    return {
      label: formatSegment(segment),
      path,
      isCurrent
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="bg-white/[0.03] py-3 text-sm text-white/70">
      <div className="container-custom flex flex-wrap items-center gap-2">
        <Link to="/" className="hover:text-white">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        {crumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {crumb.isCurrent ? (
              <span aria-current="page" className="font-semibold text-white">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.path} className="hover:text-white">
                {crumb.label}
              </Link>
            )}
            {index < crumbs.length - 1 && <span aria-hidden="true">/</span>}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumbs;
