# Wally marts 🎨

Your very own online store for arts, crafts, and paintings. Customers can
browse your pieces, add them to a cart, and pay by **Visa, debit, or credit
card** through Stripe's secure checkout.

It works in two stages:

1. **Demo mode (right now):** everything works and you can click all the way
   through a pretend checkout — no real money moves. Great for trying it out.
2. **Real mode:** paste in your free Stripe keys and the same Checkout button
   starts taking **real card payments**.

---

## Part 1 — See your shop on your own computer

You'll need **Node.js** installed first (the free tool that runs the site).
Get it from <https://nodejs.org> (choose the "LTS" version), then install it.

Now open a terminal in this `storefront` folder and run:

```bash
npm install      # download the pieces the shop needs (one time)
npm run dev      # start the shop
```

Then open **<http://localhost:3000>** in your web browser. That's your shop! 🎉

Click a product → **Add to cart** → **Cart** → **Checkout**. In demo mode you'll
land on a friendly "Thank you" page.

To stop the shop, press `Ctrl + C` in the terminal.

---

## Part 2 — Add your own products and photos

Open the file **`data/products.js`** in any text editor. Each product looks
like this:

```js
{
  id: "sunset-over-the-hills",        // a short unique name, no spaces
  name: "Sunset Over the Hills",      // the title customers see
  priceCents: 12000,                  // the price in CENTS ($120.00 = 12000)
  currency: "usd",                    // "usd", "cad", "gbp", ...
  category: "Painting",               // used for the filter buttons
  image: "/images/art-1.svg",         // the photo (see below)
  description: "An original acrylic landscape...",
},
```

- **Change a price:** remember it's in **cents**. `$45.00` is `4500`.
- **Add a product:** copy an existing `{ ... }` block, paste it, and edit it.
  Give it a new, unique `id`.
- **Remove a product:** delete its `{ ... }` block.
- **Mark something sold:** add `soldOut: true,` to its block.

### Using your own photos

1. Put your photo files (`.jpg` or `.png`) into the **`public/images/`** folder.
2. Point the product's `image` at it, e.g. `image: "/images/my-vase.jpg"`.

Square photos look best. The starter images are simple placeholders — replace
them with your real work whenever you're ready.

### Naming your shop

Open `pages/_app.js` and change `SHOP_NAME` near the top to your shop's name.

---

## Part 3 — Turn on real card payments (Stripe)

Stripe is the company that safely handles the card payment. It's free to set up
and takes a small fee per sale.

1. Create a free account at <https://stripe.com>.
2. Go to the **API keys** page: <https://dashboard.stripe.com/apikeys>.
3. Copy your **Secret key**. While testing, use the one that starts with
   `sk_test_...`. When you're ready for real sales, switch to `sk_live_...`.
4. In this `storefront` folder, make a copy of `.env.example` and name the
   copy **`.env.local`**. Open it and paste your key:

   ```
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

5. Stop the shop (`Ctrl + C`) and start it again with `npm run dev`.

Now the **Checkout** button sends customers to Stripe's secure page where they
enter their card. You never touch or store card numbers — Stripe does it all.

> **Testing without spending money:** with a `sk_test_` key you can use
> Stripe's test card `4242 4242 4242 4242`, any future expiry date, and any
> 3-digit code. No real money moves.

Your `.env.local` file holds a secret — it is **never** shared or uploaded
(it's already excluded from git).

---

## Part 4 — Put your shop on the Internet

The easiest free way is **Vercel** (the company that makes the framework this
shop is built on).

1. Create a free account at <https://vercel.com> (sign in with GitHub).
2. Push this project to a GitHub repository (or use Vercel's uploader).
3. In Vercel, click **Add New → Project** and pick your repository.
   - If your code is in this `storefront` subfolder, set the project's
     **Root Directory** to `storefront`.
4. Before deploying, open **Settings → Environment Variables** and add:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** your Stripe secret key (`sk_live_...` for real sales)
5. Click **Deploy**. In a minute or two you'll get a public web address like
   `your-shop.vercel.app` that anyone can visit and buy from. 🌍

To use your own domain name (like `mylittleartshop.com`), buy one from any
registrar and add it under **Settings → Domains** in Vercel.

---

## Handy checklist before you go live

- [ ] Replaced the placeholder images with photos of your real work
- [ ] Set your real prices (in cents!) and descriptions in `data/products.js`
- [ ] Changed `SHOP_NAME` in `pages/_app.js`
- [ ] Added your **live** Stripe key (`sk_live_...`) as an environment variable
- [ ] Checked the list of countries you ship to in `pages/api/checkout.js`
      (the `SHIP_TO` line)
- [ ] Did a test purchase with a `sk_test_` key first

---

## A note on how payments stay safe

Card details are entered on **Stripe's** page, not yours, so you never handle
raw card numbers. Prices are re-checked on the server from `data/products.js`
at checkout time, so no one can tamper with prices in their browser. Your
secret key lives only on the server and is never sent to visitors.

Happy selling! 💛
