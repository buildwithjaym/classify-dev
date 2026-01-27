import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });
console.log("ENV CHECK:", {
  PORT: process.env.PORT,
  SUPABASE_URL: process.env.SUPABASE_URL ? "OK" : "MISSING",
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY ? "OK" : "MISSING",
});



import { authRouter } from "./routes/auth.routes.js";
import { studentRouter } from "./routes/student.routes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "classify-api" });
});

app.use("/auth", authRouter);
app.use("/student", studentRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
