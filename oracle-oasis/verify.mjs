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
const ptext = () => page.evaluate((p) => document.querySelector(p + ' .platform').textContent.replace(/\s+/g, ' ').trim(), P);
const hasMorph = () => page.evaluate((p) => !!document.querySelector(p + ' .platform.pf-morph'), P);
async function persp(name){ await page.click(`#perspective button[data-perspective='${name}']`); await page.waitForTimeout(450); }

// --- Load with guest+community+marketing (no analytics selected) ---
await page.goto(file + '?build=guest,community,marketing', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await page.click('.mode-rail [data-mode="experience"]');
await page.waitForTimeout(400);
await page.click(P + ' [data-age-yes]');
await page.waitForTimeout(300);

// member (default): tabbed app
const memberTabs = await page.evaluate((p) => document.querySelectorAll(p + ' .pf-tabs .pf-tab').length, P);

await persp('guest');
const guest = await ptext();
const guestMorph = await hasMorph();  // member → guest changed perspective, so morph fires
await page.screenshot({ path: path.join(__dirname, 'v6-guest.png') });

await persp('staff');
const staff = await ptext();
await page.screenshot({ path: path.join(__dirname, 'v6-staff.png') });

await persp('management');
const mgmtNoBI = await ptext();
await page.screenshot({ path: path.join(__dirname, 'v6-mgmt.png') });

await persp('member');
const backMemberTabs = await page.evaluate((p) => document.querySelectorAll(p + ' .pf-tabs .pf-tab').length, P);
await page.screenshot({ path: path.join(__dirname, 'v6-member.png') });

// --- Second load WITH analytics: management gains depth (config-driven) ---
await page.goto(file + '?build=bisuite,biassist', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await page.click('.mode-rail [data-mode="experience"]');
await page.waitForTimeout(300);
await page.click(P + ' [data-age-yes]');
await page.waitForTimeout(200);
await persp('management');
const mgmtBI = await ptext();

await browser.close();

const results = {
  memberTabs, backMemberTabs, guestMorph,
  guest_ok: /Welcome to Oasis/.test(guest) && /membership would include/.test(guest),
  staff_ok: /Floor/.test(staff) && /Incoming orders/.test(staff) && /Member safety/.test(staff),
  mgmtNoBI_ok: /Management/.test(mgmtNoBI) && /Add the Business Intelligence Suite/.test(mgmtNoBI),
  mgmtBI_ok: /Busiest floor/.test(mgmtBI) && /Advisor/.test(mgmtBI) && !/Add the Business Intelligence Suite/.test(mgmtBI),
  errors
};
console.log(JSON.stringify(results, null, 2));

const ok = memberTabs === 4 && backMemberTabs === 4 && guestMorph
  && results.guest_ok && results.staff_ok && results.mgmtNoBI_ok && results.mgmtBI_ok
  && errors.length === 0;
console.log(ok ? '\n✅ VERIFY PASSED' : '\n❌ VERIFY FAILED');
process.exit(ok ? 0 : 1);
