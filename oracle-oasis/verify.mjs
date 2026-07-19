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

// Helper injected into the page: reach into the proposal shadow root.
const SR = `(function(){var h=document.querySelector(".experience[data-experience='proposal']");return h&&h.shadowRoot;})()`;

await page.goto(file + '?build=guest,community,marketing', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);

const shell = await page.evaluate(() => !!document.querySelector('.shell .brand'));
const propMode = await page.evaluate(() => {
  const e = document.querySelector(".experience[data-experience='proposal']");
  return e ? { hidden: e.hidden, canvas: e.classList.contains('canvas-mode'), hasShadow: !!e.shadowRoot } : null;
});
const gatewayBox = await page.evaluate(`(function(){var sr=${SR};var g=sr&&sr.querySelector('#gateway');if(!g)return null;var r=g.getBoundingClientRect();return{w:Math.round(r.width),h:Math.round(r.height)};})()`);
const waterCanvas = await page.evaluate(`(function(){var sr=${SR};var w=sr&&sr.querySelector('#water'),hw=sr&&sr.querySelector('#herowater');var wr=w&&w.getBoundingClientRect();return{water:!!w,herowater:!!hw,waterW:wr?Math.round(wr.width):0};})()`);
const beginBtn = await page.evaluate(`(function(){var sr=${SR};return !!(sr&&sr.querySelector('#beginJourney'));})()`);

await page.screenshot({ path: path.join(__dirname, 'v-1-gateway.png') });

await page.click("button[data-perspective='member']");
await page.waitForTimeout(150);
const memberPressed = await page.getAttribute("button[data-perspective='member']", 'aria-pressed');

const lockedBefore = await page.evaluate(() => document.documentElement.classList.contains('gw-locked'));
// click begin inside the shadow root directly
await page.evaluate(`(function(){var sr=${SR};var b=sr&&sr.querySelector('#beginJourney');if(b)b.click();})()`);
await page.waitForTimeout(3200);  // Begin flow is a deliberate ~2.75s crossfade
const gatewayGone = await page.evaluate(`(function(){var sr=${SR};var g=sr&&sr.querySelector('#gateway');if(!g)return true;var s=getComputedStyle(g);return s.opacity==='0'||s.display==='none'||s.visibility==='hidden'||g.hidden;})()`);
const lockedAfter = await page.evaluate(() => document.documentElement.classList.contains('gw-locked'));

await page.evaluate(() => window.scrollTo(0, 1500));
await page.waitForTimeout(400);
const elevator = await page.evaluate(`(function(){var sr=${SR};var el=sr&&sr.querySelector('#elevator');if(!el)return null;return{present:true,fixed:getComputedStyle(el).position==='fixed'};})()`);
const selector = await page.evaluate(`(function(){var sr=${SR};return !!(sr&&(sr.querySelector('#mods')||sr.querySelector('#pfSelected')||sr.querySelector('#levers')));})()`);
const imgs = await page.evaluate(`(function(){var sr=${SR};return Array.prototype.slice.call((sr||document).querySelectorAll('img[data-src]')).map(function(i){return i.getAttribute('src');});})()`);
const secText = await page.evaluate(`(function(){var sr=${SR};var h=sr&&(sr.querySelector('#sec-opportunity')||sr.querySelector('main'));return h?(h.textContent||'').replace(/\\s+/g,' ').trim().slice(0,70):null;})()`);

await page.screenshot({ path: path.join(__dirname, 'v-2-proposal.png') });

// Swap to catalog module, then back to proposal
await page.evaluate(() => window.scrollTo(0, 0));
const swapOk = await page.evaluate(() => (window.Oracle && window.Oracle.navigate) ? (window.Oracle.navigate('catalog'), 'ok') : 'no-handle');
await page.waitForTimeout(800);
const afterSwap = await page.evaluate(() => Array.from(document.querySelectorAll('.experience')).filter(e => !e.hidden).map(e => e.getAttribute('data-experience')));
// the catalog h1 must land near the top of the viewport (regression guard:
// a non-collapsing hidden proposal would push it thousands of px down)
const catalogTop = await page.evaluate(() => {
  const h1 = document.querySelector(".experience[data-experience='catalog'] h1");
  return h1 ? Math.round(h1.getBoundingClientRect().top) : null;
});
await page.screenshot({ path: path.join(__dirname, 'v-3-catalog.png') });
await page.evaluate(() => window.Oracle.navigate('proposal'));
await page.waitForTimeout(800);
const backToProp = await page.evaluate(() => Array.from(document.querySelectorAll('.experience')).filter(e => !e.hidden).map(e => e.getAttribute('data-experience')));

await browser.close();

const results = { shell, propMode, gatewayBox, waterCanvas, beginBtn, memberPressed,
  lockedBefore, gatewayGone, lockedAfter, elevator, selector, imgs, secText,
  swapOk, afterSwap, catalogTop, backToProp, errors };
console.log(JSON.stringify(results, null, 2));

const ok = shell && propMode && !propMode.hidden && propMode.canvas && propMode.hasShadow
  && gatewayBox && gatewayBox.w > 1000 && waterCanvas.water && waterCanvas.herowater
  && beginBtn && memberPressed === 'true' && lockedBefore && gatewayGone && !lockedAfter
  && elevator && elevator.fixed && selector
  && imgs.length > 0 && imgs.every(s => s && s.includes('images/'))
  && afterSwap.length === 1 && afterSwap[0] === 'catalog'
  && catalogTop !== null && catalogTop < 220
  && backToProp.length === 1 && backToProp[0] === 'proposal'
  && errors.length === 0;
console.log(ok ? '\n✅ VERIFY PASSED' : '\n❌ VERIFY FAILED');
process.exit(ok ? 0 : 1);
