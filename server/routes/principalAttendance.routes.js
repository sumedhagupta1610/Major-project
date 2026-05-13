const express = require("express");

const router = express.Router();

const db = require("../db");

// ================= REPORT =================
router.get("/report", async (req, res) => {

  try {

    const {
      branch,
      year,
      type,
      date,
      month,
      week,
      reportYear,
      from,
      to,
      studentId
    } = req.query;

    let condition = `
      attendance.branch='${branch}'
      AND attendance.year='${year}'
    `;

    // ================= STUDENT =================
    if (studentId) {

      condition += `
        AND attendance.student_id='${studentId}'
      `;
    }

    // ================= DAILY =================
    if (type === "daily") {

      condition += `
        AND attendance.date='${date}'
      `;
    }

    // ================= WEEKLY =================
    else if (type === "weekly") {

      let startDay = 1;
      let endDay = 7;

      if (week === "2") {

        startDay = 8;
        endDay = 14;
      }

      else if (week === "3") {

        startDay = 15;
        endDay = 21;
      }

      else if (week === "4") {

        startDay = 22;
        endDay = 31;
      }

      condition += `
        AND DATE_FORMAT(attendance.date,'%Y-%m')='${month}'
        AND DAY(attendance.date)
        BETWEEN ${startDay} AND ${endDay}
        AND attendance.date <= CURDATE()
      `;
    }

    // ================= MONTHLY =================
    else if (type === "monthly") {

      condition += `
        AND DATE_FORMAT(attendance.date,'%Y-%m')='${month}'
      `;
    }

    // ================= YEARLY =================
    else if (type === "yearly") {

      condition += `
        AND YEAR(attendance.date)='${reportYear}'
      `;
    }

    // ================= CUSTOM =================
    else if (type === "custom") {

      condition += `
        AND attendance.date
        BETWEEN '${from}'
        AND '${to}'
      `;
    }

    // ================= MAIN REPORT =================
    const [rows] = await db.query(

      `SELECT

        users.id,

        users.full_name AS name,

        COUNT(attendance.id) AS total,

        SUM(
          CASE
            WHEN attendance.status='present'
            THEN 1
            ELSE 0
          END
        ) AS present,

        SUM(
          CASE
            WHEN attendance.status='absent'
            THEN 1
            ELSE 0
          END
        ) AS absent,

        ROUND(
          (
            SUM(
              CASE
                WHEN attendance.status='present'
                THEN 1
                ELSE 0
              END
            ) / COUNT(attendance.id)
          ) * 100,
          1
        ) AS percentage

      FROM attendance

      JOIN users
      ON attendance.student_id = users.id

      WHERE ${condition}

      GROUP BY users.id

      ORDER BY percentage DESC`
    );

    // ================= HOLIDAYS =================
    let holidayCondition = "";

    // DAILY
    if (type === "daily") {

      holidayCondition = `
        holiday_date='${date}'
      `;
    }

    // WEEKLY
    else if (type === "weekly") {

      let startDay = 1;
      let endDay = 7;

      if (week === "2") {

        startDay = 8;
        endDay = 14;
      }

      else if (week === "3") {

        startDay = 15;
        endDay = 21;
      }

      else if (week === "4") {

        startDay = 22;
        endDay = 31;
      }

      holidayCondition = `
        DATE_FORMAT(holiday_date,'%Y-%m')='${month}'
        AND DAY(holiday_date)
        BETWEEN ${startDay} AND ${endDay}
        AND holiday_date <= CURDATE()
      `;
    }

    // MONTHLY
    else if (type === "monthly") {

      holidayCondition = `
        DATE_FORMAT(holiday_date,'%Y-%m')='${month}'
      `;
    }

    // YEARLY
    else if (type === "yearly") {

      holidayCondition = `
        YEAR(holiday_date)='${reportYear}'
      `;
    }

    // CUSTOM
    else if (type === "custom") {

      holidayCondition = `
        holiday_date
        BETWEEN '${from}'
        AND '${to}'
      `;
    }

    let holidayRows = [];

    if (holidayCondition !== "") {

      const [rows2] = await db.query(

        `SELECT *
         FROM holidays
         WHERE ${holidayCondition}`
      );

      holidayRows = rows2;
    }

    // ================= RESPONSE =================
    res.json({

      report: rows || [],

      holidays: holidayRows || []

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server Error"
    });

  }
});

// ================= LOW ATTENDANCE =================
router.get("/low", async (req, res) => {

  try {

    const {
      branch,
      year
    } = req.query;

    const [rows] = await db.query(

      `SELECT

        users.id,

        users.full_name AS name,

        ROUND(
          (
            SUM(
              CASE
                WHEN attendance.status='present'
                THEN 1
                ELSE 0
              END
            )
            /
            COUNT(attendance.id)
          ) * 100,
          1
        ) AS percentage

      FROM attendance

      JOIN users
      ON attendance.student_id = users.id

      WHERE attendance.branch='${branch}'
      AND attendance.year='${year}'

      GROUP BY users.id

      HAVING percentage < 75

      ORDER BY percentage ASC`
    );

    res.json(rows || []);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server Error"
    });

  }
});

module.exports = router;