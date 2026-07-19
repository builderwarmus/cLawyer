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

// Load with a build param to prove config seeding
await page.goto(file + '?build=guest,community,marketing', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

const startModule = await page.getAttribute('.experience', 'data-experience');
const enterClass = await page.evaluate(() => document.querySelector('.experience').classList.contains('enter'));
const selectedInDebug = await page.evaluate(() => document.querySelector('.debug').textContent);
const kpi = await page.evaluate(() => document.querySelector('.kpi b')?.textContent);
const causticsPresent = await page.evaluate(() => !!document.getElementById('env-caustics'));
const ambientPresent = await page.evaluate(() => !!document.getElementById('env-ambient'));

// Trigger a module swap (Explore the enhancements)
await page.click("button[data-go='catalog']");
await page.waitForTimeout(700);
const afterSwap = await page.getAttribute('.experience', 'data-experience');
const swapEnter = await page.evaluate(() => document.querySelector('.experience').classList.contains('enter'));
const onlyOneExperience = await page.evaluate(() => document.querySelectorAll('.experience').length);

// Perspective toggle
await page.click("button[data-perspective='member']");
await page.waitForTimeout(200);
const pressed = await page.getAttribute("button[data-perspective='member']", 'aria-pressed');

// Back nav
await page.click("button[data-go='proposal']");
await page.waitForTimeout(700);
const backModule = await page.getAttribute('.experience', 'data-experience');

// URL retained build code
const url = page.url();

await page.screenshot({ path: path.join(__dirname, 'verify-proposal.png') });
await browser.close();

const results = {
  startModule, enterClass, kpi,
  selectedHasGuest: selectedInDebug.includes('guest'),
  selectedHasCommunity: selectedInDebug.includes('community'),
  causticsPresent, ambientPresent,
  afterSwap, swapEnter, onlyOneExperience,
  memberPressed: pressed, backModule,
  urlHasBuild: /build=/.test(url), url,
  errors
};
console.log(JSON.stringify(results, null, 2));

const ok = startModule==='proposal' && enterClass && afterSwap==='catalog' && swapEnter
  && onlyOneExperience===1 && pressed==='true' && backModule==='proposal'
  && causticsPresent && ambientPresent && errors.length===0;
console.log(ok ? '\n✅ VERIFY PASSED' : '\n❌ VERIFY FAILED');
process.exit(ok ? 0 : 1);
