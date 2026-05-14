/**
 * Calcula el subtotal del carrito.
 */
export function calcSubtotal(cart) {
  return cart.reduce((sum, line) => sum + line.product.price * line.qty, 0);
}

/**
 * Calcula el total con coste de envío.
 */
export function calcTotal(cart, shippingCost = 0) {
  return calcSubtotal(cart) + shippingCost;
}

/**
 * Devuelve el número total de unidades en el carrito.
 */
export function countItems(cart) {
  return cart.reduce((sum, line) => sum + line.qty, 0);
}

/**
 * Valida que el carrito tenga al menos un producto antes de hacer checkout.
 */
export function validateCart(cart) {
  if (!cart || cart.length === 0) {
    return { valid: false, error: 'El carrito está vacío.' };
  }
  return { valid: true, error: null };
}

/**
 * Genera un resumen de pedido legible para confirmación o email.
 */
export function buildOrderSummary(cart, form, delivery) {
  return {
    items: cart.map(l => ({
      name:     l.product.name,
      category: l.product.category,
      qty:      l.qty,
      price:    l.product.price * l.qty,
      currency: l.product.currency,
    })),
    subtotal:  calcSubtotal(cart),
    shipping:  delivery?.price ?? 0,
    total:     calcTotal(cart, delivery?.price ?? 0),
    customer:  { name: form.name, email: form.email },
    address:   `${form.address}, ${form.postal} ${form.city}, ${form.country}`,
    delivery:  delivery?.label ?? 'Estándar',
    eta:       delivery?.sub   ?? '3–5 días hábiles',
    createdAt: new Date().toISOString(),
  };
}
