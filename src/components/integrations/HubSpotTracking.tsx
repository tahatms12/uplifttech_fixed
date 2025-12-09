import { useEffect } from 'react';

const HubSpotTracking: React.FC = () => {
  const portalId = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
  const isRealPortalId =
    typeof portalId === 'string' &&
    portalId.trim().length > 0 &&
    !portalId.includes('PORTAL_ID');

  useEffect(() => {
    if (typeof document === 'undefined' || !isRealPortalId) return;

    const existing = document.getElementById('hs-script-loader');
    if (existing) return;

    const script = document.createElement('script');
    script.id = 'hs-script-loader';
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = `https://js.hs-scripts.com/${portalId}.js`;

    document.head.appendChild(script);
  }, [isRealPortalId, portalId]);

  return null;
};

export default HubSpotTracking;
