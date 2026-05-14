import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthShell from '../components/auth/AuthShell';
import FloatField from '../components/auth/FloatField';
import Icon from '../components/ui/Icon';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [remember, setRemember] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const emailError = submitted && !email.includes('@') ? 'Email inválido' : null;
  const pwdError = submitted && pwd.length < 6 ? 'Mínimo 6 caracteres' : null;

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
          <button type="button" className="auth__google">
            <Icon name="google" size={18} stroke={0} />
            <span>Continuar con Google</span>
          </button>

          <div className="auth__divider"><span>o con email</span></div>

          <FloatField label="Email" type="email" value={email} onChange={setEmail} error={emailError} autoComplete="email" />
          <FloatField label="Contraseña" type="password" value={pwd} onChange={setPwd} error={pwdError} autoComplete="current-password" />

          <div className="auth__row">
            <label className="auth__check">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <span className="auth__checkbox"><Icon name="check" size={11} /></span>
              <span>Recordarme</span>
            </label>
            <button type="button" className="ulink" onClick={() => router.push('/recover')}>¿Olvidaste la contraseña?</button>
          </div>

          <button type="submit" className="btn btn--primary btn--lg btn--icon" style={{ width: '100%' }}>
            Entrar al sistema
            <span className="btn__icon"><Icon name="arrow-right" size={14} /></span>
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
