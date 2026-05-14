import { supabase } from '../lib/supabase';

// Obtiene Set de product_ids favoritos del usuario.
export async function getFavoritesFromDB(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId);

  if (error) throw error;
  return new Set(data.map(f => f.product_id));
}

// Añade un producto a favoritos.
export async function addFavoriteDB(userId, productId) {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, product_id: productId });

  if (error) throw error;
}

// Elimina un producto de favoritos.
export async function removeFavoriteDB(userId, productId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
}
