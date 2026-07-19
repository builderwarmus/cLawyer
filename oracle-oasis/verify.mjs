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

const env = () => page.evaluate(() => ({ tgt: { ...window.__ENV.tgt }, cur: { ...window.__ENV.cur }, count: window.__ENV.count() }));
const P = ".experience[data-experience='platform']";

await page.goto(file + '?build=guest,community,marketing', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const envInitial = await env();

// Enter the platform (member): a transition should have rippled + set mood
await page.click('.mode-rail [data-mode="experience"]');
await page.waitForTimeout(300);
await page.click(P + ' [data-age-yes]');
await page.waitForTimeout(400);
const afterEnter = await env();

// Switch to Staff → higher-energy mood target
await page.click("#perspective button[data-perspective='staff']");
await page.waitForTimeout(1100);   // let it ripple + ease toward the target
const staff = await env();

// Switch to Guest → cooler, calmer mood target
await page.click("#perspective button[data-perspective='guest']");
await page.waitForTimeout(400);
const guest = await env();

await browser.close();

const results = { envInitial, afterEnter, staff, guest, errors };
console.log(JSON.stringify(results, null, 2));

const ok =
  afterEnter.count > 0                                   // transitions fire ripples
  && Math.abs(staff.tgt.energy - 1.25) < 1e-6            // staff mood target set
  && staff.cur.energy > 1.15                             // and the current value eased toward it
  && Math.abs(guest.tgt.tint - 0.34) < 1e-6             // guest is cooler
  && Math.abs(guest.tgt.energy - 0.80) < 1e-6          // and calmer
  && guest.count > staff.count                           // perspective change on platform rippled again
  && errors.length === 0;
console.log(ok ? '\n✅ VERIFY PASSED' : '\n❌ VERIFY FAILED');
process.exit(ok ? 0 : 1);
