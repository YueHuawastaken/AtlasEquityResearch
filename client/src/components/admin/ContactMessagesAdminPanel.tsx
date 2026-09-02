import { useEffect, useState } from "react";
import {
  fetchAdminContactMessages,
  updateAdminContactMessageStatus,
  deleteAdminContactMessage,
  type AdminContactMessage,
  type ContactMessageStatus
} from "../../services/adminApi.js";

const statuses: ContactMessageStatus[] = ["new", "in_review", "resolved", "spam"];

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function previewText(message: string) {
  const normalized = message.trim().replace(/\s+/g, " ");
  return normalized.length > 140 ? `${normalized.slice(0, 140)}…` : normalized;
}

export function ContactMessagesAdminPanel() {
  const token = localStorage.getItem("atlas-admin-token");
  const [items, setItems] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | "">("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
  const deleteMessage = async (messageId: string) => {
    if (!token || !window.confirm("Delete this contact message permanently?")) return;
    await deleteAdminContactMessage(token, messageId);
    if (expandedId === messageId) setExpandedId(null);
    await load(statusFilter, search);
  };

  const expandedMessage = items.find((message) => message.id === expandedId) ?? null;

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

      <div className="admin-list contact-message-list">
        {loading ? (
          <div className="table-empty">Loading messages…</div>
        ) : items.length ? (
          items.map((message) => (
            <article
              key={message.id}
              className="admin-list-item admin-message-item contact-message-row"
              role="button"
              tabIndex={0}
              onClick={() => setExpandedId(message.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setExpandedId(message.id);
                }
              }}
            >
              <div className="contact-message-summary">
                <div className="contact-message-top">
                  <strong>{message.subject}</strong>
                  <span className="contact-message-time">{formatTimestamp(message.createdAt)}</span>
                </div>
                <span className="contact-message-sender">{message.name} · {message.email}</span>
                <p className="contact-message-preview">{previewText(message.message)}</p>
              </div>
              <div className="inline-actions" onClick={(event) => event.stopPropagation()}>
                <select value={message.status} onChange={(event) => void updateStatus(message.id, event.target.value as ContactMessageStatus)}>
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button type="button" className="danger-button" onClick={() => void deleteMessage(message.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="table-empty">No contact messages match this filter.</div>
        )}
      </div>

      {expandedMessage ? (
        <div className="contact-message-overlay" onClick={() => setExpandedId(null)}>
          <div className="contact-message-modal" onClick={(event) => event.stopPropagation()}>
            <div className="contact-message-modal-header">
              <div>
                <p className="eyebrow">Contact Inbox</p>
                <h3>{expandedMessage.subject}</h3>
                <span className="contact-message-sender">{expandedMessage.name} · {expandedMessage.email}</span>
                <span className="contact-message-time"> · {formatTimestamp(expandedMessage.createdAt)}</span>
              </div>
              <button type="button" className="ghost-button" onClick={() => setExpandedId(null)}>Close</button>
            </div>
            <p className="contact-message-full">{expandedMessage.message}</p>
            <div className="inline-actions">
              <select
                value={expandedMessage.status}
                onChange={(event) => void updateStatus(expandedMessage.id, event.target.value as ContactMessageStatus)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button type="button" className="danger-button" onClick={() => void deleteMessage(expandedMessage.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
