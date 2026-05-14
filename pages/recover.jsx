import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthShell from '../components/auth/AuthShell';
import FloatField from '../components/auth/FloatField';
import Icon from '../components/ui/Icon';
import { recover } from '../services/authService';

export default function RecoverPage() {
  const router = useRouter();
  const [email,     setEmail]     = useState('');
  const [sent,      setSent]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [serverErr, setServerErr] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const emailError = submitted && !email.includes('@') ? 'Email inválido' : null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerErr(null);
    if (!email.includes('@')) return;

    setLoading(true);
    try {
      await recover(email);
      setSent(true);
    } catch (err) {
      setServerErr('Error al enviar el enlace. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Recuperar acceso — AURIX</title></Head>
      <AuthShell view="recover">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Recuperar acceso</div>
          <h1 className="auth__title">Restaurar contraseña<span className="auth__dot">.</span></h1>
          <p className="auth__sub">Te enviamos un enlace de un solo uso. Sin contraseñas temporales.</p>
        </div>

        {!sent ? (
          <form onSubmit={onSubmit} className="auth__form">
            <FloatField label="Email" type="email" value={email} onChange={setEmail} error={emailError} autoComplete="email" />

            {serverErr && (
              <div className="auth__serverErr">
                <Icon name="close" size={11} /> {serverErr}
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--lg btn--icon"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Enviando…' : 'Enviar enlace de acceso'}
              {!loading && <span className="btn__icon"><Icon name="arrow-right" size={14} /></span>}
            </button>

            <div className="auth__foot">
              ¿Recordaste tu contraseña?{' '}
              <button type="button" className="ulink" onClick={() => router.push('/login')}>
                Volver a iniciar sesión
              </button>
            </div>
          </form>
        ) : (
          <div className="auth__sent">
            <div className="auth__sentMark"><Icon name="check" size={22} /></div>
            <h3>Enlace enviado.</h3>
            <p>
              Revisa la bandeja de{' '}
              <span style={{ fontFamily: 'var(--font-mono)' }}>{email}</span>.
              El enlace caduca en 15 minutos.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn--ghost" onClick={() => { setSent(false); setEmail(''); setSubmitted(false); }}>
                Enviar a otro email
              </button>
              <button className="btn btn--primary" onClick={() => router.push('/login')}>
                Ir al login
              </button>
            </div>
          </div>
        )}
      </AuthShell>
    </>
  );
}
