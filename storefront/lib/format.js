// Turn a price in cents (e.g. 4500) into a friendly string (e.g. "$45.00").
export function formatMoney(cents, currency = "usd") {
  const amount = (cents || 0) / 100;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    // Fallback if an unusual currency code is used.
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
  }
}
