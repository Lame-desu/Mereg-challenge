import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import uploadRouter from "./routes/upload";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/upload", uploadRouter);

// Serve results folder for downloads
app.use("/results", express.static(path.join(__dirname, "..", "results")));

app.get("/", (_req, res) => {
  res.send(
    "CSV Stream Processor is up. POST /upload with form-data file field `file`."
  );
});

export default app;
