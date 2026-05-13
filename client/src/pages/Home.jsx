import { useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="container navbar-inner">
          <div className="logo">
            <div className="logo-icon">🛡️</div>
            <span>Smart Campus</span>
          </div>

          <button className="btn-primary" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-container">
          <h1>Smart Campus</h1>
          <h2>Management System</h2>
          <p>
            A modern, production-ready platform designed for schools and
            colleges. Streamline academic operations, enhance communication,
            and empower students with comprehensive management tools.
          </p>

          <button
            className="btn-primary large"
            onClick={() => navigate("/login")}
          >
            Get Started →
          </button>
        </div>
      </section>

      {/* ROLES */}
      <section className="roles">
        <div className="container roles-grid">
          <RoleCard
            title="Student"
            icon="👤"
            items={[
              "View attendance and performance",
              "Submit assignments",
              "Take quizzes",
              "Access study materials",
              "Track grades and progress",
            ]}
          />

          <RoleCard
            title="Teacher"
            icon="👨‍🏫"
            items={[
              "Manage classes and attendance",
              "Create assignments and quizzes",
              "Grade submissions",
              "Post notices and resources",
              "View class analytics",
            ]}
          />

          <RoleCard
            title="Principal"
            icon="👔"
            items={[
              "Institution-wide analytics",
              "Manage teachers and staff",
              "Monitor attendance trends",
              "Create circulars",
              "Access reports",
            ]}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="container">
          <h3>Key Features</h3>
          <p className="features-subtitle">
            Everything you need to manage a modern educational institution
          </p>

          <div className="feature-grid">
            <Feature title="Role-Based Access" text="Tailored experiences for different roles." />
            <Feature title="Analytics & Insights" text="Real-time dashboards and reports." />
            <Feature title="Academic Resources" text="Assignments, quizzes, and materials." />
            <Feature title="Gamification" text="Points, badges, and achievements." />
            <Feature title="Real-Time Updates" text="Instant notifications and alerts." />
            <Feature title="Secure & Private" text="Enterprise-grade data security." />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          Smart Campus Management System.
        </div>
      </footer>
    </div>
  );
}

function RoleCard({ title, icon, items }) {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>✔ {item}</li>
        ))}
      </ul>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="feature-card">
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
}
