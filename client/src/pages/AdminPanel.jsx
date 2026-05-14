import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

export default function AdminPanel() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState("");

  const [credentials, setCredentials] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    role: "student",
    branch: "",
    year: ""
  });

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= FETCH USERS =================
  async function fetchUsers() {

    try {

      const res = await fetch(
        `${API_URL}/api/admin/users`
      );

      const data = await res.json();

      setUsers(data.users || []);

    } catch (err) {

      console.error(
        "FETCH ERROR:",
        err
      );
    }
  }

  // ================= LOGOUT =================
  function logout() {

    localStorage.clear();

    navigate("/login");
  }

  // ================= CREATE USER =================
  async function handleSave(e) {

    e.preventDefault();

    if (!form.full_name.trim()) {

      alert("Name is required");

      return;
    }

    try {

      const res = await fetch(

        `${API_URL}/api/admin/create-user`,

        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      setCredentials({

        email: data.email,

        password: data.password
      });

      setForm({

        full_name: "",

        role: "student",

        branch: "",

        year: ""
      });

      fetchUsers();

      setShowModal(false);

    } catch (err) {

      console.error(
        "CREATE ERROR:",
        err
      );
    }
  }

  // ================= DELETE =================
  async function deleteUser(id) {

    if (
      !window.confirm("Delete user?")
    ) return;

    await fetch(

      `${API_URL}/api/admin/users/${id}`,

      {
        method: "DELETE"
      }
    );

    fetchUsers();
  }

  // ================= UPDATE =================
  async function handleUpdate(e) {

    e.preventDefault();

    try {

      await fetch(

        `${API_URL}/api/admin/users/${editUser.id}`,

        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(editUser)
        }
      );

      setEditUser(null);

      fetchUsers();

    } catch (err) {

      console.error(
        "UPDATE ERROR:",
        err
      );
    }
  }

  return (

    <div className="admin-panel">

      {/* HEADER */}
      <div className="admin-header">

        <div>

          <h2>
            Admin Panel
          </h2>

          <p className="admin-subtitle">
            Manage users and system access
          </p>

        </div>

        <div className="admin-actions">

          <input
            className="search-input"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button
            className="create-btn"
            onClick={() =>
              setShowModal(true)
            }
          >
            + Create User
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

      {/* TABLE */}
      <table className="admin-table">

        <thead>

          <tr>

            <th>ID</th>

            <th>Name</th>

            <th>Role</th>

            <th>Branch</th>

            <th>Year</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {users

            .filter((u) =>

              u.full_name
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            )

            .map((u) => (

              <tr key={u.id}>

                <td>{u.id}</td>

                <td>{u.full_name}</td>

                <td>{u.role}</td>

                <td>
                  {u.branch || "-"}
                </td>

                <td>
                  {u.year || "-"}
                </td>

                <td className="action-buttons">

                  <button
                    className="update-btn"
                    onClick={() =>
                      setEditUser(u)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteUser(u.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

        </tbody>

      </table>

      {/* CREATE MODAL */}
      {showModal && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowModal(false)
          }
        >

          <div
            className="modal-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3>
              Create User
            </h3>

            <form onSubmit={handleSave}>

              <input
                placeholder="Name"
                value={form.full_name}
                onChange={(e) =>

                  setForm({

                    ...form,

                    full_name:
                      e.target.value
                  })
                }
              />

              {/* ROLE */}
              <select
                value={form.role}
                onChange={(e) =>

                  setForm({

                    ...form,

                    role:
                      e.target.value
                  })
                }
              >

                <option value="student">
                  Student
                </option>

                <option value="teacher">
                  Teacher
                </option>

                <option value="principal">
                  Principal
                </option>

              </select>

              {/* BRANCH */}
              <select
                value={form.branch}
                onChange={(e) =>

                  setForm({

                    ...form,

                    branch:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Select Branch
                </option>

                <option value="CS">
                  CS
                </option>

                <option value="IT">
                  IT
                </option>

                <option value="CE">
                  CE
                </option>

                <option value="EE">
                  EE
                </option>

                <option value="EL">
                  EL
                </option>

              </select>

              {/* YEAR */}
              <select
                value={form.year}
                onChange={(e) =>

                  setForm({

                    ...form,

                    year:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Select Year
                </option>

                <option value="1">
                  1
                </option>

                <option value="2">
                  2
                </option>

                <option value="3">
                  3
                </option>

              </select>

              <button className="create-btn">
                Create
              </button>

            </form>

          </div>

        </div>

      )}

      {/* CREDENTIAL POPUP */}
      {credentials && (

        <div
          className="modal-overlay"
          onClick={() =>
            setCredentials(null)
          }
        >

          <div
            className="modal-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3>
              User Created 🎉
            </h3>

            <p>
              <strong>Email:</strong>
              {" "}
              {credentials.email}
            </p>

            <p>
              <strong>Password:</strong>
              {" "}
              {credentials.password}
            </p>

            <button
              className="create-btn"
              onClick={() =>
                setCredentials(null)
              }
            >
              OK
            </button>

          </div>

        </div>

      )}

      {/* UPDATE MODAL */}
      {editUser && (

        <div
          className="modal-overlay"
          onClick={() =>
            setEditUser(null)
          }
        >

          <div
            className="modal-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3>
              Edit User
            </h3>

            <form onSubmit={handleUpdate}>

              <input
                value={editUser.full_name}
                onChange={(e) =>

                  setEditUser({

                    ...editUser,

                    full_name:
                      e.target.value
                  })
                }
              />

              {/* ROLE */}
              <select
                value={editUser.role}
                onChange={(e) =>

                  setEditUser({

                    ...editUser,

                    role:
                      e.target.value
                  })
                }
              >

                <option value="student">
                  Student
                </option>

                <option value="teacher">
                  Teacher
                </option>

                <option value="principal">
                  Principal
                </option>

              </select>

              {/* BRANCH */}
              <select
                value={editUser.branch || ""}
                onChange={(e) =>

                  setEditUser({

                    ...editUser,

                    branch:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Select Branch
                </option>

                <option value="CS">
                  CS
                </option>

                <option value="IT">
                  IT
                </option>

                <option value="CE">
                  CE
                </option>

                <option value="EE">
                  EE
                </option>

                <option value="EL">
                  EL
                </option>

              </select>

              {/* YEAR */}
              <select
                value={editUser.year || ""}
                onChange={(e) =>

                  setEditUser({

                    ...editUser,

                    year:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Select Year
                </option>

                <option value="1">
                  1
                </option>

                <option value="2">
                  2
                </option>

                <option value="3">
                  3
                </option>

              </select>

              <button className="update-btn">
                Update
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}