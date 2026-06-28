import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutGrid, Images, Megaphone, Calendar, MessageSquare,
  Home, BookOpen, Phone, ShieldCheck, GraduationCap, Users,
  ClipboardList, Inbox, Settings, Star, Building2, Heart,
  ExternalLink, Music, type LucideIcon
} from "lucide-react";
import { uploadManyToCloudinary, type UploadResult } from "../lib/cloudinaryUpload";

const API = "/api/admin";
const CMS = "/api/cms";

type Tab = "overview" | "gallery-images" | "gallery-videos" | "announcements" | "events" | "testimonials" | "hero" | "about" | "contact" | "values" | "divisions" | "staff" | "rules" | "admissions" | "submissions" | "settings" | "features" | "campus" | "student-life" | "portals" | "academics-content" | "anthem";

function useToken() {
  const [token, setToken] = useState(() => localStorage.getItem("pis_admin_token") ?? "");
  const save  = (t: string) => { localStorage.setItem("pis_admin_token", t); setToken(t); };
  const clear = () => { localStorage.removeItem("pis_admin_token"); setToken(""); };
  return { token, save, clear };
}
function authH(token: string) { return { "Content-Type": "application/json", Authorization: `Bearer ${token}` }; }
function useFlash() {
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const flash = (text: string, ok = true) => { setMsg({ text, ok }); setTimeout(() => setMsg(null), 4000); };
  return { msg, flash };
}

// Icons — from lucide-react
function Ico({ icon: Icon, size = 18 }: { icon: LucideIcon; size?: number }) {
  return <Icon size={size} strokeWidth={1.8} />;
}
const Ic: Record<string, JSX.Element> = {
  overview:            <Ico icon={LayoutGrid} />,
  gallery:             <Ico icon={Images} />,
  "gallery-images":    <Ico icon={Images} />,
  "gallery-videos":    <Ico icon={Images} />,
  announcements:       <Ico icon={Megaphone} />,
  events:              <Ico icon={Calendar} />,
  testimonials:        <Ico icon={MessageSquare} />,
  hero:                <Ico icon={Home} />,
  about:               <Ico icon={BookOpen} />,
  contact:             <Ico icon={Phone} />,
  values:              <Ico icon={ShieldCheck} />,
  divisions:           <Ico icon={GraduationCap} />,
  staff:               <Ico icon={Users} />,
  rules:               <Ico icon={ClipboardList} />,
  admissions:          <Ico icon={Inbox} />,
  submissions:         <Ico icon={Inbox} />,
  settings:            <Ico icon={Settings} />,
  features:            <Ico icon={Star} />,
  campus:              <Ico icon={Building2} />,
  "student-life":      <Ico icon={Heart} />,
  portals:             <Ico icon={ExternalLink} />,
  "academics-content": <Ico icon={BookOpen} />,
  anthem:              <Ico icon={Music} />,
};

// Shared Form Helpers
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="adm2-field">
      <label className="adm2-label">{label}{hint && <span className="adm2-hint"> — {hint}</span>}</label>
      {children}
    </div>
  );
}
function Flash({ msg }: { msg: { text: string; ok: boolean } | null }) {
  if (!msg) return null;
  return <div className={`adm2-flash ${msg.ok ? "adm2-flash-ok" : "adm2-flash-err"}`}>{msg.ok ? "✓" : "✗"} {msg.text}</div>;
}

