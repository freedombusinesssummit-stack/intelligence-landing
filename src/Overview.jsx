import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.15, once = true) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); else if (!once) setInView(false); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold, once]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.12);
  return (
    <div ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const f = () => setY(window.scrollY);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return y;
}

/* ── Animated number ── */
function AnimNum({ target, inView, suffix = "", prefix = "" }) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!inView || done.current) return;
    done.current = true;
    let s = null;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 1200, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(step); else setV(target);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <>{prefix}{v.toLocaleString()}{suffix}</>;
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{
  --black:#0A0A0A;--off:#F4F4F2;--white:#FFFFFF;
  --lime:#AAFF45;--lime2:#8EE032;--lime-soft:#E8F5DF;--lime-dark:#5A8A20;
  --muted:#6B6B6B;--border:#E5E5E5;--dark:#0F0F0F;--dark2:#181818;
  --text:#0A0A0A;--text2:#5A5A56;
}
html{scroll-behavior:smooth;}
body{background:var(--white);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
.wrap{max-width:1200px;margin:0 auto;padding:0 32px;}

@keyframes pulseLime{0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,0.5)}50%{box-shadow:0 0 0 10px rgba(170,255,69,0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes marquee-left{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes drawLine{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}
@keyframes pingDot{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.4);opacity:0}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}

.fade-up{animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;}
.fade-up-1{animation-delay:0.05s}.fade-up-2{animation-delay:0.12s}
.fade-up-3{animation-delay:0.2s}.fade-up-4{animation-delay:0.28s}

.reveal{opacity:0;transform:translateY(28px);transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1),transform 0.8s cubic-bezier(0.16,1,0.3,1);}
.reveal.is-in{opacity:1;transform:translateY(0);}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);}
.nav-progress{position:absolute;bottom:0;left:0;height:2px;background:var(--lime);transition:width 0.05s linear;}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:62px;}
.nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-0.02em;text-decoration:none;}
.nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:pulseLime 2.5s ease-in-out infinite;}
.nav-right{display:flex;align-items:center;gap:24px;}
.nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);cursor:pointer;background:none;border:none;font-family:'Inter',sans-serif;transition:color 0.15s;text-decoration:none;}
.nav-link:hover{color:var(--black);}
.nav-btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--black);color:var(--white);border:none;cursor:pointer;padding:9px 20px;border-radius:7px;font-family:'Inter',sans-serif;transition:all 0.15s;text-decoration:none;}
.nav-btn:hover{background:var(--lime);color:var(--black);}

