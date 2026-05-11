export default function SectionTitle({ eyebrow, title, text, inverted = false }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className={`font-heading text-xs font-bold uppercase tracking-[0.18em] ${inverted ? "text-white/45" : "text-black/45"}`}>{eyebrow}</p>
      <h2 className={`mt-3 font-heading text-3xl font-bold leading-tight md:text-5xl ${inverted ? "text-white" : "text-black"}`}>{title}</h2>
      {text ? <p className={`mt-4 md:text-lg ${inverted ? "text-white/60" : "text-black/60"}`}>{text}</p> : null}
    </div>
  );
}
