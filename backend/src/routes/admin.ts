import { Router } from "express";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middlewares/auth.js";
import db, { logVersion } from "../lib/db.js";

const router = Router();

// Auth
router.post("/login", (req, res) => {
  const { password } = req.body as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.ADMIN_JWT_SECRET;
  if (!adminPassword || !jwtSecret) { res.status(500).json({ error: "Server misconfigured" }); return; }
  if (!password || password !== adminPassword) { res.status(401).json({ error: "Incorrect password" }); return; }
  const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "8h" });
  res.json({ token });
});

router.post("/change-password", requireAuth, (req, res) => {
  const { newPassword } = req.body as { newPassword?: string };
  if (!newPassword || newPassword.length < 6) { res.status(400).json({ error: "Password must be at least 6 characters" }); return; }
  db.prepare("INSERT INTO site_settings (key,value) VALUES ('admin_password_hash',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(newPassword);
  process.env.ADMIN_PASSWORD = newPassword;
  res.json({ ok: true });
});

// Version History
router.get("/history", requireAuth, (req, res) => {
  const { table, id } = req.query;
  let rows;
  if (table && id) {
    rows = db.prepare("SELECT * FROM version_history WHERE table_name=? AND record_id=? ORDER BY changed_at DESC LIMIT 50").all(table, id);
  } else if (table) {
    rows = db.prepare("SELECT * FROM version_history WHERE table_name=? ORDER BY changed_at DESC LIMIT 100").all(table);
  } else {
    rows = db.prepare("SELECT * FROM version_history ORDER BY changed_at DESC LIMIT 100").all();
  }
  res.json(rows);
});

// Gallery Categories
router.get("/gallery/categories", requireAuth, (_req, res) => {
  const cats: any[] = db.prepare("SELECT * FROM gallery_categories ORDER BY display_order ASC, name ASC").all();
  const counts: any[] = db.prepare("SELECT category, COUNT(*) as count FROM gallery_items GROUP BY category").all();
  const countMap: Record<string, number> = {};
  for (const c of counts) countMap[c.category] = c.count;
  res.json(cats.map(c => ({ ...c, itemCount: countMap[c.name] ?? 0 })));
});
router.post("/gallery/categories", requireAuth, (req, res) => {
  const name = (req.body.name as string ?? "").trim();
  if (!name) { res.status(400).json({ error: "Category name is required" }); return; }
  const exists = db.prepare("SELECT 1 FROM gallery_categories WHERE name = ?").get(name);
  if (exists) { res.status(409).json({ error: "A category with this name already exists" }); return; }
  const maxOrder: any = db.prepare("SELECT COALESCE(MAX(display_order), -1) as m FROM gallery_categories").get();
  const result = db.prepare("INSERT INTO gallery_categories (name, display_order) VALUES (?, ?) RETURNING *").get(name, maxOrder.m + 1);
  res.status(201).json(result);
});
router.put("/gallery/categories/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const e: any = db.prepare("SELECT * FROM gallery_categories WHERE id = ?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  const newName = (req.body.name as string ?? "").trim();
  if (!newName) { res.status(400).json({ error: "Category name is required" }); return; }
  // Renaming a category updates every gallery item already filed under the old name too,
  // so existing photos/videos stay attached to the (renamed) category instead of going orphaned.
  db.prepare("UPDATE gallery_categories SET name = ? WHERE id = ?").run(newName, id);
  db.prepare("UPDATE gallery_items SET category = ? WHERE category = ?").run(newName, e.name);
  res.json({ ...e, name: newName });
});
router.delete("/gallery/categories/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const e: any = db.prepare("SELECT * FROM gallery_categories WHERE id = ?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  const itemCount: any = db.prepare("SELECT COUNT(*) as c FROM gallery_items WHERE category = ?").get(e.name);
  if (itemCount.c > 0) {
    res.status(409).json({ error: `This category still has ${itemCount.c} item(s). Move or delete them first.` });
    return;
  }
  db.prepare("DELETE FROM gallery_categories WHERE id = ?").run(id);
  res.status(204).send();
});

