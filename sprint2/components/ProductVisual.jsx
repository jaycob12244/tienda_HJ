export default function ProductVisual({ product, compact = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.5rem] border border-black/10 bg-white ${
        compact ? "h-44" : "h-64"
      }`}
      style={{
        background:
          "radial-gradient(circle at 50% 58%, rgba(0,0,0,.10), transparent 42%), linear-gradient(145deg, rgba(0,0,0,.055), rgba(0,0,0,.015))",
      }}
    >
      <div className="absolute inset-x-10 bottom-9 h-2 rounded-full bg-black/20 blur-md" />
      <div
        className="absolute left-1/2 top-1/2 h-20 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[55%_45%_42%_58%] border border-black/15 bg-black/10 shadow-2xl backdrop-blur-md"
      />
      <div
        className="absolute left-[24%] top-[39%] h-20 w-24 -rotate-12 rounded-tl-[70%] rounded-tr-[40%] border-l border-t border-black/20 bg-white/45"
      />
      <div className="absolute left-[43%] top-[39%] grid grid-cols-4 gap-1">
        {[0, 1, 2, 3].map((item) => (
          <span key={item} className="h-1 w-8 rotate-[-18deg] rounded-full bg-black/25" />
        ))}
      </div>
      <div className="absolute bottom-[28%] left-[17%] h-7 w-[68%] rounded-full border-t border-black/20 bg-black/75" />
      <span className="absolute right-4 top-4 rounded-full border border-black/10 bg-white px-3 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-black">
        {product.badge}
      </span>
    </div>
  );
}
