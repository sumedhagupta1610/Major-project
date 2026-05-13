const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

const path = require("path");

// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// ================= ROUTES =================

// AUTH
app.use(
  "/api/auth",
  require("./routes/auth.routes")
);

// NOTICES
app.use(
  "/api/notices",
  require("./routes/notice.routes")
);

// ================= TEACHER ATTENDANCE =================
app.use(
  "/api/attendance",
  require("./routes/attendance.routes")
);

// ================= PRINCIPAL ATTENDANCE =================
app.use(
  "/api/principal-attendance",
  require("./routes/principalAttendance.routes")
);

// HOLIDAYS
app.use(
  "/api/holidays",
  require("./routes/holiday.routes")
);

// ASSIGNMENTS
app.use(
  "/api/assignments",
  require("./routes/assignment.routes")
);

// NOTES
app.use(
  "/api/notes",
  require("./routes/note.routes")
);

// TIMETABLE
app.use(
  "/api/timetable",
  require("./routes/timetable.routes")
);

// CHATBOT
app.use(
  "/api/chat",
  require("./routes/chat.routes")
);

// STUDENT LIST
app.use(
  "/api/students",
  require("./routes/studentList.routes")
);

// ADMIN
app.use(
  "/api/admin",
  require("./routes/admin.routes")
);

// OVERVIEW
app.use(
  "/api/overview",
  require("./routes/overview.routes")
);

// ================= FILES =================
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ================= SERVER =================

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});