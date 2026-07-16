import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITES = [
  { id: 'ajl-tours', url: 'https://ajl-tours-frontend.vercel.app/' },
  { id: 'hildes', url: 'https://www.hildes.io/' },
  { id: 'karynsuarez', url: 'https://karynsuarez.com/' },
  { id: 'bajodigital', url: 'https://www.bajodigital.com/' },
  { id: 'niit', url: 'https://niit.edu.pk/' },
  { id: 'rootsraices', url: 'https://rootsraices.com/' },
  { id: 'manchester', url: 'https://manchester.us/' },
  { id: 'opal-properties', url: 'https://opal-properties.com/' },
  { id: 'viridianre', url: 'https://viridianre.net/' },
  { id: 'fiestafood', url: 'https://fiestafood.vercel.app/' },
  { id: 'niksjewel', url: 'https://niksjewel.com/' },
];

const OUT_DIR = path.join(__dirname, '../public/works');

async function capture() {
  const fs = await import('fs');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  for (const site of SITES) {
    const page = await context.newPage();
    try {
      await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3500);
      const outPath = path.join(OUT_DIR, `${site.id}.png`);
      await page.screenshot({ path: outPath, fullPage: false, type: 'png' });
      console.log(`✓ ${site.id} -> ${outPath}`);
    } catch (error) {
      console.error(`✗ ${site.id}:`, error instanceof Error ? error.message : error);
    } finally {
      await page.close();
    }
  }

  await browser.close();
}

capture();
