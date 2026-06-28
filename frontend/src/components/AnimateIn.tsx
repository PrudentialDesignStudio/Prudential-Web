import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  from?: "left" | "right" | "scale" | "up";
  delay?: 1 | 2 | 3 | 4;
  className?: string;
}

export default function AnimateIn({ children, from, delay, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const cls = ["animate-in",
    from === "left" ? "from-left" : from === "right" ? "from-right" : from === "scale" ? "from-scale" : "",
    delay ? `delay-${delay}` : "", className].filter(Boolean).join(" ");
  return <div ref={ref} className={cls}>{children}</div>;
}
