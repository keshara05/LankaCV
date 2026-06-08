import { NextResponse } from 'next/server';
import { getCV } from '@/lib/db';
import { getTemplateHtml } from '@/components/PreviewPanel/templates';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cvId = searchParams.get('cvId');
    const filename = searchParams.get('filename') || 'CV.pdf';

    if (!cvId) {
      return NextResponse.json({ error: 'Missing cvId' }, { status: 400 });
    }

    const cvData = await getCV(cvId);
    if (!cvData) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    // Get the static HTML markup directly
    const templateHtml = getTemplateHtml(cvData.templateId || '1', cvData);

    // Construct full self-contained HTML page
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${cvData.fullName || 'CV'}</title>
          <!-- Load Tailwind CSS via CDN for server rendering styling -->
          <script src="https://cdn.tailwindcss.com"></script>
          
          <!-- Fonts -->
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
          
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
            
            @page {
              size: A4;
              margin: 0;
            }
            
            body {
              margin: 0;
              padding: 0;
              width: 210mm;
              min-height: 297mm;
              background-color: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            /* Enforce A4 proportions in browser mode if not printing */
            @media screen {
              body {
                margin: 40px auto;
                box-shadow: 0 0 15px rgba(0,0,0,0.15);
                outline: 1px solid #e2e8f0;
              }
            }
          </style>
        </head>
        <body>
          <div style="width: 100%; height: 100%;">
            ${templateHtml}
          </div>
          <script>
            // If in normal browser, trigger print modal automatically for manual saving
            if (window.location.search.includes('mode=print')) {
              window.onload = function() {
                window.print();
              }
            }
          </script>
        </body>
      </html>
    `;

    // Check if user requested HTML print mode explicitly
    const forceHtml = searchParams.get('mode') === 'html';
    if (forceHtml) {
      return new Response(fullHtml, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Attempt Server-Side Puppeteer PDF generation
    try {
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      
      // Set the HTML content
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
      
      // Generate PDF buffer
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
      });

      await browser.close();

      return new Response(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });

    } catch (puppeteerErr) {
      console.warn('Puppeteer launch or PDF generation failed. Falling back to browser print-friendly HTML view.', puppeteerErr);
      
      // Fallback: Return HTML and append auto-print scripts
      const htmlWithPrintTrigger = fullHtml.replace('</body>', `
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
        </body>
      `);

      return new Response(htmlWithPrintTrigger, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

  } catch (err) {
    console.error('PDF Export Error:', err);
    return NextResponse.json({ error: 'Internal server error during PDF export' }, { status: 500 });
  }
}
