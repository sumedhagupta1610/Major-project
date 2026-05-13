const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");

// STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// GET
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM timetable ORDER BY id DESC");
  res.json({ timetable: rows });
});

// POST (🔥 FILE UPLOAD)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const title = req.body.title;
    const file = req.file ? req.file.filename : "";

    await db.query(
      "INSERT INTO timetable (title, file, teacher_id) VALUES (?, ?, ?)",
      [title, file, 1]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;