import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/attendance.css";

export default function Attendance() {

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // POPUPS
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // HOLIDAY
  const [showHoliday, setShowHoliday] = useState(false);
  const [holidayReason, setHolidayReason] = useState("");

  // DATE
  const [selectedDate, setSelectedDate] = useState("");

  // HISTORY
  const [showHistory, setShowHistory] = useState(false);

  const [historyMessage, setHistoryMessage] = useState("");

  const [historyData, setHistoryData] = useState([]);

  const navigate = useNavigate();

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ================= FETCH STUDENTS =================
  useEffect(() => {

    async function fetchStudents() {

      try {

        const teacherData = JSON.parse(
          localStorage.getItem("user")
        );

        if (!teacherData) {

          alert("Teacher data missing");

          navigate("/login");

          return;
        }

        const res = await fetch(

          `http://localhost:5000/api/students?year=${teacherData.year}&branch=${teacherData.branch}`

        );

        const data = await res.json();

        if (Array.isArray(data)) {

          setStudents(data);

        } else {

          setStudents([]);
        }

      } catch (err) {

        console.error(err);

        alert("Error fetching students");

      } finally {

        setLoading(false);
      }
    }

    fetchStudents();

  }, []);

  // ================= HISTORY =================
  useEffect(() => {

    async function loadHistory() {

      if (!selectedDate) return;

      try {

        // CHECK HOLIDAY
        const holidayRes = await fetch(

          `http://localhost:5000/api/holidays/${selectedDate}`

        );

        const holidayData = await holidayRes.json();

        if (holidayData.exists) {

          setHistoryMessage(
            `📅 Holiday: ${holidayData.reason}`
          );

          setHistoryData([]);

          setShowHistory(true);

          return;
        }

        // FULL ATTENDANCE
        const res = await fetch(

          `http://localhost:5000/api/attendance/full/${selectedDate}`

        );

        const data = await res.json();

        if (data.data && data.data.length > 0) {

          setHistoryData(data.data);

          setHistoryMessage("");

        } else {

          setHistoryData([]);

          setHistoryMessage(
            "❌ No attendance found"
          );
        }

        setShowHistory(true);

      } catch (err) {

        console.error(err);
      }
    }

    loadHistory();

  }, [selectedDate]);

  // ================= MARK =================
  function markAttendance(studentId, status) {

    setAttendance(prev => ({

      ...prev,

      [studentId]: status

    }));
  }

  // ================= COUNTS =================
  const totalStudents = students.length;

  const totalPresent =
    Object.values(attendance)
      .filter(v => v === "present").length;

  const totalAbsent =
    Object.values(attendance)
      .filter(v => v === "absent").length;

  // ================= SAVE =================
  async function saveAttendance() {

    const teacherData = JSON.parse(
      localStorage.getItem("user")
    );

    if (!teacherData) {

      alert("Teacher login missing");

      return;
    }

    const payload = students.map((s) => ({

      student_id: s.id,

      teacher_id: teacherData.id,

      branch: teacherData.branch,

      year: teacherData.year,

      subject: "General",

      status: attendance[s.id],

      date: today

    }));

    try {

      setSubmitting(true);

      const res = await fetch(

        "http://localhost:5000/api/attendance",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (!res.ok) {

        alert(data.error || "Failed");

        return;
      }

      setShowConfirm(false);

      setShowSuccess(true);

    } catch (err) {

      console.error(err);

      alert("Error saving attendance");

    } finally {

      setSubmitting(false);
    }
  }

  // ================= SUBMIT CHECK =================
  function handleSubmitClick() {

    if (
      Object.keys(attendance).length === 0
    ) {

      alert(
        "⚠ Attendance not marked yet"
      );

      return;
    }

    if (
      Object.keys(attendance).length
      !== students.length
    ) {

      alert(
        "⚠ Please mark attendance for all students"
      );

      return;
    }

    setShowConfirm(true);
  }

  // ================= HOLIDAY =================
  async function markHoliday() {

    if (!holidayReason.trim()) {

      alert("Please enter holiday reason");

      return;
    }

    try {

      const res = await fetch(

        "http://localhost:5000/api/holidays",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            holiday_date: today,

            reason: holidayReason
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {

        alert(data.error || "Failed");

        return;
      }

      alert("Holiday marked successfully ✅");

      setAttendance({});

      setShowHoliday(false);

      setHolidayReason("");

    } catch (err) {

      console.error(err);

      alert("Error marking holiday");
    }
  }

  return (

    <div className="attendance-page">

      {/* BACK BUTTON */}
      <button
        className="report-btn"
        style={{
          marginBottom: "20px"
        }}
        onClick={() =>
          navigate("/teacher/dashboard")
        }
      >
        ← Back
      </button>

      {/* TOP */}
      <div className="attendance-top">

        <div>

          <h2>📊 Attendance</h2>

          <p className="date">
            Date: {today}
          </p>

        </div>

        <div className="top-actions">

          {/* CALENDAR */}
          <input
            type="date"
            className="calendar-input"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
          />

          {/* HOLIDAY */}
          <button
            className="holiday-btn"
            onClick={() => setShowHoliday(true)}
          >
            📅 Mark Holiday
          </button>

          {/* REPORT */}
          <button
            className="report-btn"
            onClick={() =>
              navigate("/teacher/attendance-report")
            }
          >
            📄 Generate Report
          </button>

        </div>

      </div>

      {/* CARD */}
      <div className="attendance-card">

        {loading && (
          <p>Loading students...</p>
        )}

        {!loading && students.length === 0 && (
          <p>No students found</p>
        )}

        {!loading && students.map((s) => (

          <div
            className="student-row"
            key={s.id}
          >

            <span>
              {s.full_name}
            </span>

            <div>

              <button
                className={
                  attendance[s.id] === "present"
                    ? "btn present"
                    : "btn"
                }
                onClick={() =>
                  markAttendance(s.id, "present")
                }
              >
                Present
              </button>

              <button
                className={
                  attendance[s.id] === "absent"
                    ? "btn absent"
                    : "btn"
                }
                onClick={() =>
                  markAttendance(s.id, "absent")
                }
              >
                Absent
              </button>

            </div>

          </div>

        ))}

        {!loading && students.length > 0 && (

          <button
            className="submit-btn"
            onClick={handleSubmitClick}
          >
            Submit Attendance
          </button>

        )}

      </div>

      {/* CONFIRM */}
      {showConfirm && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h3>⚠ Confirm Attendance</h3>

            <div className="summary">

              <p>
                Total Students:
                {" "}
                <strong>{totalStudents}</strong>
              </p>

              <p>
                Present:
                {" "}
                <strong className="green">
                  {totalPresent}
                </strong>
              </p>

              <p>
                Absent:
                {" "}
                <strong className="red">
                  {totalAbsent}
                </strong>
              </p>

            </div>

            <p className="confirm-text">
              Do you really want to save attendance?
            </p>

            <div className="popup-actions">

              <button
                className="yes-btn"
                onClick={saveAttendance}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Yes"}
              </button>

              <button
                className="no-btn"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>

            </div>

          </div>

        </div>

      )}

      {/* SUCCESS */}
      {showSuccess && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h3>
              ✅ Attendance Saved Successfully
            </h3>

            <button
              className="ok-btn"
              onClick={() => {

                setShowSuccess(false);

                navigate("/teacher/dashboard");

              }}
            >
              OK
            </button>

          </div>

        </div>

      )}

      {/* HOLIDAY */}
      {showHoliday && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h3>📅 Mark Holiday</h3>

            <input
              type="text"
              placeholder="Reason for holiday"
              value={holidayReason}
              onChange={(e) =>
                setHolidayReason(e.target.value)
              }
              className="holiday-input"
            />

            <div className="popup-actions">

              <button
                className="yes-btn"
                onClick={markHoliday}
              >
                Save
              </button>

              <button
                className="no-btn"
                onClick={() => setShowHoliday(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

      {/* HISTORY */}
      {showHistory && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h3>
              📅 Attendance History
            </h3>

            {historyMessage && (
              <p style={{ marginTop: "20px" }}>
                {historyMessage}
              </p>
            )}

            {historyData.length > 0 && (

              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginTop: "20px",
                  textAlign: "left"
                }}
              >

                {historyData.map((s, i) => (

                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid #eee"
                    }}
                  >

                    <span>
                      {s.full_name}
                    </span>

                    <strong
                      style={{
                        color:
                          s.status === "present"
                            ? "green"
                            : "red"
                      }}
                    >
                      {s.status}
                    </strong>

                  </div>

                ))}

              </div>

            )}

            <button
              className="ok-btn"
              onClick={() =>
                setShowHistory(false)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}