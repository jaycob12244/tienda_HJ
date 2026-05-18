import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

/**
 * Envuelve páginas de /admin. Comportamiento:
 * - authLoading=true      → espera a que resuelva la sesión
 * - sin sesión            → redirige a /login
 * - verificando rol       → spinner mientras consulta profiles directamente
 * - sesión sin admin      → redirige a /
 * - sesión + admin        → renderiza children
 *
 * Hace su propia verificación directa del rol para no depender del
 * isAdmin del contexto (que puede perderse si syncUserData tiene timeout).
 */
export default function AdminGuard({ children }) {
  const { user, authLoading } = useApp();
  const router = useRouter();
  const [roleChecked, setRoleChecked] = useState(false);
  const [isAdmin,     setIsAdmin]     = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/login'); return; }

    // Verificación directa del rol — no depende del contexto
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        const admin = !error && data?.role === 'admin';
        setIsAdmin(admin);
        setRoleChecked(true);
        if (!admin) router.replace('/');
      })
      .catch(() => {
        setRoleChecked(true);
        router.replace('/');
      });
  }, [authLoading, user, router]);

  if (authLoading || !user || !roleChecked || !isAdmin) return null;
  return children;
}
