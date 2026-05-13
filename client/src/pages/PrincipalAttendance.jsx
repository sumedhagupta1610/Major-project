import React, { useState } from "react";
import "../styles/principal_report.css";

export default function PrincipalAttendance() {

  const [branch, setBranch] =
    useState("");

  const [year, setYear] =
    useState("");

  const [type, setType] =
    useState("daily");

  const [date, setDate] =
    useState("");

  const [month, setMonth] =
    useState("");

  const [week, setWeek] =
    useState("");

  const [reportYear, setReportYear] =
    useState("");

  const [from, setFrom] =
    useState("");

  const [to, setTo] =
    useState("");

  const [students, setStudents] =
    useState([]);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [report, setReport] =
    useState([]);

  const [holidays, setHolidays] =
    useState([]);

  const [lowStudents, setLowStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // 🔥 NEW STATE
  const [searched, setSearched] =
    useState(false);

  // ================= LOAD STUDENTS =================
  async function loadStudents() {

    if (!branch || !year) {

      alert("Enter branch and year");

      return;
    }

    try {

      const res = await fetch(

        `http://localhost:5000/api/students?branch=${branch}&year=${year}`

      );

      const data = await res.json();

      setStudents(data || []);

      setSelectedStudent(null);

    } catch (err) {

      console.error(err);
    }
  }

  // ================= GENERATE REPORT =================
  async function generateReport() {

    if (!branch || !year) {

      alert("Enter branch and year");

      return;
    }

    // ================= VALIDATIONS =================

    if (type === "daily" && !date) {

      alert("Select date");

      return;
    }

    if (
      (type === "monthly" || type === "weekly")
      &&
      !month
    ) {

      alert("Select month");

      return;
    }

    if (
      type === "weekly"
      &&
      !week
    ) {

      alert("Select week");

      return;
    }

    if (
      type === "yearly"
      &&
      !reportYear
    ) {

      alert("Enter year");

      return;
    }

    if (
      type === "custom"
      &&
      (!from || !to)
    ) {

      alert("Select start and end date");

      return;
    }

    try {

      setLoading(true);

      // 🔥 SEARCH STARTED
      setSearched(true);

      // 🔥 RESET OLD DATA
      setReport([]);
      setHolidays([]);
      setLowStudents([]);

      let url =
        `http://localhost:5000/api/principal-attendance/report?branch=${branch}&year=${year}&type=${type}`;

      // DAILY
      if (type === "daily") {

        url += `&date=${date}`;
      }

      // WEEKLY
      if (type === "weekly") {

        url += `&month=${month}&week=${week}`;
      }

      // MONTHLY
      if (type === "monthly") {

        url += `&month=${month}`;
      }

      // YEARLY
      if (type === "yearly") {

        url += `&reportYear=${reportYear}`;
      }

      // CUSTOM
      if (type === "custom") {

        url += `&from=${from}&to=${to}`;
      }

      // PARTICULAR STUDENT
      if (selectedStudent) {

        url += `&studentId=${selectedStudent}`;
      }

      console.log(url);

      const res = await fetch(url);

      const data = await res.json();

      console.log(data);

      setReport(data.report || []);

      setHolidays(data.holidays || []);

      setLoading(false);

    } catch (err) {

      console.error(err);

      setLoading(false);

      alert("Error generating report");
    }
  }

  // ================= LOW ATTENDANCE =================
  async function showLowAttendance() {

    if (!branch || !year) {

      alert("Enter branch and year");

      return;
    }

    try {

      setLoading(true);

      // 🔥 SEARCH STARTED
      setSearched(true);

      const res = await fetch(

        `http://localhost:5000/api/principal-attendance/low?branch=${branch}&year=${year}`

      );

      const data = await res.json();

      setLowStudents(data || []);

      setReport([]);

      setHolidays([]);

      setLoading(false);

    } catch (err) {

      console.error(err);

      setLoading(false);
    }
  }

  return (

    <div className="principal-attendance-page">

      {/* ================= HEADER ================= */}
      <div className="principal-attendance-header">

        <div>

          <h1>
            📊 Principal Attendance Dashboard
          </h1>

          <p>
            Generate attendance reports
            branch-wise and year-wise
          </p>

        </div>

      </div>

      {/* ================= FILTER CARD ================= */}
      <div className="principal-filter-card">

        <div className="principal-filter-grid">

          {/* BRANCH */}
          <input
            type="text"
            placeholder="Branch (CS, IT...)"
            value={branch}
            onChange={(e) =>
              setBranch(e.target.value)
            }
          />

          {/* YEAR */}
          <input
            type="text"
            placeholder="Year (1,2,3)"
            value={year}
            onChange={(e) =>
              setYear(e.target.value)
            }
          />

          {/* TYPE */}
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >

            <option value="daily">
              Daily
            </option>

            <option value="weekly">
              Weekly
            </option>

            <option value="monthly">
              Monthly
            </option>

            <option value="yearly">
              Yearly
            </option>

            <option value="custom">
              Custom
            </option>

          </select>

          {/* DAILY */}
          {type === "daily" && (

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />

          )}

          {/* WEEKLY */}
          {type === "weekly" && (

            <>

              <input
                type="month"
                value={month}
                onChange={(e) =>
                  setMonth(e.target.value)
                }
              />

              <select
                value={week}
                onChange={(e) =>
                  setWeek(e.target.value)
                }
              >

                <option value="">
                  Select Week
                </option>

                <option value="1">
                  Week 1
                </option>

                <option value="2">
                  Week 2
                </option>

                <option value="3">
                  Week 3
                </option>

                <option value="4">
                  Week 4
                </option>

              </select>

            </>

          )}

          {/* MONTHLY */}
          {type === "monthly" && (

            <input
              type="month"
              value={month}
              onChange={(e) =>
                setMonth(e.target.value)
              }
            />

          )}

          {/* YEARLY */}
          {type === "yearly" && (

            <input
              type="number"
              placeholder="Year"
              value={reportYear}
              onChange={(e) =>
                setReportYear(e.target.value)
              }
            />

          )}

          {/* CUSTOM */}
          {type === "custom" && (

            <>

              <input
                type="date"
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
              />

              <input
                type="date"
                value={to}
                onChange={(e) =>
                  setTo(e.target.value)
                }
              />

            </>

          )}

        </div>

        {/* ================= BUTTONS ================= */}
        <div className="principal-btn-group">

          <button
            className="load-btn"
            onClick={loadStudents}
          >
            Load Students
          </button>

          <button
            className="report-btn"
            onClick={generateReport}
          >
            Generate Report
          </button>

          <button
            className="low-btn"
            onClick={showLowAttendance}
          >
            Show Low Attendance
          </button>

        </div>

      </div>

      {/* ================= STUDENTS ================= */}
      <div className="principal-student-card">

        <div className="student-top">

          <h2>
            👨‍🎓 Students
          </h2>

          {selectedStudent && (

            <button
              className="clear-btn"
              onClick={() =>
                setSelectedStudent(null)
              }
            >
              Clear Selection
            </button>

          )}

        </div>

        {students.length === 0 ? (

          <p className="empty-text">
            No students loaded
          </p>

        ) : (

          <div className="student-grid">

            {students.map((s) => (

              <div
                key={s.id}
                className={`student-chip ${
                  selectedStudent === s.id
                    ? "active-student"
                    : ""
                }`}
                onClick={() =>
                  setSelectedStudent(s.id)
                }
              >

                {s.full_name}

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ================= LOADING ================= */}
      {loading && (

        <div className="loading-box">
          Loading Report...
        </div>

      )}

      {/* ================= REPORT ================= */}
      {report.length > 0 && (

        <div className="principal-report-card">

          <h2>
            📈 Attendance Report
          </h2>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Name</th>

                  <th>Total Classes</th>

                  <th>Present</th>

                  <th>Absent</th>

                  <th>Attendance %</th>

                </tr>

              </thead>

              <tbody>

                {report.map((r) => (

                  <tr key={r.id}>

                    <td>
                      {r.name}
                    </td>

                    <td>
                      {r.total}
                    </td>

                    <td>
                      {r.present}
                    </td>

                    <td>
                      {r.absent}
                    </td>

                    <td>

                      <span
                        className={
                          r.percentage < 75
                            ? "low-badge"
                            : "good-badge"
                        }
                      >

                        {r.percentage}%

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* ================= HOLIDAYS ================= */}
      {holidays.length > 0 && (

        <div className="principal-report-card">

          <h2>
            🎉 Holidays
          </h2>

          {holidays.map((h) => (

            <div
              key={h.id}
              className="holiday-item"
            >

              <strong>
                {h.title}
              </strong>

              <p>
                {h.holiday_date}
              </p>

            </div>

          ))}

        </div>

      )}

      {/* ================= LOW ATTENDANCE ================= */}
      {lowStudents.length > 0 && (

        <div className="principal-report-card">

          <h2>
            ⚠️ Low Attendance Students
          </h2>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Name</th>

                  <th>Attendance %</th>

                </tr>

              </thead>

              <tbody>

                {lowStudents.map((s) => (

                  <tr key={s.id}>

                    <td>
                      {s.name}
                    </td>

                    <td>

                      <span className="low-badge">

                        {s.percentage}%

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* ================= NO DATA ================= */}
      {searched &&
        !loading &&
        report.length === 0 &&
        holidays.length === 0 &&
        lowStudents.length === 0 && (

        <div className="principal-report-card">

          <h2>
            📭 No Attendance Found
          </h2>

          <p className="empty-report">

            No attendance or holiday records
            found for the selected filters.

          </p>

        </div>

      )}

    </div>
  );
}