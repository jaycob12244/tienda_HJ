import Head from 'next/head';
import { useState, useEffect } from 'react';
import AdminGuard from '../../components/admin/AdminGuard';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductModal from '../../components/admin/ProductModal';
import Icon from '../../components/ui/Icon';
import {
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadProductImage,
  adminAddProductImageUrl,
} from '../../services/adminService';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  // modal: null | { mode: 'create' } | { mode: 'edit', product: object }
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminGetAllProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form, { colors, sizes, pendingImages }) => {
    const payload = {
      name:             form.name.trim(),
      brand_id:         form.brand_id    || null,
      category_id:      form.category_id || null,
      price:            parseFloat(form.price) || 0,
      currency:         form.currency.trim()   || '€',
      badge:            form.badge.trim()      || null,
      rating:           form.rating !== ''     ? parseFloat(form.rating) : null,
      description:      form.description.trim() || null,
      colorway:         form.colorway.trim()   || null,
      image:            form.image.trim()      || null,
      available_colors: colors,
      available_sizes:  sizes,
    };

    if (modal.mode === 'create') {
      const created = await adminCreateProduct({ id: form.id.trim(), ...payload });
      for (const pi of pendingImages) {
        if (pi.type === 'file') {
          await adminUploadProductImage(created.id, pi.value);
        } else {
          await adminAddProductImageUrl(created.id, pi.value);
        }
      }
    } else {
      await adminUpdateProduct(modal.product.id, payload);
    }

    setModal(null);
    await load();
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await adminDeleteProduct(product.id);
      await load();
    } catch (err) {
      window.alert(`Error al eliminar: ${err.message ?? 'Error desconocido'}`);
    }
  };

  return (
    <AdminGuard>
      <Head><title>Products — AURIX Admin</title></Head>
      <AdminLayout>
        <div className="adm-header">
          <div className="adm-header__title">Products</div>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => setModal({ mode: 'create' })}
          >
            + Nuevo producto
          </button>
        </div>

        {loading ? (
          <div className="adm-loading">Cargando…</div>
        ) : products.length === 0 ? (
          <div className="adm-empty">No hay productos.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Badge</th>
                  <th>Rating</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td className="mono" style={{ fontSize: 12 }}>
                      {p.categories?.slug ?? '—'}
                    </td>
                    <td className="mono">{p.currency}{p.price}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {p.badge ?? '—'}
                    </td>
                    <td className="mono" style={{ fontSize: 12 }}>
                      {p.rating ?? '—'}
                    </td>
                    <td>
                      <div className="adm-actions">
                        <button
                          className="adm-btn-icon"
                          title="Editar"
                          onClick={() => setModal({ mode: 'edit', product: p })}
                        >
                          <Icon name="eye" size={14} />
                        </button>
                        <button
                          className="adm-btn-icon adm-btn-icon--danger"
                          title="Eliminar"
                          onClick={() => handleDelete(p)}
                        >
                          <Icon name="close" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modal && (
          <ProductModal
            product={modal.mode === 'edit' ? modal.product : null}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}
      </AdminLayout>
    </AdminGuard>
  );
}
