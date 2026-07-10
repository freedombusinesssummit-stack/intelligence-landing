import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.1, once = true) {
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
  const [ref, inView] = useInView(0.08);
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

function AnimNum({ target, inView, suffix = "" }) {
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
  return <>{v}{suffix}</>;
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{
  --black:#0A0A0A;--off:#F4F4F2;--white:#FFFFFF;
  --lime:#AAFF45;--lime2:#8EE032;--lime-soft:#E8F5DF;--lime-dark:#5A8A20;
  --muted:#6B6B6B;--border:#E5E5E5;--dark:#0F0F0F;--text:#0A0A0A;--text2:#5A5A56;
  --warm-bg:#FFF9F0;--warm-border:#F5D9B0;--hot-color:#E05A3A;--warm-color:#C07D10;--cold-color:#4A7FC1;
}
html{scroll-behavior:smooth;}
body{background:var(--white);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
.wrap{max-width:1200px;margin:0 auto;padding:0 32px;}
@keyframes pulseLime{0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,0.5)}50%{box-shadow:0 0 0 10px rgba(170,255,69,0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes marquee-left{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pingDot{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.4);opacity:0}}
.fade-up{animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;}
.d1{animation-delay:0.05s}.d2{animation-delay:0.12s}.d3{animation-delay:0.2s}
.reveal{opacity:0;transform:translateY(24px);transition:opacity 0.75s cubic-bezier(0.16,1,0.3,1),transform 0.75s cubic-bezier(0.16,1,0.3,1);}
.reveal.is-in{opacity:1;transform:translateY(0);}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);}
.nav-progress{position:absolute;bottom:0;left:0;height:2px;background:var(--lime);transition:width 0.05s linear;}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:62px;}
.nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-0.02em;text-decoration:none;}
.nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:pulseLime 2.5s ease-in-out infinite;}
.nav-right{display:flex;align-items:center;gap:24px;}
.nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);text-decoration:none;transition:color 0.15s;}
.nav-link:hover{color:var(--black);}
.nav-btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--black);color:var(--white);border:none;cursor:pointer;padding:9px 20px;border-radius:7px;font-family:'Inter',sans-serif;transition:all 0.15s;text-decoration:none;}
.nav-btn:hover{background:var(--lime);color:var(--black);}

/* HERO */
.hero{padding:130px 0 80px;background:var(--white);border-bottom:1px solid var(--border);position:relative;overflow:hidden;}
.hero-grid-bg{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,0.04) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);pointer-events:none;}
.hero>.wrap{position:relative;z-index:2;}
.hero-pill{display:inline-flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--border);border-radius:100px;padding:5px 14px 5px 6px;margin-bottom:28px;font-size:12px;font-weight:500;color:var(--text);}
.hero-pill-dot{background:var(--lime);color:var(--black);font-size:10px;font-weight:800;padding:3px 10px;border-radius:100px;letter-spacing:0.08em;text-transform:uppercase;}
.hero h1{font-size:clamp(38px,5vw,68px);font-weight:800;line-height:1.02;letter-spacing:-0.035em;color:var(--black);max-width:900px;margin-bottom:8px;}
.accent{position:relative;display:inline-block;}.accent::after{content:'';position:absolute;bottom:0;left:0;right:0;height:0.32em;background:var(--lime);z-index:-1;border-radius:2px;}
.hero-sub{font-size:clamp(22px,3vw,40px);font-weight:800;line-height:1.08;letter-spacing:-0.03em;color:#C0C0BC;margin-bottom:28px;max-width:900px;}
.hero-desc{font-size:18px;line-height:1.65;color:var(--text2);max-width:580px;}
.stats-strip{display:flex;gap:0;padding-top:48px;margin-top:48px;border-top:1px solid var(--border);}
.stat-item{flex:1;padding-right:28px;border-right:1px solid var(--border);margin-right:28px;}
.stat-item:last-child{border-right:none;margin-right:0;padding-right:0;}
.stat-num{font-size:36px;font-weight:800;letter-spacing:-0.03em;color:var(--black);line-height:1;margin-bottom:6px;}
.stat-label{font-size:13px;color:var(--text2);line-height:1.45;}

/* MARQUEE */
.marquee-wrap{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--off);padding:13px 0;}
.marquee-track{display:flex;white-space:nowrap;animation:marquee-left 50s linear infinite;}
.marquee-item{font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text2);padding:0 24px;}
.marquee-dot{color:var(--lime);}

/* ═══ DEDICATED FUNNEL SECTION ═══ */
.funnel-hero-section{padding:96px 0;background:var(--off);border-bottom:1px solid var(--border);}
.funnel-hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;margin-top:48px;}

.funnel-steps-list{display:flex;flex-direction:column;gap:0;position:relative;}
.funnel-steps-list::before{content:'';position:absolute;left:19px;top:20px;bottom:20px;width:2px;background:linear-gradient(to bottom,var(--lime),rgba(170,255,69,0.4),rgba(170,255,69,0.1));z-index:0;}
.fstep{display:flex;align-items:flex-start;gap:20px;padding:16px 0;position:relative;z-index:1;}
.fstep-num{width:40px;height:40px;border-radius:12px;background:var(--white);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:var(--black);flex-shrink:0;position:relative;z-index:2;transition:all 0.25s;}
.fstep:hover .fstep-num{background:var(--lime);border-color:var(--lime);}
.fstep-body{}
.fstep-title{font-size:15px;font-weight:700;color:var(--black);margin-bottom:3px;padding-top:9px;}
.fstep-desc{font-size:13px;color:var(--text2);line-height:1.6;}
.fstep-tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--lime-dark);margin-top:4px;}

