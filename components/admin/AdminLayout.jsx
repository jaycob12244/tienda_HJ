import Link from 'next/link';
import { useRouter } from 'next/router';
import { Monogram } from '../ui/Icon';
import Icon from '../ui/Icon';
import { useApp } from '../../context/AppContext';
import { logout } from '../../services/authService';

const NAV = [
  { href: '/admin/products', icon: 'diamond', label: 'Products' },
  { href: '/admin/orders',   icon: 'bag',     label: 'Orders'   },
];

export default function AdminLayout({ children }) {
  const { user } = useApp();
  const router   = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-sidebar__top">
          <Link href="/admin/products" className="adm-sidebar__brand">
            <Monogram size={18} />
            <span className="mono">AURIX</span>
            <span className="adm-sidebar__badge eyebrow">Admin</span>
          </Link>

          <nav className="adm-nav">
            {NAV.map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`adm-nav__link${router.pathname === href ? ' is-active' : ''}`}
              >
                <Icon name={icon} size={15} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="adm-sidebar__foot">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="adm-nav__link adm-nav__link--sm"
          >
            <Icon name="arrow-up-right" size={13} />
            <span>Ver tienda</span>
          </a>
          <div className="adm-sidebar__user mono">{user?.email}</div>
          <button
            className="adm-nav__link adm-nav__link--sm adm-nav__link--danger"
            onClick={handleLogout}
          >
            <Icon name="close" size={13} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="adm-main">
        {children}
      </main>
    </div>
  );
}
