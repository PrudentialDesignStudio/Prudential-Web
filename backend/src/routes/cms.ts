import { Router } from "express";
import db from "../lib/db.js";

const router = Router();

router.get("/gallery/categories", (req, res) => {
  const type = req.query.type as string | undefined;
  let rows: any[];
  if (type) {
    rows = db.prepare(
      "SELECT category, COUNT(*) as count FROM gallery_items WHERE type=? GROUP BY category ORDER BY category ASC"
    ).all(type);
  } else {
    rows = db.prepare(
      "SELECT category, COUNT(*) as count FROM gallery_items GROUP BY category ORDER BY category ASC"
    ).all();
  }
  res.json(rows);
});

// All defined categories, including empty ones not yet holding any items.
router.get("/gallery/all-categories", (_req, res) => {
  res.json(db.prepare("SELECT * FROM gallery_categories ORDER BY display_order ASC, name ASC").all());
});

router.get("/gallery", (req, res) => {
  const type = req.query.type as string | undefined;
  const category = req.query.category as string | undefined;
  let data: any[];
  if (type && category) {
    data = db.prepare("SELECT * FROM gallery_items WHERE type=? AND category=? ORDER BY display_order ASC").all(type, category);
  } else if (type) {
    data = db.prepare("SELECT * FROM gallery_items WHERE type=? ORDER BY display_order ASC").all(type);
  } else if (category) {
    data = db.prepare("SELECT * FROM gallery_items WHERE category=? ORDER BY display_order ASC").all(category);
  } else {
    data = db.prepare("SELECT * FROM gallery_items ORDER BY display_order ASC").all();
  }
  res.json(data);
});

router.get("/texts", (_req, res) => {
  const rows: any[] = db.prepare("SELECT * FROM site_texts").all();
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  res.json(map);
});

router.get("/announcements", (_req, res) => {
  res.json(db.prepare("SELECT * FROM announcements WHERE published=1 ORDER BY created_at DESC").all());
});

router.get("/testimonials", (_req, res) => {
  res.json(db.prepare("SELECT * FROM testimonials WHERE published=1 ORDER BY display_order ASC, created_at ASC").all());
});

router.get("/events", (_req, res) => {
  res.json(db.prepare("SELECT * FROM events WHERE published=1 ORDER BY event_date ASC").all());
});

router.get("/contact", (_req, res) => {
  res.json(db.prepare("SELECT * FROM contact_info WHERE id=1").get());
});

router.get("/hero", (_req, res) => {
  res.json(db.prepare("SELECT * FROM hero_content WHERE id=1").get());
});

router.get("/about", (_req, res) => {
  res.json(db.prepare("SELECT * FROM about_content WHERE id=1").get());
});

router.get("/values", (_req, res) => {
  res.json(db.prepare("SELECT * FROM school_values ORDER BY display_order").all());
});

router.get("/goals", (_req, res) => {
  res.json(db.prepare("SELECT * FROM school_goals ORDER BY display_order").all());
});

router.get("/divisions", (_req, res) => {
  res.json(db.prepare("SELECT * FROM academic_divisions ORDER BY display_order").all());
});

router.get("/staff", (_req, res) => {
  res.json(db.prepare("SELECT * FROM staff_members ORDER BY display_order ASC").all());
});

router.get("/rules", (_req, res) => {
  res.json(db.prepare("SELECT * FROM rules_regulations ORDER BY display_order ASC").all());
});

router.get("/anthem", (_req, res) => {
  res.json(db.prepare("SELECT * FROM anthem_content WHERE id=1").get());
});

router.get("/features", (_req, res) => {
  res.json(db.prepare("SELECT * FROM homepage_features ORDER BY display_order ASC").all());
});

router.get("/campus", (_req, res) => {
  res.json(db.prepare("SELECT * FROM campus_section WHERE id=1").get());
});

router.get("/student-life", (_req, res) => {
  const items = db.prepare("SELECT * FROM student_life_items ORDER BY display_order ASC").all();
  const clubs = db.prepare("SELECT * FROM student_clubs ORDER BY display_order ASC").all();
  res.json({ items, clubs });
});

router.get("/portals", (_req, res) => {
  res.json(db.prepare("SELECT * FROM portal_links ORDER BY display_order ASC").all());
});

router.get("/academics-content", (_req, res) => {
  res.json(db.prepare("SELECT * FROM academics_content WHERE id=1").get());
});

router.post("/contact-submit", (req, res) => {
  const { studentName, studentAge, studentGender, currentClass, desiredClass,
    parentName, phone, email, relationship, prevSchool, performance, subject, message } = req.body;
  if (!message) { res.status(400).json({ error: "Message is required" }); return; }
  db.prepare(`INSERT INTO contact_submissions
    (student_name,student_age,student_gender,current_class,desired_class,parent_name,phone,email,relationship,prev_school,performance,subject,message)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).run(studentName??null, studentAge??null, studentGender??null, currentClass??null, desiredClass??null,
    parentName??null, phone??null, email??null, relationship??null, prevSchool??null, performance??null, subject??null, message);
  res.json({ ok: true });
});

export default router;
