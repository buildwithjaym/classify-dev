import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { supabaseAdmin } from "../supabaseAdmin.js";

export const authRouter = express.Router();

// GET /auth/me
authRouter.get("/me", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("user_id, role, full_name, student_no, employee_no, department_id, section_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Profile not found" });

  res.json({ profile: data });
});
