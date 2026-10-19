import { useEffect, useState } from "react";
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from "../../api/enquiries";
import Loader from "../../components/Loader";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";

const statusOptions = ["new", "contacted", "closed"];

export default function ManageEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async (status) => {
    try {
      setLoading(true);
      setError(false);
      const res = await getEnquiries(status);
      setEnquiries(res.data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("All");
  }, []);

  const handleFilter = (s) => {
    setFilter(s);
    load(s);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateEnquiryStatus(id, status);
      load(filter);
    } catch (err) {
      alert("Could not update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await deleteEnquiry(id);
      load(filter);
    } catch (err) {
      alert("Could not delete enquiry.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ivory mb-8">Client Enquiries</h1>

      <div className="flex gap-3 mb-8">
        {["All", ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => handleFilter(s)}
            className={`px-4 py-2 text-sm rounded-sm border capitalize transition-colors ${
              filter === s ? "bg-gold text-charcoal border-gold" : "border-white/15 text-ivory/70 hover:border-gold hover:text-gold"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading enquiries" />
      ) : error ? (
        <ErrorState message="Could not load enquiries." onRetry={() => load(filter)} />
      ) : enquiries.length === 0 ? (
        <EmptyState title="No enquiries yet" />
      ) : (
        <div className="flex flex-col gap-4">
          {enquiries.map((e) => (
            <div key={e._id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-display text-lg text-ivory">{e.name}</p>
                <p className="text-sm text-ivory/60">{e.contactNumber}</p>
                <p className="text-sm text-ivory/50 mt-2 max-w-xl">{e.description}</p>
                <p className="text-xs text-ivory/30 mt-2">{new Date(e.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={e.status}
                  onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                  className="input-field w-36 capitalize"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button onClick={() => handleDelete(e._id)} className="text-sm text-maroon-light hover:text-maroon">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
