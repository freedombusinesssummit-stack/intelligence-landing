import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.12, once = true) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true);
      else if (!once) setInView(false);
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold, once]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.1);
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

function AnimNum({ target, inView, suffix = "", prefix = "" }) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!inView || done.current) return;
    done.current = true;
    let s = null;
    const step = ts => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 1200, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(step); else setV(target);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <>{prefix}{v}{suffix}</>;
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{
  --black:#0A0A0A;--off:#F4F4F2;--white:#FFFFFF;
  --lime:#AAFF45;--lime2:#8EE032;--lime-soft:#E8F5DF;--lime-dark:#5A8A20;
  --muted:#6B6B6B;--border:#E5E5E5;--dark:#0F0F0F;--text:#0A0A0A;--text2:#5A5A56;
}
html{scroll-behavior:smooth;}
body{background:var(--white);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
.wrap{max-width:1200px;margin:0 auto;padding:0 32px;}

@keyframes pulseLime{0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,0.5)}50%{box-shadow:0 0 0 10px rgba(170,255,69,0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes marquee-left{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pingDot{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.4);opacity:0}}
@keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(255,107,85,0.4)}50%{box-shadow:0 0 0 6px rgba(255,107,85,0)}}
@keyframes shimmer{0%{background-position:-400% 0}100%{background-position:400% 0}}

.fade-up{animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;}
.d1{animation-delay:0.05s}.d2{animation-delay:0.12s}.d3{animation-delay:0.2s}.d4{animation-delay:0.28s}
.reveal{opacity:0;transform:translateY(28px);transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1),transform 0.8s cubic-bezier(0.16,1,0.3,1);}
.reveal.is-in{opacity:1;transform:translateY(0);}

/* ── NAV ── */
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

/* ── HERO ── */
.hero{padding:130px 0 80px;background:var(--white);border-bottom:1px solid var(--border);position:relative;overflow:hidden;}
.hero-grid-bg{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,0.04) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);pointer-events:none;}
.hero>.wrap{position:relative;z-index:2;}
.hero-pill{display:inline-flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--border);border-radius:100px;padding:5px 14px 5px 6px;margin-bottom:28px;font-size:12px;font-weight:500;color:var(--text);}
.hero-pill-dot{background:var(--lime);color:var(--black);font-size:10px;font-weight:800;padding:3px 10px;border-radius:100px;letter-spacing:0.08em;text-transform:uppercase;}
.hero h1{font-size:clamp(38px,5.2vw,68px);font-weight:800;line-height:1.02;letter-spacing:-0.035em;color:var(--black);max-width:900px;margin-bottom:8px;}
.accent{position:relative;display:inline-block;}.accent::after{content:'';position:absolute;bottom:0;left:0;right:0;height:0.32em;background:var(--lime);z-index:-1;border-radius:2px;}
.hero-sub{font-size:clamp(24px,3.2vw,44px);font-weight:800;line-height:1.05;letter-spacing:-0.03em;color:#BBBBB7;margin-bottom:28px;max-width:900px;}
.hero-desc{font-size:18px;font-weight:400;line-height:1.65;color:var(--text2);max-width:580px;}

.stats-strip{display:flex;gap:0;padding-top:48px;margin-top:48px;border-top:1px solid var(--border);}
.stat-item{flex:1;padding-right:28px;border-right:1px solid var(--border);margin-right:28px;}
.stat-item:last-child{border-right:none;margin-right:0;padding-right:0;}
.stat-num{font-size:36px;font-weight:800;letter-spacing:-0.03em;color:var(--black);line-height:1;margin-bottom:6px;}
.stat-label{font-size:13px;color:var(--text2);line-height:1.45;}

/* ── MARQUEE ── */
.marquee-wrap{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--off);padding:13px 0;}
.marquee-track{display:flex;white-space:nowrap;animation:marquee-left 50s linear infinite;}
.marquee-item{font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text2);padding:0 24px;}
.marquee-dot{color:var(--lime);}

