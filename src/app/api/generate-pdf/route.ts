import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { html, filename } = (await request.json()) as { html: string; filename?: string };

    if (!html || typeof html !== 'string') {
      return NextResponse.json({ error: 'Missing html field' }, { status: 400 });
    }

    let browser;

    if (process.env.NODE_ENV === 'production' || process.env.USE_CHROMIUM_MIN === '1') {
      // Vercel: use @sparticuz/chromium-min
      const chromium = (await import('@sparticuz/chromium-min')).default;
      const puppeteer = (await import('puppeteer-core')).default;

      const chromiumPack =
        'https://github.com/Sparticuz/chromium/releases/download/v143.0.4/chromium-v143.0.4-pack.x64.tar';

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: { width: 794, height: 1123 },
        executablePath: await chromium.executablePath(chromiumPack),
        headless: true,
        ignoreHTTPSErrors: true,
      });
    } else {
      // Local dev: use system Chrome
      const puppeteer = (await import('puppeteer-core')).default;
      const executablePath =
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        '/usr/bin/google-chrome' ||
        '/usr/bin/chromium-browser' ||
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

      browser = await puppeteer.launch({
        executablePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 500));

    await page.emulateMediaType('screen');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      scale: 1,
    });

    await browser.close();

    const safeFilename = (filename || 'handbook').replace(/[^a-zA-Z0-9._-]/g, '-');

    return new NextResponse(pdfBuffer as Buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}.pdf"`,
        'Content-Length': String((pdfBuffer as Buffer).byteLength),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF generation failed', details: String(error) },
      { status: 500 }
    );
  }
}
