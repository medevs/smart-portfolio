import React from 'react';
import Image from 'next/image';

interface TechIconProps {
  name: string;
  className?: string;
}

const TechIcon: React.FC<TechIconProps> = ({ name, className = '' }) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg className="w-6 h-6">
        <use href={`/icons/tech-icons.svg#${name.toLowerCase()}`} />
      </svg>
    </div>
  );
};

export default TechIcon;
