export default function TechCard({ number, title, text, accent = "text-black" }) {
  return (
    <article className="rounded-[2rem] border border-black/10 bg-black/[0.025] p-6 transition hover:-translate-y-1 hover:border-black/30">
      <div className="mb-10 flex items-center justify-between">
        <span className={`text-3xl ${accent}`}>◈</span>
        <span className="font-heading text-xs font-bold text-black/35">{number}</span>
      </div>
      <h3 className="font-heading text-xl font-bold text-black">{title}</h3>
      <p className="mt-3 leading-7 text-black/60">{text}</p>
    </article>
  );
}
