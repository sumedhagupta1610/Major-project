import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/principal.css";
import logo from "../../assets/logo.png";

export default function PrincipalDashboard() {

  const navigate = useNavigate();

  const [principalName, setPrincipalName] =
    useState("Principal");

  const [stats, setStats] = useState({

    totalNotices: 0,

    totalUsers: 0

  });

  // ================= LOAD USER =================
  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (user && user.full_name) {

      setPrincipalName(user.full_name);
    }

  }, []);

  // ================= FETCH DATA =================
  useEffect(() => {

    async function fetchDashboard() {

      try {

        // OVERVIEW
        const overviewRes = await fetch(
          "http://localhost:5000/api/overview"
        );

        const overviewData =
          await overviewRes.json();

        // NOTICES
        const noticeRes = await fetch(
          "http://localhost:5000/api/notices"
        );

        const noticeData =
          await noticeRes.json();

        setStats({

          totalUsers:
            (overviewData.totalStudents || 0)
            +
            (overviewData.totalTeachers || 0),

          // 🔥 FIXED NOTICE COUNT
          totalNotices:
            Array.isArray(noticeData.notices)
              ? noticeData.notices.length
              : 0

        });

      } catch (err) {

        console.error(err);
      }
    }

    fetchDashboard();

  }, []);

  // ================= LOGOUT =================
  function logout() {

    localStorage.removeItem("user");

    navigate("/login");
  }

  return (

    <div className="principal-container">

      {/* ================= SIDEBAR ================= */}
      <div className="principal-sidebar">

        <div>

          {/* ================= LOGO ================= */}
          <div className="principal-logo">

            <img
              src={logo}
              alt="logo"
            />

            <h1>
              Smart Campus
            </h1>

            <p>
              College Management System
            </p>

          </div>

          {/* ================= MENU ================= */}
          <div className="sidebar-menu">

            <div
              className="sidebar-item"
              onClick={() =>
                navigate("/principal/attendance")
              }
            >
              <span>📊</span>
              Attendance
            </div>

            <div
              className="sidebar-item"
              onClick={() =>
                navigate("/principal/notices")
              }
            >
              <span>📢</span>
              Notices
            </div>

            <div
              className="sidebar-item"
              onClick={() =>
                navigate("/principal/overview")
              }
            >
              <span>🎓</span>
              College Overview
            </div>

          </div>

        </div>

      </div>

      {/* ================= MAIN ================= */}
      <div className="principal-main">

        {/* ================= TOPBAR ================= */}
        <div className="principal-topbar">

          <div>

            <h1>
              Welcome Back, {principalName} 👋
            </h1>

          </div>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

        {/* ================= HERO CARD ================= */}
        <div className="overview-card">

          <h2>
            🛡 Principal Administration Panel
          </h2>

          <p>

            Manage institutional activities,
            monitor attendance reports,
            supervise notices and maintain
            academic records through one
            centralized dashboard.

          </p>

        </div>

        {/* ================= STATS ================= */}
        <div className="stats-grid">

          {/* ATTENDANCE */}
          <div className="stat-card blue">

            <div className="stat-icon">
              📊
            </div>

            <h2>
              Attendance
            </h2>

            <h1>
              Active
            </h1>

            <p>
              Monitor student attendance
              and academic activity reports
            </p>

          </div>

          {/* NOTICES */}
          <div className="stat-card purple">

            <div className="stat-icon">
              📢
            </div>

            <h2>
              Notices
            </h2>

            <h1>
              {stats.totalNotices}
            </h1>

            <p>
              Official notices published
              in the system
            </p>

          </div>

          {/* OVERVIEW */}
          <div className="stat-card orange">

            <div className="stat-icon">
              🎓
            </div>

            <h2>
              Overview
            </h2>

            <h1>
              {stats.totalUsers}
            </h1>

            <p>
              Total active users
              in the campus portal
            </p>

          </div>

        </div>

        {/* ================= SYSTEM STATUS ================= */}
        <div className="system-card">

          <h2>
            ⚡ System Status
          </h2>

          <div className="status-grid">

            <div className="status-box">
              ✅ Attendance Module Active
            </div>

            <div className="status-box">
              ✅ Notice System Running
            </div>

            <div className="status-box">
              ✅ Student Database Connected
            </div>

            <div className="status-box">
              ✅ Teacher Records Available
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}