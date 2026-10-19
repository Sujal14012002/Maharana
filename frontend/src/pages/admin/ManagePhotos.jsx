import { useEffect, useState } from "react";
import { getPhotos, createPhoto, updatePhoto, deletePhoto } from "../../api/photos";
import { compressImage, formatSize } from "../../utils/compressImage";
import Loader from "../../components/Loader";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";

const emptyForm = { title: "", category: "", description: "", featured: false, order: 0 };

export default function ManagePhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [fileKey, setFileKey] = useState(0);
  const [progress, setProgress] = useState(0);

  const load = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await getPhotos();
      setPhotos(res.data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
    setEditingId(null);
    setFormError("");
    setFileKey((k) => k + 1);
    setProgress(0);
  };

  const startEdit = (photo) => {
    setEditingId(photo._id);
    setForm({
      title: photo.title,
      category: photo.category,
      description: photo.description || "",
      featured: photo.featured,
      order: photo.order || 0,
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onProgress = (e) => setProgress(Math.round((e.loaded * 100) / (e.total || 1)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || (!editingId && !file)) {
      setFormError("Title, category and an image (for new photos) are required.");
      return;
    }
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) {
      setFormError("");
      const ready = await compressImage(file);
      if (ready.size > 10 * 1024 * 1024) {
        setFormError(`Image is ${formatSize(ready.size)}. Maximum allowed is 10 MB.`);
        return;
      }
      data.append("image", ready);
    }

    try {
      setSaving(true);
      setFormError("");
      if (editingId) {
        await updatePhoto(editingId, data, onProgress);
      } else {
        await createPhoto(data, onProgress);
      }
      resetForm();
      await load();
    } catch (err) {
      setFormError(err.response?.data?.message || (err.code === "ERR_NETWORK" ? "Network problem — check internet / server and try again." : null) || "Could not save photo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo permanently?")) return;
    try {
      await deletePhoto(id);
      await load();
    } catch (err) {
      alert("Could not delete photo.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ivory mb-8">Manage Photos</h1>

      <form onSubmit={handleSubmit} className="card p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="input-field"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="Category (e.g. Wedding, Portrait)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <textarea
          className="input-field md:col-span-2"
          placeholder="Description (optional)"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          key={fileKey}
          type="file"
          accept="image/*"
          onChange={(e) => { setFile(e.target.files[0] || null); setFormError(""); }}
          className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-gold file:text-charcoal file:cursor-pointer"
        />
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-ivory/70">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured on Home
          </label>
          <input
            type="number"
            className="input-field w-28"
            placeholder="Order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />
        </div>

        {formError && <p className="text-maroon-light text-sm md:col-span-2">{formError}</p>}

        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? (progress > 0 && progress < 100 ? `Uploading ${progress}%` : progress === 100 ? "Processing..." : "Saving...") : editingId ? "Update Photo" : "Add Photo"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-outline">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <Loader label="Loading photos" />
      ) : error ? (
        <ErrorState message="Could not load photos." onRetry={load} />
      ) : photos.length === 0 ? (
        <EmptyState title="No photos uploaded yet" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {photos.map((p) => (
            <div key={p._id} className="card overflow-hidden">
              <img src={p.imageUrl} alt={p.title} className="h-44 w-full object-cover" loading="lazy" />
              <div className="p-4">
                <p className="font-display text-lg text-ivory">{p.title}</p>
                <p className="text-xs text-gold mt-1">{p.category}{p.featured ? " · Featured" : ""}</p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => startEdit(p)} className="text-sm text-ivory/70 hover:text-gold">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-sm text-maroon-light hover:text-maroon">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
