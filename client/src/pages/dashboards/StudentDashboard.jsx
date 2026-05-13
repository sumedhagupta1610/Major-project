import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/student.css";
import logo from "../../assets/logo.png";

export default function StudentDashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // 🔥 SAFE DEFAULT ATTENDANCE
  const [attendance, setAttendance] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0
  });

  const [loading, setLoading] = useState(true);

  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // 🔥 CHATBOT STATES
  const [showChat, setShowChat] = useState(false);

  const [messages, setMessages] = useState([
    {
      from: "assistant",
      text: "Hi 👋 I'm Smart Campus AI Assistant. How can I help you?"
    }
  ]);

  const [input, setInput] = useState("");

  const [chatLoading, setChatLoading] =
    useState(false);

  // ================= LOAD USER =================
  useEffect(() => {

    try {

      const u = JSON.parse(
        localStorage.getItem("user")
      );

      console.log("USER:", u);

      if (!u || !u.id) {

        alert(
          "Session expired. Please login again."
        );

        navigate("/login");

        return;
      }

      setUser(u);

    } catch (err) {

      console.error(
        "USER LOAD ERROR:",
        err
      );

      navigate("/login");
    }

  }, []);

  // ================= FETCH DATA =================
  useEffect(() => {

    if (!user || !user.id) return;

    async function fetchAll() {

      try {

        setLoading(true);

        // ================= ATTENDANCE =================
        try {

          const attRes = await fetch(

            `http://localhost:5000/api/attendance/student/${user.id}`

          );

          const attData =
            await attRes.json();

          console.log(
            "ATTENDANCE:",
            attData
          );

          setAttendance({

            total:
              attData.total || 0,

            present:
              attData.present || 0,

            absent:
              attData.absent || 0,

            percentage:
              attData.percentage || 0

          });

        } catch (err) {

          console.error(
            "ATTENDANCE ERROR:",
            err
          );

          setAttendance({
            total: 0,
            present: 0,
            absent: 0,
            percentage: 0
          });
        }

        // ================= NOTICES =================
        try {

          const nRes = await fetch(
            `http://localhost:5000/api/notices`
          );

          const nData =
            await nRes.json();

          if (nData.notices) {

            setNotices(
              nData.notices.slice(0, 3)
            );

          } else {

            setNotices([]);
          }

        } catch {

          setNotices([]);
        }

        // ================= ASSIGNMENTS =================
        try {

          const aRes = await fetch(
            `http://localhost:5000/api/assignments`
          );

          const aData =
            await aRes.json();

          console.log(
            "ASSIGNMENTS:",
            aData
          );

          // 🔥 IF BACKEND RETURNS:
          // { assignments: [...] }

          if (aData.assignments) {

            setAssignments(
              aData.assignments.slice(0, 3)
            );

          }

          // 🔥 IF BACKEND RETURNS ARRAY DIRECTLY

          else if (Array.isArray(aData)) {

            setAssignments(
              aData.slice(0, 3)
            );

          }

          else {

            setAssignments([]);
          }

        } catch (err) {

          console.error(
            "ASSIGNMENT ERROR:",
            err
          );

          setAssignments([]);
        }

      } catch (err) {

        console.error(
          "FETCH ERROR:",
          err
        );

      } finally {

        setLoading(false);
      }
    }

    fetchAll();

  }, [user]);

  // ================= CHATBOT =================
  async function sendMessage() {

    if (!input.trim()) return;

    const userMsg = {
      from: "user",
      text: input
    };

    setMessages(prev => [
      ...prev,
      userMsg
    ]);

    const currentInput = input;

    setInput("");

    try {

      setChatLoading(true);

      const response = await fetch(

        "http://localhost:5000/api/chat/chat",

        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: currentInput
          }),
        }
      );

      const data =
        await response.json();

      setMessages(prev => [

        ...prev,

        {
          from: "assistant",

          text:
            data.response ||
            "No response"
        }
      ]);

    } catch (error) {

      console.error(error);

      setMessages(prev => [

        ...prev,

        {
          from: "assistant",

          text:
            "Server error. Try again."
        }
      ]);

    } finally {

      setChatLoading(false);
    }
  }

  // ================= LOGOUT =================
  function logout() {

    localStorage.clear();

    navigate("/login");
  }

  return (

    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">

          <img
            src={logo}
            alt="logo"
            className="logo"
          />

          <span className="brand-text">
            Smart Campus
          </span>

        </div>

        <nav>

          <p
            onClick={() =>
              navigate("/student/attendance")
            }
          >
            📊 Attendance
          </p>

          <p
            onClick={() =>
              navigate("/student/notes")
            }
          >
            📖 Notes
          </p>

          <p
            onClick={() =>
              navigate("/student/assignments")
            }
          >
            📚 Assignments
          </p>

          <p
            onClick={() =>
              navigate("/student/timetable")
            }
          >
            📅 Timetable
          </p>

          <p
            onClick={() =>
              navigate("/student/notices")
            }
          >
            🔔 Notices
          </p>

          {/* AI */}
          <p
            onClick={() =>
              setShowChat(true)
            }
          >
            🤖 AI Assistant
          </p>

        </nav>

      </aside>

      {/* MAIN */}
      <main className="main">

        {/* HEADER */}
        <header className="header">

          <div>

            <h1>

              Welcome back,
              {" "}
              {user?.full_name || "Student"} 👋

            </h1>

            <p>

              {user?.branch}
              {" "}
              • Year
              {" "}
              {user?.year}

            </p>

          </div>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </header>

        {/* LOADING */}
        {loading && (

          <p>
            Loading dashboard...
          </p>

        )}

        {/* CONTENT */}
        {!loading && (

          <>

            {/* ALERT */}
            {Number(attendance?.percentage) < 75 && (

              <div className="top-alert">

                ⚠ Your attendance is below
                75%. Please improve it!

              </div>

            )}

            {/* STATS */}
            <section className="cards">

              {/* ATTENDANCE */}
              <div

                className={`card ${

                  Number(attendance?.percentage) >= 90

                    ? "excellent"

                    : Number(attendance?.percentage) >= 75

                    ? "good"

                    : Number(attendance?.percentage) >= 60

                    ? "average"

                    : "danger"

                }`}
              >

                <h3>
                  Attendance
                </h3>

                <div className="value">

                  {attendance?.percentage || 0}%

                </div>

                <p>

                  {attendance?.absent || 0}
                  {" "}
                  days absent

                </p>

                {Number(attendance?.percentage) < 75 && (

                  <span className="warning">
                    ⚠ Low Attendance
                  </span>

                )}

              </div>

              {/* TOTAL */}
              <div className="card">

                <h3>
                  Total Classes
                </h3>

                <div className="value">

                  {attendance?.total || 0}

                </div>

              </div>

              {/* PERFORMANCE */}
              <div className="card">

                <h3>
                  Performance
                </h3>

                <div className="value">

                  {Number(attendance?.percentage) >= 75

                    ? "Good"

                    : "Needs Improvement"}

                </div>

              </div>

            </section>

            {/* GRID */}
            <section className="grid">

              {/* NOTICES */}
              <div className="box">

                <h3>
                  🔔 Recent Notices
                </h3>

                {notices.length === 0 ? (

                  <p>
                    No notices available
                  </p>

                ) : (

                  notices.map(n => (

                    <div
                      key={n.id}
                      className="item"
                    >

                      {n.title}

                    </div>

                  ))
                )}

              </div>

              {/* ASSIGNMENTS */}
              <div className="box">

                <h3>
                  📚 Assignments
                </h3>

                {assignments.length === 0 ? (

                  <p>
                    No assignments
                  </p>

                ) : (

                  assignments.map(a => (

                    <div
                      key={a.id}
                      className="item"
                    >

                      {a.title}

                    </div>

                  ))
                )}

              </div>

            </section>

          </>

        )}

      </main>

      {/* CHATBOT */}
      {showChat && (

        <div className="chatbot">

          <div className="chat-header">

            <h3>
              🤖 AI Assistant
            </h3>

            <button
              onClick={() =>
                setShowChat(false)
              }
            >
              ✕
            </button>

          </div>

          <div className="chat-body">

            {messages.map((m, i) => (

              <div
                key={i}
                className={`chat-msg ${m.from}`}
              >

                {m.text}

              </div>

            ))}

            {chatLoading && (

              <div className="chat-msg assistant">
                Typing...
              </div>

            )}

          </div>

          <div className="chat-input">

            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter"
                &&
                sendMessage()
              }
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </div>

        </div>

      )}

    </div>
  );
}