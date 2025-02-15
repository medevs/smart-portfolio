"use client"

import React, { memo } from 'react';
import Image from 'next/image';
import { Handle, Position } from 'reactflow';

interface TechNodeProps {
  data: {
    name: string;
    icon: string;
    type: string;
  };
}

const TechNode = memo(({ data }: TechNodeProps) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white dark:bg-gray-800 border dark:border-gray-700">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-300 dark:!bg-gray-600"
      />
      <div className="flex items-center">
        {data.icon ? (
          <div className="relative w-8 h-8">
            <Image
              src={data.icon}
              alt={data.name}
              fill
              className="object-contain"
              sizes="32px"
            />
          </div>
        ) : (
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {data.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          {data.name}
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-300 dark:!bg-gray-600"
      />
    </div>
  );
});

TechNode.displayName = 'TechNode';

export default TechNode;
