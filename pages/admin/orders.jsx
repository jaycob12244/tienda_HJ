import Head from 'next/head';
import { useState, useEffect } from 'react';
import AdminGuard from '../../components/admin/AdminGuard';
import AdminLayout from '../../components/admin/AdminLayout';
import OrderRow from '../../components/admin/OrderRow';
import { adminGetAllOrders } from '../../services/adminService';

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetAllOrders()
      .then(data => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev =>
      prev.map(o => o.id === id ? { ...o, status: newStatus } : o)
    );
  };

  return (
    <AdminGuard>
      <Head><title>Orders — AURIX Admin</title></Head>
      <AdminLayout>
        <div className="adm-header">
          <div className="adm-header__title">Orders</div>
          <span className="mono" style={{ fontSize: 13, color: 'var(--muted)' }}>
            {orders.length} orden{orders.length !== 1 ? 'es' : ''}
          </span>
        </div>

        {loading ? (
          <div className="adm-loading">Cargando…</div>
        ) : orders.length === 0 ? (
          <div className="adm-empty">No hay órdenes aún.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Pago</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminLayout>
    </AdminGuard>
  );
}
