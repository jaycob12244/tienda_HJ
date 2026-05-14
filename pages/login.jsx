import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthShell from '../components/auth/AuthShell';
import FloatField from '../components/auth/FloatField';
import Icon from '../components/ui/Icon';
import { login } from '../services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email,      setEmail]      = useState('');
  const [pwd,        setPwd]        = useState('');
  const [remember,   setRemember]   = useState(true);
  const [loading,    setLoading]    = useState(false);
  const [serverErr,  setServerErr]  = useState(null);
  const [submitted,  setSubmitted]  = useState(false);
  const [needVerify, setNeedVerify] = useState(false);

  const emailError = submitted && !email.includes('@') ? 'Email inválido' : null;
  const pwdError   = submitted && pwd.length < 6 ? 'Mínimo 6 caracteres' : null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerErr(null);
    if (!email.includes('@') || pwd.length < 6) return;

    setLoading(true);
    try {
      await login(email, pwd);
      router.push('/');
    } catch (err) {
      if (err.message?.toLowerCase().includes('email not confirmed')) {
        setNeedVerify(true);
      } else {
        setServerErr('Email o contraseña incorrectos.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (needVerify) return (
    <>
      <Head><title>Verifica tu email — AURIX</title></Head>
      <AuthShell view="login">
        <div className="auth__sent">
          <div className="auth__sentMark"><Icon name="check" size={22} /></div>
          <h3>Verifica tu email.</h3>
          <p>Revisa la bandeja de <span style={{ fontFamily: 'var(--font-mono)' }}>{email}</span> y haz clic en el enlace de confirmación.</p>
          <button className="btn btn--primary" onClick={() => setNeedVerify(false)}>
            Intentar de nuevo
          </button>
        </div>
      </AuthShell>
    </>
  );

  return (
    <>
      <Head><title>Iniciar sesión — AURIX</title></Head>
      <AuthShell view="login">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Bienvenida de vuelta</div>
          <h1 className="auth__title">Iniciar sesión<span className="auth__dot">.</span></h1>
          <p className="auth__sub">Accede a tu archivo, pedidos y drops privados.</p>
        </div>

        <form onSubmit={onSubmit} className="auth__form">
          <FloatField label="Email" type="email" value={email} onChange={setEmail} error={emailError} autoComplete="email" />
          <FloatField label="Contraseña" type="password" value={pwd} onChange={setPwd} error={pwdError} autoComplete="current-password" />

          {serverErr && (
            <div className="auth__serverErr">
              <Icon name="close" size={11} /> {serverErr}
            </div>
          )}

          <div className="auth__row">
            <label className="auth__check">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <span className="auth__checkbox"><Icon name="check" size={11} /></span>
              <span>Recordarme</span>
            </label>
            <button type="button" className="ulink" onClick={() => router.push('/recover')}>
              ¿Olvidaste la contraseña?
            </button>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--lg btn--icon"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Entrar al sistema'}
            {!loading && <span className="btn__icon"><Icon name="arrow-right" size={14} /></span>}
          </button>

          <div className="auth__foot">
            ¿No tienes cuenta?{' '}
            <button type="button" className="ulink" onClick={() => router.push('/register')}>Crear una</button>
          </div>
        </form>
      </AuthShell>
    </>
  );
}
