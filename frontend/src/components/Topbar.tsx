import { useEffect, useState } from "react";

interface ContactInfo { phone1: string; phone2: string; email: string; address: string; }

export default function Topbar() {
  const [info, setInfo] = useState<ContactInfo>({
    phone1: "+234 809 570 0591", phone2: "+234 906 421 9878",
    email: "pis.abuja@gmail.com", address: "16 & 18 2nd Avenue, Gwarinpa Estate, Abuja",
  });

  useEffect(() => {
    fetch("/api/cms/contact")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setInfo({ phone1: d.phone1, phone2: d.phone2, email: d.email, address: d.address }); })
      .catch(() => {});
  }, []);

  return (
    <div className="topbar">
      <div className="pis-container">
        <div className="topbar-inner">
          <div className="topbar-left">
            <span className="topbar-item">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {info.address}
            </span>
          </div>
          <div className="topbar-right">
            <a href={`tel:${info.phone1}`} className="topbar-item topbar-link">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {info.phone1}
            </a>
            <a href={`mailto:${info.email}`} className="topbar-item topbar-link">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {info.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
