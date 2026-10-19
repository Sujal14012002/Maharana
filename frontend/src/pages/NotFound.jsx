import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="pt-40 pb-32 text-center px-4">
      <p className="font-display text-6xl text-gold mb-4">404</p>
      <p className="text-ivory/60 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-outline">Back to Home</Link>
    </div>
  );
}
