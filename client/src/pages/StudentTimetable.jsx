import React, { useEffect, useState } from "react";

export default function StudentTimetable() {

  const API = "http://localhost:5000";

  const [data, setData] = useState([]);

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

  return (
    <div style={{ padding: "20px", background: "#f5f7fa", minHeight: "100vh" }}>

      <h2 style={{ textAlign: "center" }}>📅 Timetable</h2>

      {data.length === 0 && (
        <p style={{ textAlign: "center", color: "gray" }}>
          No timetable uploaded
        </p>
      )}

      <div style={{ marginTop: "20px" }}>

        {data.map(t => (
          <div
            key={t.id}
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
          >
            <h3>{t.title}</h3>

            {t.file && (
              t.file.endsWith(".pdf") ? (
                <a
                  href={`http://localhost:5000/uploads/${t.file}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 View Timetable
                </a>
              ) : (
                <img
                  src={`http://localhost:5000/uploads/${t.file}`}
                  alt="timetable"
                  style={{ width: "200px", marginTop: "10px" }}
                />
              )
            )}

          </div>
        ))}

      </div>

    </div>
  );
}