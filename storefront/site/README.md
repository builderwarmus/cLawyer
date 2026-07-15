# Wally marts — the website (for Cloudflare) 🎨

This folder **is** your website. It's a plain website (no complicated build
step), so it uploads to **Cloudflare Pages** in a few minutes. Card payments
run on a tiny secure function that lives in the `functions` folder, so your
Stripe secret key never touches the shopper's browser.

It works in **demo mode** until a Stripe key is added — you can put it online
first and switch real payments on later.

---

## What's in here

| File / folder | What it is |
|---|---|
| `index.html` | The shop page customers see |
| `success.html` | The "thank you" page after a successful payment |
| `assets/products.js` | **Your products** — names, prices, pictures |
| `assets/styles.css` | The look (black theme) |
| `assets/app.js` | The cart and buttons |
| `functions/api/checkout.js` | The secure payment function (also holds the real prices) |

---

## Part 1 — Put the website online with Cloudflare (the easy way)

You'll need a free **Cloudflare** account: <https://dash.cloudflare.com/sign-up>.

1. Log in to Cloudflare.
2. In the left menu, click **Workers & Pages**.
3. Click **Create** → the **Pages** tab → **Upload assets**.
4. Give it a project name, e.g. **`wally-marts`**, and click **Create project**.
5. **Drag this `site` folder** onto the upload box (or click to browse and
   select it). Make sure the `functions` folder is included.
6. Click **Deploy site**.

In a minute Cloudflare gives you a public web address like
**`wally-marts.pages.dev`** that anyone on the Internet can visit. 🌍

At this point the shop is live and the checkout is in safe **demo mode**
(no real charges yet).

> **Prefer auto-updates from GitHub?** Instead of uploading, choose
> **Connect to Git**, pick your repository, and set:
> **Framework preset:** None · **Build command:** *(leave blank)* ·
> **Build output directory:** `storefront/site`. Cloudflare finds the
> `functions` folder automatically.

---

## Part 2 — Turn on real Visa / debit card payments (a grown-up's step)

Because this handles real money that pays out to a bank account, an adult
(your dad) should set up Stripe.

1. Create a free Stripe account at <https://stripe.com>.
2. Open the API keys page: <https://dashboard.stripe.com/apikeys>.
3. Copy the **Secret key**.
   - Use the **test** key (`sk_test_...`) to trial it safely first.
   - Use the **live** key (`sk_live_...`) when ready to take real orders.
4. In Cloudflare: open the **wally-marts** project → **Settings** →
   **Variables and Secrets** (Environment variables) → **Add**:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** the Stripe secret key you copied
   - Save it as a **Secret** (encrypted).
5. Go to the **Deployments** tab and click **Retry deployment** (or
   re-upload) so the new key takes effect.

Now the **Checkout** button sends customers to Stripe's secure page to pay by
Visa, debit, or credit card. You never see or store card numbers.

> **Test without spending money:** with a `sk_test_` key, pay using Stripe's
> test card `4242 4242 4242 4242`, any future expiry date, and any 3 digits.

---

## Part 3 — Make it your own

Open **`assets/products.js`** to change what's for sale — names, prices (in
**cents**, so `$45.00` is `4500`), categories, and descriptions.

**One important rule about prices:** the real charge amount also lives in
**`functions/api/checkout.js`** (in the `CATALOG` near the top). This second
copy is what keeps prices safe from tampering. **If you change a price, change
it in both files** so they match.

**Using your own photos:**
1. Put your photo files (`.jpg`/`.png`) into the `assets` folder.
2. In `assets/products.js`, give the product an `img`, e.g.
   `img: "assets/my-vase.jpg"` (this replaces the starter drawing).

After any change, re-upload the folder to Cloudflare (or push to GitHub if you
connected it) to publish the update.

---

## Part 4 — A custom name like wallymarts.com (optional)

In your Cloudflare Pages project, open **Custom domains** and follow the steps.
If you buy the domain through Cloudflare, it connects with one click.

---

## Checklist before real sales

- [ ] Replaced the starter drawings with photos of your real work
- [ ] Set your real prices in **both** `assets/products.js` **and**
      `functions/api/checkout.js`
- [ ] Added the **live** Stripe key (`sk_live_...`) as `STRIPE_SECRET_KEY` in Cloudflare
- [ ] Re-deployed after adding the key
- [ ] Checked the countries you ship to in `functions/api/checkout.js` (`SHIP_TO`)
- [ ] Did a test order first with a `sk_test_` key

Happy selling! 💛
