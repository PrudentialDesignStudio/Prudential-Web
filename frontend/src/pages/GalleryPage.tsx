import { useState, useCallback } from "react";
import AnimateIn from "@/components/AnimateIn";
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/galleryData";

function VideoCard({ item }: { item: GalleryItem }) {
  const isYt = item.url.includes("youtube.com") || item.url.includes("youtu.be");
  const ytId = isYt ? (item.url.split("v=")[1]?.split("&")[0] || item.url.split("/").pop()) : null;
  return (
    <div className="gallery-video-card">
      {isYt && ytId ? (
        <iframe src={`https://www.youtube.com/embed/${ytId}`} title={item.caption || "Video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", aspectRatio: "16/9", border: "none", borderRadius: 10 }} />
      ) : (
        <video src={item.url} controls style={{ width: "100%", aspectRatio: "16/9", borderRadius: 10, background: "#000" }}>Your browser does not support video.</video>
      )}
      {item.caption && <p style={{ fontSize: 13, color: "var(--pis-muted-fg)", marginTop: 8 }}>{item.caption}</p>}
    </div>
  );
}

function Lightbox({ items, index, onClose, onPrev, onNext }: { items: GalleryItem[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  const item = items[index];
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      {index > 0 && (
        <button className="lightbox-arrow lightbox-prev" onClick={e => { e.stopPropagation(); onPrev(); }} aria-label="Previous">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
      )}
      {index < items.length - 1 && (
        <button className="lightbox-arrow lightbox-next" onClick={e => { e.stopPropagation(); onNext(); }} aria-label="Next">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
      )}
      <div className="lightbox-img-wrap" onClick={e => e.stopPropagation()}>
        <img src={item.url} alt={item.caption || ""} className="lightbox-img" />
        {item.caption && <p className="lightbox-caption">{item.caption}</p>}
        <p className="lightbox-counter">{index + 1} / {items.length}</p>
      </div>
    </div>
  );
}

// Build category lists from static data
function getCategoryInfo(type: "image" | "video") {
  const counts: Record<string, number> = {};
  for (const item of GALLERY_ITEMS) {
    if (item.type === type) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

function getItemsForCategory(category: string, type: "image" | "video") {
  return GALLERY_ITEMS
    .filter(item => item.category === category && item.type === type)
    .sort((a, b) => a.display_order - b.display_order);
}

function CategoryCard({ name, count, onClick }: { name: string; count: number; onClick: () => void }) {
  return (
    <button className="gallery-cat-card" onClick={onClick}>
      <div className="gallery-cat-name">{name}</div>
      <div className="gallery-cat-count">{count} {count === 1 ? "item" : "items"}</div>
      <div className="gallery-cat-arrow">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
      </div>
    </button>
  );
}

export default function GalleryPage() {
  const [selected, setSelected] = useState<{ name: string; type: "image" | "video" } | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const imageCategories = getCategoryInfo("image");
  const videoCategories = getCategoryInfo("video");

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  if (selected) {
    const items = getItemsForCategory(selected.name, selected.type);
    const prevImage = () => setLightboxIdx(i => (i !== null && i > 0 ? i - 1 : i));
    const nextImage = () => setLightboxIdx(i => (i !== null && i < items.length - 1 ? i + 1 : i));

    return (
      <>
        <div className="page-hero">
          <div className="page-hero-grid-lines" />
          <div className="pis-container">
            <div className="page-hero-content">
              <div className="page-hero-badge">Gallery</div>
              <h1>{selected.name}</h1>
              <p>{selected.type === "image" ? "Photos" : "Videos"}</p>
            </div>
          </div>
        </div>

        <section className="gallery-section">
          <div className="pis-container">
            <button className="gallery-back-btn" onClick={() => { setSelected(null); setLightboxIdx(null); }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              Back to Gallery
            </button>

            {selected.type === "image" && items.length > 0 && (
              <div className="gallery-img-grid">
                {items.map((item, i) => (
                  <div key={item.url} className="gallery-img-item" onClick={() => setLightboxIdx(i)}>
                    <img src={item.url} alt={item.caption || ""} loading="lazy"
                      onError={e => { (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#e5e9f0"/><text x="50%" y="50%" font-family="sans-serif" font-size="16" fill="#5a6a8a" text-anchor="middle" dy=".3em">Photo coming soon</text></svg>'); }} />
                    {item.caption && <div className="gallery-img-caption">{item.caption}</div>}
                  </div>
                ))}
              </div>
            )}

            {selected.type === "video" && items.length > 0 && (
              <div className="gallery-video-grid">
                {items.map(item => <VideoCard key={item.url} item={item} />)}
              </div>
            )}
          </div>
        </section>

        {lightboxIdx !== null && selected.type === "image" && (
          <Lightbox items={items} index={lightboxIdx} onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />
        )}
      </>
    );
  }

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-grid-lines" />
        <div className="pis-container">
          <div className="page-hero-content">
            <div className="page-hero-badge">Gallery</div>
            <h1>Our Gallery</h1>
            <p>Moments from campus life at Prudential International School.</p>
          </div>
        </div>
      </div>

      <section className="gallery-section">
        <div className="pis-container">
          <AnimateIn>
            <h2 className="gallery-section-title">Photos</h2>
          </AnimateIn>
          {imageCategories.length === 0
            ? <p className="gallery-empty">No photos have been added yet.</p>
            : (
              <div className="gallery-cat-grid">
                {imageCategories.map((cat, i) => (
                  <AnimateIn key={cat.category} delay={((i % 3) + 1) as 1 | 2 | 3}>
                    <CategoryCard name={cat.category} count={cat.count} onClick={() => setSelected({ name: cat.category, type: "image" })} />
                  </AnimateIn>
                ))}
              </div>
            )
          }

          <AnimateIn>
            <h2 className="gallery-section-title" style={{ marginTop: 60 }}>Videos</h2>
          </AnimateIn>
          {videoCategories.length === 0
            ? <p className="gallery-empty">No videos have been added yet.</p>
            : (
              <div className="gallery-cat-grid">
                {videoCategories.map((cat, i) => (
                  <AnimateIn key={cat.category} delay={((i % 3) + 1) as 1 | 2 | 3}>
                    <CategoryCard name={cat.category} count={cat.count} onClick={() => setSelected({ name: cat.category, type: "video" })} />
                  </AnimateIn>
                ))}
              </div>
            )
          }
        </div>
      </section>
    </>
  );
}
