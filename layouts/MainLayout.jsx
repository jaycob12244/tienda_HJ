import Head from 'next/head';
import NavBar  from '../components/layout/NavBar';
import Footer  from '../components/layout/Footer';
import CartDrawer    from '../components/cart/CartDrawer';
import SearchOverlay from '../components/cart/SearchOverlay';

/**
 * Layout principal reutilizable.
 * Incluye NavBar, Footer, CartDrawer y SearchOverlay.
 */
export default function MainLayout({ title = 'AURIX', children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="app-shell">
        <NavBar />
        <main>{children}</main>
        <Footer />
      </div>
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
