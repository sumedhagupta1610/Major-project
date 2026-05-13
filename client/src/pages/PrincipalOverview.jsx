import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/overview.css";

export default function PrincipalOverview() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({

    totalStudents: 0,

    totalTeachers: 0,

    totalBranches: 0

  });

  const [branches, setBranches] =
    useState([]);

  const [popupTitle, setPopupTitle] =
    useState("");

  const [popupData, setPopupData] =
    useState([]);

  const [showPopup, setShowPopup] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {

    async function fetchOverview() {

      try {

        const res = await fetch(
          "http://localhost:5000/api/overview"
        );

        const data = await res.json();

        setStats({

          totalStudents:
            data.totalStudents || 0,

          totalTeachers:
            data.totalTeachers || 0,

          totalBranches:
            data.totalBranches || 0

        });

        setBranches(
          data.branches || []
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    }

    fetchOverview();

  }, []);

  // ================= OPEN POPUP =================
  function openPopup(title, data) {

    setPopupTitle(title);

    setPopupData(data);

    setShowPopup(true);
  }

  return (

    <div className="principal-page">

      {/* ================= TOP ================= */}
      <div className="principal-page-top">

        <div>

          <h1>
            🎓 College Overview
          </h1>

          <p>
            Principal monitoring dashboard
          </p>

        </div>

        <button
          className="back-btn"
          onClick={() =>
            navigate("/principal/dashboard")
          }
        >
          ← Back
        </button>

      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <p>
          Loading overview...
        </p>
      )}

      {/* ================= STATS ================= */}
      {!loading && (

        <div className="overview-grid">

          <div className="overview-card blue">

            <h2>
              👨‍🎓 Total Students
            </h2>

            <h1>
              {stats.totalStudents}
            </h1>

          </div>

          <div className="overview-card purple">

            <h2>
              👨‍🏫 Total Teachers
            </h2>

            <h1>
              {stats.totalTeachers}
            </h1>

          </div>

          <div className="overview-card green">

            <h2>
              🏫 Total Branches
            </h2>

            <h1>
              {stats.totalBranches}
            </h1>

          </div>

        </div>

      )}

      {/* ================= BRANCH DATA ================= */}
      {!loading && (

        <div className="principal-table-card">

          <h2>
            📊 Branch & Year Overview
          </h2>

          <div className="table-wrapper">

            <table className="principal-table">

              <thead>

                <tr>

                  <th>Branch</th>

                  <th>Year</th>

                  <th>Total Students</th>

                  <th>Total Teachers</th>

                  <th>View Details</th>

                </tr>

              </thead>

              <tbody>

                {branches.length === 0 && (

                  <tr>

                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "20px"
                      }}
                    >
                      No branch data found
                    </td>

                  </tr>

                )}

                {branches.map((b, index) => (

                  <tr key={index}>

                    <td>
                      {b.branch}
                    </td>

                    <td>
                      Year {b.year}
                    </td>

                    <td>
                      {b.studentCount}
                    </td>

                    <td>
                      {b.teacherCount}
                    </td>

                    <td>

                      <button
                        className="mini-btn"
                        onClick={() =>
                          openPopup(
                            `${b.branch} Year ${b.year} Students`,
                            b.students || []
                          )
                        }
                      >
                        Students
                      </button>

                      <button
                        className="mini-btn purple-btn"
                        onClick={() =>
                          openPopup(
                            `${b.branch} Teachers`,
                            b.teachers || []
                          )
                        }
                      >
                        Teachers
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* ================= POPUP ================= */}
      {showPopup && (

        <div className="popup-overlay">

          <div className="popup-box large-popup">

            <h2>
              {popupTitle}
            </h2>

            <div className="popup-list">

              {popupData.length === 0 && (

                <p>
                  No data found
                </p>

              )}

              {popupData.map((item, index) => (

                <div
                  key={index}
                  className="popup-item"
                >

                  <strong>
                    {item.full_name}
                  </strong>

                  <span>

                    Branch:
                    {" "}
                    {item.branch || "N/A"}

                    {" | "}

                    Year:
                    {" "}
                    {item.year || "N/A"}

                  </span>

                </div>

              ))}

            </div>

            <button
              className="ok-btn"
              onClick={() =>
                setShowPopup(false)
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