import React, { useEffect, useState } from "react";
import "../styles/note.css";

export default function Note() {

  const API = "http://localhost:5000";

  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {

    const res = await fetch(`${API}/api/notes`);

    const data = await res.json();

    setNotes(data.notes || []);
  }

  function handleEdit(note) {

    setEditId(note.id);

    setTitle(note.title);
    setSubject(note.subject);

    setFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function handleDelete(id) {

    const confirmDelete =
      window.confirm("Delete this note?");

    if (!confirmDelete) return;

    await fetch(`${API}/api/notes/${id}`, {
      method: "DELETE"
    });

    loadNotes();
  }

  async function handleSubmit(e) {

    e.preventDefault();

    if (!title || !subject) {

      alert("Fill required fields");

      return;
    }

    const formData = new FormData();

    formData.append("title", title);

    formData.append("subject", subject);

    if (file) {
      formData.append("file", file);
    }

    try {

      if (editId) {

        await fetch(`${API}/api/notes/${editId}`, {

          method: "PUT",

          body: formData
        });

      } else {

        await fetch(`${API}/api/notes`, {

          method: "POST",

          body: formData
        });
      }

      setTitle("");
      setSubject("");
      setFile(null);

      setEditId(null);

      loadNotes();

    } catch (err) {

      console.error(err);

      alert("Something went wrong");
    }
  }

  return (

    <div className="notes-page">

      <h2 className="title">
        📘 Notes
      </h2>

      {/* FORM */}
      <form
        className="notes-form"
        onSubmit={handleSubmit}
      >

        <input
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
        />

        <input
          type="file"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <button type="submit">

          {editId
            ? "Update"
            : "Upload"}

        </button>

      </form>

      {/* NOTES LIST */}
      <div className="notes-list">

        {notes.map((n) => (

          <div
            key={n.id}
            className="notes-card"
          >

            <h3>{n.title}</h3>

            <p className="subject">
              {n.subject}
            </p>

            {/* IMAGE */}
            {n.link &&
              !n.link.endsWith(".pdf") &&
              !n.link.endsWith(".doc") &&
              !n.link.endsWith(".docx") && (

                <img
                  src={`${API}/uploads/${n.link}`}
                  alt="note"
                  style={{
                    width: "200px",
                    borderRadius: "8px",
                    marginTop: "10px"
                  }}
                />

            )}

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "14px",
                alignItems: "stretch"
              }}
            >

              {/* VIEW BUTTON */}
              {n.link && (

                n.link.endsWith(".pdf") ||

                n.link.endsWith(".doc") ||

                n.link.endsWith(".docx")

              ) && (

                <a
                  href={`${API}/uploads/${n.link}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#2563eb",
                    color: "white",

                    width: "78px",
                    height: "38px",

                    borderRadius: "8px",

                    textDecoration: "none",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    fontSize: "14px",
                    fontWeight: "500",

                    lineHeight: "1",

                    padding: "0",

                    boxSizing: "border-box"
                  }}
                >
                  View
                </a>

              )}

              {/* EDIT BUTTON */}
              <button
                type="button"
                onClick={() => handleEdit(n)}
                style={{
                  background: "#7c3aed",
                  color: "white",
                  border: "none",

                  width: "78px",
                  height: "38px",

                  borderRadius: "8px",
                  cursor: "pointer",

                  fontSize: "14px",
                  fontWeight: "500",

                  lineHeight: "1",

                  padding: "0",

                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                  boxSizing: "border-box"
                }}
              >
                Edit
              </button>

              {/* DELETE BUTTON */}
              <button
                type="button"
                onClick={() => handleDelete(n.id)}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",

                  width: "78px",
                  height: "38px",

                  borderRadius: "8px",
                  cursor: "pointer",

                  fontSize: "14px",
                  fontWeight: "500",

                  lineHeight: "1",

                  padding: "0",

                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                  boxSizing: "border-box"
                }}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}