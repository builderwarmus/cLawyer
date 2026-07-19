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

await page.goto(file + '?build=guest,community,marketing', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);

// ---- Proposal still boots in its shadow root ----
const proposalOk = await page.evaluate(`(function(){var sr=${SR};return !!(sr&&sr.querySelector('#gateway')&&sr.querySelector('#water')&&sr.querySelector('#beginJourney'));})()`);

// ---- Reach Build via the shell mode rail ----
await page.click('.mode-rail [data-mode="build"]');
await page.waitForTimeout(600);
const buildModeActive = await page.getAttribute('.mode-rail [data-mode="build"]', 'data-active');
const catalogShown = await page.evaluate(() => {
  const c = document.querySelector(".experience[data-experience='catalog']");
  return c && !c.hidden;
});
const cardCount = await page.evaluate(() => document.querySelectorAll(".experience[data-experience='catalog'] .sel-card").length);
const onCount = await page.evaluate(() => document.querySelectorAll(".experience[data-experience='catalog'] .sel-card.on").length);
const investInitial = await page.evaluate(() => {
  const v = document.querySelector(".experience[data-experience='catalog'] .summary .total .v");
  return v ? v.textContent.trim() : null;
});
await page.screenshot({ path: path.join(__dirname, 'v4-1-catalog.png') });

// ---- Toggle guest OFF → economics + URL update live ----
await page.click(".experience[data-experience='catalog'] [data-enh='guest']");
await page.waitForTimeout(200);
const onCountAfter = await page.evaluate(() => document.querySelectorAll(".experience[data-experience='catalog'] .sel-card.on").length);
const investAfter = await page.evaluate(() => document.querySelector(".experience[data-experience='catalog'] .summary .total .v").textContent.trim());
const urlAfter = page.url();

// ---- Build My Platform → generation → complete ----
await page.click(".experience[data-experience='catalog'] [data-build]");
await page.waitForSelector(".experience[data-experience='build'] [data-experience]", { timeout: 8000 });
const completeText = await page.evaluate(() => document.querySelector(".experience[data-experience='build'] .complete .rowset").textContent.replace(/\s+/g, ' ').trim());
await page.screenshot({ path: path.join(__dirname, 'v4-2-complete.png') });

// ---- Revise My Platform → back to the selector (selections preserved) ----
await page.click(".experience[data-experience='build'] [data-revise]");
await page.waitForTimeout(600);
const backOnCatalog = await page.evaluate(() => {
  const c = document.querySelector(".experience[data-experience='catalog']");
  return c && !c.hidden;
});
const preservedOn = await page.evaluate(() => document.querySelectorAll(".experience[data-experience='catalog'] .sel-card.on").length);

await browser.close();

const results = { proposalOk, buildModeActive, catalogShown, cardCount, onCount, investInitial,
  onCountAfter, investAfter, urlAfter, completeText, backOnCatalog, preservedOn, errors };
console.log(JSON.stringify(results, null, 2));

const ok = proposalOk
  && buildModeActive === 'true' && catalogShown
  && cardCount === 7 && onCount === 3 && investInitial === '$53,000'
  && onCountAfter === 2 && investAfter === '$51,000' && /build=ck/.test(urlAfter)
  && /\$51,000/.test(completeText) && /Enhancements2Investment/.test(completeText)
  && backOnCatalog && preservedOn === 2
  && errors.length === 0;
console.log(ok ? '\n✅ VERIFY PASSED' : '\n❌ VERIFY FAILED');
process.exit(ok ? 0 : 1);
