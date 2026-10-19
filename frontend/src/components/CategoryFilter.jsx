export default function CategoryFilter({ categories, active, onChange }) {
  const all = ["All", ...categories];
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {all.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2 text-sm tracking-wide rounded-sm border transition-colors duration-200 ${
            active === cat
              ? "bg-gold text-charcoal border-gold"
              : "border-white/15 text-ivory/70 hover:border-gold hover:text-gold"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
