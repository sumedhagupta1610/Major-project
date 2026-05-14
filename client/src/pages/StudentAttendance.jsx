import React, { useEffect, useState } from "react";
import "../styles/s_attendance.css";

export default function StudentAttendance() {

  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(true);

  // ================= LOAD =================
  useEffect(() => {

    fetchAttendance();

  }, []);

  // ================= FETCH ATTENDANCE =================
  async function fetchAttendance() {

    try {

      setLoading(true);

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user || !user.id) {

        setLoading(false);

        return;
      }

      const studentId = user.id;

      const res = await fetch(

        `http://localhost:5000/api/attendance/student/${studentId}`

      );

      const result =
        await res.json();

      setData(result);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  }

  // ================= LOADING =================
  if (loading) {

    return (

      <div className="attendance-page">

        <p className="loading-text">
          Loading attendance...
        </p>

      </div>

    );
  }

  // ================= NO DATA =================
  if (!data) {

    return (

      <div className="attendance-page">

        <p className="loading-text">
          Attendance data not found
        </p>

      </div>

    );
  }

  // 🔥 PIE GRAPH
  const percentage =
    Number(data.percentage || 0);

  const graphStyle = {

    background: `conic-gradient(
      #22c55e 0% ${percentage}%,
      #ef4444 ${percentage}% 100%
    )`
  };

  return (

    <div className="attendance-page">

      <h2 className="attendance-title">
        📊 My Attendance
      </h2>

      {/* ================= TOP CARD ================= */}

      <div className="attendance-card">

        {/* GRAPH */}
        <div className="graph-section">

          <div
            className="pie-chart"
            style={graphStyle}
          >

            <div className="inner-circle">

              <span>
                {percentage}%
              </span>

            </div>

          </div>

          <p className="graph-label">
            Attendance Percentage
          </p>

        </div>

        {/* STATS */}

        <div className="stats-box">

          <div className="stat-card present">

            <h3>Present</h3>

            <p>{data.present}</p>

          </div>

          <div className="stat-card absent">

            <h3>Absent</h3>

            <p>{data.absent}</p>

          </div>

          <div className="stat-card total">

            <h3>Total Classes</h3>

            <p>{data.total}</p>

          </div>

        </div>

      </div>

      {/* ================= ABSENT DATES ================= */}

      <div className="absent-box">

        <h3>
          📅 Absent Dates
        </h3>

        {data.absentDates &&
        data.absentDates.length === 0 ? (

          <p className="no-absent">
            No absents 🎉
          </p>

        ) : (

          <ul>

            {data.absentDates?.map((d, i) => (

              <li key={i}>

                {String(d).split("T")[0]}

              </li>

            ))}

          </ul>

        )}

      </div>

    </div>
  );
}