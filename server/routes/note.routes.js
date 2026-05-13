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
  const [rows] = await db.query("SELECT * FROM notes ORDER BY id DESC");
  res.json({ notes: rows });
});

// POST (🔥 FILE UPLOAD)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, subject } = req.body;
    const file = req.file ? req.file.filename : "";

    if (!title || !subject) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    await db.query(
      "INSERT INTO notes (title, subject, link, branch, year, teacher_id) VALUES (?, ?, ?, ?, ?, ?)",
      [title, subject, file, "ALL", "ALL", 1]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM notes WHERE id=?", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;