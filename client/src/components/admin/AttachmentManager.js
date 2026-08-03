import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { createAdminAttachment, deleteAdminAttachment, fetchAdminAttachments } from "../../services/adminApi.js";
export function AttachmentManager({ scope, parentId, title }) {
    const token = localStorage.getItem("atlas-admin-token");
    const [items, setItems] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!token || !parentId) {
            setItems([]);
            return;
        }
        let active = true;
        void fetchAdminAttachments(token, scope, parentId).then((data) => {
            if (active)
                setItems(data);
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
        }
        finally {
            setLoading(false);
        }
    };
    const remove = async (attachmentId) => {
        if (!token) {
            return;
        }
        await deleteAdminAttachment(token, attachmentId);
        if (parentId) {
            setItems(await fetchAdminAttachments(token, scope, parentId));
        }
    };
    if (!parentId) {
        return (_jsxs("section", { className: "attachment-manager card", children: [_jsx("p", { className: "eyebrow", children: "Attachments" }), _jsx("h3", { children: title }), _jsx("p", { className: "muted", children: "Select an existing record to manage files." })] }));
    }
    return (_jsxs("section", { className: "attachment-manager card", children: [_jsx("p", { className: "eyebrow", children: "Attachments" }), _jsx("h3", { children: title }), _jsxs("div", { className: "attachment-upload-row", children: [_jsx("input", { type: "file", onChange: (event) => setFile(event.target.files?.[0] ?? null) }), _jsx("button", { type: "button", className: "ghost-button", onClick: upload, disabled: !file || loading, children: loading ? "Uploading…" : "Upload File" })] }), _jsx("div", { className: "admin-list", children: items.length ? items.map((attachment) => (_jsxs("article", { className: "admin-list-item", children: [_jsxs("div", { children: [_jsx("strong", { children: attachment.fileName }), _jsxs("span", { children: [attachment.fileType, " \u00B7 ", (attachment.fileSize / 1024).toFixed(1), " KB"] }), _jsx("a", { href: attachment.url, target: "_blank", rel: "noreferrer", children: "Download" })] }), _jsx("button", { type: "button", className: "danger-button", onClick: () => remove(attachment.id), children: "Delete" })] }, attachment.id))) : _jsx("p", { className: "muted", children: "No attachments yet." }) })] }));
}
