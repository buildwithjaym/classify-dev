import express from "express";
import { supabaseAdmin } from "../config/supabaseAdmin.js";

export const studentRouter = express.Router();

// Temporary MVP (until JWT auth): pass student_user_id in query
studentRouter.get("/today", async (req, res) => {
    try {
        const studentUserId = req.query.student_user_id;
        if (!studentUserId) return res.status(400).json({ error: "student_user_id is required" });

        const { data: term, error: termErr } = await supabaseAdmin
            .from("terms")
            .select("id")
            .eq("is_active", true)
            .maybeSingle();

        if (termErr || !term) return res.status(500).json({ error: "No active term found" });

        const { data: enrollments, error: enrErr } = await supabaseAdmin
            .from("enrollments")
            .select(`
        class_id,
        classes:classes (
          id,
          subjects:subjects ( subject_code, title )
        )
      `)
            .eq("term_id", term.id)
            .eq("student_user_id", studentUserId);

        if (enrErr) return res.status(500).json({ error: enrErr.message });

        const dayParam = req.query.day ? Number(req.query.day) : null;
const jsDay = new Date().getDay(); // Sun=0..Sat=6
const todayDow = jsDay === 0 ? 7 : jsDay;
const dayOfWeek = (dayParam && dayParam >= 1 && dayParam <= 7) ? dayParam : todayDow;


        const classIds = (enrollments ?? []).map(e => e.class_id);
        if (classIds.length === 0) return res.json({ items: [] });

        const { data: slots, error: slotErr } = await supabaseAdmin
            .from("class_schedule_slots")
            .select("class_id, day_of_week, start_time, end_time, room")
            .in("class_id", classIds)
            .eq("day_of_week", dayOfWeek)
            .order("start_time", { ascending: true });

        if (slotErr) return res.status(500).json({ error: slotErr.message });

        const byClass = new Map();
        for (const e of enrollments) byClass.set(e.class_id, e.classes);

        const items = (slots ?? []).map(s => ({
            class_id: s.class_id,
            subject_code: byClass.get(s.class_id)?.subjects?.subject_code ?? "—",
            title: byClass.get(s.class_id)?.subjects?.title ?? "—",
            start_time: s.start_time,
            end_time: s.end_time,
            room: s.room ?? "",
            status: "scheduled"
        }));

        res.json({ items });
    } catch (err) {
        res.status(500).json({ error: String(err?.message ?? err) });
    }
});
