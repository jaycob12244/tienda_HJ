import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminGuard from '../../components/admin/AdminGuard';
import { useApp } from '../../context/AppContext';

export default function AdminIndex() {
  const router = useRouter();
  const { authLoading, isAdmin } = useApp();

  useEffect(() => {
    if (!authLoading && isAdmin) {
      router.replace('/admin/products');
    }
  }, [authLoading, isAdmin, router]);

  return <AdminGuard><div /></AdminGuard>;
}
