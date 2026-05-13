const express = require("express");

const router = express.Router();

const db = require("../db");

// ================= SAVE ATTENDANCE =================
router.post("/", async (req, res) => {

  try {

    const attendanceData = req.body;

    for (const item of attendanceData) {

      await db.query(
        `INSERT INTO attendance 
        (student_id, teacher_id, branch, year, subject, status, date, time)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURTIME())`,
        [
          item.student_id,
          item.teacher_id,
          item.branch,
          item.year,
          item.subject,
          item.status,
          item.date
        ]
      );
    }

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server error"
    });

  }
});

// ================= CHECK ATTENDANCE DATE =================
router.get("/date/:date", async (req, res) => {

  try {

    const { date } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM attendance WHERE date=? LIMIT 1",
      [date]
    );

    res.json({
      exists: rows.length > 0
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server error"
    });

  }
});

// ================= FULL ATTENDANCE BY DATE =================
router.get("/full/:date", async (req, res) => {

  try {

    const { date } = req.params;

    const [rows] = await db.query(

      `SELECT 
        attendance.status,
        attendance.date,
        users.full_name
      FROM attendance
      JOIN users
      ON attendance.student_id = users.id
      WHERE attendance.date = ?`,

      [date]
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server error"
    });

  }
});

// ================= STUDENT ATTENDANCE =================
router.get("/student/:id", async (req, res) => {

  try {

    const studentId = req.params.id;

    const [rows] = await db.query(

      `SELECT 
        status,
        date
       FROM attendance
       WHERE student_id = ?`,

      [studentId]

    );

    const total = rows.length;

    const present =
      rows.filter(
        r => r.status === "present"
      ).length;

    const absent =
      rows.filter(
        r => r.status === "absent"
      ).length;

    const percentage =
      total > 0
        ? (
            (present / total) * 100
          ).toFixed(1)
        : 0;

    const absentDates =
      rows
        .filter(
          r => r.status === "absent"
        )
        .map(r => r.date);

    res.json({

      total,
      present,
      absent,
      percentage,
      absentDates

    });

  } catch (err) {

    console.error(
      "STUDENT ATTENDANCE ERROR:",
      err
    );

    res.status(500).json({
      error: "Server error"
    });

  }
});

// ================= REPORT =================
router.get("/report/:type", async (req, res) => {

  try {

    const { type } = req.params;

    const {
      month,
      year,
      week,
      from,
      to,
      studentId,
      date
    } = req.query;

    let condition = "";

    // ================= STUDENT FILTER =================
    if (studentId) {

      condition +=
        ` AND student_id='${studentId}'`;
    }

    // ================= DAILY =================
    if (type === "daily") {

      condition +=
        ` AND date='${date}'`;
    }

    // ================= MONTHLY =================
    else if (type === "monthly") {

      condition +=
        ` AND MONTH(date)='${month}'
          AND YEAR(date)='${year}'`;
    }

    // ================= YEARLY =================
    else if (type === "yearly") {

      condition +=
        ` AND YEAR(date)='${year}'`;
    }

    // ================= WEEKLY =================
    else if (type === "weekly") {

      condition +=
        ` AND MONTH(date)='${month}'
          AND YEAR(date)='${year}'`;

      if (week == 1) {

        condition +=
          ` AND DAY(date)
            BETWEEN 1 AND 7`;
      }

      else if (week == 2) {

        condition +=
          ` AND DAY(date)
            BETWEEN 8 AND 14`;
      }

      else if (week == 3) {

        condition +=
          ` AND DAY(date)
            BETWEEN 15 AND 21`;
      }

      else if (week == 4) {

        condition +=
          ` AND DAY(date)
            BETWEEN 22 AND 31`;
      }
    }

    // ================= CUSTOM =================
    else if (type === "custom") {

      condition +=
        ` AND date
          BETWEEN '${from}'
          AND '${to}'`;
    }

    // ================= TOTAL CLASSES =================
    const [totalRows] = await db.query(

      `SELECT COUNT(DISTINCT date) as total
       FROM attendance
       WHERE 1=1 ${condition}`

    );

    // ================= PRESENT =================
    const [presentRows] = await db.query(

      `SELECT COUNT(*) as present
       FROM attendance
       WHERE status='present'
       ${condition}`

    );

    // ================= ABSENT =================
    const [absentRows] = await db.query(

      `SELECT COUNT(*) as absent
       FROM attendance
       WHERE status='absent'
       ${condition}`

    );

    // ================= HOLIDAYS =================
    let holidayCondition = "";

    if (type === "daily") {

      holidayCondition =
        ` WHERE holiday_date='${date}'`;
    }

    else if (type === "monthly") {

      holidayCondition =
        ` WHERE MONTH(holiday_date)='${month}'
          AND YEAR(holiday_date)='${year}'`;
    }

    else if (type === "yearly") {

      holidayCondition =
        ` WHERE YEAR(holiday_date)='${year}'`;
    }

    else if (type === "weekly") {

      holidayCondition =
        ` WHERE MONTH(holiday_date)='${month}'
          AND YEAR(holiday_date)='${year}'`;

      if (week == 1) {

        holidayCondition +=
          ` AND DAY(holiday_date)
            BETWEEN 1 AND 7`;
      }

      else if (week == 2) {

        holidayCondition +=
          ` AND DAY(holiday_date)
            BETWEEN 8 AND 14`;
      }

      else if (week == 3) {

        holidayCondition +=
          ` AND DAY(holiday_date)
            BETWEEN 15 AND 21`;
      }

      else if (week == 4) {

        holidayCondition +=
          ` AND DAY(holiday_date)
            BETWEEN 22 AND 31`;
      }
    }

    else if (type === "custom") {

      holidayCondition =
        ` WHERE holiday_date
          BETWEEN '${from}'
          AND '${to}'`;
    }

    const [holidayRows] = await db.query(

      `SELECT COUNT(*) as holidays
       FROM holidays
       ${holidayCondition}`

    );

    const total =
      totalRows[0].total || 0;

    const present =
      presentRows[0].present || 0;

    const absent =
      absentRows[0].absent || 0;

    const holidays =
      holidayRows[0].holidays || 0;

    // ================= PERCENTAGE =================
    let percentage = 0;

    if (studentId) {

      percentage =
        total > 0
          ? ((present / total) * 100).toFixed(1)
          : 0;

    } else {

      const totalStudents =
        present + absent;

      percentage =
        totalStudents > 0
          ? ((present / totalStudents) * 100).toFixed(1)
          : 0;
    }

    res.json({

      total,
      present,
      absent,
      holidays,
      percentage

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server error"
    });

  }
});

module.exports = router;