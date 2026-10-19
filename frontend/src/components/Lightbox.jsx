import { useEffect, useCallback } from "react";

export default function Lightbox({ photos, index, onClose, onNavigate }) {
  const photo = photos[index];

  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + photos.length) % photos.length);
    },
    [index, photos.length, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-charcoal/97 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-ivory/70 hover:text-gold text-3xl leading-none"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>

      <button
        className="absolute left-3 md:left-8 text-ivory/60 hover:text-gold text-4xl px-2"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + photos.length) % photos.length);
        }}
        aria-label="Previous"
      >
        &#8249;
      </button>

      <div
        className="max-w-4xl w-full flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="max-h-[75vh] w-auto object-contain rounded-sm shadow-2xl"
        />
        <div className="text-center">
          <p className="font-display text-xl text-ivory">{photo.title}</p>
          <p className="text-gold text-xs tracking-widest mt-1">{photo.category}</p>
        </div>
      </div>

      <button
        className="absolute right-3 md:right-8 text-ivory/60 hover:text-gold text-4xl px-2"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % photos.length);
        }}
        aria-label="Next"
      >
        &#8250;
      </button>
    </div>
  );
}
