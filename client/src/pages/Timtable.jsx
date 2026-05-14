import React, { useEffect, useState } from "react";
import "../styles/timetable.css";

export default function Timetable() {

  const API = "http://localhost:5000";

  const [data, setData] = useState([]);

  const [title, setTitle] = useState("");

  const [file, setFile] = useState(null);

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {

    try {

      const res = await fetch(`${API}/api/timetable`);

      const d = await res.json();

      setData(d.timetable || []);

    } catch (err) {

      console.error(err);
    }
  }

  // FILE HANDLE
  function handleFile(e) {

    setFile(e.target.files[0]);
  }

  // EDIT
  function handleEdit(t) {

    setEditId(t.id);

    setTitle(t.title);

    setFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // DELETE
  async function handleDelete(id) {

    const confirmDelete =
      window.confirm(
        "Do you want to delete this timetable?"
      );

    if (!confirmDelete) return;

    try {

      const res = await fetch(

        `${API}/api/timetable/${id}`,

        {
          method: "DELETE"
        }
      );

      if (!res.ok) {

        alert("Delete failed");

        return;
      }

      // 🔥 UI UPDATE
      setData(prev =>
        prev.filter(t => t.id !== id)
      );

    } catch (err) {

      console.error(err);

      alert("Server error");
    }
  }

  // SUBMIT
  async function handleSubmit(e) {

    e.preventDefault();

    if (!title) {

      alert("Title required");

      return;
    }

    try {

      const formData = new FormData();

      formData.append("title", title);

      if (file) {

        formData.append("file", file);
      }

      let res;

      // UPDATE
      if (editId) {

        res = await fetch(

          `${API}/api/timetable/${editId}`,

          {
            method: "PUT",

            body: formData
          }
        );

      } else {

        // CREATE
        res = await fetch(

          `${API}/api/timetable`,

          {
            method: "POST",

            body: formData
          }
        );
      }

      if (!res.ok) {

        alert("Operation failed");

        return;
      }

      // RESET
      setTitle("");

      setFile(null);

      setEditId(null);

      // 🔥 REFRESH UI
      load();

    } catch (err) {

      console.error(err);

      alert("Upload failed");
    }
  }

  return (

    <div className="timetable-page">

      <h2 className="title">
        📅 Timetable
      </h2>

      {/* FORM */}

      <form
        className="timetable-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          type="file"
          onChange={handleFile}
        />

        <button type="submit">

          {editId
            ? "Update"
            : "Upload"}

        </button>

      </form>

      {/* LIST */}

      <div className="timetable-list">

        {data.map(t => (

          <div
            key={t.id}
            className="timetable-card"
          >

            <h3>{t.title}</h3>

            {/* FILE */}

            {t.file && (

              t.file.endsWith(".pdf") ||

              t.file.endsWith(".doc") ||

              t.file.endsWith(".docx")

            ) ? (

              <a
                href={`http://localhost:5000/uploads/${t.file}`}
                target="_blank"
                rel="noreferrer"
                className="pdf-link"
              >
                📄 View File
              </a>

            ) : (

              t.file && (

                <img
                  src={`http://localhost:5000/uploads/${t.file}`}
                  alt="timetable"
                  className="timetable-image"
                />

              )
            )}

            {/* BUTTONS */}

            <div className="timetable-actions">

              <button
                type="button"
                className="edit-btn"
                onClick={() => handleEdit(t)}
              >
                Edit
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={() =>
                  handleDelete(t.id)
                }
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