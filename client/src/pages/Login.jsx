import logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {

  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showChange, setShowChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changeMsg, setChangeMsg] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // ================= LOGIN =================
  async function handleSubmit(e) {

    e.preventDefault();

    setError("");

    if (!email || !password) {

      setError("Please enter email and password");

      return;
    }

    setLoading(true);

    try {

      const res = await fetch(

        `${API_URL}/api/auth/login`,

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password,
            role
          })
        }
      );

      const text = await res.text();

      let data;

      try {

        data = JSON.parse(text);

      } catch {

        throw new Error("Invalid response");
      }

      if (!res.ok) {

        setError(
          data.message || "Login failed"
        );

        return;
      }

      // ================= STORAGE =================

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "userId",
        data.user.id
      );

      localStorage.setItem(
        "role",
        data.role
      );

      // ================= NAVIGATION =================

      if (data.role === "teacher") {

        navigate("/teacher/dashboard");
      }

      else if (data.role === "student") {

        navigate("/student/dashboard");
      }

      else if (data.role === "principal") {

        navigate("/principal/dashboard");
      }

      else if (data.role === "admin") {

        navigate("/admin/dashboard");
      }

      else {

        navigate("/");
      }

    } catch (err) {

      console.error(err);

      setError("Server error");

    } finally {

      setLoading(false);
    }
  }

  // ================= CHANGE PASSWORD =================
  async function handleChangePassword(e) {

    e.preventDefault();

    setChangeMsg("");

    if (
      !email ||
      !oldPassword ||
      !newPassword
    ) {

      setChangeMsg("Fill all fields");

      return;
    }

    try {

      const res = await fetch(

        `${API_URL}/api/auth/change-password-public`,

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            oldPassword,
            newPassword
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {

        setChangeMsg(
          data.message || "Failed"
        );

        return;
      }

      setChangeMsg(
        "Password updated successfully"
      );

    } catch {

      setChangeMsg("Server error");
    }
  }

  return (

    <div className="login-page">

      <div className="login-card">

        {/* HEADER */}
        <div className="login-header">

          <img
            src={logo}
            alt="logo"
            className="login-logo"
          />

          <h2>Smart Campus</h2>

          <p>
            Management System
          </p>

        </div>

        {/* ROLE SELECTOR */}
        <div className="role-selector">

          <button
            className={
              role === "student"
                ? "active"
                : ""
            }
            onClick={() =>
              setRole("student")
            }
            type="button"
          >
            Student
          </button>

          <button
            className={
              role === "teacher"
                ? "active"
                : ""
            }
            onClick={() =>
              setRole("teacher")
            }
            type="button"
          >
            Teacher
          </button>

          <button
            className={
              role === "principal"
                ? "active"
                : ""
            }
            onClick={() =>
              setRole("principal")
            }
            type="button"
          >
            Principal
          </button>

          {/* 🔥 NEW ADMIN BUTTON */}
          <button
            className={
              role === "admin"
                ? "active"
                : ""
            }
            onClick={() =>
              setRole("admin")
            }
            type="button"
          >
            Admin
          </button>

        </div>

        {/* FORM */}
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <label>Password</label>

          <div
            style={{
              position: "relative",
              width: "100%"
            }}
          >

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              style={{
                width: "100%"
              }}
            />

            <span
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                cursor: "pointer"
              }}
            >
              {showPassword
                ? "🙈"
                : "👁️"}
            </span>

          </div>

          {error && (

            <div className="form-error">
              {error}
            </div>

          )}

          <button
            type="submit"
            className="login-btn"
          >

            {loading
              ? "Signing..."
              : "Login"}

          </button>

        </form>

        {/* CHANGE PASSWORD */}
        <div
          style={{
            textAlign: "right",
            marginTop: "10px"
          }}
        >

          <button
            className="link-btn"
            onClick={() =>
              setShowChange(true)
            }
          >
            Change Password
          </button>

        </div>

      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showChange && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowChange(false)
          }
        >

          <div
            className="modal-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3>
              Change Password
            </h3>

            <form
              onSubmit={
                handleChangePassword
              }
            >

              <label>Email</label>

              <input
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

              <label>
                Old Password
              </label>

              <input
                type="password"
                value={oldPassword}
                onChange={(e) =>
                  setOldPassword(
                    e.target.value
                  )
                }
              />

              <label>
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
              />

              {changeMsg && (
                <p>{changeMsg}</p>
              )}

              <div className="modal-actions">

                <button className="login-btn">
                  Update
                </button>

                <button
                  type="button"
                  className="login-btn secondary"
                  onClick={() =>
                    setShowChange(false)
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}