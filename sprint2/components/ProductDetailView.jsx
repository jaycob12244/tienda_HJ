import Link from "next/link";
import ProductCard from "./ProductCard";
import ProductVisual from "./ProductVisual";

export default function ProductDetailView({ product, relatedProducts }) {
  return (
    <>
      <section className="bg-white px-5 pb-20 pt-32 md:px-16">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Link className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-black/50" href="/#catalogo">
              ← Volver al catálogo
            </Link>
            <div className="mt-8">
              <ProductVisual product={product} compact={false} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-black/[0.025] p-6 md:p-8">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-black/45">{product.category}</p>
            <h1 className="mt-3 font-heading text-4xl font-black leading-tight text-black md:text-6xl">{product.name}</h1>
            <p className="mt-4 text-lg leading-8 text-black/60">{product.description}</p>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["Precio", `$${product.price}`],
                ["Peso", product.weight],
                ["Drop", product.drop],
                ["Stock", product.stock],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-black/10 bg-white p-4">
                  <span className="block text-xs uppercase tracking-[0.12em] text-black/40">{label}</span>
                  <strong className="mt-2 block font-heading text-xl text-black">{value}</strong>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <span className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-black/50">Tallas disponibles</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} className="h-11 min-w-12 rounded-full border border-black/10 bg-white text-sm text-black transition hover:border-black" type="button">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-2">
              <button className="rounded-full border border-black bg-black px-6 py-4 font-heading text-xs font-bold uppercase tracking-[0.14em] text-white" type="button">
                Añadir al carrito
              </button>
              <button className="rounded-full border border-black/10 bg-white px-6 py-4 font-heading text-xs font-bold uppercase tracking-[0.14em] text-black" type="button">
                Guardar diseño
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:px-16">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-black/45">Related Products</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-black md:text-5xl">Productos relacionados</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
