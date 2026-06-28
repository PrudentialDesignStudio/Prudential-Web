import { useState, useEffect, lazy, Suspense } from "react";
import { useSEO } from "@/hooks/useSEO";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import AnnouncementsBar from "@/components/AnnouncementsBar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollProgress from "@/components/ScrollProgress";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import AcademicsPage from "@/pages/AcademicsPage";
import StudentLifePage from "@/pages/StudentLifePage";
import GalleryPage from "@/pages/GalleryPage";
import ContactPage from "@/pages/ContactPage";
import TeamPage from "@/pages/TeamPage";
import RulesPage from "@/pages/RulesPage";
import PortalPage from "@/pages/PortalPage";
import AnthemPage from "@/pages/AnthemPage";
import ApplyPage from "@/pages/ApplyPage";

const AdminPage = lazy(() => import("@/pages/AdminPage"));

export type Page = "home" | "about" | "academics" | "life" | "gallery" | "contact" | "team" | "rules" | "portal" | "anthem" | "apply";

const PAGE_PATHS: Record<Page, string> = {
  home: "/",
  about: "/about",
  academics: "/academics",
  life: "/student-life",
  gallery: "/gallery",
  contact: "/contact",
  team: "/meet-the-team",
  rules: "/rules",
  portal: "/portal",
  anthem: "/anthem",
  apply: "/apply",
};

const PATH_TO_PAGE: Record<string, Page> = {
  "/": "home",
  "/about": "about",
  "/academics": "academics",
  "/student-life": "life",
  "/gallery": "gallery",
  "/contact": "contact",
  "/staff": "team",
  "/meet-the-team": "team",
  "/rules": "rules",
  "/portal": "portal",
  "/anthem": "anthem",
  "/apply": "apply",
};

function getPageFromPath(): Page {
  return PATH_TO_PAGE[window.location.pathname] ?? "home";
}
function isAdminRoute() {
  return window.location.pathname === "/pis-admin";
}

export default function App() {
  const [page, setPage] = useState<Page>(getPageFromPath);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(isAdminRoute);
  const [transitionOut, setTransitionOut] = useState(false);

  useSEO(page);

  useEffect(() => {
    const t = setTimeout(() => {
      setTransitionOut(true);
      setTimeout(() => setLoading(false), 800);
    }, 2800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const check = () => {
      setIsAdmin(isAdminRoute());
      setPage(getPageFromPath());
    };
    window.addEventListener("popstate", check);
    return () => window.removeEventListener("popstate", check);
  }, []);

  function navigate(p: Page) {
    const path = PAGE_PATHS[p];
    window.history.pushState({}, "", path);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (isAdmin) {
    return (
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "#080f1e" }} />}>
        <AdminPage />
      </Suspense>
    );
  }

  return (
    <>
      {loading && <LoadingScreen transitionOut={transitionOut} />}
      <div className={`site-wrapper${!loading ? " site-revealed" : ""}`}>
        <ScrollProgress />
        <Topbar />
        <Navbar current={page} navigate={navigate} />
        <AnnouncementsBar />
        <main>
          {page === "home"      && <HomePage navigate={navigate} />}
          {page === "about"     && <AboutPage />}
          {page === "academics" && <AcademicsPage />}
          {page === "life"      && <StudentLifePage />}
          {page === "gallery"   && <GalleryPage />}
          {page === "contact"   && <ContactPage />}
          {page === "team"      && <TeamPage />}
          {page === "rules"     && <RulesPage />}
          {page === "portal"    && <PortalPage />}
          {page === "anthem"    && <AnthemPage />}
          {page === "apply"     && <ApplyPage navigate={navigate} />}
        </main>
        <Footer navigate={navigate} />
      </div>
    </>
  );
}
