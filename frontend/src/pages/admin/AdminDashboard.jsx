import { useEffect, useState } from "react";
import { getPhotos } from "../../api/photos";
import { getVideos } from "../../api/videos";
import { getFrames } from "../../api/frames";
import { getEnquiries } from "../../api/enquiries";
import Loader from "../../components/Loader";

export default function AdminDashboard() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [photos, videos, frames, enquiries] = await Promise.all([
          getPhotos(),
          getVideos(),
          getFrames(),
          getEnquiries(),
        ]);
        setCounts({
          photos: photos.data.data.length,
          videos: videos.data.data.length,
          frames: frames.data.data.length,
          enquiries: enquiries.data.data.length,
          newEnquiries: enquiries.data.data.filter((e) => e.status === "new").length,
        });
      } catch (err) {
        setCounts({ photos: 0, videos: 0, frames: 0, enquiries: 0, newEnquiries: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader label="Loading dashboard" />;

  const cards = [
    { label: "Total Photos", value: counts.photos },
    { label: "Total Videos & Reels", value: counts.videos },
    { label: "Total Photo Frames", value: counts.frames },
    { label: "Total Enquiries", value: counts.enquiries },
    { label: "New Enquiries", value: counts.newEnquiries },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-ivory mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="card p-6">
            <p className="text-3xl font-display text-gold">{c.value}</p>
            <p className="text-xs text-ivory/50 mt-2">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
