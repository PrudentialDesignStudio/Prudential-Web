import { useState, useEffect } from "react";
import AnimateIn from "@/components/AnimateIn";

interface LifeItem { id: number; title: string; body: string; image_url?: string; display_order: number; }
interface Club { id: number; name: string; }

const DEFAULT_ITEMS: LifeItem[] = [
  { id:1, title:"Sports & Athletics", body:"Football, basketball, track. We take sports seriously at Prudential. Inter-house competitions run every term. Beyond the results, we use sport to teach something harder to measure: how to handle losing, lead a team, and push through when tired.", image_url:"https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778264/image_1769822857117_j4d5wu.png", display_order:1 },
  { id:2, title:"Clubs and Societies", body:"JET Science Club meets Tuesdays. Debate Society meets Thursdays. The Press Club puts out a termly newsletter that students write, edit, and print themselves. These are real activities students actually show up for.", image_url:"https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778440/image_1769823730253_ze7zst.png", display_order:2 },
  { id:3, title:"Arts and Culture", body:"Literacy Week every term. Cultural day with student performances. The arts are on the timetable. Nigerian heritage is not a theme, it is in the curriculum.", image_url:"https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778578/WhatsApp_Image_2026-01-30_at_10.54.49_PM__1__1769822959981_qqom0r.jpg", display_order:3 },
  { id:4, title:"Community Service", body:"We visit care homes. We run termly charity drives. Students who leave Prudential have a sense of responsibility outside their own lives, not because we told them to, but because it was part of their normal school year.", image_url:"https://res.cloudinary.com/dagt2a1w0/image/upload/v1773779862/image_1769826755575_zlclvn.png", display_order:4 },
  { id:5, title:"Competitions and Events", body:"Science fairs, inter-school quizzes, prize-giving day, graduation. The school calendar is full of moments that matter. These are how students learn to perform under pressure and take pride in what they have earned.", image_url:"https://res.cloudinary.com/dagt2a1w0/image/upload/v1773779034/image_1769904570224_ufbkqj.png", display_order:5 },
];

const DEFAULT_CLUBS: Club[] = [
  { id:1, name:"JET Club (Science)" }, { id:2, name:"Press and Reading Club" },
  { id:3, name:"Debate and Literary Society" }, { id:4, name:"Music and Drama Club" },
  { id:5, name:"Art Club" }, { id:6, name:"Dance" }, { id:7, name:"Visual Arts" },
];

export default function StudentLifePage() {
  const [items, setItems] = useState<LifeItem[]>(DEFAULT_ITEMS);
  const [clubs, setClubs] = useState<Club[]>(DEFAULT_CLUBS);

  useEffect(() => {
    fetch("/api/cms/student-life")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.items?.length) setItems(d.items); if (d?.clubs?.length) setClubs(d.clubs); })
      .catch(() => {});
  }, []);

  const sorted = [...items].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="sl-root">
      <div className="page-hero">
        <div className="page-hero-grid-lines" />
        <div className="pis-container">
          <AnimateIn className="page-hero-content">
            <div className="page-hero-badge">Student Life</div>
            <h1>Beyond the Classroom</h1>
            <p>Education does not stop when the lesson ends. Here is what our students get up to.</p>
          </AnimateIn>
        </div>
      </div>

      <section className="sl-stats-bar">
        <div className="pis-container">
          <div className="sl-stats-inner">
            <div className="sl-stat-item"><span className="sl-stat-n">5</span><span className="sl-stat-l">Activity Streams</span></div>
            <div className="sl-stat-div" />
            <div className="sl-stat-item"><span className="sl-stat-n">7+</span><span className="sl-stat-l">Clubs and Societies</span></div>
            <div className="sl-stat-div" />
            <div className="sl-stat-item"><span className="sl-stat-n">3x</span><span className="sl-stat-l">Termly Events</span></div>
            <div className="sl-stat-div" />
            <div className="sl-stat-item"><span className="sl-stat-n">700+</span><span className="sl-stat-l">Active Students</span></div>
          </div>
        </div>
      </section>

      <section className="sl-features">
        <div className="pis-container">
          <AnimateIn>
            <div className="sl-eyebrow">What We Get Up To</div>
            <h2 className="sl-heading">A full life. Every term.</h2>
          </AnimateIn>
          <div className="sl-feature-list">
            {sorted.map((item, i) => (
              <AnimateIn key={item.id} delay={1 as 1} className={"sl-feature-row" + (i % 2 === 1 ? " sl-feature-row--rev" : "")}>
                {item.image_url && (
                  <div className="sl-feature-img-wrap">
                    <img src={item.image_url} alt={item.title} className="sl-feature-img"
                      onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }} />
                    <span className="sl-feature-img-num">{String(i+1).padStart(2,"0")}</span>
                  </div>
                )}
                <div className="sl-feature-text">
                  <div className="sl-feature-index">0{i+1}</div>
                  <h3 className="sl-feature-title">{item.title}</h3>
                  <p className="sl-feature-body">{item.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="sl-clubs-section">
        <div className="pis-container">
          <div className="sl-clubs-inner">
            <AnimateIn className="sl-clubs-left">
              <div className="sl-eyebrow" style={{color:"#FFD700"}}>Extracurriculars</div>
              <h2 className="sl-clubs-heading">Clubs and Societies</h2>
              <p className="sl-clubs-sub">Something for everyone. Every club runs on student interest, not obligation.</p>
            </AnimateIn>
            <AnimateIn className="sl-clubs-right" delay={2}>
              <div className="sl-clubs-tags">
                {clubs.map(c => <span key={c.id} className="sl-club-tag">{c.name}</span>)}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      <section className="sl-cta-section">
        <div className="pis-container">
          <AnimateIn className="sl-cta-box">
            <div>
              <h2 className="sl-cta-heading">Want your child to be part of this?</h2>
              <p className="sl-cta-sub">Every term is a new opportunity. Admissions are open.</p>
            </div>
            <a href="#" onClick={e=>{e.preventDefault();window.open("https://wa.me/2348095700591","_blank");}} className="sl-cta-btn">
              Chat on WhatsApp
            </a>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
