import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import SectionTitle from "./SectionTitle";

const filters = ["Todos", "Running", "Training", "Trail", "Lifestyle", "Competition"];

export default function ProductCatalog({ products }) {
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "Todos") return products;
    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter, products]);

  return (
    <section id="catalogo" className="bg-white px-5 py-24 md:px-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <SectionTitle
            eyebrow="Shop System"
            title="Catálogo AURIX"
            text="Productos simulados desde JSON, tarjetas reutilizables y filtros visuales para explorar la colección."
          />
          <div className="flex flex-wrap gap-2 md:justify-end">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`rounded-lg border px-4 py-3 font-heading text-xs font-bold uppercase tracking-[0.14em] transition ${
                  activeFilter === filter
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-black/[0.03] text-black/60 hover:border-black hover:text-black"
                }`}
                type="button"
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
