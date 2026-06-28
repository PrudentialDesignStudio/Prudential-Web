import { useState, useEffect } from "react";

const LOGO = "https://res.cloudinary.com/dagt2a1w0/image/upload/v1773768204/ChatGPT_Image_Jan_31__2026__04_03_54_AM_1769828712771_d65sw2.png";

interface Props { transitionOut: boolean; }

export default function LoadingScreen({ transitionOut }: Props) {
  const [imgErr, setImgErr] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const total = 2600;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / total) * 100));
      setPct(p);
      if (p < 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <div className={`ls-root${transitionOut ? " ls-exit" : ""}`}>
      <div className="ls-bg" />
      <div className="ls-grid" />
      <div className="ls-orb ls-orb-a" />
      <div className="ls-orb ls-orb-b" />
      <div className="ls-orb ls-orb-c" />

      <div className="ls-center">
        <div className="ls-logo-wrap">
          <div className="ls-ring ls-ring-a" />
          <div className="ls-ring ls-ring-b" />
          <div className="ls-ring ls-ring-c" />
          <div className="ls-logo-bg" />
          {!imgErr
            ? <img className="ls-logo" src={LOGO} alt="PIS" onError={() => setImgErr(true)} />
            : <div className="ls-logo ls-logo-fb">P</div>
          }
        </div>

        <div className="ls-name-wrap">
          <div className="ls-school-name">Prudential International School</div>
          <div className="ls-sep"><span /><span>ABUJA · NIGERIA</span><span /></div>
        </div>

        <div className="ls-bar-wrap">
          <div className="ls-bar-track">
            <div className="ls-bar-fill" style={{ width: `${pct}%` }} />
            <div className="ls-bar-shine" />
          </div>
          <div className="ls-pct">{pct}%</div>
        </div>

        <div className="ls-tagline">Excellence &nbsp;·&nbsp; Integrity &nbsp;·&nbsp; Innovation</div>
      </div>

      <div className="ls-curtain ls-curtain-top" />
      <div className="ls-curtain ls-curtain-bottom" />
    </div>
  );
}
