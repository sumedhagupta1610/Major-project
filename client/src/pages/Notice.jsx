import React, { useEffect, useState } from "react";
import "../styles/notice.css";

export default function Notice() {

  const API_URL = "http://localhost:5000";

  const [notices, setNotices] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    branch: "",
    year: "",
    file: null,
    forAll: true
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    try {
      const res = await fetch(`${API_URL}/api/notices`);
      const data = await res.json();
      setNotices(data.notices || []);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  // 🔥 FILE FIX (multer)
  function handleFile(e) {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        file: file
      }));
    }
  }

  function handleCheck(e) {
    setForm(prev => ({
      ...prev,
      forAll: e.target.checked
    }));
  }

  // 🔥 SUBMIT FIX (FormData)
  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("branch", form.forAll ? "ALL" : form.branch);
    formData.append("year", form.forAll ? "ALL" : form.year);
    formData.append("teacher_id", 1);

    if (form.file) {
      formData.append("file", form.file);
    }

    try {
      let res;

      if (editId) {
        res = await fetch(`${API_URL}/api/notices/${editId}`, {
          method: "PUT",
          body: formData
        });
      } else {
        res = await fetch(`${API_URL}/api/notices`, {
          method: "POST",
          body: formData
        });
      }

      await res.json();

      setForm({
        title: "",
        content: "",
        branch: "",
        year: "",
        file: null,
        forAll: true
      });

      setEditId(null);
      fetchNotices();

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  // DELETE
  async function handleDelete(id) {
    const confirmDelete = window.confirm("Delete this notice?");
    if (!confirmDelete) return;

    await fetch(`${API_URL}/api/notices/${id}`, {
      method: "DELETE"
    });

    fetchNotices();
  }

  // EDIT
  function handleEdit(n) {
    setForm({
      title: n.title || "",
      content: n.content || "",
      branch: n.branch === "ALL" ? "" : n.branch,
      year: n.year === "ALL" ? "" : n.year,
      file: null,
      forAll: n.branch === "ALL"
    });
    setEditId(n.id);
  }

  return (
    <div className="notice-page">

      <h2 style={{ textAlign: "center" }}>📢 Notices</h2>

      {/* FORM */}
      <form className="notice-form" onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Title (optional)"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="content"
          placeholder="Write notice..."
          value={form.content}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            checked={form.forAll}
            onChange={handleCheck}
          />
          For all students
        </label>

        {!form.forAll && (
          <div className="row">
            <input
              type="text"
              name="branch"
              placeholder="Branch"
              value={form.branch}
              onChange={handleChange}
            />

            <input
              type="text"
              name="year"
              placeholder="Year"
              value={form.year}
              onChange={handleChange}
            />
          </div>
        )}

        {/* 🔥 FILE INPUT */}
        <input type="file" onChange={handleFile} />

        <button type="submit">
          {editId ? "Update Notice" : "Add Notice"}
        </button>

      </form>

      {/* LIST */}
      <div className="notice-list">

        {notices.map(n => (
          <div className="notice-card" key={n.id}>

            {n.title && <h3>{n.title}</h3>}
            <p>{n.content}</p>

            <small>
              {n.branch === "ALL"
                ? "For All Students"
                : `${n.branch} | Year ${n.year}`}
            </small>

            {/* 🔥 FILE SHOW */}
            {n.image && (
              n.image.endsWith(".pdf") ? (
                <a
                  href={`http://localhost:5000/uploads/${n.image}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 View PDF
                </a>
              ) : (
                <img
                  src={`http://localhost:5000/uploads/${n.image}`}
                  alt="notice"
                />
              )
            )}

            <div className="actions">
              <button onClick={() => handleEdit(n)}>Edit</button>
              <button
                className="delete"
                onClick={() => handleDelete(n.id)}
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