import { useState } from "react";

const navItems = [
  { label: "Technology", href: "/#tecnologia" },
  { label: "Tienda", href: "/#catalogo" },
  { label: "Performance", href: "/#performance" },
  { label: "Custom", href: "/#custom" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/75 px-5 backdrop-blur-2xl md:px-16">
      <div className="mx-auto grid h-20 max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-5">
        <button
          className="grid h-10 w-10 place-items-center md:hidden"
          type="button"
          aria-label="Abrir menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          <span className="block h-px w-5 bg-black before:relative before:top-[-7px] before:block before:h-px before:w-5 before:bg-black after:relative after:top-[6px] after:block after:h-px after:w-5 after:bg-black" />
        </button>

        <a className="font-heading text-2xl font-black tracking-tight text-black" href="/#inicio">
          AURIX
        </a>

        <nav
          className={`absolute left-0 right-0 top-20 grid gap-1 border-b border-black/10 bg-white/95 p-5 font-heading text-xs font-bold uppercase tracking-[0.18em] text-black/55 transition-transform md:static md:flex md:translate-y-0 md:justify-center md:gap-14 md:border-0 md:bg-transparent md:p-0 ${
            isOpen ? "translate-y-0" : "-translate-y-[130%]"
          }`}
          aria-label="Navegacion principal"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              className="rounded px-3 py-3 transition hover:bg-black/5 hover:text-black md:py-2"
              href={item.href}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            className="hidden rounded-full border border-black bg-black px-5 py-3 font-heading text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black md:inline-flex"
            href="/#custom"
          >
            Reservar
          </a>
          <button className="relative h-10 w-10 text-black/60 transition hover:text-black" type="button" aria-label="Carrito">
            □
            <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-black px-1 text-xs font-bold text-white">
              0
            </span>
          </button>
          <button className="h-10 w-10 text-black/60 transition hover:text-black" type="button" aria-label="Perfil">
            ○
          </button>
        </div>
      </div>
    </header>
  );
}
