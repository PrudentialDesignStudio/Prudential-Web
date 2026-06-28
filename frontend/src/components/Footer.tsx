import { useState } from "react";
import type { Page } from "@/App";

const LOGO = "https://res.cloudinary.com/dagt2a1w0/image/upload/v1773768204/ChatGPT_Image_Jan_31__2026__04_03_54_AM_1769828712771_d65sw2.png";

interface Props { navigate: (p: Page) => void; }

export default function Footer({ navigate }: Props) {
  const [imgErr, setImgErr] = useState(false);
  const y = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="pis-container">
        <div className="footer-grid">
          <div className="footer-brand">
            {!imgErr
              ? <img className="footer-brand-logo" src={LOGO} alt="PIS Logo" onError={() => setImgErr(true)} />
              : <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--navy2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Playfair Display,serif", fontWeight: 800, fontSize: 22, color: "var(--gold)" }}>P</div>
            }
            <div className="footer-brand-name">Prudential International School</div>
            <p>Combining British and Nigerian curricula to raise confident, well-rounded students since 2014. Located in the heart of Gwarinpa, Abuja.</p>
            <div className="footer-connect">
              <a className="footer-fb-cta fc-whatsapp" href="https://wa.me/2348095700591" target="_blank" rel="noopener noreferrer">
                <div className="footer-fb-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </div>
                <div className="footer-fb-text">
                  <span className="footer-fb-label">Chat on WhatsApp</span>
                  <span className="footer-fb-sub">Admissions and quick enquiries</span>
                </div>
                <span className="footer-fb-arrow">→</span>
              </a>
              <a className="footer-fb-cta fc-facebook" href="https://www.facebook.com/profile.php?id=61557487567907&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
                <div className="footer-fb-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </div>
                <div className="footer-fb-text">
                  <span className="footer-fb-label">Follow us on Facebook</span>
                  <span className="footer-fb-sub">Stay updated with school news</span>
                </div>
                <span className="footer-fb-arrow">→</span>
              </a>
              <a className="footer-fb-cta fc-email" href="mailto:pis.abuja@gmail.com">
                <div className="footer-fb-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </div>
                <div className="footer-fb-text">
                  <span className="footer-fb-label">Email Us</span>
                  <span className="footer-fb-sub">pis.abuja@gmail.com</span>
                </div>
                <span className="footer-fb-arrow">→</span>
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {([["Home","home"],["About Us","about"],["Academics","academics"],["Student Life","life"],["Gallery","gallery"]] as [string,Page][]).map(([l,p]) => (
                <li key={p}><button onClick={() => navigate(p)}>{l}</button></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>School</h4>
            <ul>
              {([["Meet the Team","team"],["Rules & Regulations","rules"],["School Anthem","anthem"],["Portal Login","portal"],["Apply Now","apply"],["Contact","contact"]] as [string,Page][]).map(([l,p]) => (
                <li key={p}><button onClick={() => navigate(p)}>{l}</button></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-contact-item">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              16 & 18 2nd Avenue, Gwarinpa Estate, Abuja
            </div>
            <div className="footer-contact-item">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
              +234 809 570 0591
            </div>
            <div className="footer-contact-item">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              pis.abuja@gmail.com
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {y} Prudential International School. All rights reserved.</span>
          {/* Designed by link — uncomment and update href when ready */}
          {/* <a href="https://prudentialdesignstudio.com" target="_blank" rel="noopener noreferrer" className="footer-designed-by">Designed by Prudential Design Studio</a> */}
        </div>
      </div>
    </footer>
  );
}
