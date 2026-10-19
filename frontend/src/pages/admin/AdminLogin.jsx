import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await login(username, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-ivory font-body flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="card p-8 w-full max-w-sm">
        <p className="font-display text-2xl text-gold mb-1">MPS Admin</p>
        <p className="text-xs text-ivory/40 mb-6">Sign in to manage the website</p>

        <input
          className="input-field mb-4"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="input-field mb-4"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-maroon-light text-sm mb-4">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Signing in..." : "Login"}
        </button>

        <a href="/" className="block text-center text-xs text-ivory/40 hover:text-gold mt-5">
          &larr; Back to website
        </a>
      </form>
    </div>
  );
}
