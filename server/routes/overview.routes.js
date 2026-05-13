const express = require("express");

const router = express.Router();

const db = require("../db");

// ================= OVERVIEW =================
router.get("/", async (req, res) => {

  try {

    // ================= STUDENTS =================
    const [studentRows] = await db.query(

      `SELECT *
       FROM users
       WHERE role='student'`

    );

    // ================= TEACHERS =================
    const [teacherRows] = await db.query(

      `SELECT *
       FROM users
       WHERE role='teacher'`

    );

    // ================= BRANCH + YEAR =================
    const [groupRows] = await db.query(

      `SELECT DISTINCT branch, year
       FROM users
       WHERE role='student'
       AND branch IS NOT NULL
       AND branch != ''
       AND year IS NOT NULL`

    );

    const branches = [];

    // ================= LOOP =================
    for (const g of groupRows) {

      const branchName = g.branch;

      const year = g.year;

      // ================= STUDENTS =================
      const students =
        studentRows.filter(

          s =>

            s.branch === branchName &&

            String(s.year) === String(year)

        );

      // ================= TEACHERS =================
      const teachers =
        teacherRows.filter(

          t =>

            t.branch === branchName &&

            String(t.year) === String(year)

        );

      branches.push({

        branch: branchName,

        year,

        studentCount:
          students.length,

        teacherCount:
          teachers.length,

        students,

        teachers

      });
    }

    // ================= UNIQUE BRANCH COUNT =================
    const uniqueBranches = [

      ...new Set(

        groupRows.map(
          g => g.branch
        )

      )

    ];

    // ================= RESPONSE =================
    res.json({

      totalStudents:
        studentRows.length,

      totalTeachers:
        teacherRows.length,

      totalBranches:
        uniqueBranches.length,

      branches

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      error: "Server error"

    });

  }
});

module.exports = router;