'use client';

import React, { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DownloadButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadPDF = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const resumeElement = document.getElementById('resume');
      if (!resumeElement) throw new Error('Resume element not found');

      // Store the original classes as a string
      const originalClasses = resumeElement.className;

      // Apply light mode classes for PDF generation
      resumeElement.classList.remove('dark');
      resumeElement.classList.add('light', 'print-light-mode');

      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Restore original classes immediately after canvas generation
      resumeElement.className = originalClasses;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // If content exceeds one page, add a new page
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -pdf.internal.pageSize.getHeight(), pdfWidth, pdfHeight);
      }

      pdf.save('resume.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(`Failed to generate PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      <button 
        onClick={handleDownloadPDF}
        disabled={isLoading}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
      >
        {isLoading ? 'Generating PDF...' : 'Download PDF'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default DownloadButton;