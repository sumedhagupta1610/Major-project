import React, { useEffect, useState } from "react";
import "../styles/note.css";

export default function Note() {

  const API = "http://localhost:5000";

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    const res = await fetch(`${API}/api/notes`);
    const data = await res.json();
    setNotes(data.notes || []);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!title || !subject) {
      alert("Fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    if (file) formData.append("file", file);

    fetch(`${API}/api/notes`, {
      method: "POST",
      body: formData
    })
      .then(() => {
        setTitle("");
        setSubject("");
        setFile(null);
        loadNotes();
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="notes-page">

      <h2 className="title">📘 Notes</h2>

      <form className="notes-form" onSubmit={handleSubmit}>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Upload</button>

      </form>

      <div className="notes-list">

        {notes.map(n => (
          <div key={n.id} className="notes-card">

            <h3>{n.title}</h3>
            <p className="subject">{n.subject}</p>

            {n.link && (
              n.link.endsWith(".pdf") ? (
                <a
                  href={`http://localhost:5000/uploads/${n.link}`}
                  target="_blank"
                >
                  📄 View PDF
                </a>
              ) : (
                <img
                  src={`http://localhost:5000/uploads/${n.link}`}
                  alt="note"
                  style={{ width: "200px" }}
                />
              )
            )}

          </div>
        ))}

      </div>

    </div>
  );
}