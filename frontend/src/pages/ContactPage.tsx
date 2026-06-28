import { useState, useEffect } from "react";
import AnimateIn from "@/components/AnimateIn";

const DEFAULT_CONTACT = {
  phone1: "+234 809 570 0591",
  phone2: "+234 906 421 9878",
  email: "pis.abuja@gmail.com",
  address: "16 & 18 2nd Avenue, Gwarinpa Estate, Abuja, FCT, Nigeria",
  hours: "Monday – Friday, 8:00am – 4:00pm",
};

const SUBJECTS = [
  "General Inquiry",
  "Admission Information",
  "Fees & Scholarships",
  "Student Welfare",
  "Events & Activities",
  "Other",
];

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT);
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/cms/contact")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setContactInfo(prev => ({ ...prev, ...d })); })
      .catch(() => {});
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!form.phone.trim()) e.phone = "Please enter a phone number";
    if (!form.subject) e.subject = "Please choose a subject";
    if (!form.message.trim()) e.message = "Please write a message";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const send = () => {
    if (!validate()) return;
    const msg = encodeURIComponent(
`Hello Prudential International School,

Name: ${form.name}
Phone: ${form.phone}${form.email ? `\nEmail: ${form.email}` : ""}
Subject: ${form.subject}

${form.message}`);

    fetch("/api/cms/contact-submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        email: form.email,
        subject: form.subject,
        message: form.message,
      }),
    }).catch(() => {});

    window.open(`https://wa.me/2348095700591?text=${msg}`, "_blank");
    setSent(true);
  };

  if (sent) return (
    <section className="contact-success">
      <div className="pis-container">
        <AnimateIn className="contact-success-inner">
          <div className="success-icon">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2>Message Sent!</h2>
          <p>Your message has been opened in WhatsApp. We typically reply within a few hours during school hours.</p>
          <button className="btn-primary" onClick={() => setSent(false)}>Send Another Message</button>
        </AnimateIn>
      </div>
    </section>
  );

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-grid-lines" />
        <div className="pis-container">
          <AnimateIn className="page-hero-content">
            <div className="page-hero-badge">Contact Us</div>
            <h1>Get in Touch</h1>
            <p>We're always happy to hear from families. Reach out through any channel below.</p>
          </AnimateIn>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="contact-info-strip">
        <div className="pis-container">
          <div className="contact-info-cards">
            <AnimateIn delay={1} className="contact-info-card">
              <div className="cic-icon">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div className="cic-label">Call Us</div>
              <a href={`tel:${contactInfo.phone1.replace(/\s/g,"")}`} className="cic-value">{contactInfo.phone1}</a>
              {contactInfo.phone2 && <a href={`tel:${contactInfo.phone2.replace(/\s/g,"")}`} className="cic-value">{contactInfo.phone2}</a>}
            </AnimateIn>

            <AnimateIn delay={2} className="contact-info-card">
              <div className="cic-icon">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div className="cic-label">Email Us</div>
              <a href={`mailto:${contactInfo.email}`} className="cic-value">{contactInfo.email}</a>
            </AnimateIn>

            <AnimateIn delay={3} className="contact-info-card">
              <div className="cic-icon">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="cic-label">School Hours</div>
              <div className="cic-value">{contactInfo.hours}</div>
            </AnimateIn>

            <AnimateIn delay={3} className="contact-info-card">
              <div className="cic-icon">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div className="cic-label">Find Us</div>
              <div className="cic-value">{contactInfo.address}</div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT: FORM + MAP */}
      <section className="contact-section">
        <div className="pis-container">
          <div className="contact-layout">

            {/* LEFT: FORM */}
            <AnimateIn className="contact-form-card" from="left">
              <div className="cf-form-header">
                <h2>Send Us a Message</h2>
                <p>Fill in the form and we'll connect you on WhatsApp right away.</p>
              </div>

              <div className="cf-field">
                <label>Your Name <span className="cf-req">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  className={errors.name ? "err" : ""}
                  placeholder="e.g. Chukwuemeka Okafor"
                />
                {errors.name && <span className="cf-err">{errors.name}</span>}
              </div>

              <div className="cf-row">
                <div className="cf-field">
                  <label>Phone Number <span className="cf-req">*</span></label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                    className={errors.phone ? "err" : ""}
                    placeholder="+234 800 000 0000"
                  />
                  {errors.phone && <span className="cf-err">{errors.phone}</span>}
                </div>
                <div className="cf-field">
                  <label>Email Address <span className="cf-optional">(optional)</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="cf-field">
                <label>Subject <span className="cf-req">*</span></label>
                <select
                  value={form.subject}
                  onChange={e => set("subject", e.target.value)}
                  className={errors.subject ? "err" : ""}
                >
                  <option value="">Select a topic…</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.subject && <span className="cf-err">{errors.subject}</span>}
              </div>

              <div className="cf-field">
                <label>Your Message <span className="cf-req">*</span></label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={e => set("message", e.target.value)}
                  className={errors.message ? "err" : ""}
                  placeholder="How can we help you? Tell us what you'd like to know…"
                />
                {errors.message && <span className="cf-err">{errors.message}</span>}
              </div>

              <button className="cf-submit-btn" onClick={send}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Send via WhatsApp
              </button>

              <div className="cf-disclaimer">
                Your message will open in WhatsApp. We respond during school hours, Monday–Friday.
              </div>
            </AnimateIn>

            {/* RIGHT: MAP + DIRECT CONTACTS */}
            <AnimateIn className="contact-info" from="right">
              {/* Embedded Map */}
              <div className="contact-map-wrap">
                <iframe
                  title="Prudential International School Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.658!2d7.4135!3d9.0936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwMDUnMzcuMCJOIDfCsDI0JzQ4LjYiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                  width="100%"
                  height="260"
                  style={{ border: 0, borderRadius: 12 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="contact-direct-title">Or reach us directly</div>

              <a
                href={`https://wa.me/${(contactInfo.phone1 || "2348095700591").replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-direct-btn"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>

              <a href={`mailto:${contactInfo.email}`} className="contact-email-btn">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Send an Email
              </a>

              <div className="contact-address-block">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{contactInfo.address}</span>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  );
}
