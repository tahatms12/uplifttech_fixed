import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const TrainingNoIndexHelmet = () => {
  useEffect(() => {
    const existing = document.querySelector("meta[name='robots']");
    if (existing) {
      existing.setAttribute('content', 'noindex,nofollow');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex,nofollow';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <Helmet>
      <meta name="robots" content="noindex,nofollow" />
    </Helmet>
  );
};

export default TrainingNoIndexHelmet;
