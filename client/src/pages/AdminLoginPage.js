import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/adminApi.js";
export function AdminLoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await login(email, password);
            localStorage.setItem("atlas-admin-token", response.token);
            navigate("/admin");
        }
        catch {
            setError("Login failed. Check your credentials.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "page-shell auth-shell", children: _jsxs("section", { className: "card auth-card", children: [_jsx("p", { className: "eyebrow", children: "Admin" }), _jsx("h1", { children: "Secure Login" }), _jsx("p", { className: "muted", children: "Use an admin or editor account to manage companies and research content." }), _jsxs("form", { className: "auth-form", onSubmit: onSubmit, children: [_jsxs("label", { children: [_jsx("span", { children: "Email" }), _jsx("input", { value: email, onChange: (event) => setEmail(event.target.value), type: "email", required: true })] }), _jsxs("label", { children: [_jsx("span", { children: "Password" }), _jsx("input", { value: password, onChange: (event) => setPassword(event.target.value), type: "password", required: true })] }), error ? _jsx("p", { className: "auth-error", children: error }) : null, _jsx("button", { type: "submit", disabled: loading, children: loading ? "Signing in…" : "Sign in" })] })] }) }));
}
