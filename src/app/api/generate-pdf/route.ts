// pages/api/generate-pdf.ts
import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set the viewport to A4 size
        await page.setViewport({ width: 1240, height: 1754 });

        // Navigate to your resume page (adjust the URL as needed)
        await page.goto('http://localhost:3000/resume', { waitUntil: 'networkidle0' });

        // Inject CSS to ensure light mode and proper styling
        await page.evaluate(() => {
            document.body.classList.remove('dark');
            document.body.style.background = 'white';
            const style = document.createElement('style');
            style.textContent = `
        @page { size: A4; margin: 0; }
        body { margin: 0; padding: 0; }
        #resume { width: 210mm; padding: 10mm; box-sizing: border-box; }`;
            document.head.appendChild(style);
        });

        // Generate PDF
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
        });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        res.send(pdf);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
}