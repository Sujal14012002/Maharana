import { useStudio } from "../context/StudioContext";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

export default function About() {
  const { studio, loading, error, refresh } = useStudio();

  if (loading) return <div className="pt-32"><Loader label="Loading" /></div>;
  if (error) return <div className="pt-32"><ErrorState message={error} onRetry={refresh} /></div>;

  const stats = [
    { label: "Years of Experience", value: studio?.yearsOfExperience },
    { label: "Projects Completed", value: studio?.projectsCompleted },
    { label: "Happy Clients", value: studio?.happyClients },
  ].filter((s) => s.value);

  return (
    <div className="page-wrapper">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="text-gold text-xs tracking-[0.3em] mb-3 block">OUR STORY</span>
          <h1 className="section-heading mb-6">{studio?.aboutTitle || "About the Studio"}</h1>
          <p className="text-ivory/60 leading-relaxed whitespace-pre-line">
            {studio?.aboutContent ||
              "I am the Founder and Professional Photographer at Maharana Pratap Studio Boda. I have 5 years of experience in Wedding Photography and have covered 100+ Weddings. I am also a Professional Drone Pilot with expertise in Photography, Videography, and Editing. I use Adobe Lightroom, Photoshop, and Premiere Pro for Professional Editing. I can Deliver 10,000+ edited photos within 2–3 days. I am comfortable with outstation weddings, long shooting hours, and working with Professional Teams."}
          </p>

          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-6 mt-10">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl md:text-4xl text-gold">{s.value}+</p>
                  <p className="text-xs text-ivory/50 tracking-wide mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-md overflow-hidden aspect-[4/5] bg-charcoal-lighter">
          {studio?.aboutImageUrl ? (
            <img src={studio.aboutImageUrl} alt="About the studio" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-ivory/30 font-display text-xl">
              Studio Image
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
