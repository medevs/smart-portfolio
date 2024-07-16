import React from 'react';
import dynamic from 'next/dynamic';
import Resume from '@/components/Resume';

const DownloadButton = dynamic(
  () => import('@/components/DownloadButton'),
  { ssr: false }
);

export default function ResumePage() {
  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="flex justify-end mb-4">
        <DownloadButton />
      </div>
      <div id="resume">
        <Resume />
      </div>
    </div>
  )
}