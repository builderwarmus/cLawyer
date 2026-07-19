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

const cc = () => page.evaluate(() => {
  const el = document.getElementById('concierge');
  return {
    open: el.classList.contains('open'),
    fresh: el.classList.contains('fresh'),
    title: el.querySelector('[data-cc-title]').textContent.trim(),
    body: el.querySelector('[data-cc-body]').textContent.trim(),
    action: (el.querySelector('[data-cc-run]') || {}).textContent || null
  };
});

await page.goto(file + '?build=guest', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);

// On the proposal: concierge present, pulsing (not auto-opened over the gateway)
const onProposal = await cc();

// Concierge suggests Build My Platform → follow it to the catalog
await page.click('#concierge [data-cc-fab]');
await page.waitForTimeout(200);
const openedOnProposal = await cc();
await page.click('#concierge [data-cc-run]');   // "Build My Platform"
await page.waitForTimeout(600);
const onCatalog = await cc();   // should now guide the catalog (guest already selected → "Ready when you are")
await page.screenshot({ path: path.join(__dirname, 'v7-catalog.png') });

// Its action generates the platform
await page.click('#concierge [data-cc-run]');   // "Build My Platform" → build
await page.waitForSelector(".experience[data-experience='build'] [data-experience]", { timeout: 8000 });
await page.click(".experience[data-experience='build'] [data-experience]");   // Experience My Platform
await page.waitForTimeout(400);
await page.click(".experience[data-experience='platform'] [data-age-yes]");
await page.waitForTimeout(400);
const onPlatformMember = await cc();

// Concierge's "Try the Staff view" action switches perspective
await page.click('#concierge [data-cc-run]');
await page.waitForTimeout(500);
const onPlatformStaff = await cc();

// Management with no BI → concierge offers to add it; action toggles config
await page.click("#perspective button[data-perspective='management']");
await page.waitForTimeout(400);
const mgmtBefore = await cc();
await page.click('#concierge [data-cc-run]');   // "Add the BI Suite"
await page.waitForTimeout(400);
const mgmtAfter = await cc();
await page.screenshot({ path: path.join(__dirname, 'v7-mgmt.png') });

// Close button collapses it
await page.click('#concierge [data-cc-close]');
await page.waitForTimeout(150);
const closed = await cc();

await browser.close();

const results = { onProposal, openedOnProposal, onCatalog, onPlatformMember, onPlatformStaff, mgmtBefore, mgmtAfter, closed, errors };
console.log(JSON.stringify(results, null, 2));

const ok =
  /Welcome to Oracle/.test(onProposal.title) && !onProposal.open && onProposal.fresh
  && openedOnProposal.open
  && /Ready when you are/.test(onCatalog.title) && /Build My Platform/.test(onCatalog.action || '')
  && /Your platform, live/.test(onPlatformMember.title)
  && /staff view/i.test(onPlatformStaff.title)
  && /Unlock the numbers/.test(mgmtBefore.title) && /Add the BI Suite/.test(mgmtBefore.action || '')
  && /management view/i.test(mgmtAfter.title)     // after adding BI, guidance advances
  && !closed.open
  && errors.length === 0;
console.log(ok ? '\n✅ VERIFY PASSED' : '\n❌ VERIFY FAILED');
process.exit(ok ? 0 : 1);
