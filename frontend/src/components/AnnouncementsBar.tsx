import { useEffect, useState } from "react";

interface Announcement { id: number; title: string; body: string; image_url?: string; created_at: string; }
interface EventItem { id: number; title: string; description?: string; event_date: string; location?: string; }

type Notice =
  | { kind: "announcement"; id: number; title: string; body: string; image_url?: string; sortDate: string }
  | { kind: "event"; id: number; title: string; body?: string; location?: string; sortDate: string };

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function isUpcoming(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

export default function AnnouncementsBar() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [active, setActive] = useState<Notice | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/cms/announcements").then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch("/api/cms/events").then(r => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([anns, evts]: [Announcement[], EventItem[]]) => {
      const annNotices: Notice[] = (anns || []).map(a => ({
        kind: "announcement", id: a.id, title: a.title, body: a.body, image_url: a.image_url, sortDate: a.created_at,
      }));
      const evtNotices: Notice[] = (evts || [])
        .filter(e => isUpcoming(e.event_date))
        .map(e => ({
          kind: "event", id: e.id, title: e.title, body: e.description, location: e.location, sortDate: e.event_date,
        }));
      // Newest announcements first, then soonest events, announcements take priority at the front.
      const merged = [...annNotices.sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1)), ...evtNotices.sort((a, b) => (a.sortDate < b.sortDate ? -1 : 1))];
      setNotices(merged.slice(0, 8));
    });
  }, []);

  if (notices.length === 0 || dismissed) return null;

  return (
    <>
      <div className="ann-bar">
        <div className="pis-container">
          <div className="ann-bar-inner">
            <div className="ann-bar-label">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395" /></svg>
              <span>Notices</span>
            </div>
            <div className="ann-bar-scroll">
              {notices.map(n => (
                <button key={`${n.kind}-${n.id}`} className={`ann-pill ann-pill-${n.kind}`} onClick={() => setActive(n)}>
                  <span className="ann-pill-tag">{n.kind === "event" ? "Event" : "Announcement"}</span>
                  <span className="ann-pill-title">{n.title}</span>
                </button>
              ))}
            </div>
            <button className="ann-bar-close" onClick={() => setDismissed(true)} aria-label="Dismiss notices">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>

      {active && (
        <div className="ann-modal-overlay" onClick={() => setActive(null)}>
          <div className="ann-modal" onClick={e => e.stopPropagation()}>
            <button className="ann-modal-close" onClick={() => setActive(null)} aria-label="Close">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <span className={`ann-modal-tag ann-modal-tag-${active.kind}`}>{active.kind === "event" ? "Event" : "Announcement"}</span>
            <h3>{active.title}</h3>
            {active.kind === "event" && (
              <div className="ann-modal-meta">
                <span>📅 {formatDate(active.sortDate)}</span>
                {active.location && <span>📍 {active.location}</span>}
              </div>
            )}
            {active.kind === "announcement" && (
              <div className="ann-modal-meta"><span>{formatDate(active.sortDate)}</span></div>
            )}
            {active.body && <p className="ann-modal-body">{active.body}</p>}
            {active.kind === "announcement" && active.image_url && (
              <img src={active.image_url} alt={active.title} className="ann-modal-img" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
