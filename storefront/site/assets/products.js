// ------------------------------------------------------------------
// WHAT SHOPPERS SEE  (names, prices, pictures, descriptions)
// ------------------------------------------------------------------
// Edit your products here. Prices are in CENTS ($45.00 = 4500).
//
// IMPORTANT: if you change a PRICE here, also change the matching
// price in  functions/api/checkout.js  so customers are charged the
// right amount. (That second copy is what actually charges the card,
// which keeps prices safe from tampering.)
//
// To use your own photos, see the note at the bottom of this file.
// ------------------------------------------------------------------

window.WALLY_PRODUCTS = [
  {
    id: "sunset-over-the-hills",
    name: "Sunset Over the Hills",
    cents: 12000,
    cat: "Painting",
    art: "art-1",
    desc: "An original acrylic landscape on canvas, 40 x 30 cm. Warm golds and deep purples capture the last light of a summer evening. Signed on the back and ready to hang.",
  },
  {
    id: "hand-thrown-mug",
    name: "Hand-Thrown Ceramic Mug",
    cents: 3200,
    cat: "Craft",
    art: "art-2",
    desc: "Wheel-thrown stoneware mug with a speckled sea-glass glaze. Holds about 350 ml, comfy handle, dishwasher and microwave safe. Each one is a little different.",
  },
  {
    id: "abstract-blue-study",
    name: "Abstract Blue Study",
    cents: 8500,
    cat: "Painting",
    art: "art-3",
    desc: "A bold abstract in blues and teal, mixed media on wood panel, 30 x 30 cm. A calming statement piece for a desk, shelf, or gallery wall.",
  },
  {
    id: "woven-wall-hanging",
    name: "Woven Wall Hanging",
    cents: 5400,
    cat: "Craft",
    art: "art-4",
    desc: "Hand-woven wall hanging in natural cotton and wool with wooden dowel. Roughly 35 cm wide. Adds warm, cozy texture to any room.",
  },
  {
    id: "wildflower-greeting-cards",
    name: "Wildflower Greeting Cards (Set of 6)",
    cents: 1800,
    cat: "Fun",
    art: "art-5",
    desc: "A set of six blank greeting cards printed from original watercolour wildflower paintings. Includes kraft envelopes. Perfect for any occasion.",
  },
  {
    id: "tiny-clay-cat",
    name: "Tiny Clay Cat",
    cents: 2200,
    cat: "Fun",
    art: "art-6",
    desc: "A hand-sculpted, hand-painted little clay cat, about 5 cm tall. Cheerful desk companion and a great small gift. No two are quite alike.",
  },
];

