// components/SocialLinks.tsx
import React from 'react';

interface SocialLinksProps {
  className: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ className }) => {
  return (
    <div className={`bg-neutral-400 p-4 rounded-lg shadow-md ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Connect</h2>
      {/* Add your social links here */}
    </div>
  );
}

export default SocialLinks;