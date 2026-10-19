import { useEffect, useState } from "react";
import { getPhotos, getPhotoCategories } from "../api/photos";
import PhotoCard from "../components/PhotoCard";
import CategoryFilter from "../components/CategoryFilter";
import Lightbox from "../components/Lightbox";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const loadPhotos = async (category) => {
    try {
      setLoading(true);
      setError(false);
      const res = await getPhotos(category);
      setPhotos(res.data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPhotoCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => setCategories([]));
    loadPhotos("All");
  }, []);

  const handleFilter = (cat) => {
    setActive(cat);
    loadPhotos(cat);
  };

  return (
    <div className="pt-32 pb-10">
      <div className="section-wrapper !py-0">
        <div className="text-center mb-10">
          <span className="text-gold text-xs tracking-[0.3em] mb-3 block">GALLERY</span>
          <h1 className="section-heading">Our Photography</h1>
          <p className="text-ivory/50 mt-4 max-w-xl mx-auto">
            A curated collection of moments captured across weddings, portraits, events and more.
          </p>
        </div>

        <div className="mb-12">
          <CategoryFilter categories={categories} active={active} onChange={handleFilter} />
        </div>

        {loading ? (
          <Loader label="Loading gallery" />
        ) : error ? (
          <ErrorState message="Could not load photos." onRetry={() => loadPhotos(active)} />
        ) : photos.length === 0 ? (
          <EmptyState title="No photos in this category yet" subtitle="Try selecting a different category." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 pb-10">
            {photos.map((p, i) => (
              <PhotoCard key={p._id} photo={p} onClick={() => setLightboxIndex(i)} />
            ))}
          </div>
        )}
      </div>

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
