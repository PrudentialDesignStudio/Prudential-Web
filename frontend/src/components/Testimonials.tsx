import { useEffect, useState } from "react";
import AnimateIn from "@/components/AnimateIn";

interface Testimonial { id: number; image_url: string; caption?: string; display_order: number; }

const INITIAL_COUNT = 3;
const LOAD_MORE_STEP = 3;

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [visible, setVisible] = useState(INITIAL_COUNT);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/cms/testimonials")
      .then(r => (r.ok ? r.json() : []))
      .then(d => setItems(d || []))
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  const shown = items.slice(0, visible);
  const hasMore = visible < items.length;

  return (
    <section className="testimonials-section">
      <div className="pis-container">
        <AnimateIn className="section-header center">
          <h2>What Parents Are Saying</h2>
          <p>Real words from real families at Prudential International School.</p>
          <div className="section-bar" />
        </AnimateIn>

        <div className="testimonials-grid">
          {shown.map((t, i) => (
            <AnimateIn key={t.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <button className="testimonial-card" onClick={() => setLightboxIdx(i)} aria-label={t.caption || "Read testimonial"}>
                <img src={t.image_url} alt={t.caption || "Parent testimonial"} loading="lazy"
                  onError={e => { (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="100%" height="100%" fill="#f1f4fa"/><text x="50%" y="50%" font-family="sans-serif" font-size="16" fill="#5a6a8a" text-anchor="middle" dy=".3em">Testimonial coming soon</text></svg>'); }} />
              </button>
            </AnimateIn>
          ))}
        </div>

        {hasMore && (
          <div className="testimonials-load-more">
            <button className="btn-white" onClick={() => setVisible(v => Math.min(v + LOAD_MORE_STEP, items.length))}>
              Load More Testimonials
            </button>
          </div>
        )}
      </div>

      {lightboxIdx !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIdx(null)}>
          <button className="lightbox-close" onClick={() => setLightboxIdx(null)} aria-label="Close">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {lightboxIdx > 0 && (
            <button className="lightbox-arrow lightbox-prev" onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i !== null ? i - 1 : i)); }} aria-label="Previous">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
          )}
          {lightboxIdx < shown.length - 1 && (
            <button className="lightbox-arrow lightbox-next" onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i !== null ? i + 1 : i)); }} aria-label="Next">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          )}
          <div className="lightbox-img-wrap" onClick={e => e.stopPropagation()}>
            <img src={shown[lightboxIdx].image_url} alt={shown[lightboxIdx].caption || ""} className="lightbox-img" />
            <p className="lightbox-counter">{lightboxIdx + 1} / {shown.length}</p>
          </div>
        </div>
      )}
    </section>
  );
}
