import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useStudio } from "../context/StudioContext";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/photos", label: "Photos" },
  { to: "/videos", label: "Videos & Reels" },
  { to: "/frames", label: "Photo Frames" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { studio } = useStudio();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const taps = useRef({ count: 0, timer: null });

  // Secret entry to the admin login (visitors never see anything):
  //  - tap/click the studio logo 5 times quickly, OR
  //  - press Alt + Shift + A on a keyboard
  const handleLogoTap = (e) => {
    setOpen(false);
    if (isAdmin) return;
    const t = taps.current;
    t.count += 1;
    clearTimeout(t.timer);
    t.timer = setTimeout(() => (t.count = 0), 2500);
    if (t.count >= 5) {
      t.count = 0;
      e.preventDefault(); // stop the logo's normal "go home" navigation
      navigate("/admin/login");
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === "a") navigate("/admin/login");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `relative text-sm tracking-wide transition-colors duration-200 py-1 ${
      isActive ? "text-gold" : "text-ivory/80 hover:text-gold"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-charcoal/95 backdrop-blur border-b border-white/5 shadow-lg shadow-black/30" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 h-20 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 min-w-0" onClick={handleLogoTap}>
          {studio?.logoUrl ? (
            <img src={studio.logoUrl} alt={studio.studioName} className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 object-contain rounded-full border border-gold/40" />
          ) : (
            <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full border border-gold/40 flex items-center justify-center">
              <span className="font-display text-gold text-lg">MP</span>
            </div>
          )}
          <span className="font-display text-base sm:text-xl md:text-2xl text-ivory tracking-wide truncate">
            {studio?.studioName || "Maharana Pratap Studio"}
          </span>
        </NavLink>

        <div className="hidden lg:flex items-center gap-6 xl:gap-9">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className="btn-primary !py-2 !px-5 text-sm">
              Admin
            </NavLink>
          )}
        </div>

        <button
          className="lg:hidden flex flex-col justify-center gap-1.5 w-8 h-8 shrink-0 ml-3"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`block w-full h-[2px] bg-gold transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block w-full h-[2px] bg-gold transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block w-full h-[2px] bg-gold transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-charcoal-light border-t border-white/5 px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className="btn-primary text-center" onClick={() => setOpen(false)}>
              Admin Panel
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
