import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/photos", label: "Photos" },
  { to: "/admin/videos", label: "Videos & Reels" },
  { to: "/admin/frames", label: "Photo Frames" },
  { to: "/admin/enquiries", label: "Enquiries" },
  { to: "/admin/settings", label: "Studio Settings" },
];

export default function AdminLayout() {
  const { isAdmin, checking, logout } = useAuth();

  if (checking) {
    return <div className="min-h-screen bg-charcoal flex items-center justify-center text-ivory/50">Loading...</div>;
  }
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-charcoal text-ivory font-body">
      <aside className="md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-charcoal-light">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-display text-xl text-gold">MPS Admin</p>
          <p className="text-xs text-ivory/40 mt-1">Content Management</p>
        </div>
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `px-6 py-3 text-sm whitespace-nowrap border-l-2 transition-colors ${
                  isActive
                    ? "border-gold text-gold bg-charcoal-lighter"
                    : "border-transparent text-ivory/60 hover:text-gold hover:bg-charcoal-lighter/50"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10 mt-auto">
          <a href="/" className="text-xs text-ivory/40 hover:text-gold">&larr; Back to website</a>
          <button onClick={logout} className="block mt-3 text-xs text-maroon-light hover:text-maroon">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
