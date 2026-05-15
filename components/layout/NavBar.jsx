import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Icon, { Monogram } from '../ui/Icon';
import { useApp } from '../../context/AppContext';
import { NAV_LINKS } from '../../data/products';
import ProfileDropdown from '../ui/ProfileDropdown';

export default function NavBar() {
  const app = useApp();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileTriggerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar dropdown al navegar a otra ruta
  useEffect(() => {
    const handleRouteChange = () => setProfileOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  // Cerrar dropdown al cerrar sesión
  useEffect(() => {
    if (!app.user) setProfileOpen(false);
  }, [app.user]);

  const handleNav = (id) => {
    setMobileOpen(false);
    if (id === 'shop') {
      router.push('/tienda');
    } else if (id === 'performance') {
      router.push('/performance');
    } else if (id === 'technology') {
      if (router.pathname === '/') {
        const el = document.getElementById('technology');
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      } else {
        router.push('/?scroll=technology');
      }
    }
  };

  const handleProfileClick = useCallback(() => {
    if (app.user) {
      setProfileOpen(open => !open);
    } else {
      router.push('/login');
    }
  }, [app.user, router]);

  // Callback estable para pasar a ProfileDropdown como onClose
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  return (
    <header className={`nav${scrolled ? ' is-solid' : ''}`}>
      <div className="nav__inner container container--wide">
        {/* Brand */}
        <button className="nav__brand" onClick={() => router.push('/')} aria-label="AURIX home">
          <span className="nav__mark"><Monogram size={20} /></span>
          <span>AURIX</span>
        </button>

        {/* Desktop links */}
        <nav className="nav__links">
          {NAV_LINKS.map(l => (
            <button key={l.id} className="nav__link" onClick={() => handleNav(l.id)}>{l.label}</button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="nav__right">
          <button className="nav__icon" aria-label="Buscar" onClick={() => app.setSearchOpen(true)}>
            <Icon name="search" size={18} />
          </button>
          <button className="nav__icon" aria-label="Favoritos" style={{ position: 'relative' }} onClick={() => router.push('/favoritos')}>
            <Icon name="heart" size={18} />
            {app.favorites.size > 0 && (
              <span className="nav__badge">{app.favorites.size}</span>
            )}
          </button>

          {/* Perfil: wrapper relativo para posicionar el dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              ref={profileTriggerRef}
              className="nav__icon"
              aria-label="Cuenta"
              {...(app.user ? { 'aria-expanded': profileOpen } : {})}
              onClick={handleProfileClick}
            >
              <Icon name="user" size={18} />
            </button>
            {profileOpen && app.user && (
              <ProfileDropdown
                user={app.user}
                favoritesCount={app.favorites.size}
                onClose={closeProfile}
                triggerRef={profileTriggerRef}
              />
            )}
          </div>

          <button className="nav__bag" onClick={() => app.setCartOpen(true)} aria-label="Carrito">
            <Icon name="bag" size={18} />
            <span className="nav__bag-count">{app.cart.length}</span>
          </button>
          <button className="nav__cta btn btn--sm" onClick={() => router.push('/tienda')}>
            Ver colección
          </button>
          <button className="nav__burger" onClick={() => setMobileOpen(o => !o)} aria-label="Menú">
            <Icon name={mobileOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="nav__mobile">
          <div className="nav__mobile-inner">
            {NAV_LINKS.map(l => (
              <button key={l.id} className="nav__mobile-link" onClick={() => handleNav(l.id)}>{l.label}</button>
            ))}
            <button
              className="nav__mobile-link"
              onClick={() => { setMobileOpen(false); router.push(app.user ? '/favoritos' : '/login'); }}
            >
              {app.user ? 'Mi cuenta' : 'Iniciar sesión'}
            </button>
            <div className="nav__mobile-foot">
              <button className="btn btn--primary" onClick={() => { setMobileOpen(false); router.push('/tienda'); }}>Ver colección</button>
              <button className="btn btn--ghost" onClick={() => app.setCartOpen(true)}>Carrito ({app.cart.length})</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
