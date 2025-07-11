import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <img 
        src="https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48S8sVkrTs0v8bxAn6gqLm4y5oP7kC9HFw2pRh" 
        alt="Uplift Technologies Logo" 
        width={667}
        height={196}
        className="h-12 w-auto"
        loading="eager"
        fetchpriority="high"
      />
    </div>
  );
};

export default Logo;