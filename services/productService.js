import { PRODUCTS, EXTERNAL_PRODUCTS } from '../data/products';

export const ALL_PRODUCTS = [
  ...EXTERNAL_PRODUCTS,
  ...PRODUCTS.map(p => ({ ...p, brand: 'Aurix' })),
];

/**
 * Devuelve productos de la misma categoría, excluyendo el actual.
 */
export function getRelated(product, limit = 3) {
  return ALL_PRODUCTS
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

/**
 * Filtra productos por categoría.
 */
export function filterByCategory(products, category) {
  if (!category || category === 'todos') return products;
  return products.filter(p => p.category === category);
}

/**
 * Ordena productos por el criterio indicado.
 */
export function sortProducts(products, by = 'rating') {
  return [...products].sort((a, b) => {
    if (by === 'price-asc')  return a.price - b.price;
    if (by === 'price-desc') return b.price - a.price;
    if (by === 'rating')     return b.rating - a.rating;
    if (by === 'name')       return a.name.localeCompare(b.name);
    return 0;
  });
}

/**
 * Obtiene los productos favoritos a partir de un Set de IDs.
 */
export function getFavorites(favoriteIds) {
  return ALL_PRODUCTS.filter(p => favoriteIds.has(p.id));
}
