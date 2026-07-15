import "../styles/globals.css";
import Head from "next/head";
import { CartProvider } from "../lib/cart-context";
import Layout from "../components/Layout";

// The shop's name. Change this to your own store name.
export const SHOP_NAME = "Wally marts";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Head>
        <title>{SHOP_NAME}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta
          name="description"
          content="Original arts, crafts, and paintings — handmade with love."
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}