// Gallery
router.get("/gallery", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM gallery_items ORDER BY display_order ASC, created_at ASC").all());
});
router.post("/gallery", requireAuth, (req, res) => {
  const { url, caption, type, category, displayOrder } = req.body;
  const result = db.prepare("INSERT INTO gallery_items (url,caption,type,category,display_order) VALUES (?,?,?,?,?) RETURNING *").get(url, caption, type ?? "image", category ?? "General", displayOrder ?? 0);
  res.status(201).json(result);
});
// Add several uploaded items to one category in a single request — this is what
// the "drop files into a category" admin flow calls after Cloudinary returns the URLs.
router.post("/gallery/batch", requireAuth, (req, res) => {
  const { items } = req.body as { items?: { url: string; caption?: string; type?: string; category: string }[] };
  if (!Array.isArray(items) || items.length === 0) { res.status(400).json({ error: "No items provided" }); return; }
  const insert = db.prepare("INSERT INTO gallery_items (url,caption,type,category,display_order) VALUES (?,?,?,?,?) RETURNING *");
  const maxOrders: Record<string, number> = {};
  const inserted = db.transaction(() => {
    const results = [];
    for (const item of items) {
      if (maxOrders[item.category] === undefined) {
        const row: any = db.prepare("SELECT COALESCE(MAX(display_order), -1) as m FROM gallery_items WHERE category = ?").get(item.category);
        maxOrders[item.category] = row.m;
      }
      maxOrders[item.category] += 1;
      results.push(insert.get(item.url, item.caption ?? null, item.type ?? "image", item.category, maxOrders[item.category]));
    }
    return results;
  })();
  res.status(201).json(inserted);
});
router.put("/gallery/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const e: any = db.prepare("SELECT * FROM gallery_items WHERE id=?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  const { url, caption, type, category, displayOrder } = req.body;
  if (url && url !== e.url) logVersion("gallery_items", id, "url", e.url, url);
  if (category && category !== e.category) logVersion("gallery_items", id, "category", e.category, category);
  const result = db.prepare("UPDATE gallery_items SET url=?,caption=?,type=?,category=?,display_order=? WHERE id=? RETURNING *").get(url??e.url, caption??e.caption, type??e.type, category??e.category, displayOrder??e.display_order, id);
  res.json(result);
});
router.delete("/gallery/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM gallery_items WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});

// Announcements
router.get("/announcements", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM announcements ORDER BY created_at DESC").all());
});
router.post("/announcements", requireAuth, (req, res) => {
  const { title, body, imageUrl, published } = req.body;
  const result = db.prepare("INSERT INTO announcements (title,body,image_url,published) VALUES (?,?,?,?) RETURNING *").get(title, body, imageUrl??null, (published??true)?1:0);
  res.status(201).json(result);
});
router.put("/announcements/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const e: any = db.prepare("SELECT * FROM announcements WHERE id=?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  const { title, body, imageUrl, published } = req.body;
  if (body && body !== e.body) logVersion("announcements", id, "body", e.body, body);
  const result = db.prepare("UPDATE announcements SET title=?,body=?,image_url=?,published=?,updated_at=? WHERE id=? RETURNING *").get(title??e.title, body??e.body, imageUrl!==undefined?imageUrl:e.image_url, published!==undefined?(published?1:0):e.published, new Date().toISOString(), id);
  res.json(result);
});
router.delete("/announcements/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM announcements WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});

// Testimonials
router.get("/testimonials", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM testimonials ORDER BY display_order ASC, created_at ASC").all());
});
router.post("/testimonials", requireAuth, (req, res) => {
  const { imageUrl, caption, displayOrder, published } = req.body;
  const result = db.prepare("INSERT INTO testimonials (image_url,caption,display_order,published) VALUES (?,?,?,?) RETURNING *").get(imageUrl, caption ?? null, displayOrder ?? 0, (published??true)?1:0);
  res.status(201).json(result);
});
router.put("/testimonials/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const e: any = db.prepare("SELECT * FROM testimonials WHERE id=?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  const { imageUrl, caption, displayOrder, published } = req.body;
  if (imageUrl && imageUrl !== e.image_url) logVersion("testimonials", id, "image_url", e.image_url, imageUrl);
  const result = db.prepare("UPDATE testimonials SET image_url=?,caption=?,display_order=?,published=?,updated_at=? WHERE id=? RETURNING *").get(imageUrl??e.image_url, caption!==undefined?caption:e.caption, displayOrder!==undefined?displayOrder:e.display_order, published!==undefined?(published?1:0):e.published, new Date().toISOString(), id);
  res.json(result);
});
router.delete("/testimonials/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM testimonials WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});

// Events
router.get("/events", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM events ORDER BY event_date ASC").all());
});
router.post("/events", requireAuth, (req, res) => {
  const { title, description, eventDate, location, published } = req.body;
  const result = db.prepare("INSERT INTO events (title,description,event_date,location,published) VALUES (?,?,?,?,?) RETURNING *").get(title, description??null, eventDate, location??null, (published??true)?1:0);
  res.status(201).json(result);
});
router.put("/events/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const e: any = db.prepare("SELECT * FROM events WHERE id=?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  const { title, description, eventDate, location, published } = req.body;
  const result = db.prepare("UPDATE events SET title=?,description=?,event_date=?,location=?,published=?,updated_at=? WHERE id=? RETURNING *").get(title??e.title, description!==undefined?description:e.description, eventDate??e.event_date, location!==undefined?location:e.location, published!==undefined?(published?1:0):e.published, new Date().toISOString(), id);
  res.json(result);
});
router.delete("/events/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM events WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});

// Contact GET/PUT defined below with hours field

// Hero
router.get("/hero", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM hero_content WHERE id=1").get());
});
// Hero PUT is defined below with full stats + CTA fields

