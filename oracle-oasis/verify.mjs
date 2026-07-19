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

const SR = `(function(){var h=document.querySelector(".experience[data-experience='proposal']");return h&&h.shadowRoot;})()`;
const P = ".experience[data-experience='platform']";

await page.goto(file + '?build=guest,community,marketing', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);

// proposal still boots in its shadow root
const proposalOk = await page.evaluate(`(function(){var sr=${SR};return !!(sr&&sr.querySelector('#gateway')&&sr.querySelector('#beginJourney'));})()`);

// Enter the platform via the shell Experience mode → age gate first
await page.click('.mode-rail [data-mode="experience"]');
await page.waitForTimeout(500);
const expActive = await page.getAttribute('.mode-rail [data-mode="experience"]', 'data-active');
const ageGate = await page.evaluate((p) => !!document.querySelector(p + ' [data-age-yes]'), P);
await page.screenshot({ path: path.join(__dirname, 'v5-1-agegate.png') });

// confirm 19+ → configured platform
await page.click(P + ' [data-age-yes]');
await page.waitForTimeout(300);
const tabs = await page.evaluate((p) => Array.from(document.querySelectorAll(p + ' .pf-tabs .pf-tab')).map(t => t.textContent.replace(/\s+/g, ' ').trim()), P);
await page.screenshot({ path: path.join(__dirname, 'v5-2-platform.png') });

// switch to The Bar and add a drink → cart updates
await page.click(P + ' .pf-tab[data-tab="order"]');
await page.waitForTimeout(150);
const barShown = await page.evaluate((p) => /The Bar/.test(document.querySelector(p + ' .pf-panel h2').textContent), P);
await page.click(P + ' [data-add]');
await page.waitForTimeout(120);
const cartLabel = await page.evaluate((p) => document.querySelector(p + ' [data-cart-label]').textContent, P);

// management features must NOT appear (bisuite/biassist not selected)
const hasInsights = tabs.some(t => /Insights/.test(t));

await browser.close();

const results = { proposalOk, expActive, ageGate, tabs, barShown, cartLabel, hasInsights, errors };
console.log(JSON.stringify(results, null, 2));

const expectTabs = ['Home', 'The Bar', 'Community', 'Offers'];
const tabsOk = expectTabs.every(t => tabs.some(x => x.indexOf(t) >= 0)) && tabs.length === 4;

const ok = proposalOk && expActive === 'true' && ageGate
  && tabsOk && !hasInsights
  && barShown && /Send 1 drink to the bar/.test(cartLabel)
  && errors.length === 0;
console.log(ok ? '\n✅ VERIFY PASSED' : '\n❌ VERIFY FAILED');
process.exit(ok ? 0 : 1);
