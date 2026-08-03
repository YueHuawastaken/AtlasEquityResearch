import { useEffect, useState } from "react";
import {
  fetchAdminContactMessages,
  updateAdminContactMessageStatus,
  type AdminContactMessage,
  type ContactMessageStatus
} from "../../services/adminApi.js";

const statuses: ContactMessageStatus[] = ["new", "in_review", "resolved", "spam"];

export function ContactMessagesAdminPanel() {
  const token = localStorage.getItem("atlas-admin-token");
  const [items, setItems] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | "">("");
  const [search, setSearch] = useState("");

  const load = async (nextStatus: ContactMessageStatus | "", nextSearch: string) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetchAdminContactMessages(token, {
        status: nextStatus || undefined,
        search: nextSearch.trim() || undefined
      });
      setItems(response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    void load(statusFilter, search);
  }, [token]);

  if (!token) return null;

  const applyFilters = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await load(statusFilter, search);
  };

  const updateStatus = async (messageId: string, status: ContactMessageStatus) => {
    if (!token) return;
    await updateAdminContactMessageStatus(token, messageId, status);
    await load(statusFilter, search);
  };

  return (
    <article className="card admin-panel admin-panel-wide">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Contact Inbox</p>
          <h2>Inbound Messages</h2>
        </div>
      </div>

      <form className="filter-bar" onSubmit={applyFilters}>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as ContactMessageStatus | "")}>
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email, subject, or content"
        />
        <button type="submit" className="ghost-button">Filter</button>
      </form>

      <div className="admin-list">
        {loading ? (
          <div className="table-empty">Loading messages…</div>
        ) : items.length ? (
          items.map((message) => (
            <article key={message.id} className="admin-list-item admin-message-item">
              <div>
                <strong>{message.subject}</strong>
                <span>{message.name} · {message.email}</span>
                <p className="muted">{message.message}</p>
              </div>
              <div className="inline-actions">
                <select value={message.status} onChange={(event) => void updateStatus(message.id, event.target.value as ContactMessageStatus)}>
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </article>
          ))
        ) : (
          <div className="table-empty">No contact messages match this filter.</div>
        )}
      </div>
    </article>
  );
}
