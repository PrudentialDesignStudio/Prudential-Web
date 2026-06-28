import { useRef, ReactNode } from "react";

export default function TiltCard({ children, intensity = 12 }: { children: ReactNode; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  function handleMove(e: React.MouseEvent) {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.03)`;
    const shine = el.querySelector(".tilt-shine") as HTMLElement;
    if (shine) shine.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.12) 0%, transparent 60%)`;
  }
  function handleLeave() {
    const el = ref.current; if (!el) return;
    el.style.transform = "";
    const shine = el.querySelector(".tilt-shine") as HTMLElement;
    if (shine) shine.style.background = "";
  }
  return (
    <div ref={ref} className="tilt-wrap" onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ height: "100%" }}>
      <div className="tilt-shine" />{children}
    </div>
  );
}
