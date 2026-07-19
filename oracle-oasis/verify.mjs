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

const D = ".experience[data-experience='discovery']";

// expected earliest = today + 7 (local), computed in Node — same clock as the browser
const t0 = new Date(); t0.setHours(0,0,0,0);
const earliest = new Date(t0); earliest.setDate(earliest.getDate() + 7);
const isoE = earliest.getFullYear() + '-' + String(earliest.getMonth()+1).padStart(2,'0') + '-' + String(earliest.getDate()).padStart(2,'0');

await page.goto(file + '?build=guest,community,marketing', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

// Reach Finalize via the shell mode rail
await page.click('.mode-rail [data-mode="finalize"]');
await page.waitForTimeout(500);
const finalizeActive = await page.getAttribute('.mode-rail [data-mode="finalize"]', 'data-active');
const onSummary = await page.evaluate((d) => /Your finalized platform/.test(document.querySelector(d).textContent), D);

// Summary → Schedule
await page.click(D + ' [data-next]');
await page.waitForTimeout(250);
const calEarliest = await page.getAttribute(D + ' [data-cal-earliest]', 'data-cal-earliest');

// The 7-day rule: no available day may precede `earliest`; earliest available >= earliest
const dayInfo = await page.evaluate((d) => {
  const avail = Array.from(document.querySelectorAll(d + ' .cal-day.avail')).map(b => b.getAttribute('data-date')).filter(Boolean);
  const blocked = document.querySelectorAll(d + ' .cal-day.disabled').length;
  return { firstAvail: avail.sort()[0] || null, availCount: avail.length, blocked };
}, D);

// If this month has no available day (today near month end), advance a month
if (!dayInfo.firstAvail) {
  await page.click(D + ' [data-mo="1"]');
  await page.waitForTimeout(200);
}
const pick = await page.evaluate((d) => {
  const b = document.querySelector(d + ' .cal-day.avail'); if (b) { b.click(); return b.getAttribute('data-date'); } return null;
}, D);
await page.waitForTimeout(200);
const slotsShown = await page.evaluate((d) => document.querySelectorAll(d + ' .slot').length, D);
await page.click(D + ' .slot');
await page.waitForTimeout(150);
await page.screenshot({ path: path.join(__dirname, 'v9-schedule.png') });

// Confirm → confirmation
await page.click(D + ' [data-confirm]');
await page.waitForTimeout(250);
const confirmed = await page.evaluate((d) => /Discovery session booked/.test(document.querySelector(d).textContent) && /Implementation preparation/.test(document.querySelector(d).textContent), D);
await page.screenshot({ path: path.join(__dirname, 'v9-confirmed.png') });

// Revise from discovery → back to the selector
await page.click(D + ' [data-revise]');
await page.waitForTimeout(500);
const revisedToCatalog = await page.evaluate(() => { const c = document.querySelector(".experience[data-experience='catalog']"); return c && !c.hidden; });

await browser.close();

const results = { finalizeActive, onSummary, calEarliest, isoE, dayInfo, pick, slotsShown, confirmed, revisedToCatalog, errors };
console.log(JSON.stringify(results, null, 2));

const ok = finalizeActive === 'true' && onSummary
  && calEarliest === isoE                                  // calendar blocks exactly the first 7 days
  && (dayInfo.firstAvail === null || dayInfo.firstAvail >= isoE)   // no available day precedes earliest
  && pick && pick >= isoE                                  // the day we picked respects the rule
  && slotsShown === 4 && confirmed && revisedToCatalog
  && errors.length === 0;
console.log(ok ? '\n✅ VERIFY PASSED' : '\n❌ VERIFY FAILED');
process.exit(ok ? 0 : 1);
