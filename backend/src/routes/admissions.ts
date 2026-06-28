import { Router } from "express";
import path from "path";
import fs from "fs";
import db from "../lib/db.js";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import https from "https";
import http from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Simple in-memory rate limiter (5 submissions per IP per hour) ──────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}
// Clean up stale entries every hour
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((v, k) => { if (now > v.resetAt) rateLimitMap.delete(k); });
}, 60 * 60 * 1000);

// Config
const PDF_DIR = process.env.PDF_DIR
  ?? (process.env.NODE_ENV === "production" ? "/tmp/pis-admissions" : path.resolve(__dirname, "../../../data/generated"));

if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR, { recursive: true });

// Fusion theme colours
const NAVY    = "#0B1F5C";
const CYAN    = "#00AEEF";
const GOLD    = "#FFD700";
const CRIMSON = "#B22222";
const WHITE   = "#FFFFFF";
const LIGHT   = "#F4F7FF";

const LOGO_URL = "https://res.cloudinary.com/dagt2a1w0/image/upload/v1771171056/ChatGPT_Image_Apr_13_2025_11_23_50_PM_logo_jnjnai.png";
const LOGO_CACHE = path.join(PDF_DIR, "logo_cache.png");
const WA_NUMBER = "2348095700591";

// Logo fetch (cached)
function fetchLogo(): Promise<string | null> {
  return new Promise((resolve) => {
    if (fs.existsSync(LOGO_CACHE)) { resolve(LOGO_CACHE); return; }
    const client = LOGO_URL.startsWith("https") ? https : http;
    const file = fs.createWriteStream(LOGO_CACHE);
    client.get(LOGO_URL, (res) => {
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(LOGO_CACHE); });
    }).on("error", () => {
      fs.unlink(LOGO_CACHE, () => {});
      resolve(null);
    });
  });
}

// Helpers
function genRef(): string {
  return "PIS-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 5).toUpperCase();
}

function sectionHeader(doc: PDFKit.PDFDocument, title: string) {
  doc.moveDown(0.4);
  doc.rect(doc.page.margins.left, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, 22)
    .fill(NAVY);
  doc.fillColor(WHITE).fontSize(10).font("Helvetica-Bold")
    .text(title.toUpperCase(), doc.page.margins.left + 10, doc.y - 18);
  doc.fillColor("#333333").font("Helvetica").fontSize(10);
  doc.moveDown(0.8);
}

function field(doc: PDFKit.PDFDocument, label: string, value: string) {
  const x = doc.page.margins.left;
  const colW = (doc.page.width - doc.page.margins.left - doc.page.margins.right) / 2;
  doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(8.5).text(label + ":", x, doc.y, { continued: false });
  doc.fillColor("#222222").font("Helvetica").fontSize(10).text(value || "—", x + 2, doc.y);
  doc.moveDown(0.4);
}

function fieldRow(doc: PDFKit.PDFDocument, pairs: [string, string][]) {
  const x = doc.page.margins.left;
  const total = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const colW = total / pairs.length;
  const startY = doc.y;
  pairs.forEach(([label, value], i) => {
    doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(8.5)
      .text(label + ":", x + i * colW, startY, { width: colW - 8, continued: false });
    doc.fillColor("#222222").font("Helvetica").fontSize(10)
      .text(value || "—", x + i * colW + 2, doc.y, { width: colW - 8 });
  });
  doc.y = startY + 32;
}

