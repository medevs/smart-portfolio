import React from 'react';
import Resume from '../../components/Resume';
import DownloadButton from '@/components/DownloadButton';

export default function ResumePage() {
  return (
    <div className="mx-auto px-4">
      <div className="flex justify-end mb-4">
        <DownloadButton />
      </div>
      <div id="resume">
        <Resume />
      </div>
    </div>
  )
}