/* ── BEFORE/AFTER ── */
.ba-section{padding:80px 0;background:var(--white);border-bottom:1px solid var(--border);}
.ba-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:24px;align-items:center;margin-top:48px;}
.ba-col{border-radius:16px;padding:32px;display:flex;flex-direction:column;gap:14px;}
.ba-before{background:#FFF5F5;border:1px solid #FFD6D6;}
.ba-after{background:var(--lime-soft);border:1px solid rgba(170,255,69,0.4);}
.ba-col-label{font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:4px;}
.ba-before .ba-col-label{color:#CC3333;}
.ba-after .ba-col-label{color:var(--lime-dark);}
.ba-col-title{font-size:20px;font-weight:800;color:var(--black);letter-spacing:-0.02em;margin-bottom:8px;line-height:1.2;}
.ba-item{display:flex;align-items:center;gap:10px;font-size:14px;line-height:1.45;}
.ba-before .ba-item{color:#8A3333;}
.ba-after .ba-item{color:#2A5A10;}
.ba-icon{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;}
.ba-before .ba-icon{background:rgba(204,51,51,0.12);color:#CC3333;}
.ba-after .ba-icon{background:rgba(90,138,32,0.15);color:var(--lime-dark);}
.ba-arrow{font-size:28px;color:var(--muted);text-align:center;flex-shrink:0;}

/* ── 5-STEP FORMULA ── */
.formula-section{padding:96px 0;background:var(--off);border-bottom:1px solid var(--border);}
.formula-eyebrow{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:16px;display:flex;align-items:center;gap:10px;}
.formula-eyebrow-line{width:24px;height:1px;background:var(--lime-dark);opacity:0.5;}

.formula-pipeline{display:grid;grid-template-columns:repeat(5,1fr);gap:0;margin-top:56px;position:relative;}
.formula-connector{position:absolute;top:52px;left:10%;right:10%;height:2px;background:linear-gradient(to right,var(--lime),var(--lime2),rgba(170,255,69,0.3),rgba(170,255,69,0.15),rgba(170,255,69,0.05));z-index:0;}

.formula-step{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 8px;position:relative;z-index:1;cursor:default;}
.formula-step:hover .formula-icon{border-color:var(--lime);box-shadow:0 0 0 8px rgba(170,255,69,0.15);transform:scale(1.05);}

.formula-icon{width:104px;height:104px;border-radius:24px;background:var(--white);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:36px;margin-bottom:20px;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);position:relative;z-index:2;box-shadow:0 4px 16px rgba(0,0,0,0.06);}
.formula-step.active .formula-icon{background:var(--black);border-color:var(--black);box-shadow:0 8px 32px rgba(0,0,0,0.2);}

.formula-num{font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:8px;}
.formula-step-name{font-size:18px;font-weight:800;color:var(--black);letter-spacing:-0.02em;margin-bottom:6px;}
.formula-step-desc{font-size:12px;color:var(--text2);line-height:1.55;max-width:160px;margin:0 auto 12px;}
.formula-badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:4px 10px;border-radius:100px;border:1px solid var(--border);background:var(--white);color:var(--black);}
.formula-step.active .formula-badge{background:var(--lime);border-color:var(--lime);color:var(--black);}

/* formula result visual cards */
.formula-visuals{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:32px;}
.fv-card{background:var(--white);border:1px solid var(--border);border-radius:12px;padding:12px;min-height:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;transition:all 0.2s;}
.fv-card:hover{border-color:var(--black);}
.fv-card.active{background:var(--black);border-color:var(--black);}
.fv-img{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;}
.fv-thumb{width:24px;height:16px;border-radius:3px;background:#1a1a1a;}
.fv-stat{font-size:11px;font-weight:700;color:var(--text2);}
.fv-card.active .fv-stat{color:rgba(255,255,255,0.6);}

/* formula CTA */
.formula-cta-bar{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:24px 32px;margin-top:48px;display:flex;align-items:center;justify-content:space-between;gap:24px;}
.formula-cta-text h4{font-size:17px;font-weight:700;color:var(--black);margin-bottom:4px;}
.formula-cta-text p{font-size:13px;color:var(--text2);}
.formula-cta-btns{display:flex;gap:12px;flex-shrink:0;}
.btn-outline{background:none;border:1.5px solid var(--border);color:var(--black);font-family:'Inter',sans-serif;font-size:13px;font-weight:700;padding:11px 22px;border-radius:8px;cursor:pointer;transition:all 0.15s;}
.btn-outline:hover{border-color:var(--black);}
.btn-dark{background:var(--black);color:var(--white);border:none;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;padding:11px 22px;border-radius:8px;cursor:pointer;transition:all 0.15s;text-decoration:none;display:inline-block;}
.btn-dark:hover{background:var(--lime);color:var(--black);}

/* ── QUALIFIED LEAD CHECKLIST ── */
.qualified-section{padding:96px 0;background:var(--white);border-bottom:1px solid var(--border);}
.qualified-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;margin-top:48px;}
.qualified-checks{display:flex;flex-direction:column;gap:14px;}
.qcheck{display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:var(--off);border-radius:12px;border:1px solid transparent;transition:all 0.2s;}
.qcheck:hover{border-color:var(--lime);background:var(--lime-soft);}
.qcheck-icon{width:36px;height:36px;border-radius:10px;background:var(--lime);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.qcheck-body{}
.qcheck-h{font-size:14px;font-weight:700;color:var(--black);margin-bottom:3px;}
.qcheck-p{font-size:12px;color:var(--text2);line-height:1.5;}
.qcheck-tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--lime-dark);margin-top:4px;}

/* ── AUDIENCE SOURCES ── */
.sources-section{padding:96px 0;background:var(--off);border-bottom:1px solid var(--border);}
.sources-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px;}
.source-card{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:24px;transition:all 0.2s;}
.source-card:hover{border-color:var(--black);transform:translateY(-3px);}
.source-icon{font-size:28px;margin-bottom:12px;}
.source-channel{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:6px;}
.source-name{font-size:16px;font-weight:700;color:var(--black);margin-bottom:8px;}
.source-desc{font-size:13px;color:var(--text2);line-height:1.55;}
.source-metric{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-size:12px;font-weight:700;color:var(--black);background:var(--off);padding:4px 10px;border-radius:100px;}

/* ── DASHBOARD MOCKUP ── */
.dashboard-section{padding:96px 0;background:var(--dark);position:relative;overflow:hidden;border-bottom:1px solid #1a1a1a;}
.dashboard-section::before{content:'';position:absolute;top:-20%;left:-5%;width:50%;height:70%;background:radial-gradient(ellipse at center,rgba(170,255,69,0.1),transparent 60%);filter:blur(60px);pointer-events:none;}
.dashboard-section>.wrap{position:relative;z-index:2;}

.dashboard-mockup{background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;box-shadow:0 32px 80px -16px rgba(0,0,0,0.6);margin-top:48px;}
.dashboard-chrome{background:#0A0A0A;padding:14px 20px;display:flex;align-items:center;gap:16px;border-bottom:1px solid rgba(255,255,255,0.06);}
.db-dots{display:flex;gap:6px;}
.db-dot{width:11px;height:11px;border-radius:50%;}
.db-title{font-size:12px;color:#555;font-weight:500;}
.db-actions{margin-left:auto;display:flex;gap:8px;}
.db-action{font-size:11px;font-weight:600;color:#555;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);padding:4px 12px;border-radius:6px;cursor:pointer;}
.db-action.active{color:var(--lime);border-color:rgba(170,255,69,0.3);}

.dashboard-body{display:grid;grid-template-columns:220px 1fr;min-height:560px;}

/* sidebar */
.db-sidebar{background:#0D0D0D;border-right:1px solid rgba(255,255,255,0.06);padding:20px 0;}
.db-nav-item{display:flex;align-items:center;gap:10px;padding:10px 20px;font-size:13px;color:#555;cursor:pointer;transition:all 0.15s;}
.db-nav-item:hover{color:#AAA;background:rgba(255,255,255,0.03);}
.db-nav-item.active{color:var(--lime);background:rgba(170,255,69,0.06);border-right:2px solid var(--lime);}
.db-nav-icon{font-size:15px;width:20px;text-align:center;}
.db-nav-section{font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#333;padding:16px 20px 6px;}

/* main content */
.db-main{padding:24px;}
.db-header-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.db-page-title{font-size:18px;font-weight:800;color:var(--white);letter-spacing:-0.02em;}
.db-filter-row{display:flex;gap:8px;}
.db-filter{font-size:11px;font-weight:600;color:#555;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:5px 12px;border-radius:6px;cursor:pointer;}
.db-filter.active{color:var(--lime);border-color:rgba(170,255,69,0.3);background:rgba(170,255,69,0.06);}

/* stats row */
.db-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;}
.db-stat{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;}
.db-stat-val{font-size:22px;font-weight:800;color:var(--white);letter-spacing:-0.02em;margin-bottom:3px;}
.db-stat-val.lime{color:var(--lime);}
.db-stat-label{font-size:11px;color:#555;}

/* lead rows */
.db-leads{display:flex;flex-direction:column;gap:8px;}
.db-lead-row{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px 18px;display:grid;grid-template-columns:32px 1fr 80px 90px 90px 100px 100px;gap:12px;align-items:center;cursor:pointer;transition:all 0.15s;}
.db-lead-row:hover{background:rgba(255,255,255,0.06);border-color:rgba(170,255,69,0.2);}
.db-lead-row.hot{border-left:3px solid #FF6B55;}
.db-lead-row.warm{border-left:3px solid #C07D10;}
.db-lead-row.cold{border-left:3px solid #4A7FC1;}

.db-lead-avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--white);flex-shrink:0;}
.db-lead-name{font-size:13px;font-weight:600;color:rgba(255,255,255,0.88);margin-bottom:2px;}
.db-lead-country{font-size:11px;color:#555;}

.db-score{text-align:center;}
.db-score-num{font-size:16px;font-weight:800;letter-spacing:-0.02em;}
.db-score-bar{height:3px;border-radius:2px;margin-top:4px;background:rgba(255,255,255,0.1);}
.db-score-fill{height:100%;border-radius:2px;}

.db-tier-badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:800;padding:4px 10px;border-radius:100px;letter-spacing:0.06em;}
.tier-hot{background:rgba(255,107,85,0.15);color:#FF6B55;}
.tier-warm{background:rgba(192,125,16,0.15);color:#C07D10;}
.tier-cold{background:rgba(74,127,193,0.15);color:#4A7FC1;}

.db-jur{font-size:12px;color:rgba(255,255,255,0.5);}
.db-capital{font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);}
.db-time{font-size:12px;color:rgba(255,255,255,0.5);}
.db-status{font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;}
.status-new{background:rgba(170,255,69,0.1);color:var(--lime);}
.status-viewed{background:rgba(255,255,255,0.07);color:#888;}
.status-contacted{background:rgba(192,125,16,0.12);color:#C07D10;}

/* lead detail drawer hint */
.db-lead-unlock{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--lime);background:rgba(170,255,69,0.1);border:1px solid rgba(170,255,69,0.2);padding:5px 12px;border-radius:6px;white-space:nowrap;cursor:pointer;margin-left:auto;}

/* ── FULL FUNNEL ── */
.funnel-section{padding:96px 0;background:var(--white);border-bottom:1px solid var(--border);}
.funnel-steps{display:flex;flex-direction:column;gap:0;margin-top:56px;position:relative;}
.funnel-steps::before{content:'';position:absolute;left:39px;top:40px;bottom:40px;width:2px;background:linear-gradient(to bottom,var(--lime),var(--lime2),rgba(170,255,69,0.2));z-index:0;}
.funnel-step{display:grid;grid-template-columns:80px 1fr;gap:32px;align-items:flex-start;position:relative;z-index:1;padding-bottom:40px;}
.funnel-step:last-child{padding-bottom:0;}
.funnel-step-icon{width:80px;height:80px;border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;border:2px solid var(--border);background:var(--white);transition:all 0.3s;position:relative;z-index:2;}
.funnel-step:hover .funnel-step-icon{border-color:var(--lime);box-shadow:0 0 0 6px rgba(170,255,69,0.12);}
.funnel-step-icon.final{background:var(--black);border-color:var(--black);}
.funnel-step-body{padding-top:16px;}
.funnel-step-num{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:8px;}
.funnel-step h3{font-size:22px;font-weight:800;letter-spacing:-0.02em;color:var(--black);margin-bottom:10px;line-height:1.2;}
.funnel-step p{font-size:15px;color:var(--text2);line-height:1.7;max-width:560px;margin-bottom:16px;}
.funnel-step-tags{display:flex;flex-wrap:wrap;gap:8px;}
.ftag{display:inline-flex;align-items:center;font-size:12px;font-weight:600;padding:5px 12px;border-radius:100px;background:var(--off);color:var(--text2);border:1px solid var(--border);}
.ftag.lime{background:var(--lime-soft);color:var(--lime-dark);border-color:rgba(170,255,69,0.3);}
.ftag.dark{background:var(--black);color:var(--white);border-color:var(--black);}

/* ── BOTTOM CTA ── */
.bottom-cta{padding:96px 0;background:var(--dark);position:relative;overflow:hidden;text-align:center;}
.bottom-cta::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:400px;background:radial-gradient(ellipse at center,rgba(170,255,69,0.2),transparent 60%);filter:blur(60px);pointer-events:none;}
.bottom-cta>.wrap{position:relative;z-index:2;}
.bottom-cta h2{font-size:clamp(30px,4vw,48px);font-weight:800;letter-spacing:-0.03em;color:var(--white);margin-bottom:14px;line-height:1.08;}
.bottom-cta p{font-size:17px;color:#888;max-width:460px;margin:0 auto 32px;line-height:1.65;}
.btn-lime{background:var(--lime);color:var(--black);border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:15px;font-weight:800;padding:18px 40px;border-radius:10px;transition:all 0.2s;display:inline-block;text-decoration:none;}
.btn-lime:hover{transform:translateY(-2px);box-shadow:0 16px 40px -8px rgba(170,255,69,0.5);}

@media(max-width:1024px){.dashboard-body{grid-template-columns:1fr;}.db-sidebar{display:none;}.db-lead-row{grid-template-columns:32px 1fr 70px 80px;}.db-lead-row>*:nth-child(n+6){display:none;}.formula-pipeline{grid-template-columns:1fr 1fr;gap:24px;}.formula-connector{display:none;}.formula-visuals{display:none;}.ba-grid{grid-template-columns:1fr;gap:16px;}.ba-arrow{display:none;}.qualified-grid{grid-template-columns:1fr;}.sources-grid{grid-template-columns:1fr 1fr;}}
@media(max-width:768px){.formula-pipeline{grid-template-columns:1fr;}.stats-strip{flex-wrap:wrap;}.stat-item{flex:1 1 calc(50% - 12px);border-right:none;}.funnel-step{grid-template-columns:60px 1fr;gap:16px;}.funnel-step-icon{width:60px;height:60px;font-size:22px;}.funnel-steps::before{left:29px;}.sources-grid{grid-template-columns:1fr;}.db-stats{grid-template-columns:1fr 1fr;}}
`;

const FUNNEL_STEPS = [
  {n:"01",emoji:"🎬",title:"Video Series",body:"Short expert videos on global mobility, second passports, and tax optimization — distributed on LinkedIn, YouTube, and through paid Meta/Google campaigns.",tags:[{t:"LinkedIn Video"},{t:"YouTube",cls:"lime"},{t:"Meta Ads",cls:"lime"},{t:"Google Ads"}]},
  {n:"02",emoji:"📅",title:"Mini-Webinar Invitation",body:"Each video ends with an invitation to a free mini-webinar series. A dedicated landing page captures registrations with full analytics from day one: Meta Pixel, GTM, UTM tracking.",tags:[{t:"Landing page",cls:"lime"},{t:"Meta Pixel"},{t:"Google Analytics"},{t:"UTM tracking",cls:"dark"}]},
  {n:"03",emoji:"📋",title:"Global Mobility Survey",body:"Every registrant completes the 14-question Global Mobility Survey before joining the webinar. Budget, timeline, family, motivation, jurisdiction. Without it, no lead enters the system.",tags:[{t:"14 questions",cls:"lime"},{t:"Jurisdiction intent"},{t:"Capital range"},{t:"Timeline"}]},
  {n:"04",emoji:"📊",title:"Scoring & Segmentation",body:"Each response is scored 0–100 across 6 dimensions using the Global Mobility Score Index. HOT (70+), WARM (40–69), COLD (0–39). Leads are tagged by jurisdiction, source, and UTM.",tags:[{t:"GMS 0–100",cls:"dark"},{t:"6 dimensions"},{t:"HOT / WARM / COLD",cls:"lime"},{t:"UTM tagged"}]},
  {n:"05",emoji:"✅",title:"Intent Verification",body:"Qualified leads (score 40+) go through an additional intent verification step — confirming readiness, decision authority, and depth of interest. This filters out noise.",tags:[{t:"Score 40+ only",cls:"lime"},{t:"Readiness confirmed"},{t:"Decision authority"}]},
  {n:"06",emoji:"📥",title:"Dashboard Delivery",body:"Qualified, verified leads appear in the partner dashboard matched to their jurisdiction. Each lead includes a full Advisor Brief. Partners unlock contact details with one credit.",tags:[{t:"Jurisdiction matched",cls:"dark"},{t:"Advisor Brief",cls:"lime"},{t:"1 credit = contact unlock"}]},
];

const SOURCES = [
  {icon:"🎬",channel:"Paid",name:"Meta & Instagram Ads",desc:"Targeted campaigns reaching founders and HNW individuals actively searching for residency and citizenship solutions.",metric:"60+ countries"},
  {icon:"🔍",channel:"Paid",name:"Google Search & YouTube",desc:"Intent-based targeting — people who are actively searching for 'second passport', 'golden visa', 'Portugal residency'.",metric:"Purchase intent"},
  {icon:"💼",channel:"Organic",name:"LinkedIn Content",desc:"Thought leadership content targeting C-suite executives, fund managers, and internationally mobile professionals.",metric:"B2B audience"},
  {icon:"🎤",channel:"Events",name:"FBS Summit Events",desc:"Registrants from the US Edition, Caribbean Edition, and Europe Edition events — already in the investment migration mindset.",metric:"800+ past registrants"},
  {icon:"📧",channel:"Database",name:"FBS Email Database",desc:"Existing FBS audience built over multiple event cycles — segmented by jurisdiction interest and engagement level.",metric:"Warm audience"},
  {icon:"📹",channel:"Content",name:"Webinar Series",desc:"Mini-webinar registrants who self-selected into a 3-session educational series on jurisdiction strategy — highest intent signal.",metric:"Highest intent"},
];

const DB_LEADS = [
  {avatar:"JH",color:"#D94F3A",name:"J. Harrison",country:"🇺🇸 USA",score:87,scoreColor:"#AAFF45",tier:"HOT",tierCls:"tier-hot",jur:"Malta MEIN",capital:"$400k–$2M",time:"60 days",status:"new",statusCls:"status-new",statusTxt:"New"},
  {avatar:"SM",color:"#3A6DD9",name:"S. Marchetti",country:"🇮🇹 Italy",score:74,scoreColor:"#FF6B55",tier:"HOT",tierCls:"tier-hot",jur:"Portugal GV",capital:"$300k–$1M",time:"90 days",status:"viewed",statusCls:"status-viewed",statusTxt:"Viewed"},
  {avatar:"RK",color:"#8B5CF6",name:"R. Kapoor",country:"🇮🇳 India",score:61,scoreColor:"#C07D10",tier:"WARM",tierCls:"tier-warm",jur:"UAE Residence",capital:"$150k–$500k",time:"6 months",status:"contacted",statusCls:"status-contacted",statusTxt:"Contacted"},
  {avatar:"EV",color:"#059669",name:"E. Volkov",country:"🇦🇪 UAE",score:91,scoreColor:"#AAFF45",tier:"HOT",tierCls:"tier-hot",jur:"St. Kitts CBI",capital:"$400k+",time:"30 days",status:"new",statusCls:"status-new",statusTxt:"New"},
  {avatar:"LC",color:"#C07D10",name:"L. Chen",country:"🇸🇬 Singapore",score:55,scoreColor:"#4A7FC1",tier:"WARM",tierCls:"tier-warm",jur:"Greece GV",capital:"$250k–$800k",time:"12 months",status:"new",statusCls:"status-new",statusTxt:"New"},
];

const QUALIFIED_CHECKS = [
  {icon:"💰",h:"Budget confirmed",p:"Prospect stated specific deployable capital — not 'we're interested' but '$400k–$2M ready to move'.",tag:"Question 3 of 14"},
  {icon:"📅",h:"Timeline known",p:"Exact window captured: within 3 months, 6 months, or 12 months. Not 'someday'.",tag:"Question 5 of 14"},
  {icon:"🗺️",h:"Jurisdiction selected",p:"Prospect indicated specific programme interest — Portugal GV, Malta MEIN, UAE residence, or Caribbean CBI.",tag:"Question 2 of 14"},
  {icon:"👤",h:"Decision-maker identified",p:"Self-reported as sole decision-maker or primary decision-maker in a couple/family context.",tag:"Question 9 of 14"},
  {icon:"🧠",h:"Motivation captured",p:"Tax pressure, political risk, passport freedom, business expansion, family security — in their own words.",tag:"Question 7 of 14"},
  {icon:"✅",h:"Intent verified",p:"Post-survey verification step confirms readiness. Only score 40+ leads pass. Score 70+ are flagged HOT.",tag:"Verification step"},
];

export default function Overview() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const scrollY = useScrollY();
  const [statsRef, statsInView] = useInView(0.3);
  const docH = typeof document !== "undefined"
    ? Math.max(document.documentElement.scrollHeight - window.innerHeight, 1) : 1;
  const progress = Math.min((scrollY / docH) * 100, 100);

  const filteredLeads = activeFilter === "ALL" ? DB_LEADS : DB_LEADS.filter(l => l.tier === activeFilter);

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav>
        <div className="wrap nav-inner">
          <a href="/" className="nav-logo"><div className="nav-logo-dot" />FBS Intelligence</a>
          <div className="nav-right">
            <a href="/" className="nav-link">Home</a>
            <a href="/pricing" className="nav-link">Pricing</a>
            <a href="/overview" className="nav-link" style={{ color: "var(--black)", fontWeight: 700 }}>How it works</a>
            <a href="/#apply" className="nav-btn">Apply</a>
          </div>
        </div>
        <div className="nav-progress" style={{ width: `${progress}%` }} />
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="wrap">
          <div className="hero-pill fade-up"><span className="hero-pill-dot">How it works</span>Platform Overview</div>
          <h1 className="fade-up d1">From first video view to<br /><span className="accent">qualified lead in dashboard.</span></h1>
          <div className="hero-sub fade-up d2">The 5-step formula, explained.</div>
          <p className="hero-desc fade-up d3">
            Every lead in the FBS Intelligence dashboard has been through a five-step qualification process — starting from a video and ending with a scored, verified, jurisdiction-matched Advisor Brief ready for contact.
          </p>

          <div className="stats-strip" ref={statsRef}>
            {[
              {n:5,s:"",label:"Steps from first\nview to dashboard"},
              {n:14,s:" Q",label:"Global Mobility Survey\nquestions per lead"},
              {n:92,s:"%",label:"Intent verification\ncompletion rate"},
              {n:72,s:"h",label:"From survey\nto partner dashboard"},
            ].map((s,i) => (
              <div key={i} className="stat-item">
                <div className="stat-num"><AnimNum target={s.n} inView={statsInView} suffix={s.s} /></div>
                <div className="stat-label" style={{ whiteSpace: "pre-line" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(2)].flatMap((_, k) =>
            ["Video Series", "Webinar Registration", "Global Mobility Survey", "GMS Score 0–100", "HOT · WARM · COLD", "UTM Attribution", "Intent Verification", "Jurisdiction Matching", "Advisor Brief", "Partner Dashboard", "Exclusive Leads"].map((t, i) => (
              <span key={`${k}-${i}`} className="marquee-item">{t} <span className="marquee-dot">·</span></span>
            ))
          )}
        </div>
      </div>

      {/* BEFORE / AFTER */}
      <section className="ba-section">
        <div className="wrap">
          <Reveal>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 24, height: 1, background: "var(--muted)", opacity: 0.4 }} />
              The problem we solve
            </div>
            <h2 style={{ fontSize: "clamp(26px,3.6vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--black)", marginBottom: 0, maxWidth: 700 }}>
              Most firms waste time on the wrong leads.
            </h2>
          </Reveal>

          <div className="ba-grid">
            <Reveal delay={100} className="ba-col ba-before">
              <div className="ba-col-label">Before FBS Intelligence</div>
              <div className="ba-col-title">Cold lists and wasted calls</div>
              {[
                ["✕","Cold purchased lists with no intent signal"],
                ["✕","Unqualified Facebook leads who don't know what a Golden Visa is"],
                ["✕","Hours spent on discovery calls that go nowhere"],
                ["✕","No idea of budget, timeline, or decision authority"],
                ["✕","10 conversations to find 1 qualified prospect"],
              ].map(([i, t], k) => (
                <div key={k} className="ba-item"><div className="ba-icon">{i}</div>{t}</div>
              ))}
            </Reveal>

            <div className="ba-arrow">→</div>

            <Reveal delay={200} className="ba-col ba-after">
              <div className="ba-col-label">With FBS Intelligence</div>
              <div className="ba-col-title">Verified intent, ready to talk</div>
              {[
                ["✓","Exclusive leads who completed a 14-question intent survey"],
                ["✓","Budget confirmed, timeline stated, jurisdiction selected"],
                ["✓","Global Mobility Score 0–100 before first contact"],
                ["✓","Decision-maker identified and motivation captured"],
                ["✓","Full Advisor Brief — you know exactly who you're calling"],
              ].map(([i, t], k) => (
                <div key={k} className="ba-item"><div className="ba-icon">{i}</div>{t}</div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5-STEP FORMULA */}
      <section className="formula-section" id="formula">
        <div className="wrap">
          <Reveal>
            <div className="formula-eyebrow"><span className="formula-eyebrow-line" />The 5-Step Formula</div>
            <h2 style={{ fontSize: "clamp(28px,3.8vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--black)", marginBottom: 14, maxWidth: 780 }}>
              The formula behind every<br /><span style={{ position: "relative", display: "inline-block" }}>qualified lead.<span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "0.32em", background: "var(--lime)", zIndex: -1, borderRadius: 2 }}></span></span>
            </h2>
            <p style={{ fontSize: 17, color: "var(--text2)", maxWidth: 580, lineHeight: 1.65, marginBottom: 0 }}>
              Five steps from first impression to dashboard delivery. Each step filters, qualifies, and enriches — so only serious prospects reach your firm.
            </p>
          </Reveal>

          {/* Pipeline */}
          <div className="formula-pipeline">
            <div className="formula-connector" />
            {[
              {n:"01",emoji:"🎬",name:"Attract",desc:"Short expert videos and paid campaigns reach investors and founders in 60+ countries.",badge:"60+ countries",active:false},
              {n:"02",emoji:"📥",name:"Capture",desc:"Webinar landing page captures intent and source data with full UTM attribution.",badge:"UTM tracked",active:false},
              {n:"03",emoji:"📋",name:"Qualify",desc:"14-question Global Mobility Survey collects budget, timeline, family, motivation, and jurisdiction.",badge:"14 questions",active:false},
              {n:"04",emoji:"📊",name:"Score",desc:"Global Mobility Score 0–100, HOT/WARM/COLD tier, plus intent verification for 40+ scores.",badge:"GMS 0–100",active:false},
              {n:"05",emoji:"📥",name:"Deliver",desc:"Matched lead appears in partner dashboard with Advisor Brief and contact unlock.",badge:"72h delivery",active:true},
            ].map((s, i) => (
              <Reveal key={i} delay={i * 80} className={`formula-step ${s.active ? "active" : ""}`}>
                <div className="formula-icon">{s.emoji}</div>
                <div className="formula-num">{s.n}</div>
                <div className="formula-step-name">{s.name}</div>
                <div className="formula-step-desc">{s.desc}</div>
                <div className="formula-badge">{s.badge}</div>
              </Reveal>
            ))}
          </div>

          {/* Visual result row */}
          <div className="formula-visuals">
            {[
              {label:"LinkedIn · Meta · Google · YouTube · Events",bg:"#1a1a1a",content:<div style={{display:"flex",gap:4}}>{["🎬","📱","💼","📹"].map((e,i)=><div key={i} style={{width:28,height:18,borderRadius:4,background:"#333",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>{e}</div>)}</div>},
              {label:"Landing page + pixel",bg:"var(--white)",content:<div style={{width:"80%",height:36,borderRadius:6,border:"1px solid var(--border)",background:"var(--off)",display:"flex",alignItems:"center",padding:"0 8px"}}><div style={{height:6,width:"60%",borderRadius:3,background:"var(--border)"}}></div></div>},
              {label:"14 Q survey",bg:"var(--white)",content:<div style={{display:"flex",flexDirection:"column",gap:3,width:"80%"}}>{[80,60,45].map((w,i)=><div key={i} style={{height:5,width:w+"%",borderRadius:3,background:"var(--border)"}}/>)}</div>},
              {label:"Score meter",bg:"#0A0A0A",content:<div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:900,color:"var(--lime)",letterSpacing:"-0.03em"}}>87</div><div style={{fontSize:9,color:"#555",marginTop:2}}>HOT</div></div>},
              {label:"Advisor Brief in dashboard",bg:"#0A0A0A",content:<div style={{display:"flex",flexDirection:"column",gap:3,width:"90%"}}>{[70,50,60,40].map((w,i)=><div key={i} style={{height:4,width:w+"%",borderRadius:2,background:i===0?"var(--lime)":"rgba(255,255,255,0.1)"}}/>)}</div>},
            ].map((v, i) => (
              <div key={i} className={`fv-card ${i === 4 ? "active" : ""}`} style={{ background: v.bg }}>
                {v.content}
                <div className="fv-stat" style={{ fontSize: 10, textAlign: "center", color: i === 4 ? "rgba(255,255,255,0.4)" : "var(--muted)" }}>{v.label}</div>
              </div>
            ))}
          </div>

          {/* Formula CTA bar */}
          <Reveal delay={200}>
            <div className="formula-cta-bar">
              <div className="formula-cta-text">
                <h4>Want to see what a real lead looks like?</h4>
                <p>Scroll down to see the live dashboard mockup — or apply for partner access.</p>
              </div>
              <div className="formula-cta-btns">
                <a href="#dashboard" className="btn-outline">See sample dashboard</a>
                <a href="/#apply" className="btn-dark">Apply for access →</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT MAKES A LEAD QUALIFIED */}
      <section className="qualified-section">
        <div className="wrap">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 24, height: 1, background: "#888", opacity: 0.4 }} />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888" }}>
              Lead Quality
            </div>
          </div>
          <div className="qualified-grid">
            <Reveal>
              <h2 style={{ fontSize: "clamp(26px,3.4vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--black)", marginBottom: 16, lineHeight: 1.1 }}>
                What makes a lead<br />qualified?
              </h2>
              <p style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.7, marginBottom: 28 }}>
                Every lead in your dashboard has cleared six criteria before you see their name. Not "interested". Not "clicked an ad". Genuinely ready.
              </p>
              <div style={{ background: "var(--off)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ fontSize: 22, flexShrink: 0 }}>📊</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--black)", marginBottom: 4 }}>Global Mobility Score</div>
                  <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.55 }}>Each criterion contributes to a 0–100 score. Only leads scoring 40+ reach the shared dashboard. Score 70+ are flagged HOT and prioritised.</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="qualified-checks">
                {QUALIFIED_CHECKS.map((q, i) => (
                  <div key={i} className="qcheck">
                    <div className="qcheck-icon">{q.icon}</div>
                    <div className="qcheck-body">
                      <div className="qcheck-h">{q.h}</div>
                      <div className="qcheck-p">{q.p}</div>
                      <div className="qcheck-tag">{q.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* AUDIENCE SOURCES */}
      <section className="sources-section">
        <div className="wrap">
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1, background: "#888", opacity: 0.4 }} />
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888" }}>Where leads come from</div>
            </div>
            <h2 style={{ fontSize: "clamp(26px,3.4vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--black)", marginBottom: 14 }}>
              Six acquisition channels.<br />One qualified dashboard.
            </h2>
            <p style={{ fontSize: 16, color: "var(--text2)", maxWidth: 580, lineHeight: 1.7, marginBottom: 0 }}>
              Leads enter the FBS funnel from multiple sources — all go through the same Global Mobility Survey before reaching your dashboard.
            </p>
          </Reveal>

          <div className="sources-grid">
            {SOURCES.map((s, i) => (
              <Reveal key={i} delay={i * 60} className="source-card">
                <div className="source-icon">{s.icon}</div>
                <div className="source-channel">{s.channel}</div>
                <div className="source-name">{s.name}</div>
                <div className="source-desc">{s.desc}</div>
                <div className="source-metric">📍 {s.metric}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD MOCKUP */}
      <section className="dashboard-section" id="dashboard">
        <div className="wrap">
          <Reveal>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 24, height: 1, background: "#555" }} />Partner Dashboard
            </div>
            <h2 style={{ fontSize: "clamp(26px,3.6vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--white)", marginBottom: 14, lineHeight: 1.05 }}>
              This is what you see<br />on day one.
            </h2>
            <p style={{ fontSize: 16, color: "#888", maxWidth: 560, lineHeight: 1.7 }}>
              Scored leads, matched to your jurisdiction, with Advisor Brief attached. Profile always visible. Contact details unlock with one credit.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="dashboard-mockup">
              {/* Chrome bar */}
              <div className="dashboard-chrome">
                <div className="db-dots">
                  <div className="db-dot" style={{ background: "#FF5F57" }} />
                  <div className="db-dot" style={{ background: "#FEBC2E" }} />
                  <div className="db-dot" style={{ background: "#28C840" }} />
                </div>
                <div className="db-title">FBS Intelligence — Partner Dashboard</div>
                <div className="db-actions">
                  <div className="db-action active">Lead Feed</div>
                  <div className="db-action">Analytics</div>
                  <div className="db-action">Settings</div>
                </div>
              </div>

              <div className="dashboard-body">
                {/* Sidebar */}
                <div className="db-sidebar">
                  <div className="db-nav-section">Navigation</div>
                  <div className="db-nav-item active"><span className="db-nav-icon">📥</span>Lead Feed</div>
                  <div className="db-nav-item"><span className="db-nav-icon">📊</span>Analytics</div>
                  <div className="db-nav-item"><span className="db-nav-icon">👤</span>ICP Profile</div>
                  <div className="db-nav-item"><span className="db-nav-icon">📋</span>Advisor Briefs</div>
                  <div className="db-nav-section">Account</div>
                  <div className="db-nav-item"><span className="db-nav-icon">⚙️</span>Settings</div>
                  <div className="db-nav-item"><span className="db-nav-icon">💳</span>Credits</div>
                  <div style={{ position: "absolute", bottom: 20, left: 16, right: 16 }}>
                    <div style={{ background: "rgba(170,255,69,0.08)", border: "1px solid rgba(170,255,69,0.2)", borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontSize: 11, color: "var(--lime)", fontWeight: 700, marginBottom: 4 }}>Credits remaining</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "var(--white)" }}>18</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>of 30 this month</div>
                    </div>
                  </div>
                </div>

                {/* Main */}
                <div className="db-main">
                  <div className="db-header-row">
                    <div className="db-page-title">Lead Feed</div>
                    <div className="db-filter-row">
                      {["ALL","HOT","WARM","COLD"].map(f => (
                        <div key={f} className={`db-filter ${activeFilter === f ? "active" : ""}`}
                          onClick={() => setActiveFilter(f)}>{f}</div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="db-stats">
                    {[
                      {val:"24",label:"Leads this month",lime:false},
                      {val:"9",label:"HOT (score 70+)",lime:true},
                      {val:"11",label:"WARM (40–69)",lime:false},
                      {val:"18",label:"Credits remaining",lime:false},
                    ].map((s,i) => (
                      <div key={i} className="db-stat">
                        <div className={`db-stat-val ${s.lime ? "lime" : ""}`}>{s.val}</div>
                        <div className="db-stat-label">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Lead rows */}
                  <div className="db-leads">
                    {/* Header row */}
                    <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 80px 90px 90px 100px 100px", gap: 12, padding: "0 18px", marginBottom: 4 }}>
                      {["","Lead","Score","Tier","Jurisdiction","Capital","Status"].map((h,i) => (
                        <div key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#444" }}>{h}</div>
                      ))}
                    </div>

                    {filteredLeads.map((lead, i) => (
                      <div key={i} className={`db-lead-row ${lead.tier.toLowerCase()}`}>
                        <div className="db-lead-avatar" style={{ background: lead.color }}>{lead.avatar}</div>
                        <div>
                          <div className="db-lead-name">{lead.name}</div>
                          <div className="db-lead-country">{lead.country}</div>
                        </div>
                        <div className="db-score">
                          <div className="db-score-num" style={{ color: lead.scoreColor }}>{lead.score}</div>
                          <div className="db-score-bar">
                            <div className="db-score-fill" style={{ width: lead.score + "%", background: lead.scoreColor }} />
                          </div>
                        </div>
                        <div>
                          <span className={`db-tier-badge ${lead.tierCls}`}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                            {lead.tier}
                          </span>
                        </div>
                        <div className="db-jur">{lead.jur}</div>
                        <div className="db-capital">{lead.capital}</div>
                        <div>
                          <span className={`db-status ${lead.statusCls}`}>{lead.statusTxt}</span>
                        </div>
                      </div>
                    ))}

                    {/* Unlock hint on first HOT lead */}
                    <div style={{ background: "rgba(170,255,69,0.04)", border: "1px dashed rgba(170,255,69,0.25)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 13, color: "#555" }}>🔒 Profile visible · Contact details locked</div>
                      <div className="db-lead-unlock">🔓 Unlock contact — 1 credit</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FULL FUNNEL DEEP DIVE */}
      <section className="funnel-section" id="funnel">
        <div className="wrap">
          <Reveal>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--lime-dark)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 24, height: 1, background: "var(--lime-dark)", opacity: 0.5 }} />Deep dive — All 6 stages
            </div>
            <h2 style={{ fontSize: "clamp(26px,3.4vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--black)", marginBottom: 14 }}>
              Six stages. Fully managed.<br /><span style={{ position: "relative", display: "inline-block" }}>You see results.<span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "0.32em", background: "var(--lime)", zIndex: -1, borderRadius: 2 }}></span></span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--text2)", maxWidth: 580, lineHeight: 1.7, marginBottom: 0 }}>
              Every stage is handled by FBS Intelligence. Partners only see prospects who are ready to talk.
            </p>
          </Reveal>

          <div className="funnel-steps">
            {FUNNEL_STEPS.map((s, i) => (
              <Reveal key={i} delay={i * 60} className="funnel-step">
                <div className={`funnel-step-icon ${i === 5 ? "final" : ""}`}>{s.emoji}</div>
                <div className="funnel-step-body">
                  <div className="funnel-step-num">STAGE {s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <div className="funnel-step-tags">
                    {s.tags.map((t, j) => <span key={j} className={`ftag ${t.cls || ""}`}>{t.t}</span>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bottom-cta">
        <div className="wrap">
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--lime)", color: "var(--black)", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 100, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--black)", display: "inline-block" }} />Selective Onboarding
            </div>
            <h2>Ready to receive leads<br />from this funnel?</h2>
            <p>One firm per jurisdiction. Apply and we'll review your profile within 24 hours.</p>
            <a href="/pricing" className="btn-lime">See pricing & apply →</a>
            <div style={{ marginTop: 16, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
              {["24h review","First leads in 7 days","Exclusive per jurisdiction"].map(t => (
                <span key={t} style={{ fontSize: 12, color: "#555", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "var(--lime)", fontWeight: 900 }}>✓</span> {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <footer style={{ background: "var(--black)", padding: "48px 0 32px", borderTop: "1px solid #1a1a1a" }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: "var(--white)" }}>
            <div style={{ width: 8, height: 8, background: "var(--lime)", borderRadius: "50%" }} />FBS Intelligence
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="/" style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>Home</a>
            <a href="/pricing" style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>Pricing</a>
            <a href="/overview" style={{ fontSize: 13, color: "#AAA", textDecoration: "none" }}>How it works</a>
          </div>
          <div style={{ fontSize: 12, color: "#444" }}>© 2026 Freedom Business Summit</div>
        </div>
      </footer>
    </>
  );
}