.funnel-hero-visual{position:relative;}
.fhv-card{background:var(--white);border:1px solid var(--border);border-radius:18px;padding:28px;box-shadow:0 16px 48px -8px rgba(0,0,0,0.1);animation:float 7s ease-in-out infinite;}
.fhv-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.fhv-label{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);}
.fhv-live{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--hot-color);}
.fhv-live-dot{width:7px;height:7px;border-radius:50%;background:var(--hot-color);animation:pulseLime2 1.5s infinite;}
@keyframes pulseLime2{0%,100%{opacity:1}50%{opacity:0.4}}
.fhv-jurisdiction{background:var(--lime-soft);border:1px solid rgba(170,255,69,0.3);border-radius:10px;padding:14px 16px;margin-bottom:16px;}
.fhv-jur-label{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:4px;}
.fhv-jur-val{font-size:18px;font-weight:800;color:var(--black);}
.fhv-metrics{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
.fhv-metric{background:var(--off);border-radius:8px;padding:12px;}
.fhv-metric-val{font-size:20px;font-weight:800;color:var(--black);letter-spacing:-0.02em;}
.fhv-metric-lbl{font-size:11px;color:var(--muted);margin-top:2px;}
.fhv-mini-leads{display:flex;flex-direction:column;gap:8px;margin-top:16px;}
.fhv-lead{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--off);border-radius:8px;}
.fhv-av{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--white);flex-shrink:0;}
.fhv-ln{font-size:13px;font-weight:600;color:var(--black);flex:1;}
.fhv-score{font-size:13px;font-weight:800;color:var(--hot-color);}
.fhv-new{font-size:10px;font-weight:700;color:var(--lime-dark);background:var(--lime-soft);padding:2px 8px;border-radius:100px;}

/* ═══ 5-STEP FORMULA ═══ */
.formula-section{padding:96px 0;background:var(--white);border-bottom:1px solid var(--border);}
.formula-pipeline{display:grid;grid-template-columns:repeat(5,1fr);gap:0;margin-top:56px;position:relative;}
.formula-connector{position:absolute;top:50px;left:10%;right:10%;height:2px;background:linear-gradient(to right,var(--lime),var(--lime2),rgba(170,255,69,0.4),rgba(170,255,69,0.15),rgba(170,255,69,0.05));z-index:0;}
.formula-step{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;position:relative;z-index:1;}
.formula-step:hover .formula-icon{border-color:var(--lime);box-shadow:0 0 0 8px rgba(170,255,69,0.12);transform:scale(1.06);}
.formula-icon{width:100px;height:100px;border-radius:24px;background:var(--white);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:36px;margin-bottom:20px;transition:all 0.3s;position:relative;z-index:2;box-shadow:0 4px 14px rgba(0,0,0,0.06);}
.formula-step.last-step .formula-icon{background:var(--black);border-color:var(--black);}
.formula-num{font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:8px;}
.formula-name{font-size:17px;font-weight:800;color:var(--black);letter-spacing:-0.02em;margin-bottom:6px;}
.formula-desc{font-size:12px;color:var(--text2);line-height:1.55;max-width:155px;margin:0 auto 12px;}
.formula-badge{display:inline-flex;align-items:center;font-size:11px;font-weight:700;padding:4px 10px;border-radius:100px;border:1px solid var(--border);background:var(--off);color:var(--black);}
.formula-step.last-step .formula-badge{background:var(--lime);border-color:var(--lime);}

/* ═══ GMS / LEAD QUALITY ═══ */
.gms-section{padding:96px 0;background:var(--off);border-bottom:1px solid var(--border);}
.gms-top-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;margin-top:48px;}

