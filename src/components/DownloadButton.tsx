'use client';

import React from 'react';
import html2pdf from 'html2pdf.js';

const DownloadButton: React.FC = () => {
  const handleDownloadPDF = async (): Promise<void> => {
    const element = document.getElementById('resume');
    if (element) {
      // Add print-specific styles
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .bg-gray-900 { background-color: #1a202c !important; }
          .text-white { color: white !important; }
          .text-blue-400 { color: #63b3ed !important; }
          .border-blue-500 { border-color: #4299e1 !important; }
          /* Add more specific styles as needed */
        }
      `;
      document.head.appendChild(style);

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
      } finally {
        // Remove the added style
        document.head.removeChild(style);
      }
    }
  };

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