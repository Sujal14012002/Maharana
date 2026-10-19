import { useEffect, useState } from "react";
import { useStudio } from "../../context/StudioContext";
import { updateStudioInfo, updateLogo, updateHeroImage, updateAboutImage } from "../../api/studio";
import { compressImage } from "../../utils/compressImage";
import Loader from "../../components/Loader";

const textFields = [
  { key: "studioName", label: "Studio Name" },
  { key: "tagline", label: "Tagline" },
  { key: "heroHeadline", label: "Hero Headline" },
  { key: "heroSubheadline", label: "Hero Subheadline" },
  { key: "aboutTitle", label: "About Title" },
  { key: "yearsOfExperience", label: "Years of Experience", type: "number" },
  { key: "projectsCompleted", label: "Projects Completed", type: "number" },
  { key: "happyClients", label: "Happy Clients", type: "number" },
  { key: "phone", label: "Phone" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "mapEmbedUrl", label: "Google Maps Embed URL" },
  { key: "instagram", label: "Instagram URL" },
  { key: "facebook", label: "Facebook URL" },
  { key: "youtube", label: "YouTube URL" },
  { key: "primaryColor", label: "Primary Color (hex)" },
  { key: "accentColor", label: "Accent Color (hex)" },
];

export default function ManageSettings() {
  const { studio, loading, refresh } = useStudio();
  const [form, setForm] = useState({});
  const [aboutContent, setAboutContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (studio) {
      setForm(studio);
      setAboutContent(studio.aboutContent || "");
    }
  }, [studio]);

  if (loading || !studio) return <Loader label="Loading settings" />;

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSaveText = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      await updateStudioInfo({ ...form, aboutContent });
      await refresh();
      setMessage("Studio information updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (uploader, field, file) => {
    if (!file) return;
    const data = new FormData();
    data.append(field, await compressImage(file));
    try {
      setMessage("Uploading image...");
      await uploader(data);
      await refresh();
      setMessage("Image updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not upload image.");
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-ivory mb-8">Studio Settings</h1>
      {message && <p className="text-gold text-sm mb-4">{message}</p>}

      <div className="card p-6 mb-8 space-y-4">
        <h2 className="text-gold text-sm tracking-widest">BRANDING</h2>
        <div>
          <p className="text-sm text-ivory/60 mb-2">Logo</p>
          {studio.logoUrl && <img src={studio.logoUrl} alt="Logo" className="h-16 w-16 object-contain mb-3 rounded-full border border-gold/30" />}
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(updateLogo, "logo", e.target.files[0])} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-gold file:text-charcoal file:cursor-pointer" />
        </div>
        <div>
          <p className="text-sm text-ivory/60 mb-2">Hero Background Image</p>
          {studio.heroImageUrl && <img src={studio.heroImageUrl} alt="Hero" className="h-24 w-full object-cover mb-3 rounded-sm" />}
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(updateHeroImage, "image", e.target.files[0])} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-gold file:text-charcoal file:cursor-pointer" />
        </div>
        <div>
          <p className="text-sm text-ivory/60 mb-2">About Section Image</p>
          {studio.aboutImageUrl && <img src={studio.aboutImageUrl} alt="About" className="h-24 w-full object-cover mb-3 rounded-sm" />}
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(updateAboutImage, "image", e.target.files[0])} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-gold file:text-charcoal file:cursor-pointer" />
        </div>
      </div>

      <form onSubmit={handleSaveText} className="card p-6 space-y-4">
        <h2 className="text-gold text-sm tracking-widest">STUDIO INFORMATION</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {textFields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs text-ivory/50 mb-1">{f.label}</label>
              <input
                type={f.type || "text"}
                className="input-field"
                value={form[f.key] ?? ""}
                onChange={(e) => handleChange(f.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs text-ivory/50 mb-1">About Content</label>
          <textarea
            rows={6}
            className="input-field resize-none"
            value={aboutContent}
            onChange={(e) => setAboutContent(e.target.value)}
          />
        </div>

        {message && <p className="text-gold text-sm">{message}</p>}

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
