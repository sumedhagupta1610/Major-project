import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
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

// 🔥 PRINCIPAL OVERVIEW
import PrincipalOverview from "./pages/PrincipalOverview";

// ATTENDANCE
import Attendance from "./pages/attendance";

// 🔥 REPORT PAGE
import Report from "./pages/Report";

// NOTICE
import Notice from "./pages/Notice";

// NOTES
import Note from "./pages/Note";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* ADMIN */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={<AdminPanel />}
        />

        {/* DASHBOARDS */}
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/teacher/dashboard"
          element={<TeacherDashboard />}
        />

        <Route
          path="/principal/dashboard"
          element={<PrincipalDashboard />}
        />

        {/* TEACHER ATTENDANCE */}
        <Route
          path="/teacher/attendance"
          element={<Attendance />}
        />

        {/* REPORT PAGE */}
        <Route
          path="/teacher/attendance-report"
          element={<Report />}
        />

        {/* PRINCIPAL ATTENDANCE */}
        <Route
          path="/principal/attendance"
          element={<PrincipalAttendance />}
        />

        {/* 🔥 PRINCIPAL OVERVIEW */}
        <Route
          path="/principal/overview"
          element={<PrincipalOverview />}
        />

        {/* NOTICES */}
        <Route
          path="/teacher/notices"
          element={<Notice />}
        />

        <Route
          path="/principal/notices"
          element={<Notice />}
        />

        <Route
          path="/student/notices"
          element={<StudentNotices />}
        />

        {/* ASSIGNMENTS */}
        <Route
          path="/teacher/assignment"
          element={<Assignment />}
        />

        <Route
          path="/student/assignments"
          element={<StudentAssignments />}
        />

        {/* NOTES */}
        <Route
          path="/teacher/note"
          element={<Note />}
        />

        <Route
          path="/student/notes"
          element={<StudentNotes />}
        />

        {/* TIMETABLE */}
        <Route
          path="/teacher/timetable"
          element={<Timetable />}
        />

        <Route
          path="/student/timetable"
          element={<StudentTimetable />}
        />

        {/* STUDENT ATTENDANCE */}
        <Route
          path="/student/attendance"
          element={<StudentAttendance />}
        />

      </Routes>

    </BrowserRouter>
  );
}