import { useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --black: #0A0A0A; --off: #F4F4F2; --white: #FFFFFF;
    --lime: #AAFF45; --lime-dark: #5A8A20; --lime-soft: #E8F5DF;
    --muted: #6B6B6B; --border: #E5E5E5; --text2: #5A5A56;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--off); color: var(--black); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  @keyframes pulseLime { 0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,0.5)} 50%{box-shadow:0 0 0 10px rgba(170,255,69,0)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes checkPop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }

  /* NAV */
  nav { background: var(--white); border-bottom: 1px solid var(--border); padding: 0 32px; height: 62px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .nav-logo { font-size: 14px; font-weight: 800; color: var(--black); display: flex; align-items: center; gap: 10px; letter-spacing: -0.02em; text-decoration: none; }
  .nav-logo-dot { width: 8px; height: 8px; background: var(--lime); border-radius: 50%; animation: pulseLime 2.5s ease-in-out infinite; }
  .nav-link { font-size: 12px; color: var(--muted); text-decoration: none; font-weight: 500; }
  .nav-link:hover { color: var(--black); }

  /* HERO */
  .ty-hero { padding: 64px 32px 48px; text-align: center; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
  .ty-check { width: 72px; height: 72px; background: var(--lime); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 34px; font-weight: 900; color: var(--black); margin-bottom: 28px; animation: checkPop 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
  .ty-pill { display: inline-flex; align-items: center; gap: 8px; background: var(--lime-soft); border: 1px solid rgba(170,255,69,0.4); border-radius: 100px; padding: 5px 14px 5px 6px; margin-bottom: 20px; font-size: 12px; font-weight: 600; color: var(--lime-dark); }
  .ty-pill-dot { width: 6px; height: 6px; background: var(--lime); border-radius: 50%; }
  .ty-hero h1 { font-size: clamp(28px, 4vw, 44px); font-weight: 800; letter-spacing: -0.03em; color: var(--black); margin-bottom: 14px; line-height: 1.1; }
  .ty-hero p { font-size: 16px; color: var(--text2); max-width: 480px; margin: 0 auto 36px; line-height: 1.65; }

  /* STEPS */
  .ty-steps { display: flex; justify-content: center; gap: 0; max-width: 640px; margin: 0 auto 48px; background: var(--white); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .ty-step { flex: 1; padding: 18px 16px; text-align: center; border-right: 1px solid var(--border); }
  .ty-step:last-child { border-right: none; }
  .ty-step-num { font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--lime-dark); margin-bottom: 6px; }
  .ty-step-label { font-size: 13px; font-weight: 700; color: var(--black); margin-bottom: 3px; }
  .ty-step-sub { font-size: 11px; color: var(--muted); }
  .ty-step.done .ty-step-num { color: var(--lime-dark); }
  .ty-step.done .ty-step-label::before { content: '✓ '; color: var(--lime-dark); }
  .ty-step.active { background: var(--lime-soft); }
  .ty-step.active .ty-step-num { color: var(--lime-dark); }

  /* CALENDLY WRAPPER */
  .calendly-section { max-width: 900px; margin: 0 auto; padding: 0 24px 80px; }
  .calendly-label { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); text-align: center; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 12px; }
  .calendly-label::before, .calendly-label::after { content: ''; flex: 1; max-width: 80px; height: 1px; background: var(--border); }
  .calendly-wrap { background: var(--white); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; box-shadow: 0 8px 32px -8px rgba(0,0,0,0.08); }
  .calendly-inline-widget { min-width: 320px; height: 700px; }

  /* FOOTER STRIP */
  .ty-footer { text-align: center; padding: 32px; font-size: 12px; color: var(--muted); border-top: 1px solid var(--border); background: var(--white); }
  .ty-footer a { color: var(--muted); text-decoration: none; }
  .ty-footer a:hover { color: var(--black); }

  @media (max-width: 600px) {
    .ty-hero { padding: 40px 20px 32px; }
    .ty-steps { flex-direction: column; max-width: 100%; margin: 0 16px 32px; }
    .ty-step { border-right: none; border-bottom: 1px solid var(--border); }
    .ty-step:last-child { border-bottom: none; }
    .calendly-section { padding: 0 16px 60px; }
    .calendly-inline-widget { height: 600px; }
  }
`;

export default function ThankYou() {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <style>{css}</style>

      <nav>
        <a href="/" className="nav-logo">
          <div className="nav-logo-dot" />
          FBS Intelligence
        </a>
        <a href="/" className="nav-link">← Back to home</a>
      </nav>

      {/* HERO */}
      <div className="ty-hero">
        <div className="ty-check">✓</div>
        <div className="ty-pill"><span className="ty-pill-dot" />Application received</div>
        <h1>You're in the queue.<br />Book your discovery call.</h1>
        <p>
          We review every application within 24 hours. Pick a time below and we'll confirm your slot — no obligation, no pitch deck.
        </p>
      </div>

      {/* STEPS */}
      <div className="ty-steps">
        <div className="ty-step done">
          <div className="ty-step-num">Step 01</div>
          <div className="ty-step-label">Application</div>
          <div className="ty-step-sub">Submitted</div>
        </div>
        <div className="ty-step active">
          <div className="ty-step-num">Step 02</div>
          <div className="ty-step-label">Book a call</div>
          <div className="ty-step-sub">Choose your time below</div>
        </div>
        <div className="ty-step">
          <div className="ty-step-num">Step 03</div>
          <div className="ty-step-label">Discovery call</div>
          <div className="ty-step-sub">30 min · we review fit</div>
        </div>
        <div className="ty-step">
          <div className="ty-step-num">Step 04</div>
          <div className="ty-step-label">First leads</div>
          <div className="ty-step-sub">Within 7–14 days</div>
        </div>
      </div>

      {/* CALENDLY */}
      <div className="calendly-section">
        <div className="calendly-label">Pick a time that works for you</div>
        <div className="calendly-wrap">
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/freedomsummit/30min?hide_event_type_details=1&hide_gdpr_banner=1"
          />
        </div>
      </div>

      <div className="ty-footer">
        <p>
          Questions? Email us at{" "}
          <a href="mailto:hello@fbsintelligence.com">hello@fbsintelligence.com</a>
          {" "}·{" "}
          <a href="/">Back to FBS Intelligence</a>
        </p>
      </div>
    </>
  );
}