// About
router.get("/about", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM about_content WHERE id=1").get());
});
router.put("/about", requireAuth, (req, res) => {
  const { story1, story2, story3, mission, vision, img1, img2 } = req.body;
  const e: any = db.prepare("SELECT * FROM about_content WHERE id=1").get();
  ["story1","story2","story3","mission","vision"].forEach(f => {
    const v = req.body[f];
    if (v && v !== (e as any)[f]) logVersion("about_content", 1, f, (e as any)[f], v);
  });
  const result = db.prepare("UPDATE about_content SET story1=?,story2=?,story3=?,mission=?,vision=?,img1=?,img2=?,updated_at=? WHERE id=1 RETURNING *").get(story1??e.story1, story2??e.story2, story3??e.story3, mission??e.mission, vision??e.vision, img1!==undefined?img1:e.img1, img2!==undefined?img2:e.img2, new Date().toISOString());
  res.json(result);
});

// Values
router.get("/values", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM school_values ORDER BY display_order").all());
});
router.post("/values", requireAuth, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) { res.status(400).json({ error: "Title and body required" }); return; }
  res.json(db.prepare("INSERT INTO school_values (title,body) VALUES (?,?) RETURNING *").get(title, body));
});
router.put("/values/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const { title, body } = req.body;
  const e: any = db.prepare("SELECT * FROM school_values WHERE id=?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  if (body && body !== e.body) logVersion("school_values", id, "body", e.body, body);
  const result = db.prepare("UPDATE school_values SET title=?,body=?,updated_at=? WHERE id=? RETURNING *").get(title, body, new Date().toISOString(), id);
  res.json(result);
});
router.delete("/values/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM school_values WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});

// Goals
router.get("/goals", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM school_goals ORDER BY display_order").all());
});
router.post("/goals", requireAuth, (req, res) => {
  const { body } = req.body;
  if (!body) { res.status(400).json({ error: "Goal text required" }); return; }
  const maxOrder: any = db.prepare("SELECT COALESCE(MAX(display_order), 0) as m FROM school_goals").get();
  res.json(db.prepare("INSERT INTO school_goals (body,display_order) VALUES (?,?) RETURNING *").get(body, maxOrder.m + 1));
});
router.put("/goals/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const { body } = req.body;
  const e: any = db.prepare("SELECT * FROM school_goals WHERE id=?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  if (body && body !== e.body) logVersion("school_goals", id, "body", e.body, body);
  const result = db.prepare("UPDATE school_goals SET body=?,updated_at=? WHERE id=? RETURNING *").get(body ?? e.body, new Date().toISOString(), id);
  res.json(result);
});
router.delete("/goals/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM school_goals WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});

// Academic Divisions
router.get("/divisions", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM academic_divisions ORDER BY display_order").all());
});
router.post("/divisions", requireAuth, (req, res) => {
  const { title, age_range, body } = req.body;
  if (!title || !body) { res.status(400).json({ error: "Title and body required" }); return; }
  res.json(db.prepare("INSERT INTO academic_divisions (title,age_range,body) VALUES (?,?,?) RETURNING *").get(title, age_range, body));
});
router.put("/divisions/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const e: any = db.prepare("SELECT * FROM academic_divisions WHERE id=?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  const { title, ageRange, body } = req.body;
  if (body && body !== e.body) logVersion("academic_divisions", id, "body", e.body, body);
  const result = db.prepare("UPDATE academic_divisions SET title=?,age_range=?,body=?,updated_at=? WHERE id=? RETURNING *").get(title??e.title, ageRange??e.age_range, body??e.body, new Date().toISOString(), id);
  res.json(result);
});
router.delete("/divisions/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM academic_divisions WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});

// Staff
router.get("/staff", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM staff_members ORDER BY display_order ASC").all());
});
router.post("/staff", requireAuth, (req, res) => {
  const { name, title, department, imageUrl, displayOrder } = req.body;
  const result = db.prepare("INSERT INTO staff_members (name,title,department,image_url,display_order) VALUES (?,?,?,?,?) RETURNING *").get(name, title, department??null, imageUrl??null, displayOrder??0);
  res.status(201).json(result);
});
router.put("/staff/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const e: any = db.prepare("SELECT * FROM staff_members WHERE id=?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  const { name, title, department, imageUrl, displayOrder } = req.body;
  if (name && name !== e.name) logVersion("staff_members", id, "name", e.name, name);
  if (title && title !== e.title) logVersion("staff_members", id, "title", e.title, title);
  const result = db.prepare("UPDATE staff_members SET name=?,title=?,department=?,image_url=?,display_order=? WHERE id=? RETURNING *").get(name??e.name, title??e.title, department!==undefined?department:e.department, imageUrl!==undefined?imageUrl:e.image_url, displayOrder??e.display_order, id);
  res.json(result);
});
router.delete("/staff/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM staff_members WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});

// Rules
router.get("/rules", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM rules_regulations ORDER BY display_order ASC").all());
});
router.post("/rules", requireAuth, (req, res) => {
  const { category, content, displayOrder } = req.body;
  const result = db.prepare("INSERT INTO rules_regulations (category,content,display_order) VALUES (?,?,?) RETURNING *").get(category, content, displayOrder??0);
  res.status(201).json(result);
});
router.put("/rules/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const e: any = db.prepare("SELECT * FROM rules_regulations WHERE id=?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  const { category, content, displayOrder } = req.body;
  if (content && content !== e.content) logVersion("rules_regulations", id, "content", e.content, content);
  const result = db.prepare("UPDATE rules_regulations SET category=?,content=?,display_order=? WHERE id=? RETURNING *").get(category??e.category, content??e.content, displayOrder??e.display_order, id);
  res.json(result);
});
router.delete("/rules/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM rules_regulations WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});

// Anthem
router.get("/anthem", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM anthem_content WHERE id=1").get());
});
router.put("/anthem", requireAuth, (req, res) => {
  const { schoolTitle, schoolLyrics, schoolAudio, nationalTitle, nationalLyrics, nationalAudio } = req.body;
  const e: any = db.prepare("SELECT * FROM anthem_content WHERE id=1").get();
  if (schoolLyrics && schoolLyrics !== e.school_lyrics) logVersion("anthem_content", 1, "school_lyrics", e.school_lyrics, schoolLyrics);
  if (nationalLyrics && nationalLyrics !== e.national_lyrics) logVersion("anthem_content", 1, "national_lyrics", e.national_lyrics, nationalLyrics);
  const result = db.prepare(`UPDATE anthem_content SET school_title=?,school_lyrics=?,school_audio=?,national_title=?,national_lyrics=?,national_audio=?,updated_at=? WHERE id=1 RETURNING *`).get(schoolTitle??e.school_title, schoolLyrics??e.school_lyrics, schoolAudio!==undefined?schoolAudio:e.school_audio, nationalTitle??e.national_title, nationalLyrics??e.national_lyrics, nationalAudio!==undefined?nationalAudio:e.national_audio, new Date().toISOString());
  res.json(result);
});

