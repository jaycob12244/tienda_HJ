export default function Hero() {
  return (
    <section id="inicio" className="relative grid min-h-screen place-items-center overflow-hidden bg-white px-5 pb-12 pt-32 text-center md:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_48%,rgba(0,0,0,0.08),transparent_34%)]" />
      <div className="relative z-10 mx-auto w-full max-w-[1180px]">
        <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-black/45">AURIX Performance Store</p>
        <h1 className="mx-auto mt-4 max-w-6xl font-heading text-6xl font-black leading-none tracking-[-0.06em] text-black md:text-8xl">
          Footwear for the next step
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-black/60 md:text-2xl">
          Una tienda futurista de zapatos con estética limpia, catálogo dinámico y secuencia visual controlada por scroll.
        </p>

        <div className="mx-auto mt-10 flex max-w-xl flex-col justify-center gap-3 sm:flex-row">
          <a className="rounded-full border border-black bg-black px-8 py-4 font-heading text-sm font-bold text-white transition hover:bg-white hover:text-black" href="#catalogo">
            Explorar tienda
          </a>
          <a className="rounded-full border border-black/10 bg-black/[0.03] px-8 py-4 font-heading text-sm font-bold text-black transition hover:border-black" href="#showcase">
            Ver animación
          </a>
        </div>
      </div>
    </section>
  );
}
