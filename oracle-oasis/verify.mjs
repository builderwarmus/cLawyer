import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = 'file://' + path.join(__dirname, 'index.html');
const errors = [];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('console', m => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));

const P = ".experience[data-experience='platform']";
const D = ".experience[data-experience='discovery']";
const cur = () => page.evaluate(() => window.Oracle.current());

// Full-journey smoke test — refinement pass must not regress anything.
await page.goto(file + '?build=guest,community', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);

// water + motes running without error
const waterOk = await page.evaluate(() => !!document.getElementById('env-ambient') && !!document.getElementById('env-caustics'));

// focus-visible styling present
const focusCss = await page.evaluate(() => {
  for (const sheet of document.styleSheets) {
    try { for (const r of sheet.cssRules) if (r.selectorText && r.selectorText.includes(':focus-visible')) return true; } catch(e){}
  }
  return false;
});

// proposal → build → complete
await page.click('#concierge [data-cc-fab]'); await page.waitForTimeout(150);
await page.click('#concierge [data-cc-run]'); await page.waitForTimeout(500);   // → catalog
const atCatalog = await cur();
await page.click(".experience[data-experience='catalog'] [data-build]");
await page.waitForSelector(".experience[data-experience='build'] [data-experience]", { timeout: 8000 });

// experience (age gate → platform) + a perspective switch (ripple + mood)
await page.click(".experience[data-experience='build'] [data-go-exp='']").catch(()=>{});
await page.click(".experience[data-experience='build'] [data-experience]");  // Experience My Platform
await page.waitForTimeout(300);
await page.click(P + ' [data-age-yes]'); await page.waitForTimeout(300);
await page.click("#perspective button[data-perspective='staff']"); await page.waitForTimeout(500);
const rippled = await page.evaluate(() => window.__ENV.count() > 0);
const platformShown = await page.evaluate((p) => { const e = document.querySelector(p); return e && !e.hidden; }, P);

// finalize → discovery → pick a day → confirm
await page.click('.mode-rail [data-mode="finalize"]'); await page.waitForTimeout(400);
await page.click(D + ' [data-next]'); await page.waitForTimeout(200);
await page.evaluate((d) => { const b = document.querySelector(d + ' .cal-day.avail'); if (b) b.click(); }, D);
await page.waitForTimeout(150);
await page.click(D + ' .slot'); await page.waitForTimeout(120);
await page.click(D + ' [data-confirm]'); await page.waitForTimeout(200);
const booked = await page.evaluate((d) => /Discovery session booked/.test(document.querySelector(d).textContent), D);

await browser.close();

const results = { waterOk, focusCss, atCatalog, rippled, platformShown, booked, errors };
console.log(JSON.stringify(results, null, 2));

const ok = waterOk && focusCss && atCatalog === 'catalog' && rippled && platformShown && booked && errors.length === 0;
console.log(ok ? '\n✅ VERIFY PASSED' : '\n❌ VERIFY FAILED');
process.exit(ok ? 0 : 1);