/* survey mockup */
.gms-survey-card{background:var(--white);border:1px solid var(--border);border-radius:18px;overflow:hidden;box-shadow:0 16px 48px -8px rgba(0,0,0,0.1);}
.gms-survey-chrome{background:#F5F4F0;padding:11px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border);}
.gms-dots{display:flex;gap:5px;}
.gms-dot{width:10px;height:10px;border-radius:50%;}
.gms-url{flex:1;text-align:center;font-size:11px;color:#999;background:var(--white);padding:4px 14px;border-radius:6px;max-width:260px;margin:0 auto;border:1px solid var(--border);}
.gms-body{padding:24px 28px;}
.gms-progress-row{display:flex;align-items:center;gap:10px;margin-bottom:20px;}
.gms-prog-track{flex:1;height:4px;background:var(--off);border-radius:2px;overflow:hidden;}
.gms-prog-fill{height:100%;background:var(--lime);border-radius:2px;}
.gms-prog-lbl{font-size:11px;font-weight:600;color:var(--muted);white-space:nowrap;}
.gms-q{font-size:17px;font-weight:700;color:var(--black);margin-bottom:16px;line-height:1.35;letter-spacing:-0.01em;}
.gms-options{display:flex;flex-direction:column;gap:8px;}
.gms-option{border:1.5px solid var(--border);border-radius:9px;padding:12px 16px;font-size:13px;color:var(--text);cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:10px;font-family:'Inter',sans-serif;background:none;}
.gms-option:hover{border-color:var(--black);}
.gms-option.sel{border-color:var(--lime);background:var(--lime-soft);}
.gms-option-check{width:17px;height:17px;border-radius:50%;border:1.5px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;}
.gms-option.sel .gms-option-check{background:var(--lime);border-color:var(--lime);color:var(--black);}
.gms-footer{display:flex;justify-content:space-between;align-items:center;margin-top:18px;padding-top:16px;border-top:1px solid var(--border);}
.gms-back{font-size:13px;color:var(--muted);background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;}
.gms-next{background:var(--black);color:var(--white);border:none;padding:10px 24px;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;}
.gms-next:hover{background:var(--lime);color:var(--black);}

/* scoring result */
.gms-score-card{background:var(--dark);border-radius:14px;padding:24px;margin-top:14px;text-align:center;}
.gms-score-label{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#666;margin-bottom:12px;}
.gms-score-num{font-size:68px;font-weight:900;letter-spacing:-0.04em;color:var(--lime);line-height:1;}
.gms-score-sub{font-size:13px;color:rgba(255,255,255,0.4);margin-top:6px;}
.gms-score-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(224,90,58,0.15);color:#FF6B55;font-size:12px;font-weight:700;padding:7px 16px;border-radius:100px;margin-top:12px;border:1px solid rgba(224,90,58,0.3);}

/* 6 dimensions */
.gms-dims-col{display:flex;flex-direction:column;gap:0;}
.gms-dim-intro{font-size:15px;color:var(--text2);line-height:1.7;margin-bottom:28px;}
.gms-dim{display:flex;align-items:flex-start;gap:14px;padding:16px 0;border-bottom:1px solid var(--border);}
.gms-dim:last-child{border-bottom:none;}
.gms-dim-num{font-size:11px;font-weight:700;color:var(--lime-dark);min-width:28px;padding-top:2px;}
.gms-dim-body{flex:1;}
.gms-dim-h{font-size:14px;font-weight:700;color:var(--black);margin-bottom:2px;}
.gms-dim-p{font-size:12px;color:var(--text2);line-height:1.5;}
.gms-dim-bar{display:flex;align-items:center;gap:8px;margin-top:6px;}
.gms-dim-track{flex:1;height:3px;background:var(--border);border-radius:2px;overflow:hidden;}
.gms-dim-fill{height:100%;border-radius:2px;background:var(--lime);}
.gms-dim-pct{font-size:10px;font-weight:700;color:var(--lime-dark);}

/* tiers */
.tiers-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px;}
.tier-card{border-radius:14px;padding:24px;transition:all 0.2s;}
.tier-card:hover{transform:translateY(-3px);}
.tier-card.hot{background:var(--black);border:1px solid #1a1a1a;}
.tier-card.warm{background:var(--warm-bg);border:1px solid var(--warm-border);}
.tier-card.cold{background:var(--off);border:1px solid var(--border);}
.tier-badge-row{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:800;letter-spacing:0.1em;margin-bottom:14px;}
.tier-badge-dot{width:8px;height:8px;border-radius:50%;}
.tier-range{font-size:34px;font-weight:900;letter-spacing:-0.03em;line-height:1;margin-bottom:4px;}
.tier-card.hot .tier-range{color:var(--lime);}
.tier-card.warm .tier-range{color:var(--warm-color);}
.tier-card.cold .tier-range{color:var(--cold-color);}
.tier-sublabel{font-size:12px;color:var(--muted);margin-bottom:12px;}
.tier-card.hot .tier-sublabel{color:#888;}
.tier-desc{font-size:13px;line-height:1.6;color:var(--muted);}
.tier-card.hot .tier-desc{color:rgba(255,255,255,0.55);}

/* ═══ DASHBOARD MOCKUP ═══ */
.dashboard-section{padding:96px 0;background:var(--white);border-bottom:1px solid var(--border);}
.db-wrapper{margin-top:48px;border-radius:20px;overflow:hidden;box-shadow:0 24px 72px -16px rgba(0,0,0,0.18),0 0 0 1px rgba(0,0,0,0.06);background:var(--white);}

/* mac chrome */
.db-chrome{background:#EBEBEB;padding:13px 20px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #D5D5D5;}
.db-chrome-dots{display:flex;gap:6px;}
.db-chrome-dot{width:12px;height:12px;border-radius:50%;}
.db-chrome-url{flex:1;text-align:center;}
.db-chrome-url-inner{display:inline-flex;align-items:center;gap:8px;background:var(--white);border:1px solid #D5D5D5;border-radius:8px;padding:5px 16px;font-size:12px;color:#888;min-width:280px;}
.db-chrome-lock{font-size:11px;}

/* dashboard inner */
.db-inner{background:#FAFAF9;min-height:600px;}
.db-header{padding:28px 32px 20px;border-bottom:1px solid var(--border);background:var(--white);display:flex;align-items:flex-start;justify-content:space-between;}
.db-greeting{font-size:22px;font-weight:800;color:var(--black);margin-bottom:4px;letter-spacing:-0.02em;}
.db-greeting span{color:var(--lime-dark);}
.db-sub{font-size:14px;color:var(--text2);}
.db-sub strong{color:var(--hot-color);}
.db-review-btn{background:var(--black);color:var(--white);border:none;padding:12px 24px;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;display:flex;align-items:center;gap:8px;flex-shrink:0;}

/* stat cards */
.db-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-bottom:1px solid var(--border);}
.db-stat-card{padding:20px 24px;border-right:1px solid var(--border);background:var(--white);}
.db-stat-card:last-child{border-right:none;}
.db-stat-cat{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;}
.db-stat-val{font-size:28px;font-weight:900;letter-spacing:-0.03em;color:var(--black);margin-bottom:4px;}
.db-stat-desc{font-size:12px;color:var(--muted);}
.db-stat-change{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:700;color:#2A8A3A;margin-top:6px;}

/* leads table */
.db-table-section{padding:24px 32px;}
.db-table-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.db-table-title{font-size:16px;font-weight:700;color:var(--black);}
.db-filter-group{display:flex;gap:0;background:var(--off);border:1px solid var(--border);border-radius:8px;overflow:hidden;}
.db-filter-btn{padding:7px 14px;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;border:none;background:none;font-family:'Inter',sans-serif;transition:all 0.15s;}
.db-filter-btn.active{background:var(--black);color:var(--white);}
.db-filter-btn .dot{width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:5px;}

.db-table{width:100%;border-collapse:collapse;background:var(--white);border:1px solid var(--border);border-radius:12px;overflow:hidden;}
.db-th{padding:10px 14px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);background:#FAFAF9;border-bottom:1px solid var(--border);}
.db-tr{border-bottom:1px solid var(--border);transition:background 0.15s;cursor:pointer;}
.db-tr:last-child{border-bottom:none;}
.db-tr:hover{background:#FAFAF9;}
.db-td{padding:14px 14px;font-size:13px;color:var(--text);}

.db-lead-cell{display:flex;align-items:center;gap:12px;}
.db-av{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:var(--white);flex-shrink:0;}
.db-lname{font-size:14px;font-weight:600;color:var(--black);}
.db-ltime{font-size:11px;color:var(--muted);}

.db-tier-tag{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:800;padding:4px 10px;border-radius:6px;letter-spacing:0.04em;}
.tt-hot{background:#FFF0ED;color:var(--hot-color);}
.tt-warm{background:var(--warm-bg);color:var(--warm-color);}
.tt-cold{background:#EEF4FF;color:var(--cold-color);}

.db-score-cell{display:flex;align-items:baseline;gap:4px;}
.db-score-big{font-size:16px;font-weight:800;color:var(--black);}
.db-score-denom{font-size:11px;color:var(--muted);}

.db-status-tag{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:4px 10px;border-radius:6px;}
.st-new{color:#2A8A3A;}.st-new::before{content:'•';margin-right:2px;}
.st-contacted{color:var(--muted);}.st-contacted::before{content:'✓';margin-right:2px;}
.st-reached{background:#E8F5E0;color:#2A6A1A;border:1px solid #B8DFA8;}

/* ═══ FUNNEL DEEP DIVE ═══ */
.deepdive-section{padding:96px 0;background:var(--off);border-bottom:1px solid var(--border);}
.deepdive-steps{display:flex;flex-direction:column;gap:0;margin-top:56px;position:relative;}
.deepdive-steps::before{content:'';position:absolute;left:39px;top:40px;bottom:40px;width:2px;background:linear-gradient(to bottom,var(--lime),var(--lime2),rgba(170,255,69,0.2));z-index:0;}
.deepdive-step{display:grid;grid-template-columns:80px 1fr;gap:32px;align-items:flex-start;position:relative;z-index:1;padding-bottom:40px;}
.deepdive-step:last-child{padding-bottom:0;}
.deepdive-icon{width:80px;height:80px;border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;border:2px solid var(--border);background:var(--white);transition:all 0.3s;position:relative;z-index:2;}
.deepdive-step:hover .deepdive-icon{border-color:var(--lime);box-shadow:0 0 0 6px rgba(170,255,69,0.12);}
.deepdive-icon.final{background:var(--black);border-color:var(--black);}
.deepdive-body{padding-top:16px;}
.deepdive-num{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:8px;}
.deepdive-step h3{font-size:22px;font-weight:800;letter-spacing:-0.02em;color:var(--black);margin-bottom:10px;line-height:1.2;}
.deepdive-step p{font-size:15px;color:var(--text2);line-height:1.7;max-width:560px;margin-bottom:16px;}
.step-tags{display:flex;flex-wrap:wrap;gap:8px;}
.stag{display:inline-flex;align-items:center;font-size:12px;font-weight:600;padding:5px 12px;border-radius:100px;background:var(--white);color:var(--text2);border:1px solid var(--border);}
.stag.lime{background:var(--lime-soft);color:var(--lime-dark);border-color:rgba(170,255,69,0.3);}
.stag.dark{background:var(--black);color:var(--white);border-color:var(--black);}

/* BOTTOM CTA */
.bottom-cta{padding:96px 0;background:var(--dark);position:relative;overflow:hidden;text-align:center;}
.bottom-cta::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:400px;background:radial-gradient(ellipse at center,rgba(170,255,69,0.18),transparent 60%);filter:blur(60px);pointer-events:none;}
.bottom-cta>.wrap{position:relative;z-index:2;}
.bottom-cta h2{font-size:clamp(30px,4vw,48px);font-weight:800;letter-spacing:-0.03em;color:var(--white);margin-bottom:14px;line-height:1.08;}
.bottom-cta p{font-size:17px;color:#888;max-width:460px;margin:0 auto 32px;line-height:1.65;}
.btn-lime{background:var(--lime);color:var(--black);border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:15px;font-weight:800;padding:18px 40px;border-radius:10px;transition:all 0.2s;display:inline-block;text-decoration:none;}
.btn-lime:hover{transform:translateY(-2px);box-shadow:0 16px 40px -8px rgba(170,255,69,0.5);}

/* section eyebrow */
.eyebrow{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:16px;display:flex;align-items:center;gap:10px;}
.eyebrow-line{width:24px;height:1px;background:currentColor;opacity:0.4;}
.eyebrow.lime{color:var(--lime-dark);}
.sh2{font-size:clamp(26px,3.6vw,44px);font-weight:800;letter-spacing:-0.03em;line-height:1.08;color:var(--black);margin-bottom:14px;max-width:800px;}
.sh2 .hl{position:relative;display:inline-block;}
.sh2 .hl::after{content:'';position:absolute;bottom:0;left:0;right:0;height:0.32em;background:var(--lime);z-index:-1;border-radius:2px;}
.sp{font-size:16px;color:var(--text2);max-width:580px;line-height:1.7;margin-bottom:0;}

@media(max-width:1024px){
  .funnel-hero-grid{grid-template-columns:1fr;}
  .gms-top-grid{grid-template-columns:1fr;}
  .formula-pipeline{grid-template-columns:1fr 1fr;gap:24px;}
  .formula-connector{display:none;}
  .tiers-row{grid-template-columns:1fr 1fr;}
  .db-stats{grid-template-columns:1fr 1fr;}
}
@media(max-width:768px){
  .formula-pipeline{grid-template-columns:1fr;}
  .tiers-row{grid-template-columns:1fr;}
  .stats-strip{flex-wrap:wrap;}
  .stat-item{flex:1 1 calc(50% - 12px);border-right:none;}
  .deepdive-step{grid-template-columns:60px 1fr;gap:16px;}
  .deepdive-icon{width:60px;height:60px;font-size:22px;}
  .deepdive-steps::before{left:29px;}
  .db-stats{grid-template-columns:1fr 1fr;}
  .wrap{padding:0 20px;}
}
`;

const GMS_DIMS = [
  {n:"01",h:"Budget confirmation",p:"Deployable capital, not aspiration.",w:20},
  {n:"02",h:"Decision timeline",p:"3 months, 12 months, or 'someday'.",w:20},
  {n:"03",h:"Jurisdiction specificity",p:"Specific programme vs. still comparing.",w:15},
  {n:"04",h:"Primary motivation",p:"Tax, political risk, passport, lifestyle.",w:15},
  {n:"05",h:"Family complexity",p:"Solo, couple, or multi-generational.",w:15},
  {n:"06",h:"Decision authority",p:"Sole decision-maker or consensus.",w:15},
];

const GMS_OPTIONS = ["Within 3 months — we're ready","Within 6 months","Within 12 months","Still researching"];

const DEEPDIVE_STEPS = [
  {n:"01",e:"🎬",t:"Video Series",b:"Short expert videos on global mobility, second passports, and tax optimisation — distributed on LinkedIn, YouTube, and through paid Meta/Google campaigns targeting your exact ICP and jurisdiction.",tags:[{t:"LinkedIn"},{t:"YouTube",c:"lime"},{t:"Meta Ads",c:"lime"},{t:"Google Ads"}]},
  {n:"02",e:"📅",t:"Webinar Invitation",b:"Each video ends with an invitation to a free mini-webinar. A dedicated landing page captures registrations with full analytics from day one: Meta Pixel, GTM, UTM tracking.",tags:[{t:"Landing page",c:"lime"},{t:"Meta Pixel"},{t:"Google Analytics"},{t:"UTM tracking",c:"dark"}]},
  {n:"03",e:"📋",t:"Global Mobility Survey",b:"Every registrant completes the 14-question Global Mobility Survey before joining the webinar. Budget, timeline, family situation, motivation, jurisdiction. Without completing the survey, no lead enters the system.",tags:[{t:"14 questions",c:"lime"},{t:"Budget"},{t:"Timeline"},{t:"Jurisdiction"}]},
  {n:"04",e:"📊",t:"Scoring & Verification",b:"Each response is scored 0–100 across 6 dimensions. HOT (70+), WARM (40–69), COLD (0–39). Score 40+ leads go through intent verification — confirming decision authority and readiness before they reach your dashboard.",tags:[{t:"GMS 0–100",c:"dark"},{t:"6 dimensions"},{t:"HOT / WARM / COLD",c:"lime"},{t:"Verification"}]},
  {n:"05",e:"📥",t:"Dashboard Delivery",b:"Qualified, verified leads appear in your dashboard matched to your jurisdiction. Each includes a full Advisor Brief. Profile is always visible. Contact details — email and phone — unlock with one credit.",tags:[{t:"Jurisdiction matched",c:"dark"},{t:"Advisor Brief",c:"lime"},{t:"1 credit = contact"}]},
];

const DB_LEADS = [
  {av:"JM",bg:"#D94F3A",name:"J. Marchetti",time:"12 min ago",country:"🇮🇹 Italy",tier:"HOT",tc:"tt-hot",score:87,prog:"St. Kitts CBI",status:"New",sc:"st-new"},
  {av:"RK",bg:"#3A6DD9",name:"R. Kapoor",time:"34 min ago",country:"🇮🇳 India",tier:"HOT",tc:"tt-hot",score:79,prog:"Portugal Golden Visa",status:"New",sc:"st-new"},
  {av:"SO",bg:"#8B5CF6",name:"S. Olusegun",time:"1 hr ago",country:"🇳🇬 Nigeria",tier:"WARM",tc:"tt-warm",score:58,prog:"Grenada CBI",status:"Contacted",sc:"st-contacted"},
  {av:"DH",bg:"#059669",name:"D. Harrison",time:"2 hr ago",country:"🇺🇸 USA",tier:"HOT",tc:"tt-hot",score:73,prog:"Malta MEIN",status:"Reached",sc:"st-reached"},
  {av:"ED",bg:"#C07D10",name:"E. Dubois",time:"3 hr ago",country:"🇫🇷 France",tier:"WARM",tc:"tt-warm",score:52,prog:"Malta MEIN",status:"New",sc:"st-new"},
];

export default function Overview() {
  const [selOpt, setSelOpt] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const scrollY = useScrollY();
  const [statsRef, statsInView] = useInView(0.3);
  const docH = typeof document !== "undefined" ? Math.max(document.documentElement.scrollHeight - window.innerHeight, 1) : 1;
  const progress = Math.min((scrollY / docH) * 100, 100);
  const filtered = activeFilter === "All" ? DB_LEADS : DB_LEADS.filter(l => l.tier === activeFilter.toUpperCase());

  return (<><style>{css}</style>

    {/* NAV */}
    <nav>
      <div className="wrap nav-inner">
        <a href="/" className="nav-logo"><div className="nav-logo-dot"/>FBS Intelligence</a>
        <div className="nav-right">
          <a href="/" className="nav-link">Home</a>
          <a href="/pricing" className="nav-link">Pricing</a>
          <a href="/overview" className="nav-link" style={{color:"var(--black)",fontWeight:700}}>How it works</a>
          <a href="/#apply" className="nav-btn">Apply</a>
        </div>
      </div>
      <div className="nav-progress" style={{width:progress+"%"}}/>
    </nav>

    {/* HERO */}
    <section className="hero">
      <div className="hero-grid-bg"/>
      <div className="wrap">
        <div className="hero-pill fade-up"><span className="hero-pill-dot">How it works</span>Platform Overview</div>
        <h1 className="fade-up d1">A dedicated funnel.<br/><span className="accent">Qualified leads only.</span></h1>
        <div className="hero-sub fade-up d2">Built for your firm. Your jurisdiction. Your ICP.</div>
        <p className="hero-desc fade-up d3">FBS Intelligence builds and runs a complete lead acquisition funnel for each partner — from video ads to survey to scoring to verified intent. You receive leads who are ready to talk.</p>
        <div className="stats-strip" ref={statsRef}>
          {[{n:5,s:"",l:"Steps from ad\nto dashboard"},{n:14,s:" Q",l:"Survey questions\nper lead"},{n:92,s:"%",l:"Verification\ncompletion rate"},{n:72,s:"h",l:"Survey to\ndashboard"}].map((s,i)=>(
            <div key={i} className="stat-item">
              <div className="stat-num"><AnimNum target={s.n} inView={statsInView} suffix={s.s}/></div>
              <div className="stat-label" style={{whiteSpace:"pre-line"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* MARQUEE */}
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...Array(2)].flatMap((_,k)=>["Dedicated Funnel","Your Jurisdiction","Video Ads","Webinar","GMS Survey","Intent Scoring","Verification","Dashboard Delivery","Advisor Brief","Exclusive Leads","HOT · WARM · COLD"].map((t,i)=>(
          <span key={`${k}-${i}`} className="marquee-item">{t} <span className="marquee-dot">·</span></span>
        )))}
      </div>
    </div>

    {/* DEDICATED FUNNEL SECTION */}
    <section className="funnel-hero-section" id="funnel">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow lime"><span className="eyebrow-line"/>What we build for you</div>
          <h2 className="sh2">We build the funnel.<br/>You <span className="hl">receive the leads.</span></h2>
          <p className="sp">Before the first lead reaches your dashboard, FBS Intelligence completes seven steps on your behalf — from understanding your offer to delivering verified prospects matched to your jurisdiction.</p>
        </Reveal>

        <div className="funnel-hero-grid">
          <Reveal delay={80}>
            <div className="funnel-steps-list">
              {[
                {n:"01",t:"We learn your offer",d:"Discovery call: your jurisdiction, programme, target client profile, and what a qualified lead looks like for your firm.",tag:"Onboarding"},
                {n:"02",t:"We define your ICP",d:"Based on your input, we build an Ideal Client Profile — capital range, geography, motivation, decision timeline.",tag:"Strategy"},
                {n:"03",t:"We run video ads",d:"Sponsored video content on Meta, Instagram, LinkedIn and YouTube targeting your exact ICP in relevant markets.",tag:"Acquisition"},
                {n:"04",t:"We host a webinar",d:"Interested prospects register for a mini-webinar series on global mobility. Registration captures full UTM attribution.",tag:"Registration"},
                {n:"05",t:"We qualify via survey",d:"Every registrant completes the 14-question Global Mobility Survey. Budget, timeline, family, jurisdiction, motivation.",tag:"Qualification"},
                {n:"06",t:"We score and verify",d:"Each response is scored 0–100 on 6 dimensions. Score 40+ leads go through intent verification before entering your feed.",tag:"Scoring"},
                {n:"07",t:"Leads appear in your dashboard",d:"Matched, scored, verified leads with a full Advisor Brief — ready for you to contact.",tag:"Delivery"},
              ].map((s,i)=>(
                <div key={i} className="fstep">
                  <div className="fstep-num">{s.n}</div>
                  <div className="fstep-body">
                    <div className="fstep-title">{s.t}</div>
                    <div className="fstep-desc">{s.d}</div>
                    <div className="fstep-tag">{s.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="funnel-hero-visual">
              <div className="fhv-card">
                <div className="fhv-top">
                  <div className="fhv-label">Your Partner Setup</div>
                  <div className="fhv-live"><div className="fhv-live-dot"/>Live feed active</div>
                </div>
                <div className="fhv-jurisdiction">
                  <div className="fhv-jur-label">Primary jurisdiction</div>
                  <div className="fhv-jur-val">Malta MEIN · St. Kitts CBI</div>
                </div>
                <div className="fhv-metrics">
                  <div className="fhv-metric"><div className="fhv-metric-val">24</div><div className="fhv-metric-lbl">Leads this month</div></div>
                  <div className="fhv-metric"><div className="fhv-metric-val" style={{color:"var(--hot-color)"}}>9</div><div className="fhv-metric-lbl">HOT tier</div></div>
                  <div className="fhv-metric"><div className="fhv-metric-val">18</div><div className="fhv-metric-lbl">Credits left</div></div>
                </div>
                <div className="fhv-mini-leads">
                  {[{av:"JM",bg:"#D94F3A",n:"J. Marchetti",s:87},{av:"DH",bg:"#059669",n:"D. Harrison",s:73},{av:"ED",bg:"#C07D10",n:"E. Dubois",s:52}].map((l,i)=>(
                    <div key={i} className="fhv-lead">
                      <div className="fhv-av" style={{background:l.bg}}>{l.av}</div>
                      <div className="fhv-ln">{l.n}</div>
                      <div className="fhv-score">{l.s}</div>
                      {i===0&&<div className="fhv-new">New</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    {/* 5-STEP FORMULA */}
    <section className="formula-section">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow lime"><span className="eyebrow-line"/>The 5-Step Formula</div>
          <h2 className="sh2">From ad impression to<br/><span className="hl">qualified lead in dashboard.</span></h2>
          <p className="sp">Five steps, all managed by FBS Intelligence. Each step filters, qualifies, and enriches — so only serious prospects matched to your jurisdiction reach your firm.</p>
        </Reveal>

        <div className="formula-pipeline">
          <div className="formula-connector"/>
          {[
            {n:"01",e:"🎬",name:"Attract",desc:"Sponsored video targeting your exact ICP and jurisdiction across Meta, LinkedIn and YouTube.",badge:"Your ICP targeted",last:false},
            {n:"02",e:"📥",name:"Capture",desc:"Webinar registration page with UTM attribution and pixel tracking from day one.",badge:"UTM tracked",last:false},
            {n:"03",e:"📋",name:"Qualify",desc:"14-question Global Mobility Survey: budget, timeline, family, motivation and jurisdiction interest.",badge:"14 questions",last:false},
            {n:"04",e:"📊",name:"Score",desc:"Global Mobility Score 0–100 across 6 dimensions. Intent verification for all 40+ scores.",badge:"GMS 0–100",last:false},
            {n:"05",e:"📥",name:"Deliver",desc:"Matched lead in your dashboard with a full Advisor Brief. Profile visible, contact unlocks with 1 credit.",badge:"72h delivery",last:true},
          ].map((s,i)=>(
            <Reveal key={i} delay={i*70} className={`formula-step ${s.last?"last-step":""}`}>
              <div className="formula-icon">{s.e}</div>
              <div className="formula-num">{s.n}</div>
              <div className="formula-name">{s.name}</div>
              <div className="formula-desc">{s.desc}</div>
              <div className="formula-badge">{s.badge}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* GMS / LEAD QUALITY */}
    <section className="gms-section" id="scoring">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow lime"><span className="eyebrow-line"/>Lead Scoring & Verification</div>
          <h2 className="sh2">How we score leads before<br/><span className="hl">they reach you.</span></h2>
          <p className="sp">Every registrant completes a 14-question survey. Their answers are scored across 6 dimensions to produce a Global Mobility Score (0–100). Only leads scoring 40+ pass to verification — and only verified leads reach your dashboard.</p>
        </Reveal>

        <div className="gms-top-grid">
          <Reveal delay={80}>
            <div>
              <div className="gms-survey-card">
                <div className="gms-survey-chrome">
                  <div className="gms-dots">
                    <div className="gms-dot" style={{background:"#FF5F57"}}/>
                    <div className="gms-dot" style={{background:"#FEBC2E"}}/>
                    <div className="gms-dot" style={{background:"#28C840"}}/>
                  </div>
                  <div className="gms-url">survey.fbsintelligence.com</div>
                </div>
                <div className="gms-body">
                  <div className="gms-progress-row">
                    <div className="gms-prog-track"><div className="gms-prog-fill" style={{width:"57%"}}/></div>
                    <div className="gms-prog-lbl">Question 8 of 14</div>
                  </div>
                  <div className="gms-q">What is your target timeline for obtaining residency or citizenship?</div>
                  <div className="gms-options">
                    {GMS_OPTIONS.map((opt,i)=>(
                      <button key={i} className={`gms-option ${selOpt===i?"sel":""}`} onClick={()=>setSelOpt(i)}>
                        <div className="gms-option-check">{selOpt===i?"✓":""}</div>{opt}
                      </button>
                    ))}
                  </div>
                  <div className="gms-footer">
                    <button className="gms-back">← Back</button>
                    <button className="gms-next">Next →</button>
                  </div>
                </div>
              </div>
              <div className="gms-score-card">
                <div className="gms-score-label">Global Mobility Score</div>
                <div className="gms-score-num">87</div>
                <div className="gms-score-sub">Out of 100 · 6 dimensions scored</div>
                <div className="gms-score-badge">
                  <span style={{width:7,height:7,borderRadius:"50%",background:"#FF6B55",display:"inline-block",flexShrink:0}}/>
                  HOT — Verified & ready
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="gms-dims-col">
              <div style={{marginBottom:4}}>
                <div style={{fontSize:13,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:16}}>6 Scoring Dimensions</div>
              </div>
              <p className="gms-dim-intro">Each survey question maps to one of six dimensions. The weighted score determines tier: HOT, WARM, or COLD. Budget and timeline carry the most weight — they separate real prospects from browsers.</p>
              {GMS_DIMS.map((d,i)=>(
                <div key={i} className="gms-dim">
                  <div className="gms-dim-num">{d.n}</div>
                  <div className="gms-dim-body">
                    <div className="gms-dim-h">{d.h}</div>
                    <div className="gms-dim-p">{d.p}</div>
                    <div className="gms-dim-bar">
                      <div className="gms-dim-track"><div className="gms-dim-fill" style={{width:d.w+"%"}}/></div>
                      <div className="gms-dim-pct">{d.w}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Tiers */}
        <Reveal delay={80}>
          <div style={{marginTop:56,marginBottom:20}}>
            <div style={{fontSize:13,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Score Tiers</div>
            <p style={{fontSize:15,color:"var(--text2)",maxWidth:560}}>Scores determine the tier — which controls how leads are prioritised in your dashboard and how urgently you should reach out.</p>
          </div>
        </Reveal>
        <div className="tiers-row">
          {[
            {cls:"hot",badge:"HOT",badgeColor:"#E05A3A",range:"70–100",sub:"Verified — ready to engage",desc:"Budget confirmed, timeline within 90 days, specific programme identified, decision-maker verified. Reach out within 24 hours."},
            {cls:"warm",badge:"WARM",badgeColor:"#C07D10",range:"40–69",sub:"Active research phase",desc:"Real intent with a 3–12 month horizon. Budget and programme interest present but not fully locked. Nurture and qualify further."},
            {cls:"cold",badge:"COLD",badgeColor:"#4A7FC1",range:"0–39",sub:"Early exploration",desc:"Genuine interest but timeline and budget unclear. Useful for audience intelligence and long-cycle nurture. Not delivered to your dashboard."},
          ].map((t,i)=>(
            <Reveal key={i} delay={i*80} className={`tier-card ${t.cls}`}>
              <div className="tier-badge-row" style={{color:t.badgeColor}}>
                <div className="tier-badge-dot" style={{background:t.badgeColor}}/>{t.badge}
              </div>
              <div className="tier-range">{t.range}</div>
              <div className="tier-sublabel">{t.sub}</div>
              <div className="tier-desc">{t.desc}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* DASHBOARD MOCKUP */}
    <section className="dashboard-section" id="dashboard">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow lime"><span className="eyebrow-line"/>Partner Dashboard</div>
          <h2 className="sh2">This is what you see<br/><span className="hl">on day one.</span></h2>
          <p className="sp">Scored, verified leads matched to your jurisdiction — with their Advisor Brief attached. Profile always visible. Contact details unlock with one credit.</p>
        </Reveal>

        <Reveal delay={100}>
          <div className="db-wrapper">
            {/* Mac chrome */}
            <div className="db-chrome">
              <div className="db-chrome-dots">
                <div className="db-chrome-dot" style={{background:"#FF5F57"}}/>
                <div className="db-chrome-dot" style={{background:"#FEBC2E"}}/>
                <div className="db-chrome-dot" style={{background:"#28C840"}}/>
              </div>
              <div className="db-chrome-url">
                <div className="db-chrome-url-inner">
                  <span className="db-chrome-lock">🔒</span>
                  app.fbsintelligence.com/dashboard
                </div>
              </div>
            </div>

            <div className="db-inner">
              {/* Header */}
              <div className="db-header">
                <div>
                  <div className="db-greeting">Good morning, <span>Andreas</span> 👋</div>
                  <div className="db-sub"><strong>4 new HOT leads</strong> matched overnight.</div>
                </div>
                <button className="db-review-btn">Review →</button>
              </div>

              {/* Stats */}
              <div className="db-stats">
                {[
                  {cat:"TODAY",val:"12",desc:"New leads",change:"↑ 23%"},
                  {cat:"PIPELINE",val:"$1.4M",desc:"Estimated",change:"↑ 18%"},
                  {cat:"CONTACT",val:"68%",desc:"Within 24h",change:"↑ 4%"},
                  {cat:"CLOSE",val:"22%",desc:"HOT tier",change:"↑ 7%"},
                ].map((s,i)=>(
                  <div key={i} className="db-stat-card">
                    <div className="db-stat-cat">{s.cat}</div>
                    <div className="db-stat-val">{s.val}</div>
                    <div className="db-stat-desc">{s.desc}</div>
                    <div className="db-stat-change">{s.change}</div>
                  </div>
                ))}
              </div>

              {/* Leads table */}
              <div className="db-table-section">
                <div className="db-table-header">
                  <div className="db-table-title">Live Leads Feed</div>
                  <div className="db-filter-group">
                    {["All","HOT","WARM","COLD"].map(f=>(
                      <button key={f} className={`db-filter-btn ${activeFilter===f?"active":""}`} onClick={()=>setActiveFilter(f)}>
                        {f!=="All"&&<span className="dot" style={{background:f==="HOT"?"#E05A3A":f==="WARM"?"#C07D10":"#4A7FC1"}}/>}
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <table className="db-table">
                  <thead>
                    <tr>
                      <th className="db-th">Lead</th>
                      <th className="db-th">Country</th>
                      <th className="db-th">Tier</th>
                      <th className="db-th">Score</th>
                      <th className="db-th">Programme</th>
                      <th className="db-th">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((l,i)=>(
                      <tr key={i} className="db-tr">
                        <td className="db-td">
                          <div className="db-lead-cell">
                            <div className="db-av" style={{background:l.bg}}>{l.av}</div>
                            <div>
                              <div className="db-lname">{l.name}</div>
                              <div className="db-ltime">{l.time}</div>
                            </div>
                          </div>
                        </td>
                        <td className="db-td">{l.country}</td>
                        <td className="db-td"><span className={`db-tier-tag ${l.tc}`}>{l.tier}</span></td>
                        <td className="db-td">
                          <div className="db-score-cell">
                            <div className="db-score-big">{l.score}</div>
                            <div className="db-score-denom">/100</div>
                          </div>
                        </td>
                        <td className="db-td" style={{color:"var(--text2)"}}>{l.prog}</td>
                        <td className="db-td">
                          <span className={`db-status-tag ${l.sc}`}>{l.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    {/* DEEP DIVE FUNNEL */}
    <section className="deepdive-section" id="deepdive">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow lime"><span className="eyebrow-line"/>Deep Dive</div>
          <h2 className="sh2">Every step in detail.</h2>
          <p className="sp">The full five-stage funnel from first ad impression to partner dashboard delivery — with what happens at each stage.</p>
        </Reveal>
        <div className="deepdive-steps">
          {DEEPDIVE_STEPS.map((s,i)=>(
            <Reveal key={i} delay={i*60} className="deepdive-step">
              <div className={`deepdive-icon ${i===4?"final":""}`}>{s.e}</div>
              <div className="deepdive-body">
                <div className="deepdive-num">STEP {s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.b}</p>
                <div className="step-tags">
                  {s.tags.map((t,j)=><span key={j} className={`stag ${t.c||""}`}>{t.t}</span>)}
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
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"var(--lime)",color:"var(--black)",fontSize:11,fontWeight:800,padding:"4px 12px",borderRadius:100,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:24}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"var(--black)",display:"inline-block"}}/>Selective Onboarding
          </div>
          <h2>Ready to receive leads<br/>from this funnel?</h2>
          <p>One partner per jurisdiction. Apply and we'll review your profile within 24 hours.</p>
          <a href="/pricing" className="btn-lime">See pricing & apply →</a>
          <div style={{marginTop:16,display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap"}}>
            {["Discovery call within 48h","First leads in 7–14 days","Exclusive per jurisdiction"].map(t=>(
              <span key={t} style={{fontSize:12,color:"#555",display:"inline-flex",alignItems:"center",gap:6}}>
                <span style={{color:"var(--lime)",fontWeight:900}}>✓</span>{t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>

    <footer style={{background:"var(--black)",padding:"48px 0 32px",borderTop:"1px solid #1a1a1a"}}>
      <div className="wrap" style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8,fontSize:14,fontWeight:800,color:"var(--white)"}}>
          <div style={{width:8,height:8,background:"var(--lime)",borderRadius:"50%"}}/>FBS Intelligence
        </div>
        <div style={{display:"flex",gap:24}}>
          <a href="/" style={{fontSize:13,color:"#666",textDecoration:"none"}}>Home</a>
          <a href="/pricing" style={{fontSize:13,color:"#666",textDecoration:"none"}}>Pricing</a>
          <a href="/overview" style={{fontSize:13,color:"#AAA",textDecoration:"none"}}>How it works</a>
        </div>
        <div style={{fontSize:12,color:"#444"}}>© 2026 Freedom Business Summit</div>
      </div>
    </footer>
  </>);
}
