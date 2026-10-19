export default function FrameCard({ frame }) {
  return (
    <div className="card group">
      <div className="aspect-square overflow-hidden bg-charcoal-lighter">
        <img
          src={frame.imageUrl}
          alt={frame.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-lg text-ivory">{frame.title}</p>
          <p className="text-xs text-gold tracking-wide mt-1">{frame.category}</p>
          {frame.description && <p className="text-xs text-ivory/50 mt-2">{frame.description}</p>}
        </div>
        {frame.price && <span className="text-ivory/80 text-sm whitespace-nowrap">{frame.price}</span>}
      </div>
    </div>
  );
}
