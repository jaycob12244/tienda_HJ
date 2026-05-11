import Hero from "../components/Hero";
import ProductCatalog from "../components/ProductCatalog";
import ScrollShoeSequence from "../components/ScrollShoeSequence";
import SectionTitle from "../components/SectionTitle";
import TechCard from "../components/TechCard";
import products from "../data/products.json";
import MainLayout from "../layouts/MainLayout";

const techItems = [
  {
    number: "01",
    title: "Aero-Weave Shell",
    text: "Malla monofilamento que reduce resistencia, regula temperatura y mantiene estructura sin peso extra.",
    accent: "text-black",
  },
  {
    number: "02",
    title: "Kinetic Core Midsole",
    text: "Compuesto infusionado con nitrógeno y placa de carbono para transferencia de energía casi inmediata.",
    accent: "text-black",
  },
  {
    number: "03",
    title: "Adaptive Traction",
    text: "Patrón de agarre con microcanales que ajusta contacto y estabilidad en superficies urbanas.",
    accent: "text-black",
  },
];

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <ScrollShoeSequence />

      <ProductCatalog products={products} />

      <section id="tecnologia" className="bg-white px-5 py-24 md:px-16">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle eyebrow="Proprietary Tech" title="Ingeniería que se siente viva." />
          <div className="grid gap-4 md:grid-cols-3">
            {techItems.map((item) => (
              <TechCard key={item.number} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section id="performance" className="bg-black px-5 py-24 text-white md:px-16">
        <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-[0.8fr_1fr] md:items-center">
          <SectionTitle
            eyebrow="360° Analysis"
            title="Explora la arquitectura estructural."
            text="La base del proyecto ya separa componentes, layout y página principal para escalar el sitio por sprints."
            inverted
          />
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-2xl">
            <div className="grid gap-4 text-sm text-white/60 md:grid-cols-3">
              <div>
                <strong className="block font-heading text-3xl text-white">110</strong>
                Frames de scroll
              </div>
              <div>
                <strong className="block font-heading text-3xl text-white">0</strong>
                Modelos 3D requeridos
              </div>
              <div>
                <strong className="block font-heading text-3xl text-white">React</strong>
                Componentes reutilizables
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modelos" className="bg-white px-5 py-24 md:px-16">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle
            eyebrow="Store Flow"
            title="Una tienda conectada desde la landing."
            text="El catálogo, el detalle y los productos relacionados ya están conectados para que el usuario pueda pasar de explorar a elegir."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["01", "Listado dinámico", "Los productos vienen desde un JSON simulado."],
              ["02", "Filtros visuales", "La tienda permite segmentar por categoría."],
              ["03", "Detalle conectado", "Cada tarjeta navega a una página de producto."],
            ].map(([number, title, text]) => (
              <article key={number} className="rounded-[2rem] border border-black/10 bg-black/[0.025] p-6">
                <span className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-black/40">{number}</span>
                <h3 className="mt-12 font-heading text-2xl font-bold text-black">{title}</h3>
                <p className="mt-3 text-black/60">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="custom" className="bg-white px-5 py-24 md:px-16">
        <div className="mx-auto max-w-[1440px] rounded-[2rem] border border-black/10 bg-black/[0.025] p-8">
          <SectionTitle
            eyebrow="Configure"
            title="Personaliza tu AURIX."
            text="Sprint 2 deja lista la experiencia visual de tienda para agregar carrito, checkout y persistencia en los siguientes sprints."
          />
          <div className="grid gap-4 md:grid-cols-3">
            <button className="rounded-full border border-black/10 bg-white p-4 text-left font-heading text-sm uppercase tracking-[0.12em] text-black" type="button">
              Chassis Color
            </button>
            <button className="rounded-full border border-black/10 bg-white p-4 text-left font-heading text-sm uppercase tracking-[0.12em] text-black" type="button">
              Calibration Sole
            </button>
            <button className="rounded-full border border-black bg-black p-4 text-left font-heading text-sm uppercase tracking-[0.12em] text-white" type="button">
              Añadir al carrito
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
