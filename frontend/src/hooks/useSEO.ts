import { useEffect } from "react";
import type { Page } from "@/App";
const META: Record<Page, { title: string; desc: string }> = {
  home:      { title: "Prudential International School Abuja | Making a Difference", desc: "Combining British and Nigerian curricula to raise confident, well-rounded students since 2014." },
  about:     { title: "About Us | Prudential International School Abuja", desc: "Our story, mission, vision and values." },
  academics: { title: "Academics | Prudential International School Abuja", desc: "British and Nigerian curricula, from Early Years to Secondary." },
  life:      { title: "Student Life | Prudential International School", desc: "Sports, clubs, arts, drama and more." },
  gallery:   { title: "Gallery | Prudential International School", desc: "Photos and videos from campus life at Prudential International School." },
  contact:   { title: "Contact & Enquiries | Prudential International School", desc: "Get in touch with our admissions team." },
  team:      { title: "Meet the Team | Prudential International School", desc: "The dedicated professionals who make Prudential International School what it is." },
  rules:     { title: "School Rules | Prudential International School", desc: "Our code of conduct and school guidelines." },
  portal:    { title: "Portal Login | Prudential International School", desc: "Student, Parent and Staff portal access." },
  anthem:    { title: "School Anthems | Prudential International School", desc: "The School Anthem and Nigerian National Anthem." },
  apply:     { title: "Apply for Admission | Prudential International School", desc: "Submit your admission enquiry for the 2026/2027 academic year." },
};
export function useSEO(page: Page) {
  useEffect(() => {
    const m = META[page];
    document.title = m.title;
    let d = document.querySelector('meta[name="description"]');
    if (!d) { d = document.createElement("meta"); d.setAttribute("name", "description"); document.head.appendChild(d); }
    d.setAttribute("content", m.desc);
  }, [page]);
}
