const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");

/* =========================
   FILE STORAGE CONFIG
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* =========================
   GET NOTICES (FILTERED 🔥)
========================= */
router.get("/", async (req, res) => {
  try {
    const { branch, year } = req.query;

    let sql = `
      SELECT * FROM notices
      WHERE (branch = 'ALL' AND year = 'ALL')
    `;

    const params = [];

    // 🔥 show specific notices also
    if (branch && year) {
      sql += ` OR (branch = ? AND year = ?)`;
      params.push(branch, year);
    }

    sql += " ORDER BY id DESC";

    const [rows] = await db.query(sql, params);

    res.json({ notices: rows });

  } catch (err) {
    console.error("GET NOTICE ERROR:", err);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});


/* =========================
   ADD NOTICE (UPLOAD 🔥)
========================= */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, content, branch, year, teacher_id } = req.body;

    const file = req.file ? req.file.filename : "";

    await db.query(
      `INSERT INTO notices 
      (title, content, image, branch, year, teacher_id) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title || "",
        content || "",
        file,
        branch || "ALL",
        year || "ALL",
        teacher_id || 1
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});


/* =========================
   DELETE NOTICE
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM notices WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});


/* =========================
   UPDATE NOTICE
========================= */
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const file = req.file ? req.file.filename : null;

    if (file) {
      await db.query(
        `UPDATE notices 
         SET title=?, content=?, image=? 
         WHERE id=?`,
        [title, content, file, req.params.id]
      );
    } else {
      await db.query(
        `UPDATE notices 
         SET title=?, content=? 
         WHERE id=?`,
        [title, content, req.params.id]
      );
    }

    res.json({ success: true });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;