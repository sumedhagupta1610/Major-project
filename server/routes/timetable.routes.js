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

/* ================= GET ================= */

router.get("/", async (req, res) => {

  try {

    const [rows] = await db.query(

      "SELECT * FROM timetable ORDER BY id DESC"
    );

    res.json({ timetable: rows });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch timetable"
    });
  }
});

/* ================= POST ================= */

router.post(

  "/",

  upload.single("file"),

  async (req, res) => {

    try {

      const title = req.body.title;

      const file =
        req.file
          ? req.file.filename
          : "";

      await db.query(

        "INSERT INTO timetable (title, file, teacher_id) VALUES (?, ?, ?)",

        [title, file, 1]
      );

      res.json({
        success: true
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Upload failed"
      });
    }
  }
);

/* ================= UPDATE ================= */

router.put(

  "/:id",

  upload.single("file"),

  async (req, res) => {

    try {

      const { id } = req.params;

      const title = req.body.title;

      // OLD DATA
      const [old] = await db.query(

        "SELECT * FROM timetable WHERE id = ?",

        [id]
      );

      if (old.length === 0) {

        return res.status(404).json({
          error: "Timetable not found"
        });
      }

      // KEEP OLD FILE IF NEW FILE NOT GIVEN
      const file =
        req.file
          ? req.file.filename
          : old[0].file;

      await db.query(

        "UPDATE timetable SET title = ?, file = ? WHERE id = ?",

        [title, file, id]
      );

      res.json({
        success: true
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Update failed"
      });
    }
  }
);

/* ================= DELETE ================= */

router.delete("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(

      "DELETE FROM timetable WHERE id = ?",

      [id]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Delete failed"
    });
  }
});

module.exports = router;