import React, { useEffect, useState } from "react";

export default function Timetable() {

  const API = "http://localhost:5000";

  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null); // 🔥 file object

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

  // 🔥 FILE HANDLE (NO BASE64)
  function handleFile(e) {
    setFile(e.target.files[0]);
  }

  // 🔥 SUBMIT WITH FORM DATA
  async function handleSubmit(e) {
    e.preventDefault();

    if (!title) {
      alert("Title required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (file) formData.append("file", file);

      await fetch(`${API}/api/timetable`, {
        method: "POST",
        body: formData // 🔥 no headers
      });

      setTitle("");
      setFile(null);

      load();

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  }

  return (
    <div style={{ padding: "20px" }}>

      <h2>📅 Timetable</h2>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 🔥 FILE INPUT */}
        <input type="file" onChange={handleFile} />

        <button type="submit">Upload</button>

      </form>

      <div>

        {data.map(t => (
          <div key={t.id} style={{ marginTop: "15px" }}>

            <h3>{t.title}</h3>

            {t.file && (
              t.file.endsWith(".pdf") ? (
                <a
                  href={`http://localhost:5000/uploads/${t.file}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 View PDF
                </a>
              ) : (
                <img
                  src={`http://localhost:5000/uploads/${t.file}`}
                  alt="timetable"
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