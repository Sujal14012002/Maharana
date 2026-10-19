import { Link } from "react-router-dom";
import { useStudio } from "../context/StudioContext";

export default function Footer() {
  const { studio } = useStudio();

  return (
    <footer className="bg-charcoal-light border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-display text-2xl text-ivory mb-3">
            {studio?.studioName || "Maharana Pratap Studio"}
          </h3>
          <p className="text-ivory/50 text-sm leading-relaxed max-w-xs">
            <p>Founder: Zumma Thakur</p>
          </p>
        </div>

        <div>
          <h4 className="text-gold text-sm tracking-widest mb-4">EXPLORE</h4>
          <ul className="space-y-2 text-sm text-ivory/60">
            <li><Link to="/photos" className="hover:text-gold transition-colors">Photos</Link></li>
            <li><Link to="/videos" className="hover:text-gold transition-colors">Videos & Reels</Link></li>
            <li><Link to="/frames" className="hover:text-gold transition-colors">Photo Frames</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold text-sm tracking-widest mb-4">CONTACT</h4>
          <ul className="space-y-2 text-sm text-ivory/60">
            {studio?.phone && <li>{studio.phone}</li>||"7581016465"}
            <br />
            <br/>

          
            {"zummathakur7581@gmail.com"}
            <br />
            <br />
            {"Add. Sukli Road Boda (Ward no. 10) Teh - Narsinghgarh, Distt - Rajgarh"}
          </ul>
          <div className="flex gap-4 mt-4">
            {studio?.instagram && (
              <a href={studio.instagram} target="_blank" rel="noreferrer" className="text-ivory/50 hover:text-gold text-sm">Instagram</a>
            )}
            {studio?.facebook && (
              <a href={studio.facebook} target="_blank" rel="noreferrer" className="text-ivory/50 hover:text-gold text-sm">Facebook</a>
            )}
            {studio?.youtube && (
              <a href={studio.youtube} target="_blank" rel="noreferrer" className="text-ivory/50 hover:text-gold text-sm">YouTube</a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-ivory/30">
        © 2022 {studio?.studioName || "Maharana Pratap Studio"}. All rights reserved.
      </div>
    </footer>
  );
}
