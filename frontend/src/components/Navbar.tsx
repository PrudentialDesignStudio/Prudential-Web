import { useState, useEffect } from "react";
import type { Page } from "@/App";

const LOGO = "https://res.cloudinary.com/dagt2a1w0/image/upload/v1773768204/ChatGPT_Image_Jan_31__2026__04_03_54_AM_1769828712771_d65sw2.png";

const links: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "About", page: "about" },
  { label: "Academics", page: "academics" },
  { label: "Student Life", page: "life" },
  { label: "Meet the Team", page: "team" },
  { label: "Rules", page: "rules" },
  { label: "Gallery", page: "gallery" },
  { label: "Anthem", page: "anthem" },
  { label: "Contact", page: "contact" },
];

function NavLogo() {
  const [err, setErr] = useState(false);
  return err
    ? <div className="nav-logo-fallback">P</div>
    : <img className="nav-logo" src={LOGO} alt="PIS Logo" onError={() => setErr(true)} />;
}

interface Props { current: Page; navigate: (p: Page) => void; }

export default function Navbar({ current, navigate }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="pis-container">
        <div className="navbar-inner">
          <div className="nav-brand" onClick={() => navigate("home")}>
            <NavLogo />
            <div className="nav-brand-text">
              <strong>PRUDENTIAL</strong>
              <span>International School</span>
            </div>
          </div>
          <div className="nav-links">
            {links.map(l => (
              <button key={l.page} className={`nav-link${current === l.page ? " active" : ""}`}
                onClick={() => navigate(l.page)}>{l.label}</button>
            ))}
            <button className="nav-portal-btn" onClick={() => navigate("portal")}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Portal
            </button>
            <button className="btn-apply" onClick={() => navigate("apply")}>Apply Now</button>
          </div>
          <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
        <div className={`mobile-menu${open ? " open" : ""}`}>
          {links.map(l => (
            <button key={l.page} className={`mobile-link${current === l.page ? " active" : ""}`}
              onClick={() => { navigate(l.page); setOpen(false); }}>{l.label}</button>
          ))}
          <button className="mobile-link" onClick={() => { navigate("portal"); setOpen(false); }}>Portal Login</button>
          <button className="mobile-apply" onClick={() => { navigate("apply"); setOpen(false); }}>Apply Now</button>
        </div>
      </div>
    </nav>
  );
}
