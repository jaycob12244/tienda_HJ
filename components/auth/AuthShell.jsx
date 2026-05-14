import { useRouter } from 'next/router';
import Icon from '../ui/Icon';
import { Monogram } from '../ui/Icon';
import AuthMedia from './AuthMedia';

export default function AuthShell({ children, view }) {
  const router = useRouter();

  const mediaProps = {
    login: {
      tag: 'MIEMBROS · ENTRADA',
      title: 'Vuelve a entrar al sistema.',
      sub: 'Las puertas privadas, drops anticipados y tu archivo personal te esperan dentro.',
    },
    register: {
      tag: 'MIEMBROS · NUEVO',
      title: 'Crea tu identidad AURIX.',
      sub: 'Una cuenta abre acceso a drops privados, soporte humano y el archivo completo de la marca.',
    },
    recover: {
      tag: 'RECUPERAR · ACCESO',
      title: 'Restaura tu acceso.',
      sub: 'Te enviaremos un enlace de un solo uso. Sin contraseñas temporales, sin fricción.',
    },
  }[view] || {};

  return (
    <div className="auth">
      <div className="container container--wide auth__inner">
        <div className="auth__panel">
          <div className="auth__head">
            <button className="auth__brand" onClick={() => router.push('/')}>
              <span className="auth__mark"><Monogram size={20} /></span>
              <span className="auth__word">AURIX</span>
            </button>
            <button className="ulink" onClick={() => router.push('/')}>
              <Icon name="arrow-right" size={14} style={{ transform: 'rotate(180deg)' }} /> Volver
            </button>
          </div>

          <div className="auth__tabs">
            <button className={`auth__tab${view === 'login' ? ' is-on' : ''}`} onClick={() => router.push('/login')}>
              Iniciar sesión
            </button>
            <button className={`auth__tab${view === 'register' ? ' is-on' : ''}`} onClick={() => router.push('/register')}>
              Crear cuenta
            </button>
          </div>

          <div className="auth__body">{children}</div>
        </div>

        <AuthMedia {...mediaProps} />
      </div>
    </div>
  );
}
