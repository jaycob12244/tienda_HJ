import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import Icon from '../ui/Icon';
import {
  adminUploadProductImage,
  adminAddProductImageUrl,
  adminDeleteProductImage,
} from '../../services/adminService';

const EMPTY = {
  id: '', name: '', brand_id: '', category_id: '',
  price: '', currency: '€', badge: '', rating: '',
  description: '', colorway: '', image: '',
};

/**
 * Modal de crear/editar producto.
 * @param {object|null} product  - null = modo crear, objeto = modo editar
 * @param {function}    onSave   - (form, { colors, sizes, pendingImages }) => Promise<void>
 * @param {function}    onClose  - cierra el modal sin guardar
 */
export default function ProductModal({ product, onSave, onClose }) {
  const isEdit = Boolean(product);

  // Campos del producto
  const [form, setForm] = useState(
    isEdit
      ? {
          id:          product.id          ?? '',
          name:        product.name        ?? '',
          brand_id:    product.brand_id    ?? '',
          category_id: product.category_id ?? '',
          price:       product.price       ?? '',
          currency:    product.currency    ?? '€',
          badge:       product.badge       ?? '',
          rating:      product.rating      ?? '',
          description: product.description ?? '',
          colorway:    product.colorway    ?? '',
          image:       product.image       ?? '',
        }
      : { ...EMPTY }
  );

  // Imágenes (edit: ya guardadas; create: se suben tras crear el producto)
  const [images,        setImages]        = useState(
    isEdit
      ? (product.product_images ?? []).sort((a, b) => a.position - b.position)
      : []
  );
  const [pendingImages, setPendingImages] = useState([]); // create mode: [{type:'file'|'url', value}]
  const [urlInput,      setUrlInput]      = useState('');
  const [uploading,     setUploading]     = useState(false);

  // Colores disponibles
  const [colors,    setColors]    = useState(isEdit ? (product.available_colors ?? []) : []);
  const [colorName, setColorName] = useState('');
  const [colorHex,  setColorHex]  = useState('#000000');

  // Tallas disponibles
  const [sizes,     setSizes]     = useState(isEdit ? (product.available_sizes ?? []) : []);
  const [sizeInput, setSizeInput] = useState('');

  // Categorías y marcas
  const [categories, setCategories] = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');

  const fileRef        = useRef(null);
  const thumbFileRef   = useRef(null);

  useEffect(() => {
    async function loadSelects() {
      try {
        const [cats, brs] = await Promise.all([
          supabase.from('categories').select('id, label').order('label'),
          supabase.from('brands').select('id, name').order('name'),
        ]);
        if (cats.error) console.error('[ProductModal] Error categorías:', cats.error);
        else setCategories(cats.data ?? []);
        if (brs.error)  console.error('[ProductModal] Error marcas:', brs.error);
        else setBrands(brs.data ?? []);
      } catch (err) {
        console.error('[ProductModal] Error inesperado:', err);
      }
    }
    loadSelects();
  }, []);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  // ── Handler de imagen miniatura ──

  const handleThumbFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const productId = form.id || `tmp-${Date.now()}`;
      const path = `${productId}/thumb-${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);
      setForm(f => ({ ...f, image: publicUrl }));
    } catch (err) {
      setError('Error al subir miniatura: ' + (err.message ?? 'Error desconocido'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // ── Handlers de imágenes galería ──

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (isEdit) {
      setUploading(true);
      setError('');
      try {
        const img = await adminUploadProductImage(product.id, file);
        setImages(prev => [...prev, img]);
      } catch (err) {
        setError('Error al subir imagen: ' + (err.message ?? 'Error desconocido'));
      } finally {
        setUploading(false);
        e.target.value = '';
      }
    } else {
      setPendingImages(prev => [...prev, { type: 'file', value: file }]);
      e.target.value = '';
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (isEdit) {
      setUploading(true);
      setError('');
      adminAddProductImageUrl(product.id, urlInput.trim())
        .then(img => {
          setImages(prev => [...prev, img]);
          setUrlInput('');
        })
        .catch(err => setError('Error al añadir URL: ' + (err.message ?? 'Error desconocido')))
        .finally(() => setUploading(false));
    } else {
      setPendingImages(prev => [...prev, { type: 'url', value: urlInput.trim() }]);
      setUrlInput('');
    }
  };

  const handleRemoveImage = async (img) => {
    setError('');
    try {
      await adminDeleteProductImage(img.id, img.url);
      setImages(prev => prev.filter(i => i.id !== img.id));
    } catch (err) {
      setError('Error al eliminar imagen: ' + (err.message ?? 'Error desconocido'));
    }
  };

  const handleRemovePending = (idx) => {
    setPendingImages(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Handlers de colores ──

  const handleAddColor = () => {
    if (!colorName.trim()) return;
    setColors(prev => [...prev, { name: colorName.trim(), hex: colorHex }]);
    setColorName('');
    setColorHex('#000000');
  };

  const handleRemoveColor = (idx) => setColors(prev => prev.filter((_, i) => i !== idx));

  // ── Handlers de tallas ──

  const handleAddSize = () => {
    if (!sizeInput.trim()) return;
    setSizes(prev => [...prev, sizeInput.trim()]);
    setSizeInput('');
  };

  const handleRemoveSize = (idx) => setSizes(prev => prev.filter((_, i) => i !== idx));

  // ── Submit ──

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(form, { colors, sizes, pendingImages });
    } catch (err) {
      setError(err.message ?? 'Error al guardar.');
      setSaving(false);
    }
  };

  return (
    <div
      className="adm-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="adm-modal">
        <div className="adm-modal__header">
          <div className="adm-modal__title">
            {isEdit ? 'Editar producto' : 'Nuevo producto'}
          </div>
          <button className="adm-btn-icon" onClick={onClose} type="button" aria-label="Cerrar">
            <Icon name="close" size={16} />
          </button>
        </div>

        <form className="adm-form" onSubmit={handleSubmit}>

          {/* ID + Nombre */}
          <div className="adm-form__row">
            <div className="adm-field">
              <label className="adm-field__label" htmlFor="field-id">
                ID{isEdit ? ' (solo lectura)' : ' *'}
              </label>
              <input
                id="field-id"
                className="adm-field__input"
                value={form.id}
                onChange={set('id')}
                placeholder="ax-09"
                disabled={isEdit}
                required
              />
            </div>
            <div className="adm-field">
              <label className="adm-field__label" htmlFor="field-name">Nombre *</label>
              <input
                id="field-name"
                className="adm-field__input"
                value={form.name}
                onChange={set('name')}
                required
              />
            </div>
          </div>

          {/* Marca + Categoría */}
          <div className="adm-form__row">
            <div className="adm-field">
              <label className="adm-field__label" htmlFor="field-brand">Marca *</label>
              <select
                id="field-brand"
                className="adm-field__select"
                value={form.brand_id}
                onChange={set('brand_id')}
                required
              >
                <option value="">— Selecciona —</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="adm-field">
              <label className="adm-field__label" htmlFor="field-category">Categoría *</label>
              <select
                id="field-category"
                className="adm-field__select"
                value={form.category_id}
                onChange={set('category_id')}
                required
              >
                <option value="">— Selecciona —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Precio + Moneda */}
          <div className="adm-form__row">
            <div className="adm-field">
              <label className="adm-field__label" htmlFor="field-price">Precio *</label>
              <input
                id="field-price"
                className="adm-field__input"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={set('price')}
                required
              />
            </div>
            <div className="adm-field">
              <label className="adm-field__label" htmlFor="field-currency">Moneda</label>
              <input
                id="field-currency"
                className="adm-field__input"
                value={form.currency}
                onChange={set('currency')}
                placeholder="€"
              />
            </div>
          </div>

          {/* Badge + Rating */}
          <div className="adm-form__row">
            <div className="adm-field">
              <label className="adm-field__label" htmlFor="field-badge">Badge</label>
              <input
                id="field-badge"
                className="adm-field__input"
                value={form.badge}
                onChange={set('badge')}
                placeholder="New · SS26"
              />
            </div>
            <div className="adm-field">
              <label className="adm-field__label" htmlFor="field-rating">Rating (0 – 5)</label>
              <input
                id="field-rating"
                className="adm-field__input"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={set('rating')}
              />
            </div>
          </div>

          {/* Colorway */}
          <div className="adm-field">
            <label className="adm-field__label" htmlFor="field-colorway">Colorway</label>
            <input
              id="field-colorway"
              className="adm-field__input"
              value={form.colorway}
              onChange={set('colorway')}
              placeholder="Arctic White / Lunar Grey"
            />
          </div>

          {/* Descripción */}
          <div className="adm-field">
            <label className="adm-field__label" htmlFor="field-description">Descripción</label>
            <textarea
              id="field-description"
              className="adm-field__textarea"
              value={form.description}
              onChange={set('description')}
              rows={3}
            />
          </div>

          {/* Imagen miniatura */}
          <div className="adm-field">
            <label className="adm-field__label" htmlFor="field-image">Imagen miniatura</label>
            <input
              ref={thumbFileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleThumbFileChange}
            />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                id="field-image"
                className="adm-field__input"
                value={form.image}
                onChange={set('image')}
                placeholder="https://… pegar URL o subir foto"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => thumbFileRef.current?.click()}
                disabled={uploading}
                style={{ flexShrink: 0 }}
              >
                {uploading ? 'Subiendo…' : '↑ Subir'}
              </button>
              {form.image && (
                <img
                  src={form.image}
                  alt="preview"
                  style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--line)', flexShrink: 0 }}
                />
              )}
            </div>
          </div>

          {/* ── Imágenes ── */}
          <div className="adm-field">
            <label className="adm-field__label">Imágenes galería</label>

            {/* Imágenes guardadas (edit) */}
            {isEdit && images.length > 0 && (
              <div className="adm-img-list">
                {images.map(img => (
                  <div key={img.id} className="adm-img-item">
                    <img src={img.url} alt="" className="adm-img-thumb" />
                    <button
                      type="button"
                      className="adm-img-remove"
                      onClick={() => handleRemoveImage(img)}
                      aria-label="Eliminar imagen"
                    >
                      <Icon name="close" size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Imágenes en cola (create) */}
            {!isEdit && pendingImages.length > 0 && (
              <div className="adm-img-list">
                {pendingImages.map((pi, idx) => (
                  <div key={idx} className="adm-img-item adm-img-item--pending">
                    <div className="adm-img-thumb adm-img-thumb--pending">
                      {pi.type === 'file' ? pi.value.name : '🔗 URL'}
                    </div>
                    <button
                      type="button"
                      className="adm-img-remove"
                      onClick={() => handleRemovePending(idx)}
                      aria-label="Eliminar imagen"
                    >
                      <Icon name="close" size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Subir archivo */}
            <div className="adm-inline-add" style={{ marginTop: 8 }}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Subiendo…' : '↑ Subir foto'}
              </button>
            </div>

            {/* Añadir URL */}
            <div className="adm-inline-add" style={{ marginTop: 6 }}>
              <input
                className="adm-field__input"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://… pegar URL de imagen"
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={handleAddUrl}
                disabled={!urlInput.trim() || uploading}
              >
                Añadir URL
              </button>
            </div>
          </div>

          {/* ── Colores disponibles ── */}
          <div className="adm-field">
            <label className="adm-field__label" htmlFor="field-color-name">Colores disponibles</label>

            {colors.length > 0 && (
              <div className="adm-color-list">
                {colors.map((c, i) => (
                  <div key={i} className="adm-color-item">
                    <span className="adm-color-swatch" style={{ background: c.hex }} />
                    <span>{c.name}</span>
                    <button
                      type="button"
                      className="adm-img-remove"
                      style={{ position: 'static', marginLeft: 'auto' }}
                      onClick={() => handleRemoveColor(i)}
                      aria-label="Eliminar color"
                    >
                      <Icon name="close" size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="adm-inline-add" style={{ marginTop: 8 }}>
              <input
                id="field-color-name"
                className="adm-field__input"
                value={colorName}
                onChange={e => setColorName(e.target.value)}
                placeholder="Nombre (ej: Bone)"
              />
              <input
                type="color"
                value={colorHex}
                onChange={e => setColorHex(e.target.value)}
                aria-label="Color hex"
                style={{
                  width: 40, height: 36, padding: 2,
                  borderRadius: 6, border: '1px solid var(--line)',
                  cursor: 'pointer', flexShrink: 0,
                }}
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={handleAddColor}
                disabled={!colorName.trim()}
              >
                Añadir
              </button>
            </div>
          </div>

          {/* ── Tallas disponibles ── */}
          <div className="adm-field">
            <label className="adm-field__label" htmlFor="field-size-input">Tallas disponibles</label>

            {sizes.length > 0 && (
              <div className="adm-size-chips">
                {sizes.map((s, i) => (
                  <span key={i} className="adm-size-chip">
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(i)}
                      aria-label={`Eliminar talla ${s}`}
                    >
                      <Icon name="close" size={9} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="adm-inline-add" style={{ marginTop: 8 }}>
              <input
                id="field-size-input"
                className="adm-field__input"
                value={sizeInput}
                onChange={e => setSizeInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSize(); } }}
                placeholder="38, US 9, L…"
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={handleAddSize}
                disabled={!sizeInput.trim()}
              >
                Añadir
              </button>
            </div>
          </div>

          {error && (
            <div style={{ color: 'var(--signal)', fontSize: 13 }}>{error}</div>
          )}

          <div className="adm-modal__actions">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn--primary btn--sm"
              disabled={saving}
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
