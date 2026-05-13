import React, { useEffect, useState } from "react";
import "../styles/assignment.css";

export default function Assignment() {

  const API = "http://localhost:5000";

  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    file: null
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch(`${API}/api/assignments`);
    const data = await res.json();
    setAssignments(data.assignments || []);
  }

  function handleChange(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function handleFile(e) {
    setForm(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.description) {
      alert("Fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.file) formData.append("file", form.file);

    await fetch(`${API}/api/assignments`, {
      method: "POST",
      body: formData
    });

    setForm({ title: "", description: "", file: null });
    load();
  }

  async function deleteAssignment(id) {
    const confirmDelete = window.confirm("Delete this assignment?");
    if (!confirmDelete) return;

    await fetch(`${API}/api/assignments/${id}`, {
      method: "DELETE"
    });

    load();
  }

  return (
    <div className="assignment-page">

      <h2 className="title">📚 Assignments</h2>

      {/* FORM */}
      <form className="assignment-form" onSubmit={handleSubmit}>

        <input
          name="title"
          placeholder="Assignment Title"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input type="file" onChange={handleFile} />

        <button type="submit">Upload</button>

      </form>

      {/* LIST */}
      <div className="assignment-list">

        {assignments.map(a => {

          const date = new Date(a.created_at);
          const fileUrl = `${API}/uploads/${a.link || ""}`;

          return (
            <div key={a.id} className="assignment-card">

              <h3>{a.title}</h3>
              <p>{a.description}</p>

              <small>
                📅 {date.toLocaleDateString("en-IN")}
              </small>

              {/* 🔥 FILE + BUTTONS */}
              <div style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>

                {/* FILE VIEW */}
                {a.link && (
                  a.link.toLowerCase().endsWith(".pdf") ||
                  a.link.toLowerCase().endsWith(".doc") ||
                  a.link.toLowerCase().endsWith(".docx") ? (

                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: "#2563eb",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontSize: "14px"
                      }}
                    >
                      {a.link.endsWith(".doc") || a.link.endsWith(".docx")
                        ? "Download Word"
                        : "View"}
                    </a>

                  ) : (
                    <img
                      src={fileUrl}
                      alt="assignment"
                      style={{
                        width: "150px",
                        borderRadius: "6px"
                      }}
                    />
                  )
                )}

                {/* DELETE BUTTON */}
                <button
                  onClick={() => deleteAssignment(a.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Delete
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}