// PDF Generator
async function generatePDF(data: Record<string, string>, ref: string, logoPath: string | null): Promise<string> {
  return new Promise((resolve, reject) => {
    const filename = `PIS_Admission_${(data.studentFirstName || "Form").replace(/\s+/g, "_")}_${ref}.pdf`;
    const filepath = path.join(PDF_DIR, filename);
    const doc = new PDFDocument({ size: "A4", margins: { top: 40, bottom: 40, left: 50, right: 50 }, info: { Title: "PIS Admission Form", Author: "Prudential International School" } });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // ── Header ──
    doc.rect(0, 0, doc.page.width, 90).fill(NAVY);
    if (logoPath) {
      try { doc.image(logoPath, 42, 12, { height: 66 }); } catch (_) {}
    }
    doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(18)
      .text("PRUDENTIAL INTERNATIONAL SCHOOL", 120, 20, { align: "left" });
    doc.fillColor(CYAN).font("Helvetica").fontSize(10)
      .text("16 & 18 2nd Avenue, Gwarinpa Estate, Abuja, FCT, Nigeria", 120, 44);
    doc.fillColor(GOLD).fontSize(9)
      .text("+234 809 570 0591  |  pis.abuja@gmail.com  |  prudentialschool.com.ng", 120, 60);

    // ── Title banner ──
    doc.rect(0, 90, doc.page.width, 36).fill(CRIMSON);
    doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(14)
      .text("ADMISSION ENQUIRY FORM", 0, 100, { align: "center" });

    // ── Ref / date ──
    doc.rect(0, 126, doc.page.width, 22).fill(LIGHT);
    doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(9)
      .text(`Reference: ${ref}`, 50, 133, { continued: true })
      .text(`Date: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`, { align: "right" });

    doc.y = 160;

    // ── Section 1: Student Info ──
    sectionHeader(doc, "1. Student Information");
    fieldRow(doc, [["First Name", data.studentFirstName], ["Last Name", data.studentLastName]]);
    fieldRow(doc, [["Date of Birth", data.dateOfBirth], ["Gender", data.gender]]);
    fieldRow(doc, [["Nationality", data.nationality], ["Religion", data.religion]]);
    field(doc, "Class / Year Group Applying For", data.classApplying);
    field(doc, "Desired Entry Date", data.entryDate);

    sectionHeader(doc, "2. Previous School");
    field(doc, "Name of Previous / Current School", data.prevSchool);
    fieldRow(doc, [["Last Class Attended", data.lastClass], ["Year Left / Leaving", data.yearLeft]]);
    field(doc, "Reason for Leaving", data.reasonLeaving);

    sectionHeader(doc, "3. Parent / Guardian Information");
    fieldRow(doc, [["Full Name", data.parentName], ["Relationship", data.relationship]]);
    fieldRow(doc, [["Phone Number", data.phone], ["Email Address", data.email]]);
    field(doc, "Occupation", data.occupation);

    sectionHeader(doc, "4. Home Address");
    field(doc, "Street Address", data.address);
    fieldRow(doc, [["City", data.city], ["LGA", data.lga]]);
    fieldRow(doc, [["State", data.state], ["Country", data.country || "Nigeria"]]);

    sectionHeader(doc, "5. Health Information");
    fieldRow(doc, [["Blood Group", data.bloodGroup], ["Genotype", data.genotype]]);
    field(doc, "Known Allergies or Medical Conditions", data.medicalConditions);
    field(doc, "Any Disability or Special Needs", data.disability);

    sectionHeader(doc, "6. Additional Information");
    field(doc, "How Did You Hear About Us?", data.hearAboutUs);
    field(doc, "Additional Notes / Message", data.message);

    // ── Footer ──
    const footerY = doc.page.height - 60;
    doc.rect(0, footerY, doc.page.width, 60).fill(NAVY);
    doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(9)
      .text("Making a Difference — Est. 2014 · Gwarinpa, Abuja", 0, footerY + 10, { align: "center" });
    doc.fillColor(WHITE).font("Helvetica").fontSize(8)
      .text(`Generated on ${new Date().toLocaleString()} · Ref: ${ref}`, 0, footerY + 28, { align: "center" });
    doc.fillColor(CYAN).fontSize(8)
      .text("This document is for official use by Prudential International School only.", 0, footerY + 44, { align: "center" });

    doc.end();
    stream.on("finish", () => resolve(filename));
    stream.on("error", reject);
  });
}

