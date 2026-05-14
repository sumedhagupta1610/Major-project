import React, { useEffect, useState } from "react";
import "../styles/assignment.css";

export default function Assignment() {

  const API = "http://localhost:5000";

  const [assignments, setAssignments] = useState([]);

  const [editId, setEditId] = useState(null);

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

    if (form.file) {

      formData.append("file", form.file);
    }

    // UPDATE
    if (editId) {

      await fetch(`${API}/api/assignments/${editId}`, {

        method: "PUT",

        body: formData

      });

    } else {

      // CREATE
      await fetch(`${API}/api/assignments`, {

        method: "POST",

        body: formData

      });
    }

    setForm({
      title: "",
      description: "",
      file: null
    });

    setEditId(null);

    load();
  }

  // DELETE
  async function deleteAssignment(id) {

    const confirmDelete =
      window.confirm("Delete this assignment?");

    if (!confirmDelete) return;

    await fetch(`${API}/api/assignments/${id}`, {

      method: "DELETE"

    });

    load();
  }

  // EDIT
  function handleEdit(a) {

    setForm({

      title: a.title || "",

      description: a.description || "",

      file: null

    });

    setEditId(a.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  return (

    <div className="assignment-page">

      <h2 className="title">
        📚 Assignments
      </h2>

      {/* FORM */}
      <form
        className="assignment-form"
        onSubmit={handleSubmit}
      >

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

        <input
          type="file"
          onChange={handleFile}
        />

        <button type="submit">

          {editId
            ? "Update Assignment"
            : "Upload"}

        </button>

      </form>

      {/* LIST */}
      <div className="assignment-list">

        {assignments.map(a => {

          const date =
            new Date(a.created_at);

          const fileUrl =
            `${API}/uploads/${a.link || ""}`;

          return (

            <div
              key={a.id}
              className="assignment-card"
            >

              <h3>{a.title}</h3>

              <p>{a.description}</p>

              <small>
                📅 {date.toLocaleDateString("en-IN")}
              </small>

              {/* BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "14px",
                  alignItems: "center"
                }}
              >

                {/* VIEW BUTTON */}
                {a.link && (

                  a.link
                    .toLowerCase()
                    .endsWith(".pdf") ||

                  a.link
                    .toLowerCase()
                    .endsWith(".doc") ||

                  a.link
                    .toLowerCase()
                    .endsWith(".docx")

                ) ? (

                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#2563eb",
                      color: "white",
                      width: "72px",
                      height: "34px",
                      borderRadius: "7px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "500",
                      textDecoration: "none",

                      /* FIX */
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0",
                      padding: "0",
                      border: "none",
                      lineHeight: "34px",
                      boxSizing: "border-box",
                      verticalAlign: "middle"
                    }}
                  >
                    View
                  </a>

                ) : (

                  a.link && (

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

                {/* EDIT BUTTON */}
                <button
                  type="button"
                  onClick={() =>
                    handleEdit(a)
                  }
                  style={{
                    background: "#7c3aed",
                    color: "white",
                    border: "none",
                    width: "72px",
                    height: "34px",
                    borderRadius: "7px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500"
                  }}
                >
                  Edit
                </button>

                {/* DELETE BUTTON */}
                <button
                  type="button"
                  onClick={() =>
                    deleteAssignment(a.id)
                  }
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    width: "72px",
                    height: "34px",
                    borderRadius: "7px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500"
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