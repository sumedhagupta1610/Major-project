const express = require("express");

const router = express.Router();

const db = require("../db");

// ================= ADD HOLIDAY =================
router.post("/", async (req, res) => {

  try {

    const { holiday_date, reason } = req.body;

    if (!holiday_date) {

      return res.status(400).json({
        error: "Holiday date required"
      });
    }

    // CHECK DUPLICATE
    const [existing] = await db.query(
      "SELECT * FROM holidays WHERE holiday_date=?",
      [holiday_date]
    );

    if (existing.length > 0) {

      return res.status(400).json({
        error: "Holiday already exists"
      });
    }

    // INSERT
    await db.query(
      "INSERT INTO holidays (holiday_date, reason) VALUES (?, ?)",
      [holiday_date, reason]
    );

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

// ================= CHECK HOLIDAY =================
router.get("/:date", async (req, res) => {

  try {

    const { date } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM holidays WHERE holiday_date=?",
      [date]
    );

    if (rows.length > 0) {

      return res.json({
        exists: true,
        reason: rows[0].reason
      });
    }

    res.json({
      exists: false
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server error"
    });

  }
});

module.exports = router;