// Email
async function sendEmail(data: Record<string, string>, ref: string, pdfPath: string) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;
  const notifyEmail = process.env.NOTIFY_EMAIL || gmailUser;
  if (!gmailUser || !gmailPass) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  const subject = `New Admission Enquiry — ${data.studentFirstName} ${data.studentLastName} [${ref}]`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#0B1F5C;padding:20px;text-align:center;">
        <h2 style="color:#FFD700;margin:0;">Prudential International School</h2>
        <p style="color:#00AEEF;margin:4px 0 0;">New Admission Enquiry Received</p>
      </div>
      <div style="padding:24px;background:#f9fafc;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px;color:#555;width:40%"><strong>Reference</strong></td><td style="padding:8px">${ref}</td></tr>
          <tr style="background:#eef2ff"><td style="padding:8px;color:#555"><strong>Student Name</strong></td><td style="padding:8px">${data.studentFirstName} ${data.studentLastName}</td></tr>
          <tr><td style="padding:8px;color:#555"><strong>Class Applying For</strong></td><td style="padding:8px">${data.classApplying}</td></tr>
          <tr style="background:#eef2ff"><td style="padding:8px;color:#555"><strong>Parent / Guardian</strong></td><td style="padding:8px">${data.parentName} (${data.relationship})</td></tr>
          <tr><td style="padding:8px;color:#555"><strong>Phone</strong></td><td style="padding:8px">${data.phone}</td></tr>
          <tr style="background:#eef2ff"><td style="padding:8px;color:#555"><strong>Email</strong></td><td style="padding:8px">${data.email}</td></tr>
          <tr><td style="padding:8px;color:#555"><strong>Previous School</strong></td><td style="padding:8px">${data.prevSchool}</td></tr>
          <tr style="background:#eef2ff"><td style="padding:8px;color:#555"><strong>Submitted</strong></td><td style="padding:8px">${new Date().toLocaleString()}</td></tr>
        </table>
        <p style="margin-top:20px;color:#666;font-size:13px;">The full admission form is attached as a PDF. Please review and follow up with the parent/guardian at your earliest convenience.</p>
      </div>
      <div style="background:#0B1F5C;padding:12px;text-align:center;">
        <p style="color:rgba(255,255,255,.6);font-size:11px;margin:0;">Prudential International School · 16 & 18 2nd Avenue, Gwarinpa, Abuja</p>
      </div>
    </div>`;

  await transporter.sendMail({
    from: `"PIS Admissions" <${gmailUser}>`,
    to: notifyEmail,
    subject,
    html,
    attachments: [{ filename: path.basename(pdfPath), path: pdfPath }],
  });
}

// Router
const router = Router();

router.get("/status", (_req, res) => {
  res.json({
    emailConfigured: !!(process.env.GMAIL_USER && process.env.GMAIL_PASS),
    notifyEmail: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER || null,
  });
});

router.post("/submit", async (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ?? req.socket.remoteAddress ?? "unknown";
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "Too many submissions. Please try again in an hour." });
    return;
  }
  const data: Record<string, string> = req.body;
  const required = ["studentFirstName", "studentLastName", "classApplying", "parentName", "phone", "relationship"];
  const missing = required.filter((k) => !data[k]);
  if (missing.length) {
    res.status(400).json({ error: "Missing required fields", missing });
    return;
  }

  const ref = genRef();
  let filename: string | null = null;

  try {
    const logoPath = await fetchLogo();
    filename = await generatePDF(data, ref, logoPath);
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
    return;
  }

  // Save to database
  try {
    db.prepare(`INSERT OR IGNORE INTO admissions
      (ref, student_first_name, student_last_name, date_of_birth, gender, nationality,
       religion, class_applying, entry_date, prev_school, last_class, year_left,
       reason_leaving, parent_name, relationship, phone, email, occupation,
       hear_about_us, message, filename)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(ref, data.studentFirstName, data.studentLastName, data.dateOfBirth, data.gender,
      data.nationality, data.religion, data.classApplying, data.entryDate, data.prevSchool,
      data.lastClass, data.yearLeft, data.reasonLeaving, data.parentName, data.relationship,
      data.phone, data.email, data.occupation, data.hearAboutUs, data.message, filename);
  } catch (err) {
    console.error("Failed to save admission to DB:", err);
  }

  // Fire email without blocking response
  sendEmail(data, ref, path.join(PDF_DIR, filename)).catch((err) =>
    console.error("Email send failed:", err)
  );

  // Build WhatsApp message
  const waMsg = encodeURIComponent(
    `NEW ADMISSION ENQUIRY — PIS\nRef: ${ref}\n\nStudent: ${data.studentFirstName} ${data.studentLastName}\nClass: ${data.classApplying}\nDOB: ${data.dateOfBirth || "N/A"}\n\nParent: ${data.parentName} (${data.relationship})\nPhone: ${data.phone}\nEmail: ${data.email || "N/A"}\n\nPrevious School: ${data.prevSchool || "N/A"}\n\nMessage: ${data.message || "N/A"}\n\nFull PDF form submitted — ref ${ref}.`
  );

  res.json({
    ok: true,
    ref,
    filename,
    downloadUrl: `/api/admissions/download/${filename}`,
    whatsappUrl: `https://wa.me/${WA_NUMBER}?text=${waMsg}`,
  });
});

router.get("/download/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const filepath = path.join(PDF_DIR, filename);
  if (!fs.existsSync(filepath)) {
    res.status(404).json({ error: "File not found or expired" });
    return;
  }
  res.download(filepath, filename);
});

export default router;
