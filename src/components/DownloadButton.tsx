'use client';

import React, { useState, useEffect } from 'react';

const DownloadButton: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownloadPDF = async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('resume');
      if (element) {
        const opt = {
          margin: 10,
          filename: 'resume.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
          await html2pdf().from(element).set(opt).save();
        } catch (error) {
          console.error('PDF generation failed:', error);
        }
      }
    }
  };

  if (!isClient) {
    return null; // Don't render anything on the server
  }

  return (
    <button 
      onClick={handleDownloadPDF}
      className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Download PDF
    </button>
  );
};

export default DownloadButton;