import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { processCsvFile } from "../services/csvProcessor";

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "..", "uploads");
const ensureDir = (p: string) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
};
ensureDir(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 * 1024 },
}); // 10GB limit as example

// POST /upload
// field name: file
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ error: "No file uploaded. Use `file` field in form-data." });

  const uploadedPath = req.file.path;

  try {
    const resultFilename = await processCsvFile(uploadedPath);
    const downloadUrl = `/results/${resultFilename}`;

    // Return link to result file
    return res.json({ downloadUrl });
  } catch (err) {
    console.error("Processing failed", err);
    return res.status(500).json({ error: "Failed to process CSV" });
  } finally {
    // Remove uploaded temp file if exists
    fs.unlink(uploadedPath, (e) => {
      if (e) console.warn("Failed to remove temp upload", e);
    });
  }
});

export default router;
