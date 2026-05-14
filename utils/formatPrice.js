export function formatPrice(amount, currency = '€') {
  return `${currency}${amount}`;
}

export function formatTotal(cart) {
  return cart.reduce((acc, line) => acc + line.product.price * line.qty, 0);
}