// Login
function LoginForm({ onLogin }: { onLogin: (t: string) => void }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErr("");
    try {
      const r = await fetch(`${API}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      if (!r.ok) { setErr("Incorrect password."); return; }
      const { token } = await r.json(); onLogin(token);
    } catch { setErr("Cannot connect to server."); } finally { setLoading(false); }
  };
  return (
    <div className="adm2-login-bg">
      <div className="adm2-login-card">
        <img src="https://res.cloudinary.com/dagt2a1w0/image/upload/v1773768204/ChatGPT_Image_Jan_31__2026__04_03_54_AM_1769828712771_d65sw2.png" alt="PIS" className="adm2-login-logo" />
        <h1 className="adm2-login-title">Admin Dashboard</h1>
        <p className="adm2-login-sub">Prudential International School · Abuja</p>
        <form onSubmit={submit} style={{ width: "100%" }}>
          <input type="password" placeholder="Enter admin password" value={pw} onChange={e => setPw(e.target.value)} className="adm2-input" style={{ marginBottom: 12 }} required />
          {err && <div className="adm2-flash adm2-flash-err" style={{ marginBottom: 12 }}>{err}</div>}
          <button type="submit" className="adm2-btn-primary" style={{ width: "100%" }} disabled={loading}>{loading ? "Signing in…" : "Sign In"}</button>
        </form>
      </div>
    </div>
  );
}

// Overview
function OverviewTab({ token, setTab }: { token: string; setTab: (t: Tab) => void }) {
  const [counts, setCounts] = useState({ gallery: 0, staff: 0, announcements: 0, events: 0, submissions: 0, unread: 0, testimonials: 0 });
  useEffect(() => {
    const h = authH(token);
    Promise.all([
      fetch(`${CMS}/gallery?type=image`).then(r => r.ok ? r.json() : []),
      fetch(`${API}/staff`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/announcements`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/events`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/submissions`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/testimonials`, { headers: h }).then(r => r.ok ? r.json() : []),
    ]).then(([gallery, staff, ann, events, subs, testimonials]) => {
      setCounts({ gallery: gallery.length, staff: staff.length, announcements: ann.length, events: events.length, submissions: subs.length, unread: subs.filter((s: any) => !s.read).length, testimonials: testimonials.length });
    }).catch(() => {});
  }, [token]);

  const stats = [
    { label: "Unread Messages", value: counts.unread, total: `of ${counts.submissions}`, color: counts.unread > 0 ? "#ef4444" : "#22c55e", urgent: counts.unread > 0, tab: "submissions" as Tab },
    { label: "Gallery Photos", value: counts.gallery, color: "#3b82f6", tab: "media" as Tab },
    { label: "Team Members", value: counts.staff, color: "#8b5cf6", tab: "staff" as Tab },
    { label: "Announcements", value: counts.announcements, color: "#f59e0b", tab: "announcements" as Tab },
    { label: "Events", value: counts.events, color: "#10b981", tab: "events" as Tab },
    { label: "Testimonials", value: counts.testimonials, color: "#ec4899", tab: "testimonials" as Tab },
  ];

  const quick: { icon: string; label: string; desc: string; tab: Tab; color: string }[] = [
    { icon: "hero", label: "Edit Homepage", desc: "Update headline, stats, and CTA", tab: "hero", color: "#0B1F5C" },
    { icon: "gallery-images", label: "Add Photos", desc: "Upload gallery photos by category", tab: "gallery-images", color: "#3b82f6" },
    { icon: "announcements", label: "Post Announcement", desc: "Publish to the website", tab: "announcements", color: "#f59e0b" },
    { icon: "testimonials", label: "Manage Testimonials", desc: "Curate parent testimonial cards", tab: "testimonials", color: "#ec4899" },
    { icon: "staff", label: "Manage Team", desc: "Add or update staff profiles", tab: "staff", color: "#8b5cf6" },
    { icon: "submissions", label: "Read Messages", desc: "Review contact enquiries", tab: "submissions", color: "#ef4444" },
    { icon: "contact", label: "Update Contact Info", desc: "Phone, email, address, hours", tab: "contact", color: "#10b981" },
  ];

  return (
    <div className="adm2-content">
      <div className="adm2-page-header">
        <h2>Dashboard Overview</h2>
        <p>Everything happening on the Prudential website at a glance.</p>
      </div>

      {counts.unread > 0 && (
        <div className="adm2-alert" onClick={() => setTab("submissions")}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
          You have <strong>{counts.unread} unread {counts.unread === 1 ? "message" : "messages"}</strong> — click to view
        </div>
      )}

      <div className="adm2-stats-grid">
        {stats.map(s => (
          <button key={s.label} className={`adm2-stat-card${s.urgent ? " adm2-stat-urgent" : ""}`} onClick={() => setTab(s.tab)}>
            <div className="adm2-stat-num" style={{ color: s.color }}>{s.value}</div>
            <div className="adm2-stat-label">{s.label}</div>
            {s.total && <div className="adm2-stat-sub">{s.total}</div>}
          </button>
        ))}
      </div>

      <h3 className="adm2-section-title">Quick Actions</h3>
      <div className="adm2-quick-grid">
        {quick.map(q => (
          <button key={q.tab} className="adm2-quick-card" onClick={() => setTab(q.tab)}>
            <div className="adm2-quick-icon" style={{ background: q.color + "15", color: q.color }}>{Ic[q.icon]}</div>
            <div className="adm2-quick-text">
              <strong>{q.label}</strong>
              <span>{q.desc}</span>
            </div>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "#94a3b8", flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
          </button>
        ))}
      </div>

      <h3 className="adm2-section-title" style={{ marginTop: 32 }}>All Pages You Can Edit</h3>
      <div className="adm2-all-pages-grid">
        {([
          { tab: "hero", label: "Homepage Hero" }, { tab: "features", label: "Why We're Different" },
          { tab: "campus", label: "Campus Section" }, { tab: "about", label: "About Page" },
          { tab: "divisions", label: "Academic Divisions" }, { tab: "academics-content", label: "Academics Content" },
          { tab: "values", label: "Core Values" }, { tab: "student-life", label: "Student Life" },
          { tab: "portals", label: "Portal Links" }, { tab: "media", label: "Gallery & Videos" },
          { tab: "anthem", label: "Anthems" },
          { tab: "staff", label: "Meet the Team" }, { tab: "rules", label: "Rules & Regs" },
          { tab: "announcements", label: "Announcements" }, { tab: "events", label: "Events" },
          { tab: "testimonials", label: "Testimonials" },
          { tab: "contact", label: "Contact Info" }, { tab: "submissions", label: "Enquiries" },
        ] as { tab: Tab; label: string }[]).map(p => (
          <button key={p.tab} className="adm2-page-chip" onClick={() => setTab(p.tab)}>
            <span className="adm2-page-chip-icon">{Ic[p.tab] ?? Ic.about}</span>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Gallery helper - shared between Images and Videos tabs
function GalleryTab({ token, mediaType }: { token: string; mediaType: "image" | "video" }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState<{ name: string; percent: number; error?: string }[]>([]);
  const { msg, flash } = useFlash();

  const loadCategories = useCallback(async () => {
    const r = await fetch(`${API}/gallery/categories`, { headers: authH(token) });
    if (r.ok) {
      const cats = await r.json();
      setCategories(cats);
      if (cats.length && !cats.some((c: any) => c.name === activeCategory)) {
        setActiveCategory(cats[0].name);
      }
    }
  }, [token, activeCategory]);

  const loadItems = useCallback(async () => {
    if (!activeCategory) { setItems([]); return; }
    const r = await fetch(`${CMS}/gallery?category=${encodeURIComponent(activeCategory)}&type=${mediaType}`);
    if (r.ok) setItems(await r.json());
  }, [activeCategory, mediaType]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadItems(); }, [loadItems]);

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCatName.trim(); if (!name) return;
    const r = await fetch(`${API}/gallery/categories`, { method: "POST", headers: authH(token), body: JSON.stringify({ name }) });
    if (r.ok) {
      const cat = await r.json();
      setNewCatName(""); setCreatingCat(false);
      flash(`Category "${name}" created.`);
      await loadCategories(); setActiveCategory(cat.name);
    } else flash("Could not create category.", false);
  };

  const renameCategory = async (id: number) => {
    const name = renameValue.trim(); if (!name) { setRenamingId(null); return; }
    const r = await fetch(`${API}/gallery/categories/${id}`, { method: "PUT", headers: authH(token), body: JSON.stringify({ name }) });
    if (r.ok) { flash("Renamed."); setRenamingId(null); await loadCategories(); if (activeCategory) setActiveCategory(name); }
    else flash("Could not rename.", false);
  };

  const deleteCategory = async (cat: any) => {
    if (cat.itemCount > 0) { flash(`Move or delete the ${cat.itemCount} item(s) first.`, false); return; }
    if (!confirm(`Delete the empty category "${cat.name}"?`)) return;
    const r = await fetch(`${API}/gallery/categories/${cat.id}`, { method: "DELETE", headers: authH(token) });
    if (r.ok) { flash("Deleted."); await loadCategories(); }
    else flash("Could not delete.", false);
  };

  const handleFiles = async (files: FileList | File[]) => {
    if (!activeCategory) { flash("Select or create a category first.", false); return; }
    const fileArr = Array.from(files);
    setUploads(fileArr.map(f => ({ name: f.name, percent: 0 })));
    const results = await uploadManyToCloudinary(fileArr, (i, pct) => {
      setUploads(prev => prev.map((u, idx) => idx === i ? { ...u, percent: pct } : u));
    });
    const successes = results.filter((r): r is UploadResult => !("error" in r));
    const failures = results.filter((r): r is { error: string } => "error" in r);
    if (successes.length) {
      await fetch(`${API}/gallery/batch`, {
        method: "POST", headers: authH(token),
        body: JSON.stringify({ items: successes.map(s => ({ url: s.url, type: mediaType, category: activeCategory })) }),
      });
      flash(`Added ${successes.length} ${mediaType}(s) to "${activeCategory}".`);
      loadItems(); loadCategories();
    }
    if (failures.length) flash(`${failures.length} file(s) failed.`, false);
    setTimeout(() => setUploads([]), 1800);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const remove = async (id: number) => {
    if (!confirm("Remove this item?")) return;
    await fetch(`${API}/gallery/${id}`, { method: "DELETE", headers: authH(token) });
    flash("Removed."); loadItems(); loadCategories();
  };

  const accept = mediaType === "image" ? "image/*" : "video/*";
  const label = mediaType === "image" ? "Photos" : "Videos";

  return (
    <div className="adm2-content">
      <div className="adm2-page-header">
        <h2>Gallery {label}</h2>
        <p>{mediaType === "image"
          ? "Organise photos into categories — then drag and drop to upload. No Cloudinary copy-pasting needed."
          : "Organise videos into categories — then drag and drop to upload. Supports MP4, MOV, and other common formats."}</p>
      </div>
      <Flash msg={msg} />

      {/* Category section */}
      <div className="adm2-section-block">
        <div className="adm2-section-label">Categories</div>
        <div className="adm2-cat-list">
          {categories.map(cat => (
            <div key={cat.id} className={"adm2-cat-item" + (activeCategory === cat.name ? " adm2-cat-item--active" : "")}>
              {renamingId === cat.id ? (
                <input
                  className="adm2-input" autoFocus style={{ flex: 1, minWidth: 0 }}
                  value={renameValue} onChange={e => setRenameValue(e.target.value)}
                  onBlur={() => renameCategory(cat.id)}
                  onKeyDown={e => { if (e.key === "Enter") renameCategory(cat.id); if (e.key === "Escape") setRenamingId(null); }}
                />
              ) : (
                <button className="adm2-cat-item-btn" onClick={() => setActiveCategory(cat.name)}>
                  <span className="adm2-cat-item-name">{cat.name}</span>
                  <span className="adm2-cat-item-count">{cat.itemCount}</span>
                </button>
              )}
              <div className="adm2-cat-item-actions">
                <button className="adm2-icon-btn" title="Rename" onClick={() => { setRenamingId(cat.id); setRenameValue(cat.name); }}>✎</button>
                {(cat.itemCount === 0) && <button className="adm2-icon-btn adm2-icon-btn--danger" title="Delete" onClick={() => deleteCategory(cat)}>×</button>}
              </div>
            </div>
          ))}

          {creatingCat ? (
            <form onSubmit={createCategory} className="adm2-cat-new-form">
              <input className="adm2-input" autoFocus placeholder="Category name…"
                value={newCatName} onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => { if (e.key === "Escape") { setCreatingCat(false); setNewCatName(""); } }}
              />
              <button type="submit" className="adm2-btn-primary" style={{ padding: "8px 16px" }}>Create</button>
              <button type="button" className="adm2-btn-ghost" style={{ padding: "8px 12px" }} onClick={() => { setCreatingCat(false); setNewCatName(""); }}>Cancel</button>
            </form>
          ) : (
            <button className="adm2-cat-add-btn" onClick={() => setCreatingCat(true)}>
              <span>+</span> New Category
            </button>
          )}
        </div>
      </div>

      {/* Upload zone */}
      {activeCategory ? (
        <div className="adm2-section-block">
          <div className="adm2-section-label">Upload to "{activeCategory}"</div>
          <div
            className={"adm2-drop-zone adm2-drop-zone--large" + (dragOver ? " adm2-drop-zone--over" : "")}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <div className="adm2-drop-empty">
              <div className="adm2-drop-icon">{mediaType === "image" ? "🖼" : "🎬"}</div>
              <p>Drag {label.toLowerCase()} here to upload</p>
              <p className="adm2-drop-sub">or</p>
              <label className="adm2-btn-primary" style={{ cursor: "pointer" }}>
                Choose {label}
                <input type="file" accept={accept} multiple style={{ display: "none" }}
                  onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }}
                />
              </label>
            </div>
            {uploads.length > 0 && (
              <div className="adm2-upload-progress">
                {uploads.map((u, i) => (
                  <div key={i} className="adm2-upload-row">
                    <div className="adm2-upload-name">{u.name}<span>{u.error ? "Failed" : `${u.percent}%`}</span></div>
                    <div className="adm2-upload-bar">
                      <div style={{ width: `${u.percent}%`, background: u.error ? "#dc2626" : "#0B1F5C" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        !categories.length && (
          <div className="adm2-empty-state">
            <div style={{ fontSize: 32 }}>{mediaType === "image" ? "🖼" : "🎬"}</div>
            <p>No categories yet — create one above to get started.</p>
          </div>
        )
      )}

      {/* Items grid */}
      {activeCategory && items.length > 0 && (
        <div className="adm2-section-block">
          <div className="adm2-section-label">{items.length} {label} in "{activeCategory}"</div>
          <div className={"adm2-media-grid" + (mediaType === "video" ? " adm2-media-grid--video" : "")}>
            {[...items].sort((a, b) => a.display_order - b.display_order).map(item => (
              <div key={item.id} className="adm2-media-card">
                {item.type === "video"
                  ? <video src={item.url} className="adm2-media-thumb" muted />
                  : <img src={item.url} alt={item.caption ?? ""} className="adm2-media-thumb" onError={e => (e.currentTarget.style.opacity = "0.2")} />
                }
                <div className="adm2-media-overlay">
                  <button className="adm2-icon-btn adm2-icon-btn--light adm2-icon-btn--danger" onClick={() => remove(item.id)}>×</button>
                </div>
                {item.caption && <div className="adm2-media-caption">{item.caption}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCategory && items.length === 0 && categories.length > 0 && (
        <div className="adm2-empty-state">
          <p>No {label.toLowerCase()} in "{activeCategory}" yet.</p>
        </div>
      )}
    </div>
  );
}

function GalleryImagesTab({ token }: { token: string }) {
  return <GalleryTab token={token} mediaType="image" />;
}

function GalleryVideosTab({ token }: { token: string }) {
  return <GalleryTab token={token} mediaType="video" />;
}


// Announcements
function AnnouncementsTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]); const [form, setForm] = useState({ title: "", body: "", imageUrl: "", published: true }); const [editing, setEditing] = useState<number | null>(null);
  const { msg, flash } = useFlash();
  const load = useCallback(async () => { const r = await fetch(`${API}/announcements`, { headers: authH(token) }); if (r.ok) setItems(await r.json()); }, [token]);
  useEffect(() => { load(); }, [load]);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { title: form.title, body: form.body, imageUrl: form.imageUrl || null, published: form.published };
    const url = editing !== null ? `${API}/announcements/${editing}` : `${API}/announcements`;
    await fetch(url, { method: editing !== null ? "PUT" : "POST", headers: authH(token), body: JSON.stringify(body) });
    setForm({ title: "", body: "", imageUrl: "", published: true }); setEditing(null); flash(editing !== null ? "Updated!" : "Posted!"); load();
  };
  const del = async (id: number) => { if (!confirm("Delete this announcement?")) return; await fetch(`${API}/announcements/${id}`, { method: "DELETE", headers: authH(token) }); flash("Deleted."); load(); };
  const startEdit = (a: any) => { setEditing(a.id); setForm({ title: a.title, body: a.body, imageUrl: a.image_url ?? "", published: a.published }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>{editing !== null ? "Edit Announcement" : "Announcements"}</h2><p>These appear publicly on the website for all visitors to see.</p></div>
      <Flash msg={msg} />
      <div className="adm2-card">
        <form onSubmit={save}>
          <Field label="Title"><input className="adm2-input" placeholder="e.g. Term 2 Resumption Date" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></Field>
          <Field label="Message"><textarea className="adm2-textarea" rows={5} placeholder="Write the announcement here…" value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} required /></Field>
          <Field label="Image URL (optional)"><input className="adm2-input" placeholder="https://…" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} /></Field>
          <label className="adm2-check"><input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} /> Visible to website visitors</label>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type="submit" className="adm2-btn-primary">{editing !== null ? "Save Changes" : "Post Announcement"}</button>
            {editing !== null && <button type="button" className="adm2-btn-ghost" onClick={() => { setEditing(null); setForm({ title: "", body: "", imageUrl: "", published: true }); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="adm2-list">
        {items.length === 0 && <div className="adm2-empty">No announcements yet.</div>}
        {items.map(a => (
          <div key={a.id} className={`adm2-list-item${!a.published ? " adm2-list-draft" : ""}`}>
            <div className="adm2-list-body">
              <strong>{a.title}</strong>
              <span>{new Date(a.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} {!a.published && <span className="adm2-draft-tag">Draft</span>}</span>
              <p>{a.body.slice(0, 120)}{a.body.length > 120 ? "…" : ""}</p>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button className="adm2-btn-sm" onClick={() => startEdit(a)}>Edit</button>
              <button className="adm2-btn-danger-sm" onClick={() => del(a.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Testimonials
function TestimonialsTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ imageUrl: "", caption: "", displayOrder: 0, published: true });
  const [editing, setEditing] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { msg, flash } = useFlash();

  const load = useCallback(async () => {
    const r = await fetch(`${API}/testimonials`, { headers: authH(token) });
    if (r.ok) setItems(await r.json());
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const uploadFile = async (file: File) => {
    flash("Uploading…");
    const results = await uploadManyToCloudinary([file]);
    if (results[0]?.url) { setForm(f => ({ ...f, imageUrl: results[0].url })); flash("Image uploaded — fill in label and save."); }
    else flash("Upload failed.", false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { imageUrl: form.imageUrl, caption: form.caption || null, displayOrder: Number(form.displayOrder) || 0, published: form.published };
    const url = editing !== null ? `${API}/testimonials/${editing}` : `${API}/testimonials`;
    await fetch(url, { method: editing !== null ? "PUT" : "POST", headers: authH(token), body: JSON.stringify(body) });
    setForm({ imageUrl: "", caption: "", displayOrder: 0, published: true });
    setEditing(null); flash(editing !== null ? "Updated!" : "Added!"); load();
  };

  const del = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`${API}/testimonials/${id}`, { method: "DELETE", headers: authH(token) });
    flash("Deleted."); load();
  };

  const startEdit = (t: any) => {
    setEditing(t.id);
    setForm({ imageUrl: t.image_url, caption: t.caption ?? "", displayOrder: t.display_order ?? 0, published: !!t.published });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="adm2-content">
      <div className="adm2-page-header">
        <h2>Testimonials</h2>
        <p>Parent testimonial cards shown on the homepage. Each is a single image with the quote designed into it — drag and drop to upload.</p>
      </div>
      <Flash msg={msg} />

      <div className="adm2-card">
        <div className="adm2-card-title">{editing !== null ? "Edit Testimonial" : "Add Testimonial"}</div>
        <form onSubmit={save}>
          <Field label="Testimonial Image">
            <div
              className={"adm2-drop-zone" + (dragOver ? " adm2-drop-zone--over" : "") + (form.imageUrl ? " adm2-drop-zone--filled" : "")}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={async e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) uploadFile(f); }}
            >
              {form.imageUrl ? (
                <div className="adm2-drop-preview">
                  <img src={form.imageUrl} alt="" />
                  <button type="button" className="adm2-drop-clear" onClick={() => setForm(f => ({ ...f, imageUrl: "" }))}>× Change</button>
                </div>
              ) : (
                <div className="adm2-drop-empty">
                  <div className="adm2-drop-icon">🖼</div>
                  <p>Drag testimonial image here</p>
                  <label className="adm2-btn-ghost" style={{ cursor: "pointer" }}>
                    Browse files
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }} />
                  </label>
                </div>
              )}
            </div>
          </Field>

          <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
            <Field label="Internal Label" hint="for your reference only — not shown on site">
              <input className="adm2-input" placeholder="e.g. Mrs Jane Doe — Conducive Environment" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} />
            </Field>
            <Field label="Order" hint="lower = first">
              <input className="adm2-input" type="number" style={{ width: 90 }} value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))} />
            </Field>
          </div>

          <label className="adm2-check" style={{ marginTop: 8 }}>
            <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
            Visible to website visitors
          </label>

          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button type="submit" className="adm2-btn-primary" disabled={!form.imageUrl}>{editing !== null ? "Save Changes" : "Add Testimonial"}</button>
            {editing !== null && <button type="button" className="adm2-btn-ghost" onClick={() => { setEditing(null); setForm({ imageUrl: "", caption: "", displayOrder: 0, published: true }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="adm2-section-label">All Testimonials ({items.length})</div>
        <div className="adm2-testimonial-grid">
          {items.length === 0 && <div className="adm2-empty">No testimonials yet — upload one above.</div>}
          {items.map(t => (
            <div key={t.id} className={"adm2-testimonial-card" + (!t.published ? " adm2-draft" : "")}>
              <img src={t.image_url} alt="" className="adm2-testimonial-img" onError={e => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
              <div className="adm2-testimonial-meta">
                <span className="adm2-testimonial-label">{t.caption || "Testimonial"}</span>
                {!t.published && <span className="adm2-draft-tag">Hidden</span>}
              </div>
              <div className="adm2-testimonial-actions">
                <button className="adm2-btn-sm" onClick={() => startEdit(t)}>Edit</button>
                <button className="adm2-btn-danger-sm" onClick={() => del(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Events
function EventsTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]); const [form, setForm] = useState({ title: "", description: "", eventDate: "", location: "", published: true }); const [editing, setEditing] = useState<number | null>(null);
  const { msg, flash } = useFlash();
  const load = useCallback(async () => { const r = await fetch(`${API}/events`, { headers: authH(token) }); if (r.ok) setItems(await r.json()); }, [token]);
  useEffect(() => { load(); }, [load]);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { title: form.title, description: form.description || null, eventDate: form.eventDate, location: form.location || null, published: form.published };
    const url = editing !== null ? `${API}/events/${editing}` : `${API}/events`;
    await fetch(url, { method: editing !== null ? "PUT" : "POST", headers: authH(token), body: JSON.stringify(body) });
    setForm({ title: "", description: "", eventDate: "", location: "", published: true }); setEditing(null); flash(editing !== null ? "Updated!" : "Added!"); load();
  };
  const del = async (id: number) => { if (!confirm("Delete this event?")) return; await fetch(`${API}/events/${id}`, { method: "DELETE", headers: authH(token) }); flash("Deleted."); load(); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>{editing !== null ? "Edit Event" : "Events"}</h2><p>School events shown publicly on the website calendar.</p></div>
      <Flash msg={msg} />
      <div className="adm2-card">
        <form onSubmit={save}>
          <Field label="Event Title"><input className="adm2-input" placeholder="e.g. Prize-Giving Day 2026" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></Field>
          <div style={{ display: "flex", gap: 12 }}>
            <Field label="Date"><input className="adm2-input" type="date" value={form.eventDate} onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} required /></Field>
            <Field label="Location (optional)"><input className="adm2-input" placeholder="e.g. School Hall" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></Field>
          </div>
          <Field label="Description (optional)"><textarea className="adm2-textarea" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
          <label className="adm2-check"><input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} /> Published</label>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type="submit" className="adm2-btn-primary">{editing !== null ? "Save" : "Add Event"}</button>
            {editing !== null && <button type="button" className="adm2-btn-ghost" onClick={() => { setEditing(null); setForm({ title: "", description: "", eventDate: "", location: "", published: true }); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="adm2-list">
        {items.length === 0 && <div className="adm2-empty">No events yet.</div>}
        {items.map(ev => (
          <div key={ev.id} className={`adm2-list-item${!ev.published ? " adm2-list-draft" : ""}`}>
            <div className="adm2-list-body">
              <strong>{ev.title}</strong>
              <span>{ev.event_date}{ev.location ? ` · ${ev.location}` : ""} {!ev.published && <span className="adm2-draft-tag">Draft</span>}</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="adm2-btn-sm" onClick={() => { setEditing(ev.id); setForm({ title: ev.title, description: ev.description ?? "", eventDate: ev.event_date, location: ev.location ?? "", published: ev.published }); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
              <button className="adm2-btn-danger-sm" onClick={() => { if (!confirm("Delete?")) return; fetch(`${API}/events/${ev.id}`, { method: "DELETE", headers: authH(token) }).then(() => { flash("Deleted."); load(); }); }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hero
function HeroTab({ token }: { token: string }) {
  const [form, setForm] = useState({ headline: "", subtext: "", badge: "", btn1Text: "", btn2Text: "", bgImage: "", stat1Num: "", stat1Label: "", stat2Num: "", stat2Label: "", stat3Num: "", stat3Label: "", ctaBadge: "", ctaHeading: "", ctaBody: "", ctaBtn1: "", ctaBtn2: "" });
  const { msg, flash } = useFlash();
  const sf = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  useEffect(() => {
    fetch(`${API}/hero`, { headers: authH(token) }).then(r => r.ok ? r.json() : null).then(d => {
      if (d) setForm({ headline: d.headline||"", subtext: d.subtext||"", badge: d.badge||"", btn1Text: d.btn1_text||"", btn2Text: d.btn2_text||"", bgImage: d.bg_image||"", stat1Num: d.stat1_num||"", stat1Label: d.stat1_label||"", stat2Num: d.stat2_num||"", stat2Label: d.stat2_label||"", stat3Num: d.stat3_num||"", stat3Label: d.stat3_label||"", ctaBadge: d.cta_badge||"", ctaHeading: d.cta_heading||"", ctaBody: d.cta_body||"", ctaBtn1: d.cta_btn1||"", ctaBtn2: d.cta_btn2||"" });
    }).catch(() => {});
  }, [token]);
  const save = async (e: React.FormEvent) => { e.preventDefault(); const r = await fetch(`${API}/hero`, { method: "PUT", headers: authH(token), body: JSON.stringify(form) }); if (r.ok) flash("Saved!"); else flash("Save failed.", false); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>Homepage Hero & CTA</h2><p>The first thing visitors see. Keep it clear, confident, and up to date.</p></div>
      <Flash msg={msg} />
      <form onSubmit={save}>
        <div className="adm2-card">
          <div className="adm2-card-title">Hero Section</div>
          <Field label="Ribbon Badge" hint="shown on the crimson ribbon"><input className="adm2-input" value={form.badge} onChange={sf("badge")} placeholder="Discipline · Excellence · Integrity · Respect" /></Field>
          <Field label="Headline"><input className="adm2-input" value={form.headline} onChange={sf("headline")} /></Field>
          <Field label="Subtext"><textarea className="adm2-textarea" rows={3} value={form.subtext} onChange={sf("subtext")} /></Field>
          <div style={{ display: "flex", gap: 12 }}>
            <Field label="Primary Button"><input className="adm2-input" value={form.btn1Text} onChange={sf("btn1Text")} placeholder="Apply for Admission" /></Field>
            <Field label="Secondary Button"><input className="adm2-input" value={form.btn2Text} onChange={sf("btn2Text")} placeholder="Discover Our Story" /></Field>
          </div>
        </div>
        <div className="adm2-card">
          <div className="adm2-card-title">Stats Counters</div>
          {[{ n: "stat1Num", l: "stat1Label", label: "Stat 1" }, { n: "stat2Num", l: "stat2Label", label: "Stat 2" }, { n: "stat3Num", l: "stat3Label", label: "Stat 3" }].map(s => (
            <div key={s.n} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              <Field label={`${s.label} Number`}><input className="adm2-input" style={{ width: 100 }} value={(form as any)[s.n]} onChange={sf(s.n)} placeholder="11+" /></Field>
              <Field label={`${s.label} Label`}><input className="adm2-input" value={(form as any)[s.l]} onChange={sf(s.l)} placeholder="Years of Excellence" /></Field>
            </div>
          ))}
        </div>
        <div className="adm2-card">
          <div className="adm2-card-title">Call-to-Action Section</div>
          <Field label="Badge Text"><input className="adm2-input" value={form.ctaBadge} onChange={sf("ctaBadge")} placeholder="Admissions Open — 2026/2027" /></Field>
          <Field label="Heading"><input className="adm2-input" value={form.ctaHeading} onChange={sf("ctaHeading")} /></Field>
          <Field label="Body"><textarea className="adm2-textarea" rows={3} value={form.ctaBody} onChange={sf("ctaBody")} /></Field>
          <div style={{ display: "flex", gap: 12 }}>
            <Field label="Primary Button"><input className="adm2-input" value={form.ctaBtn1} onChange={sf("ctaBtn1")} /></Field>
            <Field label="Secondary Button"><input className="adm2-input" value={form.ctaBtn2} onChange={sf("ctaBtn2")} /></Field>
          </div>
        </div>
        <button type="submit" className="adm2-btn-primary">Save Hero & CTA</button>
      </form>
    </div>
  );
}

// About
function AboutTab({ token }: { token: string }) {
  const [form, setForm] = useState({ story1: "", story2: "", story3: "", mission: "", vision: "", img1: "", img2: "" });
  const { msg, flash } = useFlash();
  useEffect(() => { fetch(`${API}/about`, { headers: authH(token) }).then(r => r.ok ? r.json() : null).then(d => { if (d) setForm({ story1: d.story1, story2: d.story2, story3: d.story3, mission: d.mission, vision: d.vision, img1: d.img1||"", img2: d.img2||"" }); }).catch(() => {}); }, [token]);
  const save = async (e: React.FormEvent) => { e.preventDefault(); const r = await fetch(`${API}/about`, { method: "PUT", headers: authH(token), body: JSON.stringify(form) }); if (r.ok) flash("About page saved!"); else flash("Save failed.", false); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>About Page</h2><p>The school story, mission, vision, and photos.</p></div>
      <Flash msg={msg} />
      <form onSubmit={save}>
        <div className="adm2-card">
          <div className="adm2-card-title">School Story</div>
          {[{k:"story1",l:"Paragraph 1"},{k:"story2",l:"Paragraph 2"},{k:"story3",l:"Paragraph 3"}].map(f => (
            <Field key={f.k} label={f.l}><textarea className="adm2-textarea" rows={3} value={(form as any)[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} /></Field>
          ))}
        </div>
        <div className="adm2-card">
          <div className="adm2-card-title">Mission & Vision</div>
          <Field label="Mission Statement"><textarea className="adm2-textarea" rows={3} value={form.mission} onChange={e => setForm(f => ({ ...f, mission: e.target.value }))} /></Field>
          <Field label="Vision Statement"><textarea className="adm2-textarea" rows={3} value={form.vision} onChange={e => setForm(f => ({ ...f, vision: e.target.value }))} /></Field>
        </div>
        <div className="adm2-card">
          <div className="adm2-card-title">Story Photos</div>
          <div style={{ display: "flex", gap: 16 }}>
            {[{k:"img1",l:"Photo 1"},{k:"img2",l:"Photo 2"}].map(f => (
              <div key={f.k} style={{ flex: 1 }}>
                <Field label={f.l}><input className="adm2-input" value={(form as any)[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder="https://…" /></Field>
                {(form as any)[f.k] && <img src={(form as any)[f.k]} alt="preview" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginTop: 8 }} onError={e => (e.currentTarget.style.display = "none")} />}
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="adm2-btn-primary">Save About Page</button>
      </form>
    </div>
  );
}

// Contact Info
function ContactTab({ token }: { token: string }) {
  const [form, setForm] = useState({ phone1: "", phone2: "", email: "", address: "", hours: "", mapUrl: "", facebook: "" });
  const { msg, flash } = useFlash();
  useEffect(() => { fetch(`${API}/contact`, { headers: authH(token) }).then(r => r.ok ? r.json() : null).then(d => { if (d) setForm({ phone1: d.phone1, phone2: d.phone2, email: d.email, address: d.address, hours: d.hours||"", mapUrl: d.map_url||"", facebook: d.facebook||"" }); }).catch(() => {}); }, [token]);
  const save = async (e: React.FormEvent) => { e.preventDefault(); const r = await fetch(`${API}/contact`, { method: "PUT", headers: authH(token), body: JSON.stringify(form) }); if (r.ok) flash("Saved! Changes are live everywhere."); else flash("Save failed.", false); };
  const fields = [
    { k: "phone1", l: "Phone Number 1", ph: "+234 809 570 0591" },
    { k: "phone2", l: "Phone Number 2", ph: "+234 906 421 9878" },
    { k: "email",  l: "Email Address",  ph: "pis.abuja@gmail.com" },
    { k: "address",l: "Physical Address",ph: "16 & 18 2nd Avenue, Gwarinpa Estate…" },
    { k: "hours",  l: "School Hours",   ph: "Monday – Friday, 8:00am – 4:00pm" },
    { k: "facebook",l:"Facebook URL (optional)",ph:"https://facebook.com/…" },
    { k: "mapUrl", l: "Google Maps Embed URL (optional)", ph: "https://google.com/maps/embed?…" },
  ];
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>Contact Information</h2><p>These details appear in the topbar, footer, and contact page — one change updates the whole site.</p></div>
      <Flash msg={msg} />
      <div className="adm2-card">
        <form onSubmit={save}>
          {fields.map(f => <Field key={f.k} label={f.l}><input className="adm2-input" value={(form as any)[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph} /></Field>)}
          <button type="submit" className="adm2-btn-primary" style={{ marginTop: 8 }}>Save Contact Info</button>
        </form>
      </div>
    </div>
  );
}

// Values
function ValuesTab({ token }: { token: string }) {
  const [values, setValues] = useState<any[]>([]); const [editing, setEditing] = useState<any | null>(null); const [newForm, setNewForm] = useState({ title: "", body: "" }); const [adding, setAdding] = useState(false);
  const { msg, flash } = useFlash();
  const load = useCallback(async () => { const r = await fetch(`${API}/values`, { headers: authH(token) }); if (r.ok) setValues(await r.json()); }, [token]);
  useEffect(() => { load(); }, [load]);
  const save = async (e: React.FormEvent) => { e.preventDefault(); if (!editing) return; const r = await fetch(`${API}/values/${editing.id}`, { method: "PUT", headers: authH(token), body: JSON.stringify({ title: editing.title, body: editing.body }) }); if (r.ok) { flash("Updated!"); setEditing(null); load(); } else flash("Save failed.", false); };
  const add = async (e: React.FormEvent) => { e.preventDefault(); const r = await fetch(`${API}/values`, { method: "POST", headers: authH(token), body: JSON.stringify(newForm) }); if (r.ok) { flash("Added!"); setNewForm({ title: "", body: "" }); setAdding(false); load(); } };
  const del = async (id: number) => { if (!confirm("Delete?")) return; await fetch(`${API}/values/${id}`, { method: "DELETE", headers: authH(token) }); flash("Deleted."); load(); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>Core Values</h2><p>The school's core values shown on the About page.</p></div>
      <Flash msg={msg} />
      {(editing || adding) && (
        <div className="adm2-card">
          <form onSubmit={editing ? save : add}>
            <div className="adm2-card-title">{editing ? `Editing: ${editing.title}` : "New Core Value"}</div>
            <Field label="Value Title"><input className="adm2-input" value={editing ? editing.title : newForm.title} onChange={e => editing ? setEditing((v: any) => ({ ...v, title: e.target.value })) : setNewForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Integrity" required /></Field>
            <Field label="Description"><textarea className="adm2-textarea" rows={3} value={editing ? editing.body : newForm.body} onChange={e => editing ? setEditing((v: any) => ({ ...v, body: e.target.value })) : setNewForm(f => ({ ...f, body: e.target.value }))} required /></Field>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="adm2-btn-primary">Save</button>
              <button type="button" className="adm2-btn-ghost" onClick={() => { setEditing(null); setAdding(false); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {!editing && !adding && <button className="adm2-btn-primary" style={{ marginBottom: 16 }} onClick={() => setAdding(true)}>+ Add Value</button>}
      <div className="adm2-list">
        {values.map(v => (
          <div key={v.id} className="adm2-list-item">
            <div className="adm2-list-body"><strong>{v.title}</strong><p>{v.body.slice(0, 100)}…</p></div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="adm2-btn-sm" onClick={() => { setEditing({ ...v }); setAdding(false); }}>Edit</button>
              <button className="adm2-btn-danger-sm" onClick={() => del(v.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Divisions
function DivisionsTab({ token }: { token: string }) {
  const [divisions, setDivisions] = useState<any[]>([]); const [editing, setEditing] = useState<any | null>(null); const [newForm, setNewForm] = useState({ title: "", age_range: "", body: "" }); const [adding, setAdding] = useState(false);
  const { msg, flash } = useFlash();
  const load = useCallback(async () => { const r = await fetch(`${API}/divisions`, { headers: authH(token) }); if (r.ok) setDivisions(await r.json()); }, [token]);
  useEffect(() => { load(); }, [load]);
  const save = async (e: React.FormEvent) => { e.preventDefault(); if (!editing) return; const r = await fetch(`${API}/divisions/${editing.id}`, { method: "PUT", headers: authH(token), body: JSON.stringify({ title: editing.title, ageRange: editing.age_range, body: editing.body }) }); if (r.ok) { flash("Updated!"); setEditing(null); load(); } };
  const add = async (e: React.FormEvent) => { e.preventDefault(); const r = await fetch(`${API}/divisions`, { method: "POST", headers: authH(token), body: JSON.stringify(newForm) }); if (r.ok) { flash("Added!"); setNewForm({ title: "", age_range: "", body: "" }); setAdding(false); load(); } };
  const del = async (id: number) => { if (!confirm("Delete?")) return; await fetch(`${API}/divisions/${id}`, { method: "DELETE", headers: authH(token) }); flash("Deleted."); load(); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>Academic Divisions</h2><p>Pre-School, Elementary, and Secondary sections shown on the Academics page.</p></div>
      <Flash msg={msg} />
      {(editing || adding) && (
        <div className="adm2-card">
          <form onSubmit={editing ? save : add}>
            <div className="adm2-card-title">{editing ? `Editing: ${editing.title}` : "New Division"}</div>
            <div style={{ display: "flex", gap: 12 }}>
              <Field label="Division Name"><input className="adm2-input" value={editing ? editing.title : newForm.title} onChange={e => editing ? setEditing((v: any) => ({ ...v, title: e.target.value })) : setNewForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Pre-School" required /></Field>
              <Field label="Age Range"><input className="adm2-input" value={editing ? editing.age_range : newForm.age_range} onChange={e => editing ? setEditing((v: any) => ({ ...v, age_range: e.target.value })) : setNewForm(f => ({ ...f, age_range: e.target.value }))} placeholder="Ages 2 – 5" /></Field>
            </div>
            <Field label="Description"><textarea className="adm2-textarea" rows={4} value={editing ? editing.body : newForm.body} onChange={e => editing ? setEditing((v: any) => ({ ...v, body: e.target.value })) : setNewForm(f => ({ ...f, body: e.target.value }))} required /></Field>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="adm2-btn-primary">Save</button>
              <button type="button" className="adm2-btn-ghost" onClick={() => { setEditing(null); setAdding(false); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {!editing && !adding && <button className="adm2-btn-primary" style={{ marginBottom: 16 }} onClick={() => setAdding(true)}>+ Add Division</button>}
      <div className="adm2-list">
        {divisions.map(d => (
          <div key={d.id} className="adm2-list-item">
            <div className="adm2-list-body"><strong>{d.title}</strong> <span style={{ color: "#64748b", fontSize: 13 }}>({d.age_range})</span><p>{d.body?.slice(0, 100)}…</p></div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="adm2-btn-sm" onClick={() => { setEditing({ ...d }); setAdding(false); }}>Edit</button>
              <button className="adm2-btn-danger-sm" onClick={() => del(d.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Features
function FeaturesTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]); const [editing, setEditing] = useState<number | null>(null); const [form, setForm] = useState({ title: "", body: "" });
  const { msg, flash } = useFlash();
  const load = useCallback(async () => { const r = await fetch(`${API}/features`, { headers: authH(token) }); if (r.ok) setItems(await r.json()); }, [token]);
  useEffect(() => { load(); }, [load]);
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); const max = items.reduce((m: number, i: any) => Math.max(m, i.display_order), 0);
    const url = editing !== null ? `${API}/features/${editing}` : `${API}/features`;
    const r = await fetch(url, { method: editing !== null ? "PUT" : "POST", headers: authH(token), body: JSON.stringify({ ...form, displayOrder: editing !== null ? undefined : max + 1 }) });
    if (r.ok) { setForm({ title: "", body: "" }); setEditing(null); flash(editing !== null ? "Updated!" : "Added!"); load(); } else flash("Save failed.", false);
  };
  const del = async (id: number) => { if (!confirm("Delete?")) return; await fetch(`${API}/features/${id}`, { method: "DELETE", headers: authH(token) }); flash("Deleted."); load(); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>Why We're Different</h2><p>The feature cards on the homepage. Icons are assigned automatically.</p></div>
      <Flash msg={msg} />
      <div className="adm2-card">
        <form onSubmit={save}>
          <div className="adm2-card-title">{editing !== null ? "Edit Feature" : "Add Feature"}</div>
          <Field label="Feature Title"><input className="adm2-input" placeholder="e.g. Two Curricula, One School" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></Field>
          <Field label="Description"><textarea className="adm2-textarea" rows={3} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} required /></Field>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="adm2-btn-primary">{editing !== null ? "Update" : "+ Add Feature"}</button>
            {editing !== null && <button type="button" className="adm2-btn-ghost" onClick={() => { setEditing(null); setForm({ title: "", body: "" }); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="adm2-list">
        {items.map(item => (
          <div key={item.id} className="adm2-list-item">
            <div className="adm2-list-body"><strong>{item.title}</strong><p>{item.body.slice(0, 100)}…</p></div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="adm2-btn-sm" onClick={() => { setEditing(item.id); setForm({ title: item.title, body: item.body }); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
              <button className="adm2-btn-danger-sm" onClick={() => del(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Campus
function CampusTab({ token }: { token: string }) {
  const [form, setForm] = useState({ heading: "", subtext: "", bullet1: "", bullet2: "", bullet3: "", bullet4: "" });
  const { msg, flash } = useFlash();
  const sf = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  useEffect(() => { fetch(`${API}/campus`, { headers: authH(token) }).then(r => r.ok ? r.json() : null).then(d => { if (d) setForm({ heading: d.heading, subtext: d.subtext, bullet1: d.bullet1, bullet2: d.bullet2, bullet3: d.bullet3, bullet4: d.bullet4 }); }).catch(() => {}); }, [token]);
  const save = async (e: React.FormEvent) => { e.preventDefault(); const r = await fetch(`${API}/campus`, { method: "PUT", headers: authH(token), body: JSON.stringify(form) }); if (r.ok) flash("Saved!"); else flash("Save failed.", false); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>Campus Section</h2><p>The "Come See the Campus" section on the homepage.</p></div>
      <Flash msg={msg} />
      <div className="adm2-card">
        <form onSubmit={save}>
          <Field label="Section Heading"><input className="adm2-input" value={form.heading} onChange={sf("heading")} /></Field>
          <Field label="Description"><textarea className="adm2-textarea" rows={3} value={form.subtext} onChange={sf("subtext")} /></Field>
          {(["bullet1","bullet2","bullet3","bullet4"] as const).map((k, i) => (
            <Field key={k} label={`Bullet Point ${i+1}`}><input className="adm2-input" value={form[k]} onChange={sf(k)} placeholder={`e.g. ${["Science Labs","Sports Complex","Modern Classrooms","Art Studios"][i]}`} /></Field>
          ))}
          <button type="submit" className="adm2-btn-primary" style={{ marginTop: 8 }}>Save Campus Section</button>
        </form>
      </div>
    </div>
  );
}

// Student Life
function StudentLifeTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]); const [clubs, setClubs] = useState<any[]>([]); const [editing, setEditing] = useState<number | null>(null); const [form, setForm] = useState({ title: "", body: "", imageUrl: "" }); const [clubName, setClubName] = useState("");
  const { msg, flash } = useFlash();
  const load = useCallback(async () => { const r = await fetch(`${API}/student-life`, { headers: authH(token) }); if (r.ok) { const d = await r.json(); setItems(d.items || []); setClubs(d.clubs || []); } }, [token]);
  useEffect(() => { load(); }, [load]);
  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault(); const max = items.reduce((m: number, i: any) => Math.max(m, i.display_order), 0);
    const url = editing !== null ? `${API}/student-life/items/${editing}` : `${API}/student-life/items`;
    const r = await fetch(url, { method: editing !== null ? "PUT" : "POST", headers: authH(token), body: JSON.stringify({ ...form, displayOrder: editing !== null ? undefined : max + 1 }) });
    if (r.ok) { setForm({ title: "", body: "", imageUrl: "" }); setEditing(null); flash("Saved!"); load(); }
  };
  const delItem = async (id: number) => { if (!confirm("Delete?")) return; await fetch(`${API}/student-life/items/${id}`, { method: "DELETE", headers: authH(token) }); flash("Deleted."); load(); };
  const addClub = async (e: React.FormEvent) => { e.preventDefault(); const r = await fetch(`${API}/student-life/clubs`, { method: "POST", headers: authH(token), body: JSON.stringify({ name: clubName }) }); if (r.ok) { setClubName(""); flash("Club added!"); load(); } };
  const delClub = async (id: number) => { await fetch(`${API}/student-life/clubs/${id}`, { method: "DELETE", headers: authH(token) }); load(); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>Student Life</h2><p>Activity sections and clubs shown on the Student Life page.</p></div>
      <Flash msg={msg} />
      <div className="adm2-card">
        <div className="adm2-card-title">{editing !== null ? "Edit Activity" : "Add Activity"}</div>
        <form onSubmit={saveItem}>
          <Field label="Activity Title"><input className="adm2-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Sports & Athletics" required /></Field>
          <Field label="Description"><textarea className="adm2-textarea" rows={4} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} required /></Field>
          <Field label="Image (optional)">
            <div className="adm2-upload-zone" onDragOver={e => e.preventDefault()} onDrop={async e => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (!file) return;
              flash("Uploading…");
              const results = await uploadManyToCloudinary([file]);
              if (results[0]?.url) { setForm(f => ({ ...f, imageUrl: results[0].url })); flash("Image uploaded!"); }
              else flash("Upload failed.", false);
            }}>
              {form.imageUrl
                ? <img src={form.imageUrl} alt="preview" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 6, display: "block", marginBottom: 8 }} />
                : <span>Drag image here or</span>
              }
              <label className="adm2-upload-browse">
                {form.imageUrl ? "Change image" : "browse to upload"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  flash("Uploading…");
                  const results = await uploadManyToCloudinary([file]);
                  if (results[0]?.url) { setForm(f => ({ ...f, imageUrl: results[0].url })); flash("Image uploaded!"); }
                  else flash("Upload failed.", false);
                }} />
              </label>
            </div>
          </Field>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="adm2-btn-primary">{editing !== null ? "Update Activity" : "+ Add Activity"}</button>
            {editing !== null && <button type="button" className="adm2-btn-ghost" onClick={() => { setEditing(null); setForm({ title: "", body: "", imageUrl: "" }); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="adm2-list">
        {items.map(item => (
          <div key={item.id} className="adm2-list-item">
            {item.image_url && <img src={item.image_url} alt="" style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
            <div className="adm2-list-body"><strong>{item.title}</strong><p>{item.body.slice(0, 90)}…</p></div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="adm2-btn-sm" onClick={() => { setEditing(item.id); setForm({ title: item.title, body: item.body, imageUrl: item.image_url||"" }); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
              <button className="adm2-btn-danger-sm" onClick={() => delItem(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="adm2-card" style={{ marginTop: 24 }}>
        <div className="adm2-card-title">Clubs & Societies</div>
        <form onSubmit={addClub} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input className="adm2-input" style={{ flex: 1 }} placeholder="Club name, e.g. JET Science Club" value={clubName} onChange={e => setClubName(e.target.value)} required />
          <button type="submit" className="adm2-btn-primary">+ Add</button>
        </form>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {clubs.map((c: any) => (
            <span key={c.id} className="adm2-chip">
              {c.name}
              <button onClick={() => delClub(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", marginLeft: 4, fontWeight: 700 }}>×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Portals
function PortalsTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]); const [editing, setEditing] = useState<number | null>(null); const [form, setForm] = useState({ title: "", description: "", tag: "", url: "", color: "#003366" });
  const { msg, flash } = useFlash();
  const load = useCallback(async () => { const r = await fetch(`${API}/portals`, { headers: authH(token) }); if (r.ok) setItems(await r.json()); }, [token]);
  useEffect(() => { load(); }, [load]);
  const save = async (e: React.FormEvent) => { e.preventDefault(); if (!editing) return; const r = await fetch(`${API}/portals/${editing}`, { method: "PUT", headers: authH(token), body: JSON.stringify(form) }); if (r.ok) { setEditing(null); flash("Portal updated!"); load(); } else flash("Save failed.", false); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>Portal Links</h2><p>Student, Parent, and Staff portal cards. Click Edit to update any portal's URL or description.</p></div>
      <Flash msg={msg} />
      {editing !== null && (
        <div className="adm2-card">
          <form onSubmit={save}>
            <div className="adm2-card-title">Editing Portal</div>
            <div style={{ display: "flex", gap: 12 }}>
              <Field label="Title"><input className="adm2-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></Field>
              <Field label="Tag"><input className="adm2-input" style={{ width: 120 }} value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="Students" /></Field>
              <Field label="Card Color"><input type="color" className="adm2-input" style={{ width: 60, height: 38, padding: 2 }} value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} /></Field>
            </div>
            <Field label="Description"><textarea className="adm2-textarea" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
            <Field label="Login URL"><input className="adm2-input" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://…" /></Field>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="adm2-btn-primary">Save Portal</button>
              <button type="button" className="adm2-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="adm2-list">
        {items.map(item => (
          <div key={item.id} className="adm2-list-item">
            <div className="adm2-list-icon" style={{ background: item.color + "18", color: item.color, borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{item.tag?.[0]}</div>
            <div className="adm2-list-body"><strong>{item.title}</strong> <span className="adm2-badge-sm">{item.tag}</span><span>{item.description}</span><span style={{ color: "#94a3b8", fontSize: 12 }}>{item.url}</span></div>
            <button className="adm2-btn-sm" onClick={() => { setEditing(item.id); setForm({ title: item.title, description: item.description, tag: item.tag, url: item.url, color: item.color }); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Academics Content
function AcademicsContentTab({ token }: { token: string }) {
  const [form, setForm] = useState({ curriculumHeading: "", curriculumBody: "", curriculumImage: "", scienceHeading: "", scienceBody: "", scienceImage: "" });
  const { msg, flash } = useFlash();
  const sf = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  useEffect(() => { fetch(`${API}/academics-content`, { headers: authH(token) }).then(r => r.ok ? r.json() : null).then(d => { if (d) setForm({ curriculumHeading: d.curriculum_heading, curriculumBody: d.curriculum_body, curriculumImage: d.curriculum_image||"", scienceHeading: d.science_heading, scienceBody: d.science_body, scienceImage: d.science_image||"" }); }).catch(() => {}); }, [token]);
  const save = async (e: React.FormEvent) => { e.preventDefault(); const r = await fetch(`${API}/academics-content`, { method: "PUT", headers: authH(token), body: JSON.stringify(form) }); if (r.ok) flash("Saved!"); else flash("Save failed.", false); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>Academics Content</h2><p>Curriculum overview and science section on the Academics page.</p></div>
      <Flash msg={msg} />
      <form onSubmit={save}>
        <div className="adm2-card">
          <div className="adm2-card-title">Curriculum Section</div>
          <Field label="Heading"><input className="adm2-input" value={form.curriculumHeading} onChange={sf("curriculumHeading")} /></Field>
          <Field label="Body Text"><textarea className="adm2-textarea" rows={4} value={form.curriculumBody} onChange={sf("curriculumBody")} /></Field>
          <Field label="Image URL"><input className="adm2-input" value={form.curriculumImage} onChange={sf("curriculumImage")} placeholder="https://…" /></Field>
          {form.curriculumImage && <img src={form.curriculumImage} alt="preview" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 8, marginTop: 8 }} onError={e => (e.currentTarget.style.display="none")} />}
        </div>
        <div className="adm2-card">
          <div className="adm2-card-title">Science Section</div>
          <Field label="Heading"><input className="adm2-input" value={form.scienceHeading} onChange={sf("scienceHeading")} /></Field>
          <Field label="Body Text"><textarea className="adm2-textarea" rows={4} value={form.scienceBody} onChange={sf("scienceBody")} /></Field>
          <Field label="Image URL"><input className="adm2-input" value={form.scienceImage} onChange={sf("scienceImage")} placeholder="https://…" /></Field>
          {form.scienceImage && <img src={form.scienceImage} alt="preview" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 8, marginTop: 8 }} onError={e => (e.currentTarget.style.display="none")} />}
        </div>
        <button type="submit" className="adm2-btn-primary">Save Academics Content</button>
      </form>
    </div>
  );
}

// Anthem
function AnthemTab({ token }: { token: string }) {
  const [form, setForm] = useState({ schoolTitle: "", schoolLyrics: "", schoolAudio: "", nationalTitle: "", nationalLyrics: "", nationalAudio: "" });
  const { msg, flash } = useFlash();
  const sf = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  useEffect(() => { fetch(`${API}/anthem`, { headers: authH(token) }).then(r => r.ok ? r.json() : null).then(d => { if (d) setForm({ schoolTitle: d.school_title||"", schoolLyrics: d.school_lyrics||"", schoolAudio: d.school_audio||"", nationalTitle: d.national_title||"", nationalLyrics: d.national_lyrics||"", nationalAudio: d.national_audio||"" }); }).catch(() => {}); }, [token]);
  const save = async (e: React.FormEvent) => { e.preventDefault(); const r = await fetch(`${API}/anthem`, { method: "PUT", headers: authH(token), body: JSON.stringify({ schoolTitle: form.schoolTitle, schoolLyrics: form.schoolLyrics, schoolAudio: form.schoolAudio, nationalTitle: form.nationalTitle, nationalLyrics: form.nationalLyrics, nationalAudio: form.nationalAudio }) }); if (r.ok) flash("Saved!"); else flash("Save failed.", false); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>Anthems</h2><p>School anthem and national anthem — titles, lyrics, and audio files.</p></div>
      <Flash msg={msg} />
      <form onSubmit={save}>
        <div className="adm2-card">
          <div className="adm2-card-title">School Anthem</div>
          <Field label="Title"><input className="adm2-input" value={form.schoolTitle} onChange={sf("schoolTitle")} /></Field>
          <Field label="Lyrics"><textarea className="adm2-textarea" rows={10} value={form.schoolLyrics} onChange={sf("schoolLyrics")} placeholder="Enter lyrics…" /></Field>
          <Field label="Audio File (MP3)">
            <div className="adm2-audio-upload">
              {form.schoolAudio ? (
                <div className="adm2-audio-preview">
                  <audio controls src={form.schoolAudio} style={{ width: "100%", height: 36 }} />
                  <button type="button" className="adm2-btn-ghost" style={{ marginTop: 6, fontSize: 12 }} onClick={() => setForm(f => ({ ...f, schoolAudio: "" }))}>× Remove</button>
                </div>
              ) : (
                <label className="adm2-drop-zone" style={{ cursor: "pointer" }}>
                  <div className="adm2-drop-empty">
                    <div className="adm2-drop-icon">🎵</div>
                    <p>Drag MP3 here or click to browse</p>
                  </div>
                  <input type="file" accept="audio/*" style={{ display: "none" }} onChange={async e => {
                    const file = e.target.files?.[0]; if (!file) return;
                    flash("Uploading audio…");
                    const results = await uploadManyToCloudinary([file]);
                    if (results[0]?.url) { setForm(f => ({ ...f, schoolAudio: results[0].url })); flash("Audio uploaded!"); }
                    else flash("Upload failed.", false);
                    e.target.value = "";
                  }} />
                </label>
              )}
            </div>
          </Field>
        </div>
        <div className="adm2-card">
          <div className="adm2-card-title">National Anthem</div>
          <Field label="Title"><input className="adm2-input" value={form.nationalTitle} onChange={sf("nationalTitle")} /></Field>
          <Field label="Lyrics"><textarea className="adm2-textarea" rows={10} value={form.nationalLyrics} onChange={sf("nationalLyrics")} /></Field>
          <Field label="Audio File (MP3)">
            <div className="adm2-audio-upload">
              {form.nationalAudio ? (
                <div className="adm2-audio-preview">
                  <audio controls src={form.nationalAudio} style={{ width: "100%", height: 36 }} />
                  <button type="button" className="adm2-btn-ghost" style={{ marginTop: 6, fontSize: 12 }} onClick={() => setForm(f => ({ ...f, nationalAudio: "" }))}>× Remove</button>
                </div>
              ) : (
                <label className="adm2-drop-zone" style={{ cursor: "pointer" }}>
                  <div className="adm2-drop-empty">
                    <div className="adm2-drop-icon">🎵</div>
                    <p>Drag MP3 here or click to browse</p>
                  </div>
                  <input type="file" accept="audio/*" style={{ display: "none" }} onChange={async e => {
                    const file = e.target.files?.[0]; if (!file) return;
                    flash("Uploading audio…");
                    const results = await uploadManyToCloudinary([file]);
                    if (results[0]?.url) { setForm(f => ({ ...f, nationalAudio: results[0].url })); flash("Audio uploaded!"); }
                    else flash("Upload failed.", false);
                    e.target.value = "";
                  }} />
                </label>
              )}
            </div>
          </Field>
        </div>
        <button type="submit" className="adm2-btn-primary">Save Anthems</button>
      </form>
    </div>
  );
}

// Staff
function StaffTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]); const [editing, setEditing] = useState<number | null>(null); const [form, setForm] = useState({ name: "", title: "", department: "", imageUrl: "" }); const [preview, setPreview] = useState("");
  const { msg, flash } = useFlash();
  const load = useCallback(async () => { const r = await fetch(`${API}/staff`, { headers: authH(token) }); if (r.ok) setItems(await r.json()); }, [token]);
  useEffect(() => { load(); }, [load]);
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); const max = items.reduce((m: number, i: any) => Math.max(m, i.display_order), 0);
    const url = editing !== null ? `${API}/staff/${editing}` : `${API}/staff`;
    const r = await fetch(url, { method: editing !== null ? "PUT" : "POST", headers: authH(token), body: JSON.stringify({ ...form, displayOrder: editing !== null ? undefined : max + 1 }) });
    if (r.ok) { setForm({ name: "", title: "", department: "", imageUrl: "" }); setPreview(""); setEditing(null); flash(editing !== null ? "Updated!" : "Added!"); load(); } else flash("Save failed.", false);
  };
  const del = async (id: number) => { if (!confirm("Remove?")) return; await fetch(`${API}/staff/${id}`, { method: "DELETE", headers: authH(token) }); flash("Removed."); load(); };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>Meet the Team</h2><p>Staff profiles shown on the Team page. Square photos work best.</p></div>
      <Flash msg={msg} />
      <div className="adm2-card">
        <form onSubmit={save}>
          <div className="adm2-card-title">{editing !== null ? "Edit Team Member" : "Add Team Member"}</div>
          <div style={{ display: "flex", gap: 12 }}>
            <Field label="Full Name"><input className="adm2-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Dr. Essien N. Patrick" required /></Field>
            <Field label="Job Title"><input className="adm2-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Principal" required /></Field>
          </div>
          <Field label="Department (optional)"><input className="adm2-input" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} /></Field>
          <Field label="Photo">
            <div className="adm2-upload-zone" onDragOver={e => e.preventDefault()} onDrop={async e => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (!file) return;
              flash("Uploading…");
              const results = await uploadManyToCloudinary([file]);
              if (results[0]?.url) { setForm(f => ({ ...f, imageUrl: results[0].url })); setPreview(results[0].url); flash("Photo uploaded!"); }
              else flash("Upload failed.", false);
            }}>
              {preview
                ? <img src={preview} alt="preview" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: "50%", display: "block", margin: "0 auto 8px" }} />
                : <span>Drag photo here or</span>
              }
              <label className="adm2-upload-browse">
                {preview ? "Change photo" : "browse to upload"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  flash("Uploading…");
                  const results = await uploadManyToCloudinary([file]);
                  if (results[0]?.url) { setForm(f => ({ ...f, imageUrl: results[0].url })); setPreview(results[0].url); flash("Photo uploaded!"); }
                  else flash("Upload failed.", false);
                }} />
              </label>
            </div>
          </Field>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="adm2-btn-primary">{editing !== null ? "Update" : "+ Add Member"}</button>
            {editing !== null && <button type="button" className="adm2-btn-ghost" onClick={() => { setEditing(null); setForm({ name: "", title: "", department: "", imageUrl: "" }); setPreview(""); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="adm2-staff-grid">
        {items.length === 0 && <div className="adm2-empty">No team members yet.</div>}
        {items.map(item => (
          <div key={item.id} className="adm2-staff-card">
            <div className="adm2-staff-avatar">
              {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => (e.currentTarget.style.opacity="0.2")} /> : <span>{item.name.split(" ").map((n: string) => n[0]).slice(0,2).join("")}</span>}
            </div>
            <div className="adm2-staff-info">
              <strong>{item.name}</strong>
              <span>{item.title}</span>
              {item.department && <span style={{ color: "#94a3b8", fontSize: 12 }}>{item.department}</span>}
            </div>
            <div className="adm2-staff-actions">
              <button className="adm2-btn-sm" onClick={() => { setEditing(item.id); setForm({ name: item.name, title: item.title, department: item.department||"", imageUrl: item.image_url||"" }); setPreview(item.image_url||""); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
              <button className="adm2-btn-danger-sm" onClick={() => del(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Rules
function RulesTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [form, setForm] = useState({ content: "" });
  const [editing, setEditing] = useState<number | null>(null);
  const { msg, flash } = useFlash();

  const load = useCallback(async () => {
    const r = await fetch(`${API}/rules`, { headers: authH(token) });
    if (r.ok) setItems(await r.json());
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const parseContent = (c: string): string[] => { try { const p = JSON.parse(c); if (Array.isArray(p)) return p; } catch {} return [c]; };
  const grouped = items.reduce((acc, r) => { if (!acc[r.category]) acc[r.category] = []; acc[r.category].push(r); return acc; }, {} as Record<string, any[]>);
  const categories = Object.keys(grouped);

  const createCat = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;
    // Category exists implicitly once a rule is saved under it
    // Just switch to it
    setSelectedCat(name);
    setNewCatName("");
    setAddingCat(false);
    flash(`Category "${name}" ready — add rules below.`);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat) return;
    const maxOrder = items.reduce((m: number, i: any) => Math.max(m, i.display_order), -1);
    const contentArray = form.content.split("\n").map((s: string) => s.trim()).filter(Boolean);
    const body = { category: selectedCat, content: JSON.stringify(contentArray), displayOrder: editing !== null ? undefined : maxOrder + 1 };
    const url = editing !== null ? `${API}/rules/${editing}` : `${API}/rules`;
    const r = await fetch(url, { method: editing !== null ? "PUT" : "POST", headers: authH(token), body: JSON.stringify(body) });
    if (r.ok) { setForm({ content: "" }); setEditing(null); flash(editing !== null ? "Updated!" : "Rules saved!"); load(); }
    else flash("Save failed.", false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this rule block?")) return;
    await fetch(`${API}/rules/${id}`, { method: "DELETE", headers: authH(token) });
    flash("Deleted.");
    load();
  };

  return (
    <div className="adm2-content">
      <div className="adm2-page-header">
        <h2>Rules & Regulations</h2>
        <p>Create a category first, then add rule blocks under it.</p>
      </div>
      <Flash msg={msg} />

      {/* Category selector */}
      <div className="adm2-cat-selector">
        <div className="adm2-cat-selector-label">Select a category to edit</div>
        <div className="adm2-cat-chips">
          {categories.map(cat => (
            <button key={cat} className={`adm2-cat-chip${selectedCat === cat ? " active" : ""}`} onClick={() => { setSelectedCat(cat); setEditing(null); setForm({ content: "" }); }}>
              {cat}
            </button>
          ))}
          {addingCat ? (
            <form onSubmit={createCat} style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input className="adm2-input" style={{ width: 200 }} placeholder="Category name…" value={newCatName} onChange={e => setNewCatName(e.target.value)} autoFocus required />
              <button type="submit" className="adm2-btn-primary" style={{ padding: "6px 14px" }}>Create</button>
              <button type="button" className="adm2-btn-ghost" style={{ padding: "6px 10px" }} onClick={() => setAddingCat(false)}>✕</button>
            </form>
          ) : (
            <button className="adm2-cat-chip-add" onClick={() => setAddingCat(true)}>+ New Category</button>
          )}
        </div>
      </div>

      {/* Rules editor for selected category */}
      {selectedCat && (
        <div className="adm2-card" style={{ marginTop: 20 }}>
          <form onSubmit={save}>
            <div className="adm2-card-title">{editing !== null ? `Editing block in "${selectedCat}"` : `Add rules to "${selectedCat}"`}</div>
            <Field label="Rules" hint="One rule per line — each line becomes a numbered item on the site">
              <textarea className="adm2-textarea" rows={7}
                placeholder={"Students must wear full uniform at all times.\nAll shirts must be properly tucked in.\nSchool shoes only — no trainers."}
                value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
            </Field>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="adm2-btn-primary">{editing !== null ? "Update" : "Save Rules"}</button>
              {editing !== null && <button type="button" className="adm2-btn-ghost" onClick={() => { setEditing(null); setForm({ content: "" }); }}>Cancel</button>}
            </div>
          </form>
        </div>
      )}

      {/* Display all categories */}
      {Object.entries(grouped).map(([cat, rules]: [string, any[]]) => (
        <div key={cat} className="adm2-rules-group">
          <div className="adm2-rules-group-title">{cat}</div>
          {rules.map((rule: any) => (
            <div key={rule.id} className="adm2-list-item">
              <div className="adm2-list-body">
                {parseContent(rule.content).map((r: string, i: number) => (
                  <div key={i} style={{ fontSize: 13, color: "#475569" }}>{i + 1}. {r}</div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="adm2-btn-sm" onClick={() => {
                  setSelectedCat(rule.category);
                  setEditing(rule.id);
                  setForm({ content: parseContent(rule.content).join("\n") });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}>Edit</button>
                <button className="adm2-btn-danger-sm" onClick={() => del(rule.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Admissions
function AdmissionsTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const { msg, flash } = useFlash();

  const load = useCallback(async () => {
    const r = await fetch(`${API}/admissions`, { headers: authH(token) });
    if (r.ok) setItems(await r.json());
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const del = async (id: number) => {
    if (!confirm("Delete this admission submission permanently?")) return;
    await fetch(`${API}/admissions/${id}`, { method: "DELETE", headers: authH(token) });
    flash("Deleted."); load();
  };

  const unread = items.filter(i => !i.read).length;

  return (
    <div className="adm2-content">
      <div className="adm2-page-header">
        <h2>Admissions {unread > 0 && <span className="adm2-badge-alert">{unread} new</span>}</h2>
        <p>All admission enquiries submitted through the Apply page. Each entry has a downloadable PDF.</p>
      </div>
      <Flash msg={msg} />
      {items.length === 0 && <div className="adm2-empty">No admission submissions yet.</div>}
      <div className="adm2-list">
        {items.map(sub => (
          <div key={sub.id} className={`adm2-submission${!sub.read ? " adm2-submission-unread" : ""}`}>
            <div className="adm2-submission-head" onClick={async () => {
                setExpanded(expanded === sub.id ? null : sub.id);
                if (!sub.read) {
                  await fetch(`${API}/admissions/${sub.id}/read`, { method: "PUT", headers: authH(token) });
                  load();
                }
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {!sub.read && <span className="adm2-unread-dot" />}
                <div>
                  <strong style={{ display: "block", fontSize: 14 }}>{sub.student_name || `${sub.student_first_name || ""} ${sub.student_last_name || ""}`.trim() || "Unnamed"}</strong>
                  <span style={{ fontSize: 12.5, color: "#64748b" }}>
                    {sub.class_applying || sub.classApplying || "—"} · Parent: {sub.parent_name || sub.parentName || "—"} · {sub.phone || "—"}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  {new Date(sub.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{expanded === sub.id ? "▲" : "▼"}</span>
              </div>
            </div>
            {expanded === sub.id && (
              <div className="adm2-submission-body" style={{ paddingTop: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", fontSize: 13, marginBottom: 16 }}>
                  {[
                    ["Student", `${sub.student_first_name || ""} ${sub.student_last_name || ""}`.trim()],
                    ["Class", sub.class_applying || sub.classApplying],
                    ["Date of Birth", sub.date_of_birth || sub.dateOfBirth],
                    ["Gender", sub.gender],
                    ["Parent / Guardian", sub.parent_name || sub.parentName],
                    ["Relationship", sub.relationship],
                    ["Phone", sub.phone],
                    ["Email", sub.email],
                    ["Previous School", sub.prev_school || sub.prevSchool],
                    ["Ref", sub.ref],
                  ].map(([label, value]) => value ? (
                    <div key={label}>
                      <span style={{ color: "#94a3b8", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px" }}>{label}</span>
                      <div style={{ color: "#1e293b", marginTop: 2 }}>{value}</div>
                    </div>
                  ) : null)}
                </div>
                {sub.message && (
                  <div style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#334155", marginBottom: 14 }}>
                    <strong style={{ display: "block", marginBottom: 4, color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px" }}>Message</strong>
                    {sub.message}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {sub.filename && (
                    <a href={`/api/admissions/download/${sub.filename}`} target="_blank" rel="noreferrer" className="adm2-btn-primary" style={{ fontSize: 12.5, padding: "6px 14px", textDecoration: "none" }}>
                      Download PDF
                    </a>
                  )}
                  {sub.email && (
                    <a href={`mailto:${sub.email}?subject=Re: Admission Enquiry [${sub.ref}]`} className="adm2-btn-ghost" style={{ fontSize: 12.5, padding: "6px 14px" }}>
                      Reply via Email
                    </a>
                  )}
                  {sub.phone && (
                    <a href={`https://wa.me/${sub.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="adm2-btn-ghost" style={{ fontSize: 12.5, padding: "6px 14px" }}>
                      WhatsApp
                    </a>
                  )}
                  <button className="adm2-btn-danger-sm" onClick={() => del(sub.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Submissions
function SubmissionsTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]); const [expanded, setExpanded] = useState<number | null>(null); const [notes, setNotes] = useState<Record<number, string>>({});
  const { msg, flash } = useFlash();
  const load = useCallback(async () => { const r = await fetch(`${API}/submissions`, { headers: authH(token) }); if (r.ok) { const data = await r.json(); setItems(data); const nm: Record<number, string> = {}; data.forEach((s: any) => { nm[s.id] = s.notes||""; }); setNotes(nm); } }, [token]);
  useEffect(() => { load(); }, [load]);
  const markRead = async (id: number) => { await fetch(`${API}/submissions/${id}/read`, { method: "PUT", headers: authH(token) }); load(); };
  const del = async (id: number) => { if (!confirm("Delete?")) return; await fetch(`${API}/submissions/${id}`, { method: "DELETE", headers: authH(token) }); flash("Deleted."); load(); };
  const saveNote = async (id: number) => { await fetch(`${API}/submissions/${id}/notes`, { method: "PUT", headers: authH(token), body: JSON.stringify({ notes: notes[id]??"" }) }); flash("Note saved."); };
  const unread = items.filter(i => !i.read).length;
  return (
    <div className="adm2-content">
      <div className="adm2-page-header">
        <h2>Contact Enquiries {unread > 0 && <span className="adm2-badge-alert">{unread} new</span>}</h2>
        <p>Messages sent from the Contact page. Click any message to expand it.</p>
      </div>
      <Flash msg={msg} />
      {items.length === 0 && <div className="adm2-empty">No enquiries yet.</div>}
      <div className="adm2-list">
        {items.map(sub => (
          <div key={sub.id} className={`adm2-submission${!sub.read ? " adm2-submission-unread" : ""}`}>
            <div className="adm2-submission-head" onClick={() => { setExpanded(expanded === sub.id ? null : sub.id); if (!sub.read) markRead(sub.id); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {!sub.read && <span className="adm2-unread-dot" />}
                <div>
                  <strong style={{ display: "block" }}>{sub.name}</strong>
                  <span style={{ fontSize: 13, color: "#64748b" }}>{sub.email} {sub.phone && `· ${sub.phone}`} {sub.subject && <span className="adm2-badge-sm">{sub.subject}</span>}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94a3b8" }}>
                {new Date(sub.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                <span>{expanded === sub.id ? "▲" : "▼"}</span>
              </div>
            </div>
            {expanded === sub.id && (
              <div className="adm2-submission-body">
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#334155", marginBottom: 16, background: "#f8fafc", borderRadius: 8, padding: 14 }}>{sub.message}</p>
                <Field label="Internal Notes" hint="private — not visible to the sender">
                  <textarea className="adm2-textarea" rows={2} value={notes[sub.id]??""} onChange={e => setNotes(n => ({ ...n, [sub.id]: e.target.value }))} placeholder="Add a private note…" />
                </Field>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className="adm2-btn-sm" onClick={() => saveNote(sub.id)}>Save Note</button>
                  <a href={`mailto:${sub.email}?subject=Re: ${sub.subject||"Your Enquiry"}`} className="adm2-btn-primary" style={{ textDecoration: "none", fontSize: 13, padding: "6px 14px" }}>Reply via Email</a>
                  <button className="adm2-btn-danger-sm" onClick={() => del(sub.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Settings
function SettingsTab({ token, onPasswordChanged }: { token: string; onPasswordChanged: () => void }) {
  const [newPw, setNewPw] = useState(""); const [confirmPw, setConfirmPw] = useState("");
  const { msg, flash } = useFlash();
  const changePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { flash("Passwords don't match.", false); return; }
    if (newPw.length < 6) { flash("Password must be at least 6 characters.", false); return; }
    const r = await fetch(`${API}/change-password`, { method: "POST", headers: authH(token), body: JSON.stringify({ newPassword: newPw }) });
    if (r.ok) { flash("Password changed! Logging you out…"); setNewPw(""); setConfirmPw(""); setTimeout(onPasswordChanged, 2000); } else flash("Failed to change password.", false);
  };
  return (
    <div className="adm2-content">
      <div className="adm2-page-header"><h2>Settings</h2><p>Admin account security settings.</p></div>
      <Flash msg={msg} />
      <div className="adm2-card" style={{ maxWidth: 480 }}>
        <div className="adm2-card-title">Change Admin Password</div>
        <form onSubmit={changePw}>
          <Field label="New Password" hint="minimum 6 characters"><input className="adm2-input" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required /></Field>
          <Field label="Confirm New Password"><input className="adm2-input" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required /></Field>
          <button type="submit" className="adm2-btn-primary" style={{ marginTop: 8 }}>Change Password</button>
        </form>
      </div>
    </div>
  );
}

// Main
export default function AdminPage() {
  const { token, save, clear } = useToken();
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/hero`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.ok) setAuthed(true); else clear(); }).catch(() => {});
  }, []);

  const handleLogin = (t: string) => { save(t); setAuthed(true); };
  const handleLogout = () => { clear(); setAuthed(false); };

  if (!authed) return <LoginForm onLogin={handleLogin} />;

  const NAV_GROUPS = [
    { label: "Dashboard", tabs: [{ id: "overview" as Tab, label: "Overview" }] },
    {
      label: "Pages",
      tabs: [
        { id: "hero" as Tab, label: "Homepage Hero" },
        { id: "features" as Tab, label: "Why We're Different" },
        { id: "campus" as Tab, label: "Campus Section" },
        { id: "about" as Tab, label: "About Page" },
        { id: "divisions" as Tab, label: "Academic Divisions" },
        { id: "academics-content" as Tab, label: "Academics Content" },
        { id: "values" as Tab, label: "Core Values" },
        { id: "student-life" as Tab, label: "Student Life" },
        { id: "portals" as Tab, label: "Portal Links" },
      ],
    },
    {
      label: "Media",
      tabs: [
        { id: "gallery-images" as Tab, label: "Gallery Photos" },
        { id: "gallery-videos" as Tab, label: "Gallery Videos" },
        { id: "anthem" as Tab, label: "Anthems" },
      ],
    },
    {
      label: "School",
      tabs: [
        { id: "staff" as Tab, label: "Meet the Team" },
        { id: "rules" as Tab, label: "Rules & Regs" },
        { id: "announcements" as Tab, label: "Announcements" },
        { id: "events" as Tab, label: "Events" },
        { id: "testimonials" as Tab, label: "Testimonials" },
      ],
    },
    {
      label: "Admin",
      tabs: [
        { id: "contact" as Tab, label: "Contact Info" },
        { id: "admissions" as Tab, label: "Admissions" },
        { id: "submissions" as Tab, label: "Enquiries" },
        { id: "settings" as Tab, label: "Settings" },
      ],
    },
  ];

  const navigateTo = (t: Tab) => { setTab(t); setSidebarOpen(false); };

  return (
    <div className="adm2-wrap">
      {/* TOP BAR */}
      <header className="adm2-topbar">
        <div className="adm2-topbar-left">
          <button className="adm2-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span /><span /><span />
          </button>
          <img src="https://res.cloudinary.com/dagt2a1w0/image/upload/v1773768204/ChatGPT_Image_Jan_31__2026__04_03_54_AM_1769828712771_d65sw2.png" alt="PIS" className="adm2-topbar-logo" />
          <div className="adm2-topbar-title">
            <span>Prudential International School</span>
            <span>Admin Dashboard</span>
          </div>
        </div>
        <div className="adm2-topbar-right">
          <a href="/" target="_blank" rel="noreferrer" className="adm2-topbar-btn">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
            View Site
          </a>
          <button className="adm2-topbar-btn adm2-topbar-logout" onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      <div className="adm2-body">
        {/* SIDEBAR OVERLAY (mobile) */}
        {sidebarOpen && <div className="adm2-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* SIDEBAR */}
        <aside className={`adm2-sidebar${sidebarOpen ? " adm2-sidebar-open" : ""}`}>
          <nav className="adm2-nav">
            {NAV_GROUPS.map(group => (
              <div key={group.label} className="adm2-nav-group">
                <div className="adm2-nav-group-label">{group.label}</div>
                {group.tabs.map(t => (
                  <button
                    key={t.id}
                    className={`adm2-nav-item${tab === t.id ? " adm2-nav-active" : ""}`}
                    onClick={() => navigateTo(t.id)}
                  >
                    <span className="adm2-nav-icon">{Ic[t.id] ?? Ic.about}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="adm2-main">
          {tab === "overview"          && <OverviewTab          token={token} setTab={setTab} />}
          {tab === "gallery-images"     && <GalleryImagesTab      token={token} />}
          {tab === "gallery-videos"     && <GalleryVideosTab      token={token} />}
          {tab === "announcements"     && <AnnouncementsTab     token={token} />}
          {tab === "events"            && <EventsTab            token={token} />}
          {tab === "testimonials"      && <TestimonialsTab      token={token} />}
          {tab === "hero"              && <HeroTab              token={token} />}
          {tab === "about"             && <AboutTab             token={token} />}
          {tab === "contact"           && <ContactTab           token={token} />}
          {tab === "values"            && <ValuesTab            token={token} />}
          {tab === "divisions"         && <DivisionsTab         token={token} />}
          {tab === "academics-content" && <AcademicsContentTab  token={token} />}
          {tab === "features"          && <FeaturesTab          token={token} />}
          {tab === "campus"            && <CampusTab            token={token} />}
          {tab === "student-life"      && <StudentLifeTab       token={token} />}
          {tab === "portals"           && <PortalsTab           token={token} />}
          {tab === "anthem"            && <AnthemTab            token={token} />}
          {tab === "staff"             && <StaffTab             token={token} />}
          {tab === "rules"             && <RulesTab             token={token} />}
          {tab === "admissions"        && <AdmissionsTab        token={token} />}
          {tab === "submissions"       && <SubmissionsTab       token={token} />}
          {tab === "settings"          && <SettingsTab          token={token} onPasswordChanged={handleLogout} />}
        </main>
      </div>
    </div>
  );
}
