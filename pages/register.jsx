import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthShell from '../components/auth/AuthShell';
import FloatField from '../components/auth/FloatField';
import { PwdMeter, scorePwd } from '../components/auth/PwdMeter';
import Icon from '../components/ui/Icon';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nameError = submitted && name.length < 2 ? 'Indica tu nombre' : null;
  const emailError = submitted && !email.includes('@') ? 'Email inválido' : null;
  const pwdScore = scorePwd(pwd);
  const pwdError = submitted && pwd.length < 8 ? 'Mínimo 8 caracteres' : null;
  const termsError = submitted && !terms ? 'Acepta los términos para continuar' : null;

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Head><title>Crear cuenta — AURIX</title></Head>
      <AuthShell view="register">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Únete a AURIX</div>
          <h1 className="auth__title">Crear cuenta<span className="auth__dot">.</span></h1>
          <p className="auth__sub">Drops privados, soporte humano y archivo completo.</p>
        </div>

        <form onSubmit={onSubmit} className="auth__form">
          <button type="button" className="auth__google">
            <Icon name="google" size={18} stroke={0} />
            <span>Continuar con Google</span>
          </button>

          <div className="auth__divider"><span>o con email</span></div>

          <div className="auth__split">
            <FloatField label="Nombre" value={name} onChange={setName} error={nameError} autoComplete="given-name" />
            <FloatField label="Email" type="email" value={email} onChange={setEmail} error={emailError} autoComplete="email" />
          </div>

          <FloatField
            label="Contraseña"
            type="password"
            value={pwd}
            onChange={setPwd}
            error={pwdError}
            hint={pwd ? <PwdMeter score={pwdScore} /> : '8+ caracteres, una mayúscula y un número.'}
            autoComplete="new-password"
          />

          <label className="auth__terms">
            <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />
            <span className={`auth__checkbox${termsError ? ' is-error' : ''}`}><Icon name="check" size={11} /></span>
            <span>
              Acepto los <a className="ulink" href="#">Términos</a> y la <a className="ulink" href="#">Política de privacidad</a>.
            </span>
          </label>
          {termsError && (
            <div className="auth__termsErr"><Icon name="close" size={11} /> {termsError}</div>
          )}

          <button type="submit" className="btn btn--primary btn--lg btn--icon" style={{ width: '100%' }}>
            Crear cuenta AURIX
            <span className="btn__icon"><Icon name="arrow-right" size={14} /></span>
          </button>

          <div className="auth__foot">
            ¿Ya estás dentro?{' '}
            <button type="button" className="ulink" onClick={() => router.push('/login')}>Iniciar sesión</button>
          </div>
        </form>
      </AuthShell>
    </>
  );
}