// Submissions
router.get("/submissions", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM contact_submissions ORDER BY created_at DESC").all());
});
router.put("/submissions/:id/read", requireAuth, (req, res) => {
  db.prepare("UPDATE contact_submissions SET read=1 WHERE id=?").run(Number(req.params.id));
  res.json({ ok: true });
});
router.put("/submissions/:id/notes", requireAuth, (req, res) => {
  const { notes } = req.body;
  db.prepare("UPDATE contact_submissions SET notes=? WHERE id=?").run(notes, Number(req.params.id));
  res.json({ ok: true });
});
router.delete("/submissions/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM contact_submissions WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});

// Admissions
router.get("/admissions", requireAuth, (_req, res) => {
  const rows = db.prepare("SELECT * FROM admissions ORDER BY created_at DESC").all();
  res.json(rows);
});
router.put("/admissions/:id/read", requireAuth, (req, res) => {
  db.prepare("UPDATE admissions SET read=1 WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});
router.delete("/admissions/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM admissions WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

// Site Texts
router.get("/texts", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM site_texts ORDER BY key").all());
});
router.put("/texts/:key", requireAuth, (req, res) => {
  const { value } = req.body as { value?: string };
  if (value === undefined) { res.status(400).json({ error: "value required" }); return; }
  const result = db.prepare("UPDATE site_texts SET value=?,updated_at=? WHERE key=? RETURNING *").get(value, new Date().toISOString(), req.params.key);
  if (!result) { res.status(404).json({ error: "Key not found" }); return; }
  res.json(result);
});

// ── Hero (extended: stats + CTA) ──────────────────────────────────────────
router.put("/hero", requireAuth, (req, res) => {
  const { headline, subtext, badge, btn1Text, btn2Text, bgImage,
    stat1Num, stat1Label, stat2Num, stat2Label, stat3Num, stat3Label,
    ctaBadge, ctaHeading, ctaBody, ctaBtn1, ctaBtn2 } = req.body;
  const e: any = db.prepare("SELECT * FROM hero_content WHERE id=1").get();
  if (headline && headline !== e.headline) logVersion("hero_content", 1, "headline", e.headline, headline);
  if (subtext && subtext !== e.subtext) logVersion("hero_content", 1, "subtext", e.subtext, subtext);
  const result = db.prepare(`UPDATE hero_content SET
    headline=?,subtext=?,badge=?,btn1_text=?,btn2_text=?,bg_image=?,
    stat1_num=?,stat1_label=?,stat2_num=?,stat2_label=?,stat3_num=?,stat3_label=?,
    cta_badge=?,cta_heading=?,cta_body=?,cta_btn1=?,cta_btn2=?,updated_at=?
    WHERE id=1 RETURNING *`).get(
    headline??e.headline, subtext??e.subtext, badge??e.badge,
    btn1Text??e.btn1_text, btn2Text??e.btn2_text,
    bgImage!==undefined?bgImage:e.bg_image,
    stat1Num??e.stat1_num, stat1Label??e.stat1_label,
    stat2Num??e.stat2_num, stat2Label??e.stat2_label,
    stat3Num??e.stat3_num, stat3Label??e.stat3_label,
    ctaBadge??e.cta_badge, ctaHeading??e.cta_heading, ctaBody??e.cta_body,
    ctaBtn1??e.cta_btn1, ctaBtn2??e.cta_btn2,
    new Date().toISOString());
  res.json(result);
});

// Homepage Features
router.get("/features", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM homepage_features ORDER BY display_order ASC").all());
});
router.post("/features", requireAuth, (req, res) => {
  const { title, body, displayOrder } = req.body;
  const max = (db.prepare("SELECT MAX(display_order) as m FROM homepage_features").get() as any)?.m ?? 0;
  const result = db.prepare("INSERT INTO homepage_features (title,body,display_order) VALUES (?,?,?) RETURNING *").get(title, body, displayOrder??max+1);
  res.status(201).json(result);
});
router.put("/features/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const e: any = db.prepare("SELECT * FROM homepage_features WHERE id=?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  const { title, body, displayOrder } = req.body;
  const result = db.prepare("UPDATE homepage_features SET title=?,body=?,display_order=? WHERE id=? RETURNING *").get(title??e.title, body??e.body, displayOrder??e.display_order, id);
  res.json(result);
});
router.delete("/features/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM homepage_features WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});

// Campus Section
router.get("/campus", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM campus_section WHERE id=1").get());
});
router.put("/campus", requireAuth, (req, res) => {
  const { heading, subtext, bullet1, bullet2, bullet3, bullet4 } = req.body;
  const e: any = db.prepare("SELECT * FROM campus_section WHERE id=1").get();
  const result = db.prepare("UPDATE campus_section SET heading=?,subtext=?,bullet1=?,bullet2=?,bullet3=?,bullet4=?,updated_at=? WHERE id=1 RETURNING *").get(
    heading??e.heading, subtext??e.subtext,
    bullet1??e.bullet1, bullet2??e.bullet2, bullet3??e.bullet3, bullet4??e.bullet4,
    new Date().toISOString());
  res.json(result);
});

// Student Life
router.get("/student-life", requireAuth, (_req, res) => {
  const items = db.prepare("SELECT * FROM student_life_items ORDER BY display_order ASC").all();
  const clubs = db.prepare("SELECT * FROM student_clubs ORDER BY display_order ASC").all();
  res.json({ items, clubs });
});
router.post("/student-life/items", requireAuth, (req, res) => {
  const { title, body, imageUrl, displayOrder } = req.body;
  const max = (db.prepare("SELECT MAX(display_order) as m FROM student_life_items").get() as any)?.m ?? 0;
  const result = db.prepare("INSERT INTO student_life_items (title,body,image_url,display_order) VALUES (?,?,?,?) RETURNING *").get(title, body, imageUrl??null, displayOrder??max+1);
  res.status(201).json(result);
});
router.put("/student-life/items/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const e: any = db.prepare("SELECT * FROM student_life_items WHERE id=?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  const { title, body, imageUrl, displayOrder } = req.body;
  const result = db.prepare("UPDATE student_life_items SET title=?,body=?,image_url=?,display_order=? WHERE id=? RETURNING *").get(title??e.title, body??e.body, imageUrl!==undefined?imageUrl:e.image_url, displayOrder??e.display_order, id);
  res.json(result);
});
router.delete("/student-life/items/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM student_life_items WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});
router.post("/student-life/clubs", requireAuth, (req, res) => {
  const { name } = req.body;
  const max = (db.prepare("SELECT MAX(display_order) as m FROM student_clubs").get() as any)?.m ?? 0;
  const result = db.prepare("INSERT INTO student_clubs (name,display_order) VALUES (?,?) RETURNING *").get(name, max+1);
  res.status(201).json(result);
});
router.delete("/student-life/clubs/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM student_clubs WHERE id=?").run(Number(req.params.id));
  res.status(204).send();
});

