import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import logo from "../assets/logo.png";

export default function Home() {

  const navigate = useNavigate();

  return (

    <div className="home">

      {/* BACKGROUND BLOBS */}
      <div className="bg-circle one"></div>
      <div className="bg-circle two"></div>

      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          {/* LOGO */}
          <img
            src={logo}
            alt="Smart Campus"
            className="hero-logo"
          />

          {/* TITLE */}
          <h1>Smart Campus</h1>

          <h2>Management System</h2>

          {/* DESCRIPTION */}
          <p>
            A modern platform for students, teachers,
            and principals to manage attendance,
            assignments, notices, and academic activities
            in one place.
          </p>

          {/* FEATURE TAGS */}
          <div className="feature-tags">

            <span>📊 Attendance</span>

            <span>📚 Assignments</span>

            <span>🔔 Notices</span>

            <span>📖 Study Materials</span>

          </div>

          {/* BUTTON */}
          <button
            className="hero-btn"
            onClick={() => navigate("/login")}
          >
            Get Started →
          </button>

        </div>

      </section>

    </div>
  );
}