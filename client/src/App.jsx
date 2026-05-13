import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

import AdminPanel from "./pages/AdminPanel";

import Assignment from "./pages/Assignment";

import StudentDashboard from "./pages/dashboards/StudentDashboard";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import PrincipalDashboard from "./pages/dashboards/PrincipalDashboard";

import StudentNotes from "./pages/StudentsNotes";
import StudentAssignments from "./pages/StudentAssignment";
import StudentNotices from "./pages/StudentNotices";

import Timetable from "./pages/Timtable";
import StudentTimetable from "./pages/StudentTimetable";

import StudentAttendance from "./pages/StudentAttendance";
import PrincipalAttendance from "./pages/PrincipalAttendance";

import PrincipalOverview from "./pages/PrincipalOverview";

import Attendance from "./pages/attendance";

import Report from "./pages/Report";

import Notice from "./pages/Notice";

import Note from "./pages/Note";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= HOME ================= */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* ================= LOGIN ================= */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin/dashboard"
          element={<AdminPanel />}
        />

        {/* ================= STUDENT ================= */}
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/attendance"
          element={<StudentAttendance />}
        />

        <Route
          path="/student/notes"
          element={<StudentNotes />}
        />

        <Route
          path="/student/assignments"
          element={<StudentAssignments />}
        />

        <Route
          path="/student/notices"
          element={<StudentNotices />}
        />

        <Route
          path="/student/timetable"
          element={<StudentTimetable />}
        />

        {/* ================= TEACHER ================= */}
        <Route
          path="/teacher/dashboard"
          element={<TeacherDashboard />}
        />

        <Route
          path="/teacher/attendance"
          element={<Attendance />}
        />

        <Route
          path="/teacher/attendance-report"
          element={<Report />}
        />

        <Route
          path="/teacher/notices"
          element={<Notice />}
        />

        <Route
          path="/teacher/assignment"
          element={<Assignment />}
        />

        <Route
          path="/teacher/note"
          element={<Note />}
        />

        <Route
          path="/teacher/timetable"
          element={<Timetable />}
        />

        {/* ================= PRINCIPAL ================= */}
        <Route
          path="/principal/dashboard"
          element={<PrincipalDashboard />}
        />

        <Route
          path="/principal/attendance"
          element={<PrincipalAttendance />}
        />

        <Route
          path="/principal/overview"
          element={<PrincipalOverview />}
        />

        <Route
          path="/principal/notices"
          element={<Notice />}
        />

      </Routes>

    </BrowserRouter>
  );
}