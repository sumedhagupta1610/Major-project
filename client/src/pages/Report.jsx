import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/attendance.css";

export default function AttendanceReport() {

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [reportType, setReportType] =
    useState("monthly");

  // 🔥 NEW DAILY DATE
  const [date, setDate] = useState("");

  // 🔥 MONTH INPUT
  const [month, setMonth] = useState(
    `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`
  );

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [week, setWeek] = useState(1);

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  const [report, setReport] = useState(null);

  // ================= LOAD STUDENTS =================
  useEffect(() => {

    async function loadStudents() {

      try {

        const teacherData = JSON.parse(
          localStorage.getItem("user")
        );

        const res = await fetch(

          `http://localhost:5000/api/students?year=${teacherData.year}&branch=${teacherData.branch}`

        );

        const data = await res.json();

        setStudents(data);

      } catch (err) {

        console.error(err);
      }
    }

    loadStudents();

  }, []);

  // ================= GENERATE =================
  async function generateReport() {

    try {

      let url =
        `http://localhost:5000/api/attendance/report/${reportType}`;

      // ================= STUDENT =================
      if (selectedStudent) {

        url += `?studentId=${selectedStudent}`;
      }

      // ================= DAILY =================
      if (reportType === "daily") {

        url +=
          `${selectedStudent ? "&" : "?"}date=${date}`;
      }

      // ================= MONTHLY =================
      else if (reportType === "monthly") {

        const splitMonth =
          month.split("-");

        const reportMonth =
          splitMonth[1];

        const reportYear =
          splitMonth[0];

        url +=
          `${selectedStudent ? "&" : "?"}month=${reportMonth}&year=${reportYear}`;
      }

      // ================= YEARLY =================
      else if (reportType === "yearly") {

        url +=
          `${selectedStudent ? "&" : "?"}year=${year}`;
      }

      // ================= WEEKLY =================
      else if (reportType === "weekly") {

        const splitMonth =
          month.split("-");

        const reportMonth =
          splitMonth[1];

        const reportYear =
          splitMonth[0];

        url +=
          `${selectedStudent ? "&" : "?"}week=${week}&month=${reportMonth}&year=${reportYear}`;
      }

      // ================= CUSTOM =================
      else if (reportType === "custom") {

        url +=
          `${selectedStudent ? "&" : "?"}from=${from}&to=${to}`;
      }

      const res = await fetch(url);

      const data = await res.json();

      setReport(data);

    } catch (err) {

      console.error(err);

      alert("Error generating report");
    }
  }

  // ================= STATUS =================
  function getAttendanceStatus(percent) {

    if (percent < 50) {

      return {
        text: "⚠ Low Attendance",
        color: "#dc2626"
      };
    }

    if (percent < 75) {

      return {
        text: "📘 Average Attendance",
        color: "#d97706"
      };
    }

    return {
      text: "✅ Perfect Attendance",
      color: "#16a34a"
    };
  }

  const status =

    report &&
    selectedStudent &&
    report.total > 0

      ? getAttendanceStatus(
          Number(report.percentage)
        )

      : null;

  // 🔥 WEEK LABEL
  function getWeekLabel() {

    if (reportType !== "weekly")
      return "";

    const monthName =
      new Date(month).toLocaleString(
        "default",
        { month: "long" }
      );

    return `Week ${week} - ${monthName}`;
  }

  return (

    <div className="attendance-page">

      {/* TOP */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >

        <div>

          <h2>📄 Attendance Reports</h2>

          <p className="date">
            Generate attendance analytics
          </p>

        </div>

        <button
          className="report-btn"
          onClick={() =>
            navigate("/teacher/attendance")
          }
        >
          ← Back
        </button>

      </div>

      {/* FILTER CARD */}
      <div className="attendance-card">

        <h3>📌 Select Report Type</h3>

        <select
          className="holiday-input"
          value={reportType}
          onChange={(e) =>
            setReportType(e.target.value)
          }
        >

          {/* 🔥 NEW DAILY */}
          <option value="daily">
            Daily Report
          </option>

          <option value="monthly">
            Monthly Report
          </option>

          <option value="weekly">
            Weekly Report
          </option>

          <option value="yearly">
            Yearly Report
          </option>

          <option value="custom">
            Custom Report
          </option>

        </select>

        {/* DAILY */}
        {reportType === "daily" && (

          <div style={{ marginTop: "15px" }}>

            <input
              type="date"
              className="holiday-input"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />

          </div>

        )}

        {/* MONTHLY */}
        {reportType === "monthly" && (

          <div style={{ marginTop: "15px" }}>

            {/* 🔥 MONTH PICKER */}
            <input
              type="month"
              className="holiday-input"
              value={month}
              onChange={(e) =>
                setMonth(e.target.value)
              }
            />

          </div>

        )}

        {/* WEEKLY */}
        {reportType === "weekly" && (

          <div style={{ marginTop: "15px" }}>

            {/* 🔥 MONTH */}
            <input
              type="month"
              className="holiday-input"
              value={month}
              onChange={(e) =>
                setMonth(e.target.value)
              }
            />

            {/* WEEK */}
            <input
              type="number"
              placeholder="Week Number"
              className="holiday-input"
              value={week}
              min="1"
              max="4"
              onChange={(e) => {

                let value =
                  Number(e.target.value);

                if (value < 1) value = 1;

                if (value > 4) value = 4;

                setWeek(value);

              }}
              style={{ marginTop: "10px" }}
            />

          </div>

        )}

        {/* YEARLY */}
        {reportType === "yearly" && (

          <div style={{ marginTop: "15px" }}>

            <input
              type="number"
              placeholder="Year"
              className="holiday-input"
              value={year}
              onChange={(e) =>
                setYear(e.target.value)
              }
            />

          </div>

        )}

        {/* CUSTOM */}
        {reportType === "custom" && (

          <div style={{ marginTop: "15px" }}>

            <input
              type="date"
              className="holiday-input"
              value={from}
              onChange={(e) =>
                setFrom(e.target.value)
              }
            />

            <input
              type="date"
              className="holiday-input"
              value={to}
              onChange={(e) =>
                setTo(e.target.value)
              }
              style={{ marginTop: "10px" }}
            />

          </div>

        )}

      </div>

      {/* STUDENTS */}
      <div
        className="attendance-card"
        style={{ marginTop: "20px" }}
      >

        <h3>👨‍🎓 Select Student</h3>

        <p className="date">
          Select whole class OR individual student
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "15px"
          }}
        >

          <button
            className={
              !selectedStudent
                ? "btn present"
                : "btn"
            }
            onClick={() =>
              setSelectedStudent(null)
            }
          >
            Whole Class
          </button>

          {students.map((s) => (

            <button
              key={s.id}
              className={
                selectedStudent === s.id
                  ? "btn present"
                  : "btn"
              }
              onClick={() =>
                setSelectedStudent(s.id)
              }
            >
              {s.full_name}
            </button>

          ))}

        </div>

      </div>

      {/* GENERATE */}
      <button
        className="submit-btn"
        onClick={generateReport}
      >
        Generate Report
      </button>

      {/* RESULT */}
      {report && (

        <div
          className="attendance-card"
          style={{ marginTop: "25px" }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >

            <h3>📊 Report Result</h3>

            {/* 🔥 WEEK LABEL */}
            {reportType === "weekly" && (

              <div
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  fontWeight: "600"
                }}
              >
                {getWeekLabel()}
              </div>

            )}

          </div>

          <div className="summary">

            <p>
              Total Classes:
              {" "}
              <strong>
                {report.total}
              </strong>
            </p>

            <p>
              Present:
              {" "}
              {/* 🔥 FIXED */}
              <span className="green-text">
                {report.present}
              </span>
            </p>

            <p>
              Absent:
              {" "}
              <span className="red-text">
                {report.absent}
              </span>
            </p>

            <p>
              Holidays:
              {" "}
              <strong>
                {report.holidays}
              </strong>
            </p>

            <p>
              Attendance Percentage:
              {" "}
              <strong>
                {report.percentage}%
              </strong>
            </p>

          </div>

          {/* STATUS */}
          {status && (

            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                borderRadius: "12px",
                background: "#f9fafb",
                textAlign: "center"
              }}
            >

              <h3
                style={{
                  color: status.color
                }}
              >
                {status.text}
              </h3>

            </div>

          )}

        </div>

      )}

    </div>
  );
}