import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../context/AppContext';

/**
 * Envuelve páginas de /admin. Comportamiento:
 * - authLoading=true  → pantalla en blanco (espera a Supabase)
 * - sin sesión        → redirige a /login
 * - sesión sin admin  → redirige a /
 * - sesión + admin    → renderiza children
 */
export default function AdminGuard({ children }) {
  const { user, isAdmin, authLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user)    { router.replace('/login'); return; }
    if (!isAdmin) { router.replace('/');      return; }
  }, [user, isAdmin, authLoading, router]);

  if (authLoading || !user || !isAdmin) return null;
  return children;
}
