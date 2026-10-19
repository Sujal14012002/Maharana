import { useStudio } from "../context/StudioContext";
import EnquiryForm from "../components/EnquiryForm";

export default function Contact() {
  const { studio } = useStudio();

  return (
    <div className="page-wrapper">
      <div className="text-center mb-14">
        <span className="text-gold text-xs tracking-[0.3em] mb-3 block">GET IN TOUCH</span>
        <h1 className="section-heading">Contact Us</h1>
        <p className="text-ivory/50 mt-4 max-w-xl mx-auto">
          Have an event in mind? Send us the details and we'll take it from there.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-gold text-xs tracking-widest mb-2">PHONE</h3>
            <p className="text-ivory/80">{studio?.phone || "7581016465"}</p>
          </div>
          <div>
            <h3 className="text-gold text-xs tracking-widest mb-2">WHATSAPP</h3>
            <p className="text-ivory/80">{studio?.whatsapp || "7581016465"}</p>
          </div>
          <div>
            <h3 className="text-gold text-xs tracking-widest mb-2">EMAIL</h3>
          <p>zummathakur7581@gmail.com</p>
          </div>
          <div>
            <h3 className="text-gold text-xs tracking-widest mb-2">STUDIO ADDRESS</h3>
            <p className="text-ivory/80">{studio?.address || "Sukli Road Boda (Ward no. 10) Teh - Narsinghgarh, Distt - Rajgarh"}</p>
          </div>

          {studio?.mapEmbedUrl && (
            <div className="rounded-md overflow-hidden border border-white/10 mt-2">
              <iframe
                src={studio.mapEmbedUrl}
                title="Studio location"
                className="w-full h-64 border-0"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div>
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
}
