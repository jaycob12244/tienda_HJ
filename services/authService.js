import { supabase } from '../lib/supabase';

// Registrar nuevo usuario. Supabase envía email de verificación automáticamente.
export async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

// Iniciar sesión con email y contraseña.
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// Cerrar sesión.
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Enviar email de recuperación de contraseña.
export async function recover(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined'
      ? `${window.location.origin}/reset-password`
      : undefined,
  });
  if (error) throw error;
}

// Reenviar email de verificación.
export async function resendVerification(email) {
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  if (error) throw error;
}

// Obtener sesión actual.
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
