import Link from "next/link";
import ProductVisual from "./ProductVisual";

export default function ProductCard({ product }) {
  return (
    <article className="group rounded-[2rem] border border-black/10 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-black/25 hover:shadow-xl">
      <ProductVisual product={product} />
      <div className="p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-black/45">
            {product.category}
          </span>
          <span className="text-sm text-black/45">★ {product.rating}</span>
        </div>
        <h3 className="font-heading text-2xl font-bold text-black">{product.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-black/60">{product.edition}</p>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <span className="block text-xs uppercase tracking-[0.12em] text-black/40">Desde</span>
            <strong className="font-heading text-2xl text-black">${product.price}</strong>
          </div>
          <Link
            className="rounded-full border border-black px-4 py-3 font-heading text-xs font-bold uppercase tracking-[0.14em] text-black transition group-hover:bg-black group-hover:text-white"
            href={`/productos/${product.slug}`}
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
