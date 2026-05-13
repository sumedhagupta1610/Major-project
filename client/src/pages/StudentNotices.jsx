import React, { useEffect, useState } from "react";

export default function StudentNotices() {

  const API = "http://localhost:5000";

  const [notices, setNotices] = useState([]);

  useEffect(() => {
    loadNotices();
  }, []);

  async function loadNotices() {

    try {

      const res = await fetch(`${API}/api/notices`);

      const data = await res.json();

      setNotices(data.notices || []);

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
        📢 Notices
      </h2>

      {notices.length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "gray"
          }}
        >
          No notices available
        </p>
      )}

      <div style={{ marginTop: "20px" }}>

        {notices.map(n => {

          const date = new Date(n.created_at);

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

              {n.title && <h3>{n.title}</h3>}

              <p>{n.content}</p>

              <small style={{ color: "gray" }}>
                📅 {date.toLocaleDateString("en-IN")}
              </small>

              <br />

              {/* 🔥 FILE FIX */}
              {n.image && (

                n.image.includes(".pdf") ? (

                  <a
                    href={`${API}/uploads/${n.image.replace("uploads/", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: "10px",
                      color: "#2563eb",
                      fontWeight: "500"
                    }}
                  >
                    📄 View PDF
                  </a>

                ) : (

                  <img
                    src={`${API}/uploads/${n.image.replace("uploads/", "")}`}
                    alt="notice"
                    style={{
                      maxWidth: "200px",
                      marginTop: "10px",
                      borderRadius: "8px"
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