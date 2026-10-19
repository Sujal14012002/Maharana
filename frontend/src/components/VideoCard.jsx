import { useState } from "react";

export default function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="card group">
      <div className={`relative ${video.type === "reel" ? "aspect-[9/16]" : "aspect-video"} bg-charcoal-lighter`}>
        {playing ? (
          <video
            src={video.videoUrl}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <button
            className="relative h-full w-full flex items-center justify-center"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${video.title}`}
          >
            {video.thumbnailUrl ? (
              <img src={video.thumbnailUrl} alt={video.title} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <video src={video.videoUrl} className="h-full w-full object-cover" preload="metadata" muted playsInline />
            )}
            <span className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/10 transition-colors" />
            <span className="absolute h-14 w-14 rounded-full bg-gold/90 flex items-center justify-center text-charcoal text-xl">
              &#9658;
            </span>
          </button>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <p className="font-display text-base sm:text-lg text-ivory line-clamp-2">{video.title}</p>
        <p className="text-xs text-gold tracking-wide mt-1">{video.category} · {video.type === "reel" ? "Reel" : "Video"}</p>
      </div>
    </div>
  );
}
