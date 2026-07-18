// ------------------------------------------------------------------
// YOUR PRODUCTS
// ------------------------------------------------------------------
// This is your shop's catalog. Add, remove, or edit items here.
//
// Each product needs:
//   id          A short unique name, lowercase-with-dashes (no spaces).
//   name        The title shown to customers.
//   priceCents  The price in CENTS. e.g. $45.00 is 4500. (Avoids rounding bugs.)
//   currency    'usd', 'cad', 'gbp', etc.
//   category    A label like "Painting" or "Craft" (used for filtering).
//   image       Path to a photo in the /public/images folder.
//   description Text shown on the product page.
//   soldOut     Optional. Set to true to keep an item listed but not buyable.
//
// To use your OWN photos: drop them into  storefront/public/images/
// and point "image" at them, e.g. image: '/images/my-photo.jpg'
// ------------------------------------------------------------------

const products = [
  {
    id: "sunset-over-the-hills",
    name: "Sunset Over the Hills",
    priceCents: 12000,
    currency: "usd",
    category: "Painting",
    image: "/images/art-1.svg",
    description:
      "An original acrylic landscape on canvas, 40 x 30 cm. Warm golds and deep purples capture the last light of a summer evening. Signed on the back and ready to hang.",
  },
  {
    id: "hand-thrown-mug",
    name: "Hand-Thrown Ceramic Mug",
    priceCents: 3200,
    currency: "usd",
    category: "Craft",
    image: "/images/art-2.svg",
    description:
      "Wheel-thrown stoneware mug with a speckled sea-glass glaze. Holds about 350 ml, comfy handle, dishwasher and microwave safe. Each one is a little different.",
  },
  {
    id: "abstract-blue-study",
    name: "Abstract Blue Study",
    priceCents: 8500,
    currency: "usd",
    category: "Painting",
    image: "/images/art-3.svg",
    description:
      "A bold abstract in blues and teal, mixed media on wood panel, 30 x 30 cm. A calming statement piece for a desk, shelf, or gallery wall.",
  },
  {
    id: "woven-wall-hanging",
    name: "Woven Wall Hanging",
    priceCents: 5400,
    currency: "usd",
    category: "Craft",
    image: "/images/art-4.svg",
    description:
      "Hand-woven wall hanging in natural cotton and wool with wooden dowel. Roughly 35 cm wide. Adds warm, cozy texture to any room.",
  },
  {
    id: "wildflower-greeting-cards",
    name: "Wildflower Greeting Cards (Set of 6)",
    priceCents: 1800,
    currency: "usd",
    category: "Fun",
    image: "/images/art-5.svg",
    description:
      "A set of six blank greeting cards printed from original watercolour wildflower paintings. Includes kraft envelopes. Perfect for any occasion.",
  },
  {
    id: "tiny-clay-cat",
    name: "Tiny Clay Cat",
    priceCents: 2200,
    currency: "usd",
    category: "Fun",
    image: "/images/art-6.svg",
    description:
      "A hand-sculpted, hand-painted little clay cat, about 5 cm tall. Cheerful desk companion and a great small gift. No two are quite alike.",
  },
];

export function getAllProducts() {
  return products;
}

export function getProductById(id) {
  return products.find((p) => p.id === id);
}

export function getCategories() {
  const seen = [];
  for (const p of products) {
    if (!seen.includes(p.category)) seen.push(p.category);
  }
  return seen;
}

export default products;
