export default function PhotoCard({ photo, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick && onClick(photo)}
      className="group relative overflow-hidden rounded-md bg-charcoal-lighter aspect-[4/5] w-full text-left cursor-pointer"
    >
      <img
        src={photo?.imageUrl}
        alt={photo?.title || "Studio Photo"}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/0 to-charcoal/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <p className="font-display text-lg text-ivory">{photo?.title}</p>
        <p className="text-xs text-gold tracking-wide">{photo?.category}</p>
      </div>
    </button>
  );
}
