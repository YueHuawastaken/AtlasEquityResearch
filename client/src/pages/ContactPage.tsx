import { useState } from "react";
import { api } from "../services/api.js";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/contact", form);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="section-header">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>Reach the research desk</h1>
          <p className="muted">Use this form to send a research request, collaboration note, or follow-up.</p>
        </div>
      </section>

      <section className="card content-card">
        <form className="admin-form" onSubmit={submit}>
          <input placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <input placeholder="Subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} required />
          <textarea placeholder="Message" rows={6} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required />
          <button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send Message"}</button>
        </form>
        {sent ? <p className="success-banner">Thanks. Your message has been sent to the research desk.</p> : null}
      </section>
    </div>
  );
}
