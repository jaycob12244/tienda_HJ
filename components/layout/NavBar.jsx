import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Icon, { Monogram } from '../ui/Icon';
import { useApp } from '../../context/AppContext';
import { NAV_LINKS } from '../../data/products';

export default function NavBar() {
  const app = useApp();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          <button className="nav__icon" aria-label="Cuenta" onClick={() => router.push('/login')}>
            <Icon name="user" size={18} />
          </button>
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
          {NAV_LINKS.map(l => (
            <button key={l.id} className="nav__mobile-link" onClick={() => handleNav(l.id)}>{l.label}</button>
          ))}
          <div className="nav__mobile-foot">
            <button className="btn btn--primary" onClick={() => { setMobileOpen(false); router.push('/tienda'); }}>Ver colección</button>
            <button className="btn btn--ghost" onClick={() => app.setCartOpen(true)}>Carrito ({app.cart.length})</button>
          </div>
        </div>
      )}
    </header>
  );
}
