export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-black/10 bg-white px-5 py-14 md:px-16">
      <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-[1fr_auto]">
        <div>
          <strong className="font-heading text-2xl font-black text-black">AURIX</strong>
          <p className="mt-5 max-w-md text-sm leading-7 text-black/50">
            © 2026 AURIX TELEMETRY. ENGINEERED FOR PRECISION.
          </p>
        </div>
        <nav className="grid gap-4 text-sm text-black/55" aria-label="Enlaces secundarios">
          <a className="transition hover:text-black" href="#tecnologia">
            Sustainability
          </a>
          <a className="transition hover:text-black" href="#performance">
            Technical Specs
          </a>
          <a className="transition hover:text-black" href="#inicio">
            Privacy Policy
          </a>
          <a className="transition hover:text-black" href="#custom">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