/* HERO */
.hero{padding:130px 0 80px;background:var(--white);border-bottom:1px solid var(--border);position:relative;overflow:hidden;}
.hero-grid-bg{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,0.04) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);-webkit-mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);pointer-events:none;}
.hero>.wrap{position:relative;z-index:2;}
.hero-pill{display:inline-flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--border);border-radius:100px;padding:5px 14px 5px 6px;margin-bottom:28px;font-size:12px;font-weight:500;color:var(--text);}
.hero-pill-dot{background:var(--lime);color:var(--black);font-size:10px;font-weight:800;padding:3px 10px;border-radius:100px;letter-spacing:0.08em;text-transform:uppercase;}
.hero h1{font-size:clamp(38px,5.2vw,66px);font-weight:800;line-height:1.02;letter-spacing:-0.035em;color:var(--black);max-width:880px;margin-bottom:8px;}
.hero h1 .accent{position:relative;display:inline-block;}
.hero h1 .accent::after{content:'';position:absolute;bottom:0;left:0;right:0;height:0.32em;background:var(--lime);z-index:-1;border-radius:2px;}
.hero-sub{font-size:clamp(26px,3.6vw,48px);font-weight:800;line-height:1.05;letter-spacing:-0.035em;color:#AAAAAA;margin-bottom:28px;max-width:880px;}
.hero-desc{font-size:18px;font-weight:400;line-height:1.65;color:var(--text2);max-width:600px;margin-bottom:0;}
.hero-desc strong{display:block;margin-top:10px;font-weight:700;color:var(--black);}

/* STATS */
.stats-strip{display:flex;gap:0;padding-top:52px;margin-top:52px;border-top:1px solid var(--border);}
.stat-item{flex:1;padding-right:28px;border-right:1px solid var(--border);margin-right:28px;}
.stat-item:last-child{border-right:none;margin-right:0;padding-right:0;}
.stat-num{font-size:38px;font-weight:800;letter-spacing:-0.03em;color:var(--black);line-height:1;margin-bottom:6px;font-variant-numeric:tabular-nums;}
.stat-label{font-size:13px;color:var(--text2);line-height:1.45;}

/* SECTION BASICS */
.section{padding:96px 0;}
.section-off{background:var(--off);border-bottom:1px solid var(--border);}
.section-white{background:var(--white);border-bottom:1px solid var(--border);}
.section-dark{background:var(--dark);border-bottom:1px solid #1a1a1a;position:relative;overflow:hidden;}
.section-dark::before{content:'';position:absolute;top:-30%;left:-10%;width:60%;height:80%;background:radial-gradient(ellipse at center,rgba(170,255,69,0.12),transparent 60%);filter:blur(60px);pointer-events:none;}
.section-dark>.wrap{position:relative;z-index:2;}
.section-lime{background:var(--lime);border-bottom:1px solid rgba(0,0,0,0.1);}

.eyebrow{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:18px;display:inline-flex;align-items:center;gap:10px;}
.eyebrow-line{width:24px;height:1px;background:currentColor;opacity:0.4;}
.eyebrow-lime{color:var(--lime-dark);}
.section-dark .eyebrow{color:#888;}
.section-dark .eyebrow-lime{color:var(--lime);}
.section-lime .eyebrow{color:rgba(0,0,0,0.5);}

h2.section-h2{font-size:clamp(28px,3.8vw,48px);font-weight:800;letter-spacing:-0.03em;line-height:1.05;color:var(--black);margin-bottom:18px;max-width:820px;}
.section-dark h2.section-h2{color:var(--white);}
.section-lime h2.section-h2{color:var(--black);}
.hl-sm{background:linear-gradient(120deg,var(--lime) 0%,var(--lime) 100%);background-repeat:no-repeat;background-size:100% 0.32em;background-position:0 88%;padding:0 4px;}
.section-body{font-size:17px;line-height:1.65;color:var(--text2);max-width:640px;margin-bottom:48px;}
.section-dark .section-body{color:#AAA;}

/* MARQUEE */
.marquee-wrap{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--off);padding:13px 0;}
.marquee-track{display:flex;white-space:nowrap;animation:marquee-left 45s linear infinite;}
.marquee-item{font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text2);padding:0 24px;}
.marquee-dot{color:var(--lime);}

/* ═══════════════════════════════════════════
   FUNNEL VISUALIZATION
   ═══════════════════════════════════════════ */
.funnel-section{padding:96px 0;background:var(--white);border-bottom:1px solid var(--border);}

.funnel-steps{display:flex;flex-direction:column;gap:0;margin-top:56px;position:relative;}

/* vertical connector line */
.funnel-steps::before{
  content:'';position:absolute;left:39px;top:40px;bottom:40px;width:2px;
  background:linear-gradient(to bottom,var(--lime),var(--lime2),#ccc);
  z-index:0;
}

.funnel-step{display:grid;grid-template-columns:80px 1fr;gap:32px;align-items:flex-start;position:relative;z-index:1;padding-bottom:40px;}
.funnel-step:last-child{padding-bottom:0;}

.funnel-step-left{display:flex;flex-direction:column;align-items:center;gap:0;}
.funnel-step-icon{
  width:80px;height:80px;border-radius:20px;
  display:flex;align-items:center;justify-content:center;
  font-size:28px;flex-shrink:0;
  border:2px solid var(--border);
  background:var(--white);
  transition:all 0.3s;
  position:relative;z-index:2;
}
.funnel-step:hover .funnel-step-icon{border-color:var(--lime);box-shadow:0 0 0 6px rgba(170,255,69,0.15);}
.funnel-step-icon.active-step{background:var(--black);border-color:var(--black);}

.funnel-step-body{padding-top:16px;}
.funnel-step-num{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:8px;}
.funnel-step h3{font-size:22px;font-weight:800;letter-spacing:-0.02em;color:var(--black);margin-bottom:10px;line-height:1.2;}
.funnel-step p{font-size:15px;color:var(--text2);line-height:1.7;max-width:560px;margin-bottom:16px;}
.funnel-step-meta{display:flex;flex-wrap:wrap;gap:8px;}
.funnel-tag{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:5px 12px;border-radius:100px;background:var(--off);color:var(--text2);border:1px solid var(--border);}
.funnel-tag.lime{background:var(--lime-soft);color:var(--lime-dark);border-color:rgba(170,255,69,0.3);}
.funnel-tag.dark{background:var(--black);color:var(--white);border-color:var(--black);}

/* ═══════════════════════════════════════════
   SEGMENTATION / GMS SCORING
   ═══════════════════════════════════════════ */
.seg-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;}

.gms-wheel{position:relative;width:100%;max-width:380px;margin:0 auto;}
.gms-wheel svg{width:100%;height:auto;}

.seg-dimensions{display:flex;flex-direction:column;gap:12px;}
.seg-dim{background:var(--white);border:1px solid var(--border);border-radius:12px;padding:18px 20px;display:flex;align-items:center;gap:16px;transition:all 0.2s;}
.seg-dim:hover{border-color:var(--black);transform:translateX(4px);}
.seg-dim-num{width:36px;height:36px;border-radius:10px;background:var(--lime);color:var(--black);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;}
.seg-dim-body{flex:1;}
.seg-dim-h{font-size:14px;font-weight:700;color:var(--black);margin-bottom:2px;}
.seg-dim-p{font-size:12px;color:var(--text2);line-height:1.5;}
.seg-dim-weight{font-size:12px;font-weight:700;color:var(--lime-dark);white-space:nowrap;}

/* TIER CARDS */
.tiers-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px;}
.tier-card{border-radius:16px;padding:28px 24px;position:relative;overflow:hidden;transition:all 0.25s;}
.tier-card:hover{transform:translateY(-4px);}
.tier-card.hot{background:#0A0A0A;border:1px solid #1a1a1a;}
.tier-card.warm{background:#fff9f0;border:1px solid #F5D9B0;}
.tier-card.cold{background:var(--off);border:1px solid var(--border);}
.tier-badge{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:800;letter-spacing:0.1em;margin-bottom:16px;}
.tier-dot{width:8px;height:8px;border-radius:50%;}
.tier-badge.hot{color:#FF6B55;}.tier-dot.hot{background:#FF6B55;animation:pulseDot 1.5s infinite;}
.tier-badge.warm{color:#C07D10;}.tier-dot.warm{background:#C07D10;}
.tier-badge.cold{color:#4A7FC1;}.tier-dot.cold{background:#4A7FC1;}
@keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(255,107,85,0.4)}50%{box-shadow:0 0 0 6px rgba(255,107,85,0)}}
.tier-range{font-size:36px;font-weight:900;letter-spacing:-0.03em;line-height:1;margin-bottom:6px;}
.tier-card.hot .tier-range{color:var(--lime);}
.tier-card.warm .tier-range{color:#C07D10;}
.tier-card.cold .tier-range{color:#4A7FC1;}
.tier-sub{font-size:12px;color:var(--muted);margin-bottom:16px;}
.tier-card.hot .tier-sub{color:#888;}
.tier-desc{font-size:13px;line-height:1.6;color:var(--muted);}
.tier-card.hot .tier-desc{color:rgba(255,255,255,0.6);}

/* ═══════════════════════════════════════════
   VIDEO SERIES SECTION
   ═══════════════════════════════════════════ */
.video-series-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px;}
.video-card{background:var(--white);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all 0.25s;cursor:default;}
.video-card:hover{transform:translateY(-4px);border-color:var(--black);box-shadow:0 16px 40px -10px rgba(0,0,0,0.1);}
.video-thumb{aspect-ratio:16/9;background:var(--dark);position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.video-thumb-gradient{position:absolute;inset:0;}
.video-play{width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);position:relative;z-index:2;}
.video-play-icon{width:0;height:0;border-top:9px solid transparent;border-bottom:9px solid transparent;border-left:16px solid var(--white);margin-left:3px;}
.video-ep{position:absolute;top:12px;left:12px;background:var(--lime);color:var(--black);font-size:10px;font-weight:800;padding:3px 8px;border-radius:100px;letter-spacing:0.06em;z-index:2;}
.video-duration{position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,0.6);color:var(--white);font-size:11px;font-weight:600;padding:2px 8px;border-radius:4px;z-index:2;}
.video-body{padding:20px;}
.video-label{font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:6px;}
.video-title{font-size:16px;font-weight:700;color:var(--black);line-height:1.3;margin-bottom:8px;}
.video-desc{font-size:13px;color:var(--text2);line-height:1.55;}

/* ═══════════════════════════════════════════
   WEBINAR / LANDING FUNNEL STEPS
   ═══════════════════════════════════════════ */
.mini-funnel{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:48px;position:relative;}
.mini-funnel::after{content:'';position:absolute;top:40px;left:calc(12.5%);right:calc(12.5%);height:2px;background:linear-gradient(to right,var(--lime),var(--lime2),#E5E5E5,#E5E5E5);z-index:0;}
.mf-step{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 12px;position:relative;z-index:1;}
.mf-icon{width:80px;height:80px;border-radius:20px;background:var(--white);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:16px;transition:all 0.3s;position:relative;z-index:2;}
.mf-step.done .mf-icon{background:var(--black);border-color:var(--black);}
.mf-step.active .mf-icon{background:var(--lime);border-color:var(--lime);box-shadow:0 0 0 8px rgba(170,255,69,0.2);}
.mf-num{font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:6px;}
.mf-title{font-size:14px;font-weight:700;color:var(--black);margin-bottom:6px;line-height:1.3;}
.mf-desc{font-size:12px;color:var(--text2);line-height:1.5;}

/* ═══════════════════════════════════════════
   SURVEY / GMS FORM MOCKUP
   ═══════════════════════════════════════════ */
.survey-mockup{background:var(--white);border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:0 24px 60px -10px rgba(0,0,0,0.12);max-width:520px;margin:0 auto;animation:float 6s ease-in-out infinite;}
.survey-chrome{background:#F5F4F0;padding:12px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border);}
.survey-dots{display:flex;gap:5px;}
.survey-dot{width:11px;height:11px;border-radius:50%;}
.survey-url{flex:1;text-align:center;font-size:11px;color:#999;background:var(--white);padding:4px 16px;border-radius:6px;max-width:280px;margin:0 auto;border:1px solid var(--border);}
.survey-body{padding:28px 32px;}
.survey-progress{display:flex;align-items:center;gap:12px;margin-bottom:24px;}
.survey-progress-track{flex:1;height:4px;background:var(--off);border-radius:2px;overflow:hidden;}
.survey-progress-fill{height:100%;background:var(--lime);border-radius:2px;}
.survey-progress-label{font-size:11px;font-weight:600;color:var(--muted);white-space:nowrap;}
.survey-q{font-size:18px;font-weight:700;color:var(--black);margin-bottom:20px;line-height:1.35;letter-spacing:-0.01em;}
.survey-options{display:flex;flex-direction:column;gap:10px;}
.survey-option{border:1.5px solid var(--border);border-radius:10px;padding:14px 18px;font-size:14px;color:var(--text);cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:12px;font-family:'Inter',sans-serif;background:none;}
.survey-option:hover{border-color:var(--black);}
.survey-option.selected{border-color:var(--lime);background:var(--lime-soft);}
.survey-option-check{width:18px;height:18px;border-radius:50%;border:1.5px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.survey-option.selected .survey-option-check{background:var(--lime);border-color:var(--lime);color:var(--black);font-size:10px;font-weight:800;}
.survey-footer{display:flex;justify-content:space-between;align-items:center;margin-top:24px;padding-top:20px;border-top:1px solid var(--border);}
.survey-back{font-size:13px;color:var(--muted);background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;}
.survey-next{background:var(--black);color:var(--white);border:none;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;}
.survey-next:hover{background:var(--lime);color:var(--black);}

/* SCORE RESULT MOCKUP */
.score-result{background:var(--dark);border-radius:16px;padding:28px;text-align:center;margin-top:20px;}
.score-result-label{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#888;margin-bottom:16px;}
.score-result-num{font-size:72px;font-weight:900;letter-spacing:-0.04em;color:var(--lime);line-height:1;font-variant-numeric:tabular-nums;}
.score-result-sub{font-size:14px;color:rgba(255,255,255,0.5);margin-top:8px;}
.score-result-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,107,85,0.15);color:#FF6B55;font-size:13px;font-weight:700;padding:8px 18px;border-radius:100px;margin-top:14px;border:1px solid rgba(255,107,85,0.3);}

/* ═══════════════════════════════════════════
   ANALYTICS / SERVICES
   ═══════════════════════════════════════════ */
.services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px;}
.service-card{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:24px;transition:all 0.2s;}
.service-card:hover{border-color:var(--black);transform:translateY(-2px);}
.service-icon{font-size:28px;margin-bottom:14px;}
.service-cat{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:6px;}
.service-name{font-size:16px;font-weight:700;color:var(--black);margin-bottom:8px;}
.service-desc{font-size:13px;color:var(--text2);line-height:1.55;}

/* ═══════════════════════════════════════════
   LEAD DELIVERY
   ═══════════════════════════════════════════ */
.delivery-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
.delivery-lead-card{background:var(--white);border-radius:16px;box-shadow:0 20px 48px -8px rgba(0,0,0,0.12),0 0 0 1px var(--border);padding:28px;animation:float 7s ease-in-out infinite;}
.dlc-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border);}
.dlc-tier{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800;color:#FF6B55;letter-spacing:0.06em;}
.dlc-score{background:rgba(255,107,85,0.1);color:#FF6B55;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;margin-left:4px;}
.dlc-time{font-size:11px;color:var(--muted);}
.dlc-profile{display:flex;align-items:center;gap:14px;margin-bottom:18px;}
.dlc-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#D94F3A,#C07D10);color:var(--white);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;}
.dlc-name{font-size:15px;font-weight:700;color:var(--black);margin-bottom:2px;}
.dlc-meta{font-size:12px;color:var(--text2);}
.dlc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px;background:var(--off);border-radius:10px;margin-bottom:16px;}
.dlc-field .dlc-label{font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);margin-bottom:3px;}
.dlc-field .dlc-val{font-size:12px;font-weight:700;color:var(--black);}
.dlc-quote{background:var(--dark);border-radius:10px;padding:14px;border-left:3px solid var(--lime);}
.dlc-ql{font-size:9px;font-weight:700;letter-spacing:0.14em;color:var(--lime);margin-bottom:6px;}
.dlc-qtext{font-size:12px;color:rgba(255,255,255,0.88);line-height:1.6;font-style:italic;}

/* UTM TAG */
.utm-tag{display:inline-flex;align-items:center;gap:8px;background:#0A0A0A;color:var(--lime);font-size:10px;font-weight:700;padding:6px 12px;border-radius:6px;font-family:'Monaco','Courier New',monospace;margin-top:12px;}

/* BOTTOM CTA */
.bottom-cta-section{padding:100px 0;background:var(--dark);position:relative;overflow:hidden;text-align:center;}
.bottom-cta-section::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:400px;background:radial-gradient(ellipse at center,rgba(170,255,69,0.2),transparent 60%);filter:blur(60px);pointer-events:none;}
.bottom-cta-section>.wrap{position:relative;z-index:2;}
.bottom-cta-section h2{font-size:clamp(30px,4vw,48px);font-weight:800;letter-spacing:-0.03em;color:var(--white);margin-bottom:16px;line-height:1.08;}
.bottom-cta-section p{font-size:17px;color:#888;max-width:480px;margin:0 auto 32px;line-height:1.65;}
.cta-btn-lime{background:var(--lime);color:var(--black);border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:15px;font-weight:800;padding:18px 40px;border-radius:10px;transition:all 0.2s;}
.cta-btn-lime:hover{transform:translateY(-2px);box-shadow:0 16px 40px -8px rgba(170,255,69,0.5);}

@media(max-width:1024px){
  .seg-grid,.delivery-grid{grid-template-columns:1fr;}
  .video-series-grid{grid-template-columns:1fr 1fr;}
  .mini-funnel::after{display:none;}
}
@media(max-width:768px){
  .funnel-step{grid-template-columns:60px 1fr;gap:16px;}
  .funnel-step-icon{width:60px;height:60px;font-size:22px;border-radius:14px;}
  .funnel-steps::before{left:29px;}
  .tiers-row,.video-series-grid,.services-grid{grid-template-columns:1fr;}
  .mini-funnel{grid-template-columns:1fr 1fr;gap:24px;}
  .stats-strip{flex-wrap:wrap;gap:24px;}
  .stat-item{flex:1 1 calc(50% - 12px);border-right:none;padding-right:0;margin-right:0;}
  .gms-wheel{max-width:280px;}
  .dlc-grid{grid-template-columns:1fr;}
}
`;

/* ── DATA ── */
const FUNNEL_STEPS = [
  {
    n: "01", emoji: "🎬",
    title: "Video Series",
    body: "We create a series of short educational videos on global mobility, second passports, and tax optimization. Distributed on LinkedIn, YouTube, and through paid Meta/Google campaigns targeting founders, investors and internationally mobile individuals.",
    tags: [
      { label: "LinkedIn Video", cls: "" },
      { label: "YouTube Shorts", cls: "" },
      { label: "Meta Ads", cls: "lime" },
      { label: "Google Ads", cls: "lime" },
    ],
  },
  {
    n: "02", emoji: "📅",
    title: "Mini-Webinar Invitation",
    body: "Each video ends with an invitation to a free mini-webinar series — 3 sessions covering jurisdiction-specific strategies. A dedicated landing page captures registrations. Analytics are connected from day one: Meta Pixel, Google Tag, UTM tracking.",
    tags: [
      { label: "Landing page", cls: "lime" },
      { label: "Meta Pixel", cls: "" },
      { label: "Google Analytics", cls: "" },
      { label: "UTM tracking", cls: "dark" },
    ],
  },
  {
    n: "03", emoji: "📋",
    title: "Global Mobility Survey",
    body: "Every registrant completes the Global Mobility Survey — 14 questions covering jurisdiction interest, capital range, family situation, timeline, and motivation. The survey is the qualification engine. Without it, no lead enters the system.",
    tags: [
      { label: "14 questions", cls: "lime" },
      { label: "Jurisdiction intent", cls: "" },
      { label: "Capital range", cls: "" },
      { label: "Timeline", cls: "" },
    ],
  },
  {
    n: "04", emoji: "📊",
    title: "Scoring & Segmentation",
    body: "Each response is scored 0–100 on 6 dimensions using the Global Mobility Score Index. HOT (70+), WARM (40–69), or COLD (0–39). Leads are tagged by jurisdiction, source track, UTM parameters, and any partner referral attribution.",
    tags: [
      { label: "GMS 0–100", cls: "dark" },
      { label: "6 dimensions", cls: "" },
      { label: "HOT / WARM / COLD", cls: "lime" },
      { label: "Auto-tagged", cls: "" },
    ],
  },
  {
    n: "05", emoji: "✅",
    title: "Intent Verification",
    body: "Qualified leads (score 40+) go through an additional intent verification step — confirming readiness, decision authority, and depth of interest. This step filters out noise and ensures every lead that reaches a partner has genuinely expressed intent.",
    tags: [
      { label: "Score 40+ only", cls: "lime" },
      { label: "Readiness confirmed", cls: "" },
      { label: "Decision authority", cls: "" },
    ],
  },
  {
    n: "06", emoji: "📥",
    title: "Dashboard Delivery",
    body: "Qualified, verified leads appear in the partner dashboard matched to their jurisdiction and ICP. Each lead includes a full Advisor Brief. Partners can view the profile for free and unlock contact details (email, phone) with one credit.",
    tags: [
      { label: "Jurisdiction matched", cls: "dark" },
      { label: "Advisor Brief", cls: "lime" },
      { label: "1 credit = contact unlock", cls: "" },
    ],
  },
];

const GMS_DIMS = [
  { n: "01", h: "Budget Confirmation", p: "Real deployable capital vs. aspirational number.", w: "20%" },
  { n: "02", h: "Decision Timeline", p: "3 months, 12 months, or 'someday'?", w: "20%" },
  { n: "03", h: "Jurisdiction Specificity", p: "Specific country vs. comparing options.", w: "15%" },
  { n: "04", h: "Primary Motivation", p: "Tax, political risk, family, passport, or lifestyle.", w: "15%" },
  { n: "05", h: "Family Complexity", p: "Solo, couple, family with kids, multi-generational.", w: "15%" },
  { n: "06", h: "Decision Authority", p: "Sole decision-maker or family involved.", w: "15%" },
];

const VIDEO_SERIES = [
  {
    ep: "EP 01", color: "#1a1a1a",
    label: "Foundations",
    title: "Why founders are getting a second passport in 2026",
    desc: "Tax exposure, political risk, and the rise of Plan B thinking among HNW individuals.",
    duration: "8:34",
  },
  {
    ep: "EP 02", color: "#0F2840",
    label: "Jurisdiction Deep Dive",
    title: "Portugal vs. Malta vs. UAE — which is right for you?",
    desc: "A practical comparison of the top three jurisdictions by capital requirement, timeline, and lifestyle.",
    duration: "11:20",
  },
  {
    ep: "EP 03", color: "#1a0A00",
    label: "Action",
    title: "The Global Mobility Survey — know your score",
    desc: "Take the 14-question assessment and understand exactly where you stand and what your next move is.",
    duration: "6:45",
  },
];

const SERVICES = [
  { icon: "📊", cat: "Analytics", name: "Meta Pixel + CAPI", desc: "Full conversion tracking from ad impression to survey completion. Server-side events for iOS14+ accuracy." },
  { icon: "🔍", cat: "Analytics", name: "Google Analytics 4", desc: "Event-based tracking across webinar registration and survey funnel. Funnel visualization and drop-off analysis." },
  { icon: "🏷️", cat: "Attribution", name: "UTM Framework", desc: "utm_source, utm_medium, utm_campaign, utm_content stored on every lead permanently. Full attribution chain." },
  { icon: "📧", cat: "CRM", name: "MailerLite", desc: "Email sequences triggered by survey completion. Segmented by tier, jurisdiction, and intent level." },
  { icon: "🗄️", cat: "Database", name: "Supabase / PostgreSQL", desc: "Lead storage with jurisdiction array matching. Real-time feed updates for partner dashboards." },
  { icon: "🔗", cat: "Integration", name: "Zapier / Webhooks", desc: "Survey → Score → Tag → Dashboard pipeline. Automatic routing to matched partner feeds." },
];

const MINI_FUNNEL = [
  { n: "01", emoji: "🎬", title: "Video series", desc: "3–5 short videos, organic + paid distribution", done: true },
  { n: "02", emoji: "📅", title: "Webinar landing", desc: "Registration page with analytics connected", done: true },
  { n: "03", emoji: "📋", title: "GMS Survey", desc: "14-question qualification at registration", active: true },
  { n: "04", emoji: "📥", title: "Lead in dashboard", desc: "Scored, tagged, and matched to partner" },
];

const SURVEY_OPTIONS = [
  "Within 3 months — we're ready",
  "Within 6 months",
  "Within 12 months",
  "Still researching",
];

export default function Overview() {
  const [selectedOpt, setSelectedOpt] = useState(1);
  const scrollY = useScrollY();
  const [statsRef, statsInView] = useInView(0.3);
  const docH = typeof document !== "undefined" ? document.documentElement.scrollHeight - window.innerHeight : 1;
  const progress = Math.min((scrollY / docH) * 100, 100);

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav>
        <div className="wrap nav-inner">
          <a href="/" className="nav-logo"><div className="nav-logo-dot" />FBS Intelligence</a>
          <div className="nav-right">
            <a href="/" className="nav-link">Landing</a>
            <a href="/pricing" className="nav-link">Pricing</a>
            <a href="/overview" className="nav-link" style={{ color: "var(--black)", fontWeight: 700 }}>Overview</a>
            <a href="/#apply" className="nav-btn">Apply</a>
          </div>
        </div>
        <div className="nav-progress" style={{ width: `${progress}%` }} />
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="wrap">
          <div className="hero-pill fade-up">
            <span className="hero-pill-dot">How it works</span>
            Platform Overview
          </div>
          <h1 className="fade-up fade-up-1">
            From video view to <span className="accent">qualified lead.</span>
          </h1>
          <div className="hero-sub fade-up fade-up-2">
            The full funnel, explained.
          </div>
          <p className="hero-desc fade-up fade-up-3">
            Every lead in the FBS Intelligence dashboard has been through a six-stage qualification process — starting from a video and ending with a scored, verified, jurisdiction-matched Advisor Brief.
            <strong>No cold lists. No guesswork. Just intent.</strong>
          </p>

          <div className="stats-strip" ref={statsRef}>
            <div className="stat-item">
              <div className="stat-num"><AnimNum target={6} inView={statsInView} /></div>
              <div className="stat-label">Funnel stages from<br />first view to dashboard</div>
            </div>
            <div className="stat-item">
              <div className="stat-num"><AnimNum target={14} inView={statsInView} suffix=" Q" /></div>
              <div className="stat-label">Global Mobility Survey<br />questions per respondent</div>
            </div>
            <div className="stat-item">
              <div className="stat-num"><AnimNum target={92} inView={statsInView} suffix="%" /></div>
              <div className="stat-label">Intent verification<br />completion rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-num"><AnimNum target={72} inView={statsInView} suffix="h" /></div>
              <div className="stat-label">From survey completion<br />to partner dashboard</div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(2)].flatMap((_, k) =>
            ["Video Series", "Webinar Registration", "Global Mobility Survey", "GMS Score 0–100", "HOT · WARM · COLD Tiers", "UTM Attribution", "Intent Verification", "Jurisdiction Matching", "Advisor Brief", "Partner Dashboard"].map((t, i) => (
              <span key={`${k}-${i}`} className="marquee-item">{t} <span className="marquee-dot">·</span></span>
            ))
          )}
        </div>
      </div>

      {/* ── STAGE 1: VIDEO SERIES ── */}
      <section className="section section-off" id="video">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow eyebrow-lime"><span className="eyebrow-line" />Stage 01 — Acquisition</div>
            <h2 className="section-h2">It starts with a <span className="hl-sm">video series.</span></h2>
            <p className="section-body">
              We create educational content targeting founders, investors, and internationally mobile individuals — distributed through organic channels and paid campaigns. Each video ends with an invitation to a free mini-webinar series.
            </p>
          </Reveal>

          <div className="video-series-grid">
            {VIDEO_SERIES.map((v, i) => (
              <Reveal key={i} delay={i * 80} className="video-card">
                <div className="video-thumb" style={{ background: v.color }}>
                  <div className="video-ep">{v.ep}</div>
                  <div className="video-play"><div className="video-play-icon" /></div>
                  <div className="video-duration">{v.duration}</div>
                </div>
                <div className="video-body">
                  <div className="video-label">{v.label}</div>
                  <div className="video-title">{v.title}</div>
                  <div className="video-desc">{v.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAGE 2: WEBINAR FUNNEL ── */}
      <section className="section section-white" id="webinar">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow eyebrow-lime"><span className="eyebrow-line" />Stage 02 — Registration</div>
            <h2 className="section-h2">Landing page. <span className="hl-sm">Analytics connected.</span></h2>
            <p className="section-body">
              A dedicated landing page captures webinar registrations. Every service in the stack is connected from day one — attribution is complete before the first lead enters the system.
            </p>
          </Reveal>

          <div className="mini-funnel">
            {MINI_FUNNEL.map((s, i) => (
              <Reveal key={i} delay={i * 100} className="mf-step">
                <div className={`mf-icon ${s.done ? "done" : ""} ${s.active ? "active" : ""}`}>
                  {s.emoji}
                </div>
                <div className="mf-num">STEP {s.n}</div>
                <div className="mf-title">{s.title}</div>
                <div className="mf-desc">{s.desc}</div>
              </Reveal>
            ))}
          </div>

          <div className="services-grid" style={{ marginTop: 64 }}>
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 60} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <div className="service-cat">{s.cat}</div>
                <div className="service-name">{s.name}</div>
                <div className="service-desc">{s.desc}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAGE 3: SURVEY + SCORING ── */}
      <section className="section section-off" id="survey">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow eyebrow-lime"><span className="eyebrow-line" />Stages 03–04 — Survey & Scoring</div>
            <h2 className="section-h2">14 questions. <span className="hl-sm">One score.</span></h2>
            <p className="section-body">
              Every registrant completes the Global Mobility Survey before joining the webinar. Responses are scored across 6 dimensions to produce a single Global Mobility Score (0–100). This is what separates serious prospects from curious browsers.
            </p>
          </Reveal>

          <div className="seg-grid">
            {/* Survey mockup */}
            <Reveal delay={100}>
              <div>
                <div className="survey-mockup">
                  <div className="survey-chrome">
                    <div className="survey-dots">
                      <div className="survey-dot" style={{ background: "#FF5F57" }} />
                      <div className="survey-dot" style={{ background: "#FEBC2E" }} />
                      <div className="survey-dot" style={{ background: "#28C840" }} />
                    </div>
                    <div className="survey-url">survey.fbsintelligence.com</div>
                  </div>
                  <div className="survey-body">
                    <div className="survey-progress">
                      <div className="survey-progress-track">
                        <div className="survey-progress-fill" style={{ width: "57%" }} />
                      </div>
                      <div className="survey-progress-label">Q8 of 14</div>
                    </div>
                    <div className="survey-q">
                      What is your target timeline for obtaining residency or citizenship?
                    </div>
                    <div className="survey-options">
                      {SURVEY_OPTIONS.map((opt, i) => (
                        <button key={i} className={`survey-option ${selectedOpt === i ? "selected" : ""}`}
                          onClick={() => setSelectedOpt(i)}>
                          <div className="survey-option-check">{selectedOpt === i ? "✓" : ""}</div>
                          {opt}
                        </button>
                      ))}
                    </div>
                    <div className="survey-footer">
                      <button className="survey-back">← Back</button>
                      <button className="survey-next">Next →</button>
                    </div>
                  </div>
                </div>

                <div className="score-result" style={{ marginTop: 16 }}>
                  <div className="score-result-label">Your Global Mobility Score</div>
                  <div className="score-result-num">87</div>
                  <div className="score-result-sub">Out of 100 · Based on 6 dimensions</div>
                  <div className="score-result-badge">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF6B55", display: "inline-block", flexShrink: 0 }} />
                    HOT — Ready to engage
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Dimensions */}
            <Reveal delay={200}>
              <div>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>6 Scoring Dimensions</div>
                  <div className="seg-dimensions">
                    {GMS_DIMS.map((d, i) => (
                      <div key={i} className="seg-dim">
                        <div className="seg-dim-num">{d.n}</div>
                        <div className="seg-dim-body">
                          <div className="seg-dim-h">{d.h}</div>
                          <div className="seg-dim-p">{d.p}</div>
                        </div>
                        <div className="seg-dim-weight">{d.w}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Tier cards */}
          <div className="tiers-row" style={{ marginTop: 64 }}>
            {[
              { cls: "hot", badge: "HOT", range: "70–100", sub: "Ready to engage", desc: "Confirmed budget, decision authority, clear timeline within 90 days. Immediate outreach recommended." },
              { cls: "warm", badge: "WARM", range: "40–69", sub: "Active research", desc: "Real intent with 3–12 month horizon. Budget and jurisdiction interest present but not yet locked." },
              { cls: "cold", badge: "COLD", range: "0–39", sub: "Early exploration", desc: "Genuine interest but timeline unclear. Useful for audience intelligence, long-cycle nurture." },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 80} className={`tier-card ${t.cls}`}>
                <div className={`tier-badge ${t.cls}`}>
                  <div className={`tier-dot ${t.cls}`} />{t.badge}
                </div>
                <div className="tier-range">{t.range}</div>
                <div className="tier-sub">{t.sub}</div>
                <div className="tier-desc">{t.desc}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL FUNNEL VISUAL ── */}
      <section className="funnel-section" id="funnel">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow eyebrow-lime"><span className="eyebrow-line" />Full Funnel</div>
            <h2 className="section-h2">Six stages. Fully managed. <span className="hl-sm">You see results.</span></h2>
            <p className="section-body">
              From the moment someone watches a video to the moment they appear in a partner's dashboard — every stage is handled by FBS Intelligence. Partners only see prospects who are ready to talk.
            </p>
          </Reveal>

          <div className="funnel-steps">
            {FUNNEL_STEPS.map((s, i) => (
              <Reveal key={i} delay={i * 80} className="funnel-step">
                <div className="funnel-step-left">
                  <div className={`funnel-step-icon ${i === 5 ? "active-step" : ""}`}>
                    {s.emoji}
                  </div>
                </div>
                <div className="funnel-step-body">
                  <div className="funnel-step-num">STAGE {s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <div className="funnel-step-meta">
                    {s.tags.map((tag, j) => (
                      <span key={j} className={`funnel-tag ${tag.cls}`}>{tag.label}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAGE 6: DASHBOARD DELIVERY ── */}
      <section className="section section-dark" id="delivery">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow" style={{ color: "#888" }}><span className="eyebrow-line" />Stage 06 — Delivery</div>
            <h2 className="section-h2">The lead lands <span className="hl-sm">in your dashboard.</span></h2>
            <p className="section-body">
              Matched to your jurisdiction. Scored. Verified. With a full Advisor Brief attached. You unlock contact details with one credit and reach out knowing exactly who you're calling and why they're ready now.
            </p>
          </Reveal>

          <div className="delivery-grid">
            <Reveal delay={100}>
              <div className="delivery-lead-card">
                <div className="dlc-head">
                  <div className="dlc-tier">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF6B55", display: "inline-block", animation: "pulseDot 1.5s infinite" }} />
                    HOT
                    <span className="dlc-score">Score 87/100</span>
                  </div>
                  <div className="dlc-time">Delivered 12 min ago</div>
                </div>
                <div className="dlc-profile">
                  <div className="dlc-avatar">DH</div>
                  <div>
                    <div className="dlc-name">D. Harrison</div>
                    <div className="dlc-meta">🇺🇸 Founder · San Francisco, USA</div>
                  </div>
                </div>
                <div className="dlc-grid">
                  {[["Capital", "$400k–$2M"], ["Timeline", "60 days"], ["Family", "Spouse + 2"], ["Programme", "Malta MEIN"]].map(([l, v]) => (
                    <div key={l} className="dlc-field">
                      <div className="dlc-label">{l}</div>
                      <div className="dlc-val">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="dlc-quote">
                  <div className="dlc-ql">PROSPECT'S OWN WORDS</div>
                  <div className="dlc-qtext">"We've been planning this for two years. Budget is ready, we just need the right firm to guide us through Malta."</div>
                </div>
                <div className="utm-tag">utm_campaign=malta_founders_q2 · source=meta_ads</div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { emoji: "🎯", h: "Jurisdiction matched", p: "Only reaches partners who cover Malta — no noise for other firms." },
                  { emoji: "📋", h: "Full Advisor Brief", p: "Score, profile, capital, timeline, motivation, and the prospect's own words — all before first contact." },
                  { emoji: "🏷️", h: "UTM stored permanently", p: "The full attribution chain is locked to the lead. You know exactly which campaign and video produced it." },
                  { emoji: "🔓", h: "One credit to unlock", p: "Contact details (email + WhatsApp) unlock with a single credit. Profile is always visible for free." },
                  { emoji: "📊", h: "Your status, your view", p: "When you mark a lead as contacted — only you see that. Other matched partners are unaffected." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "18px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, transition: "all 0.2s", cursor: "default" }}>
                    <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.emoji}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", marginBottom: 4 }}>{item.h}</div>
                      <div style={{ fontSize: 13, color: "#AAA", lineHeight: 1.55 }}>{item.p}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bottom-cta-section">
        <div className="wrap">
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--lime)", color: "var(--black)", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 100, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--black)" }} />
              Selective Onboarding
            </div>
            <h2>Ready to receive leads<br />from this funnel?</h2>
            <p>We onboard a limited number of service providers per jurisdiction. Apply and we'll review your profile within 24 hours.</p>
            <a href="/#apply" className="cta-btn-lime" style={{ display: "inline-block", textDecoration: "none" }}>
              Apply for Partner Access →
            </a>
            <div style={{ marginTop: 16, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
              {["24h review", "First leads in 7 days", "Pricing on discovery call"].map(t => (
                <span key={t} style={{ fontSize: 12, color: "#555", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "var(--lime)", fontWeight: 900 }}>✓</span> {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--black)", padding: "48px 0 32px", borderTop: "1px solid #1a1a1a" }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: "var(--white)" }}>
            <div style={{ width: 8, height: 8, background: "var(--lime)", borderRadius: "50%" }} />
            FBS Intelligence
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="/" style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>Landing</a>
            <a href="/pricing" style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>Pricing</a>
            <a href="/overview" style={{ fontSize: 13, color: "#AAA", textDecoration: "none" }}>Overview</a>
          </div>
          <div style={{ fontSize: 12, color: "#444" }}>© 2026 Freedom Business Summit</div>
        </div>
      </footer>
    </>
  );
}
