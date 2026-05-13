import React, { useEffect, useState } from "react";

export default function StudentNotes() {

  const API = "http://localhost:5000";

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const res = await fetch(`${API}/api/notes`);
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (err) {
      console.error(err);
    }
  }

  // 🔥 FIXED URL HANDLER
  function getFileUrl(link) {
    if (!link) return "";

    // agar already full URL hai
    if (link.startsWith("http")) {
      return link;
    }

    // warna uploads se serve hoga
    return `${API}/uploads/${link}`;
  }

  return (
    <div style={{ padding: "20px", background: "#f5f7fa", minHeight: "100vh" }}>

      <h2 style={{ textAlign: "center" }}>📘 Notes</h2>

      {notes.length === 0 && (
        <p style={{ textAlign: "center", color: "gray" }}>
          No notes available
        </p>
      )}

      <div style={{ marginTop: "20px" }}>

        {notes.map(n => {

          const fileUrl = getFileUrl(n.link);

          return (
            <div
              key={n.id}
              style={{
                background: "#fff",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
            >
              <h3>{n.title}</h3>
              <p><b>{n.subject}</b></p>

              {/* 🔥 FILE SHOW */}
              {n.link && (
                n.link.toLowerCase().endsWith(".pdf") ? (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 Open Notes
                  </a>
                ) : (
                  <img
                    src={fileUrl}
                    alt="note"
                    style={{
                      width: "200px",
                      marginTop: "10px",
                      borderRadius: "6px"
                    }}
                  />
                )
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}