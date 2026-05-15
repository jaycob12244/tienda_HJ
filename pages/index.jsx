import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import ScrollProgress from '../components/ui/ScrollProgress';
import Reveal         from '../components/ui/Reveal';

import NavBar    from '../components/layout/NavBar';
import Footer    from '../components/layout/Footer';

import Hero             from '../components/home/Hero';
import Marquee          from '../components/home/Marquee';
import Categories       from '../components/home/Categories';
import Technology       from '../components/home/Technology';
import Benefits         from '../components/home/Benefits';
import Newsletter       from '../components/home/Newsletter';

import CartDrawer     from '../components/cart/CartDrawer';
import SearchOverlay  from '../components/cart/SearchOverlay';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (router.query.scroll === 'technology') {
      const t = setTimeout(() => {
        const el = document.getElementById('technology');
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      }, 350);
      return () => clearTimeout(t);
    }
  }, [router.query.scroll]);

  const scrollToShop = () => {
    const el = document.getElementById('shop');
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>AURIX — Sneakers de alta ingeniería</title>
      </Head>

      <ScrollProgress />

      <div className="app-shell">
        <NavBar />

        <main>
          <Hero onShop={scrollToShop} />

          {/* Wrapper keeps body's dark canvas from bleeding through Reveal opacity:0 states */}
          <div style={{ background: 'var(--paper)' }}>
            <Reveal variant="fade" duration={800}>
              <Marquee />
            </Reveal>

            <Reveal variant="rise">
              <Categories />
            </Reveal>

            <Reveal variant="rise" id="technology">
              <Technology />
            </Reveal>

            <Reveal variant="fade">
              <Benefits />
            </Reveal>

            <Reveal variant="rise">
              <Newsletter />
            </Reveal>

            <Reveal variant="fade">
              <Footer />
            </Reveal>
          </div>
        </main>
      </div>

      {/* Overlays */}
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
