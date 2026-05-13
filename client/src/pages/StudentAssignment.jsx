import React, { useEffect, useState } from "react";

export default function StudentAssignments() {

  const API = "http://localhost:5000";

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {

    try {

      const res = await fetch(`${API}/api/assignments`);

      const data = await res.json();

      setAssignments(data.assignments || []);

    } catch (err) {

      console.error(err);

    }
  }

  return (

    <div
      style={{
        padding: "20px",
        background: "#f5f7fa",
        minHeight: "100vh"
      }}
    >

      <h2 style={{ textAlign: "center" }}>
        📚 Assignments
      </h2>

      {assignments.length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "gray"
          }}
        >
          No assignments available
        </p>
      )}

      <div style={{ marginTop: "20px" }}>

        {assignments.map(a => {

          const date = new Date(a.created_at);

          return (

            <div
              key={a.id}
              style={{
                background: "#fff",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
            >

              <h3>{a.title}</h3>

              <p>{a.description}</p>

              <small style={{ color: "gray" }}>
                📅 {date.toLocaleDateString("en-IN")}
              </small>

              <br />

              {/* 🔥 PDF FIX */}
              {a.link && (

                <a
                  href={`${API}/uploads/${a.link.replace("uploads/", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    color: "#2563eb",
                    fontWeight: "500"
                  }}
                >
                  📄 View Assignment
                </a>

              )}

            </div>

          );
        })}

      </div>

    </div>
  );
}