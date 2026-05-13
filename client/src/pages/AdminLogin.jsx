import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Email and password required");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Login failed");

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", "admin");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  // Change password from login (uses public change endpoint that verifies old password)
  const [showChange, setShowChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeMsg, setChangeMsg] = useState("");

  async function handleChange(e) {
    e.preventDefault();
    setChangeMsg("");
    if (!email || !oldPassword || !newPassword) return setChangeMsg('Provide email, old and new passwords');
    if (newPassword.length < 6) return setChangeMsg('New password must be 6+ chars');
    if (newPassword !== confirmPassword) return setChangeMsg('Passwords do not match');
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/change-password-public`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, oldPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) return setChangeMsg(data.message || 'Change failed');
      setChangeMsg('Password changed successfully');
      setShowChange(false);
    } catch (err) {
      console.error(err);
      setChangeMsg('Unable to connect to server');
    } finally { setLoading(false); }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
              <linearGradient id="g2" x1="0" x2="1">
                <stop offset="0" stopColor="#3f5bd6" />
                <stop offset="1" stopColor="#00c3a3" />
              </linearGradient>
            </defs>
            <rect rx="10" width="64" height="64" fill="url(#g2)" />
            <path d="M16 36 L32 24 L48 36 L32 44 Z" fill="#fff" opacity="0.95" />
            <circle cx="32" cy="20" r="4" fill="#fff" />
          </svg>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Smart Campus</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Admin Login</div>
          </div>
        </div>
        <h2 style={{ marginTop: 6 }}>Sign in</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="form-error">{error}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
            <button type="button" className="login-btn secondary" onClick={() => setShowChange((s) => !s)}>{showChange ? 'Close' : 'Change password'}</button>
          </div>

          {showChange && (
            <div className="modal-overlay" onMouseDown={() => setShowChange(false)}>
              <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
                <h4>Change Admin Password</h4>
                <form onSubmit={handleChange} className="change-form">
                  <label>Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} />
                  <label>Old Password</label>
                  <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                  <label>New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <label>Confirm New</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  {changeMsg && <div className="form-error">{changeMsg}</div>}
                  <div className="modal-actions">
                    <button className="login-btn" type="submit">Update</button>
                    <button type="button" className="login-btn secondary" onClick={() => setShowChange(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
