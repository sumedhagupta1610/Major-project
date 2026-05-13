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
  const [rows] = await db.query("SELECT * FROM assignments ORDER BY id DESC");
  res.json({ assignments: rows });
});

// POST
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, branch, year, teacher_id } = req.body;
    const file = req.file ? req.file.filename : "";

    if (!title || !description) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    await db.query(
      "INSERT INTO assignments (title, description, link, branch, year, teacher_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        file,
        branch || "ALL",
        year || "ALL",
        teacher_id || 1
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM assignments WHERE id=?", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;