// Portal Links
router.get("/portals", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM portal_links ORDER BY display_order ASC").all());
});
router.put("/portals/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const e: any = db.prepare("SELECT * FROM portal_links WHERE id=?").get(id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  const { title, description, tag, url, color } = req.body;
  const result = db.prepare("UPDATE portal_links SET title=?,description=?,tag=?,url=?,color=? WHERE id=? RETURNING *").get(title??e.title, description??e.description, tag??e.tag, url??e.url, color??e.color, id);
  res.json(result);
});

// Academics Content
router.get("/academics-content", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM academics_content WHERE id=1").get());
});
router.put("/academics-content", requireAuth, (req, res) => {
  const { curriculumHeading, curriculumBody, curriculumImage, scienceHeading, scienceBody, scienceImage } = req.body;
  const e: any = db.prepare("SELECT * FROM academics_content WHERE id=1").get();
  const result = db.prepare(`UPDATE academics_content SET
    curriculum_heading=?,curriculum_body=?,curriculum_image=?,
    science_heading=?,science_body=?,science_image=?,updated_at=? WHERE id=1 RETURNING *`).get(
    curriculumHeading??e.curriculum_heading, curriculumBody??e.curriculum_body,
    curriculumImage!==undefined?curriculumImage:e.curriculum_image,
    scienceHeading??e.science_heading, scienceBody??e.science_body,
    scienceImage!==undefined?scienceImage:e.science_image,
    new Date().toISOString());
  res.json(result);
});

// Contact Info (with hours)
router.get("/contact", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM contact_info WHERE id=1").get());
});
router.put("/contact", requireAuth, (req, res) => {
  const { phone1, phone2, email, address, hours, mapUrl, facebook } = req.body;
  const e: any = db.prepare("SELECT * FROM contact_info WHERE id=1").get();
  const result = db.prepare("UPDATE contact_info SET phone1=?,phone2=?,email=?,address=?,hours=?,map_url=?,facebook=?,updated_at=? WHERE id=1 RETURNING *").get(
    phone1??e.phone1, phone2??e.phone2, email??e.email, address??e.address,
    hours??e.hours, mapUrl!==undefined?mapUrl:e.map_url, facebook!==undefined?facebook:e.facebook,
    new Date().toISOString());
  res.json(result);
});

export default router;
