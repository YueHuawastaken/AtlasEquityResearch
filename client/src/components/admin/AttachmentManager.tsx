import { useEffect, useState } from "react";
import {
  createAdminAttachment,
  deleteAdminAttachment,
  fetchAdminAttachments,
  type AdminAttachment,
  type AttachmentScope
} from "../../services/adminApi.js";

interface AttachmentManagerProps {
  scope: AttachmentScope;
  parentId: string | null;
  title: string;
}

export function AttachmentManager({ scope, parentId, title }: AttachmentManagerProps) {
  const token = localStorage.getItem("atlas-admin-token");
  const [items, setItems] = useState<AdminAttachment[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !parentId) {
      setItems([]);
      return;
    }

    let active = true;
    void fetchAdminAttachments(token, scope, parentId).then((data) => {
      if (active) setItems(data);
    });

    return () => {
      active = false;
    };
  }, [token, scope, parentId]);

  const upload = async () => {
    if (!token || !parentId || !file) {
      return;
    }

    setLoading(true);
    try {
      await createAdminAttachment(token, scope, parentId, file);
      setItems(await fetchAdminAttachments(token, scope, parentId));
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (attachmentId: string) => {
    if (!token) {
      return;
    }

    await deleteAdminAttachment(token, attachmentId);
    if (parentId) {
      setItems(await fetchAdminAttachments(token, scope, parentId));
    }
  };

  if (!parentId) {
    return (
      <section className="attachment-manager card">
        <p className="eyebrow">Attachments</p>
        <h3>{title}</h3>
        <p className="muted">Select an existing record to manage files.</p>
      </section>
    );
  }

  return (
    <section className="attachment-manager card">
      <p className="eyebrow">Attachments</p>
      <h3>{title}</h3>

      <div className="attachment-upload-row">
        <input type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        <button type="button" className="ghost-button" onClick={upload} disabled={!file || loading}>
          {loading ? "Uploading…" : "Upload File"}
        </button>
      </div>

      <div className="admin-list">
        {items.length ? items.map((attachment) => (
          <article key={attachment.id} className="admin-list-item">
            <div>
              <strong>{attachment.fileName}</strong>
              <span>{attachment.fileType} · {(attachment.fileSize / 1024).toFixed(1)} KB</span>
              <a href={attachment.url} target="_blank" rel="noreferrer">Download</a>
            </div>
            <button type="button" className="danger-button" onClick={() => remove(attachment.id)}>Delete</button>
          </article>
        )) : <p className="muted">No attachments yet.</p>}
      </div>
    </section>
  );
}
