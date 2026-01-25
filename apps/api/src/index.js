import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { studentRouter } from "./routes/student.routes.js";
import { authRouter } from "./routes/auth.routes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/student", studentRouter);
app.use("/auth", authRouter);

app.get("/health", (req, res) => {
    res.json({ ok: true, service: "classify-api" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
