"use client"

import React, { memo } from 'react';
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
        <img src={data.icon} alt={data.name} className="w-8 h-8" />
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