// ------------------------------------------------------------------
// The starter artwork (simple drawings). To use YOUR OWN photos:
//   1. Put photo files in the  assets/  folder (e.g. my-vase.jpg)
//   2. In a product above, change  art: "art-2"  to  img: "assets/my-vase.jpg"
// The site shows a photo if "img" is set, otherwise the drawing in "art".
// ------------------------------------------------------------------
window.WALLY_ART = {
  "art-1": '<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd27a"/><stop offset="0.55" stop-color="#f2933f"/><stop offset="1" stop-color="#7d3b6b"/></linearGradient></defs><rect width="600" height="600" fill="url(#a1)"/><circle cx="300" cy="235" r="80" fill="#fff3d6" opacity="0.9"/><path d="M0 420 Q150 360 300 420 T600 420 V600 H0 Z" fill="#5a2b52" opacity="0.65"/><path d="M0 470 Q150 420 300 470 T600 470 V600 H0 Z" fill="#3d1c39" opacity="0.7"/></svg>',
  "art-2": '<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dff3ef"/><stop offset="1" stop-color="#a7d8cf"/></linearGradient></defs><rect width="600" height="600" fill="url(#a2)"/><path d="M215 200 h150 a20 20 0 0 1 20 20 v150 a55 55 0 0 1 -55 55 h-80 a55 55 0 0 1 -55 -55 v-150 a20 20 0 0 1 20 -20 Z" fill="#6bab9f"/><path d="M385 235 h34 a34 34 0 0 1 0 68 h-34 Z" fill="none" stroke="#6bab9f" stroke-width="16"/><circle cx="265" cy="255" r="9" fill="#33564f"/><circle cx="315" cy="255" r="9" fill="#33564f"/><circle cx="290" cy="300" r="7" fill="#4c7d73"/></svg>',
  "art-3": '<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b3a63"/><stop offset="1" stop-color="#2f6f8f"/></linearGradient></defs><rect width="600" height="600" fill="url(#a3)"/><circle cx="220" cy="230" r="120" fill="#4fa3c7" opacity="0.55"/><circle cx="380" cy="340" r="150" fill="#7fd0e6" opacity="0.4"/><path d="M120 430 C220 360 380 500 500 400" stroke="#dff3ff" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M150 180 C260 260 340 120 470 210" stroke="#bfe8f5" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.8"/></svg>',
  "art-4": '<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="600" fill="#efe6d7"/><rect x="180" y="120" width="240" height="16" rx="8" fill="#b79b6e"/><g stroke="#c9b48c" stroke-width="10" stroke-linecap="round"><line x1="205" y1="150" x2="205" y2="380"/><line x1="245" y1="150" x2="245" y2="420"/><line x1="285" y1="150" x2="285" y2="360"/><line x1="325" y1="150" x2="325" y2="420"/><line x1="365" y1="150" x2="365" y2="380"/><line x1="395" y1="150" x2="395" y2="350"/></g><path d="M195 250 q105 40 210 0" stroke="#8a6f45" stroke-width="14" fill="none"/><path d="M195 310 q105 40 210 0" stroke="#c85a3c" stroke-width="14" fill="none"/><path d="M215 380 l80 60 l90 -70" stroke="#8a6f45" stroke-width="12" fill="none" stroke-linejoin="round"/></svg>',
  "art-5": '<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="600" fill="#fbf4ec"/><line x1="300" y1="320" x2="300" y2="470" stroke="#5f8f5a" stroke-width="8"/><path d="M300 400 q-40 -20 -60 -60 q45 0 60 40 Z" fill="#7cb073"/><path d="M300 380 q40 -20 60 -60 q-45 0 -60 40 Z" fill="#7cb073"/><g fill="#e8739a"><circle cx="300" cy="270" r="34"/><circle cx="256" cy="290" r="30"/><circle cx="344" cy="290" r="30"/><circle cx="272" cy="238" r="30"/><circle cx="328" cy="238" r="30"/></g><circle cx="300" cy="268" r="20" fill="#f4c34e"/><g fill="#c79bd6"><circle cx="150" cy="180" r="16"/><circle cx="128" cy="192" r="14"/><circle cx="172" cy="192" r="14"/><circle cx="150" cy="205" r="10" fill="#f4c34e"/></g><g fill="#8fb3e8"><circle cx="460" cy="200" r="16"/><circle cx="438" cy="212" r="14"/><circle cx="482" cy="212" r="14"/><circle cx="460" cy="225" r="10" fill="#f4c34e"/></g></svg>',
  "art-6": '<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a6" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fcebdd"/><stop offset="1" stop-color="#f4d3b6"/></linearGradient></defs><rect width="600" height="600" fill="url(#a6)"/><ellipse cx="300" cy="440" rx="110" ry="30" fill="#d9a97f" opacity="0.5"/><path d="M230 430 q-10 -120 70 -150 q80 30 70 150 Z" fill="#e08a4a"/><path d="M245 300 l-12 -46 l40 26 Z" fill="#e08a4a"/><path d="M355 300 l12 -46 l-40 26 Z" fill="#e08a4a"/><circle cx="272" cy="330" r="10" fill="#3a2a20"/><circle cx="328" cy="330" r="10" fill="#3a2a20"/><path d="M285 358 q15 14 30 0" stroke="#3a2a20" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M300 340 l-8 8 l8 8 l8 -8 Z" fill="#c25a3c"/><g stroke="#3a2a20" stroke-width="4" stroke-linecap="round"><line x1="250" y1="352" x2="215" y2="346"/><line x1="250" y1="362" x2="216" y2="366"/><line x1="350" y1="352" x2="385" y2="346"/><line x1="350" y1="362" x2="384" y2="366"/></g></svg>',
};
