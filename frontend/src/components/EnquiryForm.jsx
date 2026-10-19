import { useState } from "react";
import { submitEnquiry } from "../api/enquiries";

const initialForm = { name: "", contactNumber: "", description: "" };

export default function EnquiryForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.contactNumber || !form.description) {
      setStatus("error");
      setErrorMsg("Please fill in all fields.");
      return;
    }
    try {
      setStatus("submitting");
      await submitEnquiry(form);
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.response?.data?.message || "Could not submit enquiry. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl w-full">
      <div>
        <label className="block text-xs tracking-widest text-gold mb-2">FULL NAME</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-xs tracking-widest text-gold mb-2">CONTACT NUMBER</label>
        <input
          type="tel"
          name="contactNumber"
          value={form.contactNumber}
          onChange={handleChange}
          placeholder="e.g. +91 98765 43210"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-xs tracking-widest text-gold mb-2">TELL US ABOUT YOUR EVENT</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Event type, date, location, requirements..."
          rows={5}
          className="input-field resize-none"
        />
      </div>

      {status === "error" && <p className="text-maroon-light text-sm">{errorMsg}</p>}
      {status === "success" && (
        <p className="text-gold text-sm">Thank you! Your enquiry has been received. We'll reach out soon.</p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-fit disabled:opacity-60">
        {status === "submitting" ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  );
}
