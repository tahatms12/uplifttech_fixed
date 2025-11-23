import React from 'react';

type Logo = {
  name: string;
  imageUrl: string;
};

const logos: Logo[] = [
  { 
    name: 'Dental Intelligence', 
    imageUrl: 'https://cdn.brandfetch.io/idvukMAGow/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1760965849981' 
  },
  { 
    name: 'Wistia', 
    imageUrl: 'https://embed-ssl.wistia.com/deliveries/287bfa426e0c5c7e54c3a37ceb8dd4e6e7e82e05.webp?image_crop_resized=1000x1000' 
  },
  { 
    name: 'CareStack', 
    imageUrl: 'https://a.storyblok.com/f/144863/1200x630/db57474aa8/carestack-og.png' 
  },
  { 
    name: 'Curve Dental', 
    imageUrl: 'https://images.seeklogo.com/logo-png/23/1/curve-dental-logo-png_seeklogo-230894.png' 
  },
  { 
    name: 'Weave', 
    imageUrl: 'https://mms.businesswire.com/media/20230912527387/en/1887279/22/Weave_Logo_2021_Charcoal.jpg' 
  },
  { 
    name: 'Lighthouse 360', 
    imageUrl: 'https://aadomconference.com/wp-content/uploads/2017/02/lighthouse_360_logo-1-min.png' 
  }
];

const ClientLogos: React.FC = () => {
  return (
    <section aria-label="Client logos" className="border-y border-border-muted/60 bg-surface/70 py-8 sm:py-10">
      <div className="container-custom">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-text-muted">Trusted by customer-obsessed brands</p>
        <ul className="mt-6 grid grid-cols-2 gap-4 text-sm text-text-muted sm:grid-cols-3 md:grid-cols-6">
          {logos.map((logo) => (
            <li
              key={logo.name}
              className="flex items-center justify-center rounded-lg border border-border-muted/60 bg-surface-alt/80 px-4 py-6"
            >
              <img 
                src={logo.imageUrl} 
                alt={logo.name}
                className="h-12 w-auto object-contain"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ClientLogos;
