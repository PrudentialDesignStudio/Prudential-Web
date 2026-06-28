import { useState, useEffect } from "react";
import AnimateIn from "@/components/AnimateIn";

interface TeamMember { name: string; role: string; img: string; dept?: string; }

const DEFAULT_TEAM: TeamMember[] = [
  { img: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414016/1_Dr._Essien_N._Patrick_CEO_Managing_Director_pqodaz.jpg", name: "Dr. Essien N. Patrick", role: "CEO / Managing Director", dept: "Leadership" },
  { img: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414017/2_Ngoutane_M_Mariama_Proprietress_Supervisor_dw0jdg.jpg", name: "Ngoutane M. Mariama", role: "Proprietress / Supervisor", dept: "Leadership" },
  { img: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414016/3_Santana_Tumo_Head_Admin_bwhjgh.jpg", name: "Santana Tumo", role: "Head Admin", dept: "Administration" },
  { img: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414015/4_Obanubi_Olusegun_Taiwo_Coordinator_Examination_Officer_tcepng.jpg", name: "Obanubi Olusegun Taiwo", role: "Examination Officer / Coordinator", dept: "Administration" },
  { img: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414019/5_Laha_Terence_Ternenge_Principal_idhgj1.jpg", name: "Laha Terence Ternenge", role: "Principal", dept: "Leadership" },
  { img: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414016/6_Murna_Aba_Head_of_Primary_School_dmgjfc.jpg", name: "Murna Aba", role: "Head of Primary School", dept: "Academic" },
  { img: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414018/7_Maureen_Onichakwe_Head_of_Early_Years_ctswb6.jpg", name: "Maureen Onichakwe", role: "Head of Early Years", dept: "Academic" },
  { img: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414017/8_Paul_Msughther_HOD_Science_r5dupo.jpg", name: "Paul Msughther", role: "HOD Science", dept: "Academic" },
  { img: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414016/Chinonso_Frank_Vice_Principal_HOD_Arts_nrqdme.jpg", name: "Chinonso Frank", role: "Vice Principal / HOD Arts", dept: "Academic" },
  { img: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414017/10_Essien_Beckline_Head_of_Lodgistics_isldic.jpg", name: "Essien Beckline", role: "Head of Logistics", dept: "Administration" },
  { img: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414017/11_Afolabi_Rhoda_Accountant_x0ylkk.jpg", name: "Afolabi Rhoda", role: "Accountant", dept: "Administration" },
  { img: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414016/12_Juvert_Essien_Procurement_Officer_qct6wq.jpg", name: "Juvert Essien", role: "Procurement Officer", dept: "Administration" },
];

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const [err, setErr] = useState(false);
  const initials = member.name.split(" ").map(w => w[0]).join("").slice(0, 2);
  return (
    <AnimateIn delay={((index % 4) + 1) as 1 | 2 | 3} className="staff-card">
      <div className="staff-card-img-wrap">
        {!err
          ? <img src={member.img} alt={member.name} className="staff-card-img" onError={() => setErr(true)} />
          : <div className="staff-card-fallback">{initials}</div>
        }
        <div className="staff-card-overlay" />
      </div>
      <div className="staff-card-body">
        <div className="staff-card-name">{member.name}</div>
        <div className="staff-card-role">{member.role}</div>
        <div className="staff-card-bar" />
      </div>
    </AnimateIn>
  );
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM);

  useEffect(() => {
    fetch("/api/cms/staff")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.length) {
          setTeam(data.map((m: any) => ({
            name: m.name,
            role: m.title,
            img: m.image_url || "",
            dept: m.department,
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="staff-hero">
        <div className="staff-hero-inner pis-container">
          <AnimateIn className="page-hero-content center">
            <div className="page-hero-badge">Our People</div>
            <h1>Meet the Team</h1>
            <p>The dedicated professionals who make Prudential International School the institution it is today.</p>
          </AnimateIn>
        </div>
      </section>
      <section className="staff-section">
        <div className="pis-container">
          <div className="staff-grid">
            {team.map((m, i) => <TeamCard key={m.name + i} member={m} index={i} />)}
          </div>
        </div>
      </section>
    </>
  );
}
