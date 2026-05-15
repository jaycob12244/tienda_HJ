import { supabase } from '../lib/supabase';

// ── Productos ──

/**
 * Devuelve todos los productos con joins a brands, categories y product_images.
 */
export async function adminGetAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, brands(name), categories(slug, label), product_images(id, url, position)')
    .order('id');
  if (error) throw error;
  // Ordenar las imágenes por position dentro de cada producto
  return data.map(p => ({
    ...p,
    product_images: (p.product_images ?? []).sort((a, b) => a.position - b.position),
  }));
}

/**
 * Crea un producto nuevo. `fields` debe incluir { id, name, price, ... }.
 */
export async function adminCreateProduct(fields) {
  const { data, error } = await supabase
    .from('products')
    .insert([fields])
    .select('*, brands(name), categories(slug, label)')
    .single();
  if (error) throw error;
  return data;
}

/**
 * Actualiza un producto existente por su id.
 */
export async function adminUpdateProduct(id, fields) {
  const { data, error } = await supabase
    .from('products')
    .update(fields)
    .eq('id', id)
    .select('*, brands(name), categories(slug, label)')
    .single();
  if (error) throw error;
  return data;
}

/**
 * Elimina un producto por su id.
 */
export async function adminDeleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── Imágenes de producto ──

/**
 * Sube un archivo a Supabase Storage y crea fila en product_images.
 * Retorna la fila creada { id, product_id, url, position }.
 */
export async function adminUploadProductImage(productId, file) {
  const ext  = file.name.split('.').pop();
  const path = `${productId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, file, { upsert: false });
  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(path);

  return adminAddProductImageUrl(productId, publicUrl);
}

/**
 * Añade una URL como imagen de producto en position=0 (portada).
 * Empuja todas las imágenes existentes +1 para que la nueva sea la miniatura.
 * Retorna la fila creada { id, product_id, url, position }.
 */
export async function adminAddProductImageUrl(productId, url) {
  // Empujar todas las imágenes existentes una posición hacia adelante
  await supabase.rpc('increment_image_positions', { p_product_id: productId });

  // Insertar la nueva imagen en position=0 (será la portada/miniatura)
  const { data, error } = await supabase
    .from('product_images')
    .insert([{ product_id: productId, url, position: 0 }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Elimina una imagen de product_images.
 * Si la URL pertenece a Supabase Storage, también borra el objeto (best-effort).
 * @param {string} imageId - UUID de la fila en product_images
 * @param {string} url     - URL de la imagen (para detectar si es Storage)
 */
export async function adminDeleteProductImage(imageId, url) {
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId);
  if (error) throw error;

  // Best-effort: borrar del Storage si es una URL de storage del proyecto
  if (url && url.includes('/storage/v1/object/public/product-images/')) {
    const storagePath = url.split('/storage/v1/object/public/product-images/')[1];
    await supabase.storage.from('product-images').remove([storagePath]);
    // Ignorar error — la fila ya está borrada
  }
}

// ── Órdenes ──

/**
 * Devuelve todas las órdenes con sus items, ordenadas por fecha desc.
 */
export async function adminGetAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Actualiza el estado de una orden.
 */
export async function updateOrderStatus(id, status) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}
