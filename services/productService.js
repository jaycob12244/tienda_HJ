import { supabase } from '../lib/supabase';

// Normaliza un producto de Supabase al formato que usa el frontend
function normalize(p) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brands?.name ?? '',
    category: p.categories?.slug ?? '',
    price: p.price,
    currency: p.currency,
    badge: p.badge,
    rating: p.rating,
    desc: p.description,
    image: p.image ?? null,
    colorway: p.colorway ?? null,
  };
}

// Fetch todos los productos desde Supabase.
// Devuelve null en caso de error (distinto de [] que sería vacío).
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, brands(name), categories(slug, label)')
    .order('id');

  if (error) {
    console.warn('Error fetching products from Supabase:', error.message);
    return null;
  }

  return data.map(normalize);
}

// Filtra productos relacionados (misma categoría, distinto id)
export function getRelated(product, allProducts, limit = 3) {
  return allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

// Devuelve los productos que están en favoritos
export function getFavoriteProducts(favoriteIds, allProducts) {
  return allProducts.filter(p => favoriteIds.has(p.id));
}

// Filtra por categoría
export function filterByCategory(allProducts, category) {
  if (category === 'todos') return allProducts;
  return allProducts.filter(p => p.category === category);
}
