import { supabase } from '../lib/supabase';

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

// Obtiene el carrito del usuario desde Supabase.
export async function getCartFromDB(userId) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('qty, products(id, name, price, currency, badge, rating, description, image, colorway, brands(name), categories(slug))')
    .eq('user_id', userId);

  if (error) throw error;

  return data
    .filter(item => item.products != null) // ignorar filas huérfanas (producto eliminado)
    .map(item => ({
    product: {
      id: item.products.id,
      name: item.products.name,
      brand: item.products.brands?.name ?? '',
      category: item.products.categories?.slug ?? '',
      price: item.products.price,
      currency: item.products.currency,
      badge: item.products.badge,
      rating: item.products.rating,
      desc: item.products.description,
      image: item.products.image ?? null,
      colorway: item.products.colorway ?? null,
    },
    qty: item.qty,
  }));
}

// Crea o actualiza un item del carrito.
export async function upsertCartItemDB(userId, productId, qty) {
  const { error } = await supabase
    .from('cart_items')
    .upsert(
      { user_id: userId, product_id: productId, qty },
      { onConflict: 'user_id,product_id' }
    );

  if (error) throw error;
}

// Elimina un item del carrito.
export async function removeCartItemDB(userId, productId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
}

// Vacía el carrito completo del usuario.
export async function clearCartDB(userId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}

// Migra el carrito local (localStorage) a Supabase al hacer login.
export async function migrateLocalCartToDB(userId, localCart) {
  if (!localCart || localCart.length === 0) return;

  const items = localCart.map(line => ({
    user_id: userId,
    product_id: line.product.id,
    qty: line.qty,
  }));

  const { error } = await supabase
    .from('cart_items')
    .upsert(items, { onConflict: 'user_id,product_id', ignoreDuplicates: true });

  if (error) throw error;
}
