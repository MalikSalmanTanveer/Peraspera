import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/previews');
const BASE_URL = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173';

const SECTIONS = [
  { id: 'tools-stack', filename: 'tools-animation.png', label: 'Tools animation' },
  { id: 'global-reach', filename: 'global-reach.png', label: 'Global reach + flags' },
  { id: 'peraspera-labs', filename: 'peraspera-labs.png', label: 'Peraspera Labs' },
];

async function capture() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 90000 });

  for (const section of SECTIONS) {
    const locator = page.locator(`#${section.id}`);
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    const outPath = path.join(OUT_DIR, section.filename);
    await locator.screenshot({ path: outPath, type: 'png' });
    console.log(`✓ ${section.label} -> ${outPath}`);
  }

  await browser.close();
}

capture().catch((error) => {
  console.error(error);
  process.exit(1);
});
