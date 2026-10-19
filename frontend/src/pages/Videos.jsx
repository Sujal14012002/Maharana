import { useEffect, useState } from "react";
import { getVideos } from "../api/videos";
import VideoCard from "../components/VideoCard";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

const typeTabs = [
  { key: "All", label: "All" },
  { key: "video", label: "Films" },
  { key: "reel", label: "Reels" },
];

const filmGrid = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6";
const reelGrid = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [type, setType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async (t) => {
    try {
      setLoading(true);
      setError(false);
      const res = await getVideos(t !== "All" ? { type: t } : {});
      setVideos(res.data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("All");
  }, []);

  const handleTab = (t) => {
    setType(t);
    load(t);
  };

  const films = videos.filter((v) => v.type !== "reel");
  const reels = videos.filter((v) => v.type === "reel");

  return (
    <div className="page-wrapper">
      <div className="text-center mb-10">
        <span className="text-gold text-xs tracking-[0.3em] mb-3 block">IN MOTION</span>
        <h1 className="section-heading">Videos &amp; Reels</h1>
        <p className="text-ivory/50 mt-4 max-w-xl mx-auto">
          Cinematic wedding films and short-form reels that bring your story to life.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-12">
        {typeTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTab(t.key)}
            className={`px-5 py-2 text-sm tracking-wide rounded-sm border transition-colors ${
              type === t.key ? "bg-gold text-charcoal border-gold" : "border-white/15 text-ivory/70 hover:border-gold hover:text-gold"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading videos" />
      ) : error ? (
        <ErrorState message="Could not load videos." onRetry={() => load(type)} />
      ) : videos.length === 0 ? (
        <EmptyState title="No videos here yet" subtitle="New films and reels are added regularly." />
      ) : (
        <div className="space-y-14">
          {films.length > 0 && (
            <section>
              {type === "All" && reels.length > 0 && (
                <h2 className="font-display text-2xl text-ivory mb-5">Films</h2>
              )}
              <div className={filmGrid}>
                {films.map((v) => (
                  <VideoCard key={v._id} video={v} />
                ))}
              </div>
            </section>
          )}

          {reels.length > 0 && (
            <section>
              {type === "All" && films.length > 0 && (
                <h2 className="font-display text-2xl text-ivory mb-5">Reels</h2>
              )}
              <div className={reelGrid}>
                {reels.map((v) => (
                  <VideoCard key={v._id} video={v} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
