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

      // 🔥 GET USER OBJECT
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      console.log("USER:", user);

      // 🔥 SAFETY CHECK
      if (!user || !user.id) {

        console.error(
          "Student not found"
        );

        setLoading(false);

        return;
      }

      const studentId = user.id;

      // 🔥 FETCH
      const res = await fetch(

        `http://localhost:5000/api/attendance/student/${studentId}`

      );

      const result =
        await res.json();

      console.log(
        "ATTENDANCE:",
        result
      );

      setData(result);

    } catch (err) {

      console.error(
        "ATTENDANCE ERROR:",
        err
      );

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

  return (

    <div className="attendance-page">

      <h2>
        📊 My Attendance
      </h2>

      {/* ================= GRAPH ================= */}
      <div className="graph-box">

        <div className="circle">

          <span>
            {data.percentage}%
          </span>

        </div>

        <p>
          Attendance Percentage
        </p>

      </div>

      {/* ================= STATS ================= */}
      <div className="stats">

        <p>
          ✅ Present:
          {" "}
          {data.present}
        </p>

        <p>
          ❌ Absent:
          {" "}
          {data.absent}
        </p>

        <p>
          📚 Total:
          {" "}
          {data.total}
        </p>

      </div>

      {/* ================= ABSENT DATES ================= */}
      <div className="absent-box">

        <h3>
          📅 Absent Dates
        </h3>

        {data.absentDates &&
        data.absentDates.length === 0 ? (

          <p>
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