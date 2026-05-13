import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../styles/teacher.css";

export default function TeacherDashboard() {

  const [teacher, setTeacher] = useState(null);

  const [counts, setCounts] = useState({
    assignments: 0,
    notices: 0,
    notes: 0
  });

  const navigate = useNavigate();

  const API = "http://localhost:5000";

  // ================= LOAD TEACHER =================
  useEffect(() => {

    try {

      // 🔥 USING EXISTING WORKING STORAGE
      const data = localStorage.getItem("user");

      if (!data) {
        navigate("/login");
        return;
      }

      const parsed = JSON.parse(data);

      console.log("TEACHER:", parsed);

      setTeacher(parsed);

      loadCounts();

    } catch (err) {

      console.error(err);

      navigate("/login");

    }

  }, []);

  // ================= FETCH COUNTS =================
  async function loadCounts() {

    try {

      const [aRes, nRes, noRes] = await Promise.all([
        fetch(`${API}/api/assignments`),
        fetch(`${API}/api/notices`),
        fetch(`${API}/api/notes`)
      ]);

      const aData = await aRes.json();
      const nData = await nRes.json();
      const noData = await noRes.json();

      setCounts({
        assignments: aData.assignments?.length || 0,
        notices: nData.notices?.length || 0,
        notes: noData.notes?.length || 0
      });

    } catch (err) {

      console.error("Dashboard error:", err);

    }
  }

  // ================= LOGOUT =================
  function logout() {

    localStorage.clear();

    navigate("/login");
  }

  return (

    <div className="teacher-dashboard">

      {/* ================= SIDEBAR ================= */}
      <aside className="teacher-sidebar">

        <div className="teacher-brand">

          <img
            src={logo}
            alt="logo"
            className="teacher-logo"
          />

          <h2>Smart Campus</h2>

        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="teacher-nav">

          <p onClick={() => navigate("/teacher/attendance")}>
            📊 Attendance
          </p>

          <p onClick={() => navigate("/teacher/notices")}>
            🔔 Notices
          </p>

          <p onClick={() => navigate("/teacher/assignment")}>
            📚 Assignments
          </p>

          <p onClick={() => navigate("/teacher/note")}>
            📖 Notes
          </p>

          <p onClick={() => navigate("/teacher/timetable")}>
            📅 Timetable
          </p>

        </nav>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="teacher-main">

        {/* ================= HEADER ================= */}
        <header className="teacher-header">

          <div>

            {/* 🔥 DYNAMIC NAME */}
            <h1>
              Welcome Back,
              {" "}
              {teacher?.full_name || "Teacher"} 👋
            </h1>

            {/* 🔥 DYNAMIC BRANCH + YEAR */}
            <p>
              {teacher?.branch || "Department"}
              {" • "}
              Year {teacher?.year || "-"}
            </p>

          </div>

          <button
            className="teacher-logout"
            onClick={logout}
          >
            Logout
          </button>

        </header>

        {/* ================= CARDS ================= */}
        <section className="teacher-cards">

          <div className="teacher-card assignments">

            <h3>Assignments</h3>

            <div className="teacher-value">
              {counts.assignments}
            </div>

            <span>Total uploaded assignments</span>

          </div>

          <div className="teacher-card notices">

            <h3>Notices</h3>

            <div className="teacher-value">
              {counts.notices}
            </div>

            <span>Total published notices</span>

          </div>

          <div className="teacher-card notes">

            <h3>Notes</h3>

            <div className="teacher-value">
              {counts.notes}
            </div>

            <span>Total uploaded notes</span>

          </div>

        </section>

        {/* ================= PROFILE SECTION ================= */}
        <section className="teacher-grid">

          <div className="teacher-box">

            <h3>👨‍🏫 Teacher Profile</h3>

            <p>
              <strong>Full Name:</strong>
              {" "}
              {teacher?.full_name || "-"}
            </p>

            <p>
              <strong>Department:</strong>
              {" "}
              {teacher?.branch || "-"}
            </p>

            <p>
              <strong>Teaching Year:</strong>
              {" "}
              {teacher?.year || "-"}
            </p>

            <p>
              <strong>Status:</strong>
              {" "}
              Active
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}