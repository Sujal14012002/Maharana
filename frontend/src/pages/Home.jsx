import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStudio } from "../context/StudioContext";
import { getPhotos } from "../api/photos";
import { getVideos } from "../api/videos";
import PhotoCard from "../components/PhotoCard";
import VideoCard from "../components/VideoCard";
import Lightbox from "../components/Lightbox";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function Home() {
  const { studio, loading: studioLoading } = useStudio();
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [photoRes, videoRes] = await Promise.all([getPhotos(), getVideos()]);
        setPhotos(photoRes.data.data.filter((p) => p.featured).slice(0, 8));
        setVideos(videoRes.data.data.filter((v) => v.featured).slice(0, 3));
      } catch (err) {
        // fail silently on home; sections show empty state
      } finally {
        setMediaLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {studio?.heroImageUrl ? (
            <img src={studio.heroImageUrl} alt="Hero" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-royal-gradient" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40" />
        </div>

        <div className="relative section-wrapper !py-0 w-full">
          <div className="max-w-2xl animate-hero-in">
            <div className="gold-line mb-6" />
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-ivory leading-[1.05]">
              {studio?.heroHeadline || (studioLoading ? "" : `${studio?.studioName || "Maharana Pratap Studio"}`)}
            </h1>
            <p className="mt-6 text-ivory/70 text-base sm:text-lg max-w-lg leading-relaxed">
              {studio?.heroSubheadline ||
                "We Capture Love Stories! Specialists in Drone Pilot & Wedding Photography & Filming & Frames. Available Worldwide."}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/photos" className="btn-primary">View Our Work</Link>
              <Link to="/contact" className="btn-outline">Enquire Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PHOTOS */}
      <section className="section-wrapper">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-gold text-xs tracking-[0.3em] mb-3">PORTFOLIO</span>
          <h2 className="section-heading">Featured Photography</h2>
        </div>

        {mediaLoading ? (
          <Loader label="Loading photos" />
        ) : photos.length === 0 ? (
          <EmptyState title="Featured photos coming soon" subtitle="Check back shortly for our latest work." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {photos.map((p, i) => (
              <PhotoCard key={p._id} photo={p} onClick={() => setLightboxIndex(i)} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/photos" className="btn-outline">See Full Gallery</Link>
        </div>
      </section>

      {/* FEATURED VIDEOS */}
      <section className="section-wrapper bg-charcoal-light/40">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-gold text-xs tracking-[0.3em] mb-3">IN MOTION</span>
          <h2 className="section-heading">Cinematic Films & Reels</h2>
        </div>

        {mediaLoading ? (
          <Loader label="Loading videos" />
        ) : videos.length === 0 ? (
          <EmptyState title="Featured videos coming soon" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {videos.map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/videos" className="btn-outline">Watch More</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="section-wrapper">
        <div className="bg-royal-gradient rounded-lg px-8 py-16 md:py-20 text-center flex flex-col items-center">
          <h2 className="font-display text-3xl md:text-4xl text-ivory max-w-2xl">
            Let's create something timeless together.
          </h2>
          <p className="text-ivory/70 mt-4 max-w-lg">
            Share your event details with us and our team will get in touch within 24 hours.
          </p>
          <Link to="/contact" className="btn-primary mt-8">Start Your Enquiry</Link>
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
