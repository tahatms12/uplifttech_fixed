import { useEffect } from 'react';

const HubSpotTracking: React.FC = () => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const existing = document.getElementById('hs-script-loader');
    if (existing) return;

    const script = document.createElement('script');
    script.id = 'hs-script-loader';
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = '//js-na2.hs-scripts.com/244421138.js';

    document.head.appendChild(script);
  }, []);

  return null;
};

export default HubSpotTracking;
