import { useState, useRef, useEffect } from "react";
import AnimateIn from "@/components/AnimateIn";

const SCHOOL_LOGO = "https://res.cloudinary.com/dagt2a1w0/image/upload/v1773768204/ChatGPT_Image_Jan_31__2026__04_03_54_AM_1769828712771_d65sw2.png";
const NATIONAL_FLAG = "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781558768/ChatGPT_Image_Jun_15_2026_10_25_10_PM_eyyiyr.png";

const NATIONAL_LYRICS_DEFAULT = `Stanza 1
Nigeria we hail thee,
Our own dear native land,
Though tribe and tongue may differ,
In brotherhood, we stand,
Nigerians all, and proud to serve
Our sovereign Motherland.

Stanza 2
Our flag shall be a symbol
That truth and justice reign,
In peace or battle honour'd,
And this we count as gain,
To hand on to our children
A banner without stain.

Stanza 3
O God of all creation,
Grant this our one request,
Help us to build a nation
Where no man is oppressed,
And so with peace and plenty
Nigeria may be blessed.`;

const NATIONAL_AUDIO_DEFAULT = "https://res.cloudinary.com/dagt2a1w0/video/upload/v1781555362/The_City_Choir_-_The_National_Anthem_CeeNaija.com__1_rbbzfs.mp3";

interface AnthemData {
  school_title: string;
  school_lyrics: string;
  school_audio: string;
  national_title: string;
  national_lyrics: string;
  national_audio: string;
}

function NigerianFlag() {
  return (
    <div className="flag-scene" aria-hidden="true">
      <div className="flag-pole" />
      <div className="flag-wrap">
        <div className="flag-body">
          <div className="flag-green flag-left" />
          <div className="flag-white" />
          <div className="flag-green flag-right" />
        </div>
        <div className="flag-shadow" />
      </div>
    </div>
  );
}

function AudioPlayer({ src, downloadName }: { src: string; downloadName: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPlaying(false); setProgress(0); setCurrent(0); setDuration(0); setLoaded(false);
    const el = audioRef.current;
    if (!el) return;
    el.load();
  }, [src]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onMeta = () => { setDuration(el.duration || 0); setLoaded(true); };
    const onTime = () => { setCurrent(el.currentTime); setProgress((el.currentTime / (el.duration || 1)) * 100); };
    const onEnded = () => setPlaying(false);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => { el.removeEventListener("loadedmetadata", onMeta); el.removeEventListener("timeupdate", onTime); el.removeEventListener("ended", onEnded); };
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); } else { el.play().catch(() => {}); setPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - rect.left) / rect.width) * el.duration;
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="anthem-player">
      <audio ref={audioRef} src={src || undefined} preload="metadata" />
      <div className="anthem-progress-bar" onClick={seek}>
        <div className="anthem-progress-fill" style={{ width: `${progress}%` }} />
        <div className="anthem-progress-thumb" style={{ left: `${progress}%` }} />
      </div>
      <div className="anthem-time-row">
        <span>{fmt(current)}</span>
        <span>{loaded ? fmt(duration) : "--:--"}</span>
      </div>
      <button className="anthem-play-btn" onClick={toggle} aria-label={playing ? "Pause" : "Play"} disabled={!src}>
        {playing ? (
          <svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>
        ) : (
          <svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
        )}
      </button>
      {src && (
        <a href={src} download={downloadName} className="anthem-download-btn">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          Download
        </a>
      )}
      {!src && <p className="anthem-audio-note">Audio will be added via the admin dashboard.</p>}
    </div>
  );
}

export default function AnthemPage() {
  const [tab, setTab] = useState<"school" | "national">("school");
  const [anthem, setAnthem] = useState<AnthemData>({
    school_title: "Prudential International School Anthem",
    school_lyrics: "",
    school_audio: "",
    national_title: "Nigerian National Anthem",
    national_lyrics: NATIONAL_LYRICS_DEFAULT,
    national_audio: NATIONAL_AUDIO_DEFAULT,
  });

  useEffect(() => {
    fetch("/api/cms/anthem")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setAnthem({
            school_title: data.school_title || "Prudential International School Anthem",
            school_lyrics: data.school_lyrics || "",
            school_audio: data.school_audio || "",
            national_title: data.national_title || "Nigerian National Anthem",
            national_lyrics: data.national_lyrics || NATIONAL_LYRICS_DEFAULT,
            national_audio: data.national_audio || NATIONAL_AUDIO_DEFAULT,
          });
        }
      })
      .catch(() => {});
  }, []);

  const isNational = tab === "national";
  const currentTitle = isNational ? anthem.national_title : anthem.school_title;
  const currentLyrics = isNational ? anthem.national_lyrics : anthem.school_lyrics;
  const currentAudio = isNational ? anthem.national_audio : anthem.school_audio;
  const coverSrc = isNational ? NATIONAL_FLAG : SCHOOL_LOGO;
  const downloadName = isNational ? "Nigeria-National-Anthem.mp3" : "PIS-School-Anthem.mp3";

  return (
    <>
      <section className="anthem-hero-section">
        <NigerianFlag />
        <div className="anthem-hero-overlay" />
        <div className="pis-container" style={{ position: "relative", zIndex: 2 }}>
          <AnimateIn className="anthem-hero-content">
            <div className="anthem-crest-icon">
              <svg width="38" height="38" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
              </svg>
            </div>
            <h1>School Anthems</h1>
            <p>The anthems that define our identity and our pride as a nation.</p>
            <div className="anthem-tabs">
              <button className={`anthem-tab-btn${tab === "school" ? " active" : ""}`} onClick={() => setTab("school")}>School Anthem</button>
              <button className={`anthem-tab-btn${tab === "national" ? " active" : ""}`} onClick={() => setTab("national")}>National Anthem</button>
            </div>
          </AnimateIn>
        </div>
      </section>

      <section className="anthem-body-section">
        <div className="pis-container">
          <div className="anthem-layout">
            <AnimateIn className="anthem-player-col" from="left">
              <div className="anthem-player-card">
                <div className="anthem-player-cover">
                  <img
                    src={coverSrc}
                    alt={isNational ? "Nigerian Flag" : "PIS"}
                    style={{ transition: "opacity 0.4s ease", opacity: 1 }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  {!isNational && <div className="anthem-vinyl-anim" />}
                </div>
                <div className="anthem-player-info">
                  <div className="anthem-player-title">{currentTitle}</div>
                  <div className="anthem-player-sub">
                    {isNational ? "Federal Republic of Nigeria" : "Prudential International School · Abuja"}
                  </div>
                </div>
                <AudioPlayer key={tab} src={currentAudio} downloadName={downloadName} />
              </div>
            </AnimateIn>

            <AnimateIn className="anthem-lyrics-col" from="right">
              <div className="anthem-lyrics-card">
                <div className="anthem-lyrics-header">
                  <h2>{currentTitle}</h2>
                  <div className="anthem-lyrics-rule" />
                </div>
                {currentLyrics
                  ? <pre className="anthem-lyrics-body">{currentLyrics}</pre>
                  : <p className="anthem-audio-note" style={{ padding: "24px 0" }}>Lyrics will be added via the admin dashboard.</p>
                }
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  );
}
