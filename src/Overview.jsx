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

function VideoCard({ v, i }) {
  const [playing, setPlaying] = useState(false);
  return (
    <Reveal delay={i*80} className="video-card">
      <div className="video-thumb" onClick={()=>!playing&&setPlaying(true)}>
        {playing ? (
          <iframe
            src={`https://player.mux.com/${v.id}?autoplay=true&primary-color=%23AAFF45`}
            title={v.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{width:"100%",height:"100%",border:"none",display:"block"}}
          />
        ) : (
          <>
            <img
              src={`https://image.mux.com/${v.id}/thumbnail.jpg?time=2&width=400&height=710&fit_mode=smartcrop`}
              alt={v.title}
              loading="lazy"
            />
            <div className="video-badge">{v.badge}</div>
            <div className="video-play">▶</div>
          </>
        )}
      </div>
      <div className="video-info">
        <div className="video-stage">{v.stage}</div>
        <div className="video-title">{v.title}</div>
        <div className="video-desc">{v.desc}</div>
      </div>
    </Reveal>
  );
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
.nav-right{display:flex;align-items:center;gap:20px;}
section[id]{scroll-margin-top:78px;}
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

/* ═══ HORIZONTAL STEPS ═══ */
.hsteps-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:0;margin-top:48px;position:relative;}
.hstep{display:flex;flex-direction:column;align-items:center;text-align:center;padding:24px 12px 24px;position:relative;background:var(--white);border:1px solid var(--border);border-right:none;transition:all 0.2s;}
.hstep:first-child{border-radius:14px 0 0 14px;}
.hstep:last-child{border-right:1px solid var(--border);border-radius:0 14px 14px 0;}
.hstep:hover{background:var(--lime-soft);border-color:rgba(170,255,69,0.4);z-index:1;}
.hstep:hover .hstep-num{color:var(--lime-dark);}
.hstep-emoji{font-size:24px;margin-bottom:10px;}
.hstep-num{font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}
.hstep-title{font-size:13px;font-weight:700;color:var(--black);margin-bottom:6px;line-height:1.3;}
.hstep-desc{font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:8px;}
.hstep-tag{display:inline-block;font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--lime-dark);background:var(--lime-soft);padding:2px 8px;border-radius:100px;}
.hstep-arrow{position:absolute;right:-10px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--border);z-index:2;background:var(--white);padding:2px;}

/* ═══ DASHBOARD MOCKUP (from main page) ═══ */
.ovdash-mockup{position:relative;z-index:2;border-radius:14px;overflow:hidden;box-shadow:0 24px 60px -10px rgba(0,0,0,0.18),0 0 0 1px rgba(0,0,0,0.06);background:var(--white);margin-top:32px;}
.ovdash-chrome{background:#f5f4f0;padding:12px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border);}
.ovdash-dots{display:flex;gap:6px;}
.ovdash-dots span{width:11px;height:11px;border-radius:50%;}
.ovdash-url{flex:1;text-align:center;font-size:12px;color:#999;background:var(--white);padding:4px 16px;border-radius:6px;max-width:360px;margin:0 auto;border:1px solid var(--border);}
.ovdash-main{padding:24px 32px;overflow:hidden;}
.ovdash-greeting{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border);}
.ovdash-greeting h3{font-size:22px;font-weight:700;color:var(--black);margin-bottom:4px;letter-spacing:-0.02em;}
.ovdash-greeting p{font-size:13px;color:var(--text2);}
.ovdash-cta{background:var(--black);color:var(--white);border:none;padding:10px 18px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif;}
.ovdash-kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px;}
.ovdash-kpi{background:var(--off);border-radius:10px;padding:16px;transition:all 0.2s;}
.ovdash-kpi:hover{background:var(--lime-soft);}
.ovdash-kpi-tag{font-size:9px;font-weight:700;letter-spacing:0.1em;color:var(--muted);margin-bottom:8px;}
.ovdash-kpi-num{font-size:26px;font-weight:800;color:var(--black);letter-spacing:-0.02em;line-height:1;margin-bottom:4px;}
.ovdash-kpi-label{font-size:11px;color:var(--text2);}
.ovdash-kpi-trend{font-size:11px;color:var(--lime-dark);margin-top:6px;font-weight:600;}
.ovdash-section-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.ovdash-section-head h4{font-size:14px;font-weight:700;color:var(--black);}
.ovdash-filters{display:flex;gap:4px;}
.ovdash-filter{font-size:11px;padding:4px 10px;border-radius:4px;color:var(--muted);cursor:pointer;display:inline-flex;align-items:center;gap:5px;}
.ovdash-filter.active{background:var(--black);color:var(--white);}
.ovdash-table{background:var(--white);border:1px solid var(--border);border-radius:8px;overflow:hidden;}
.ovdash-table-head,.ovdash-row{display:grid;grid-template-columns:1.6fr 1fr 0.7fr 0.7fr 1.2fr 0.9fr;gap:8px;padding:10px 14px;align-items:center;font-size:11px;}
.ovdash-table-head{background:#fafaf6;color:var(--muted);font-weight:700;letter-spacing:0.06em;text-transform:uppercase;font-size:10px;}
.ovdash-row{border-top:1px solid var(--border);transition:background 0.15s;}
.ovdash-row:hover{background:var(--lime-soft);}
.ovdash-cell{display:flex;align-items:center;gap:8px;}
.ovdash-avatar{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:var(--white);flex-shrink:0;}
.ovdash-name{font-size:12px;font-weight:600;color:var(--black);}
.ovdash-time{font-size:10px;color:var(--muted);}
.ovdash-tier{font-size:10px;font-weight:700;padding:3px 8px;border-radius:4px;letter-spacing:0.04em;}
.ovdash-tier.hot{background:rgba(217,79,58,0.12);color:#D94F3A;}
.ovdash-tier.warm{background:rgba(192,125,16,0.12);color:#C07D10;}
.ovdash-tier.cold{background:rgba(74,127,193,0.12);color:#4A7FC1;}
.ovdash-gmsi{font-size:13px;font-weight:700;color:var(--black);}
.ovdash-gmsi-of{font-size:10px;color:var(--muted);margin-left:1px;}
.ovdash-prog{font-size:11px;color:var(--text2);}
.ovdash-status{font-size:10px;padding:3px 8px;border-radius:4px;}
.ovdash-status.new{color:var(--lime-dark);font-weight:700;}
.ovdash-status.contacted{background:var(--off);color:var(--text2);}
.ovdash-status.called{background:var(--lime-soft);color:var(--lime-dark);font-weight:600;}
.ovdash-hot-dot{width:7px;height:7px;background:#D94F3A;border-radius:50%;display:inline-block;}
.ovdash-warm-dot{width:7px;height:7px;background:#C07D10;border-radius:50%;display:inline-block;}
.ovdash-cold-dot{width:7px;height:7px;background:#4A7FC1;border-radius:50%;display:inline-block;}

/* ═══ ADVISOR BRIEF ANATOMY ═══ */
.advisor-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:start;margin-top:72px;padding-top:72px;border-top:1px solid var(--border);}

.advisor-card{background:var(--white);border:1px solid var(--border);border-radius:18px;overflow:hidden;box-shadow:0 16px 48px -8px rgba(0,0,0,0.1);margin-top:28px;}
.ac-header{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;}
.ac-header-left{display:flex;align-items:center;gap:10px;}
.ac-hot-badge{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:800;color:var(--hot-color);letter-spacing:0.04em;}
.ac-hot-dot{width:8px;height:8px;border-radius:50%;background:var(--hot-color);flex-shrink:0;}
.ac-score-tag{background:#FFF0ED;color:var(--hot-color);font-size:12px;font-weight:700;padding:3px 10px;border-radius:6px;}
.ac-time{font-size:12px;color:var(--muted);}
.ac-divider{height:1px;background:var(--border);margin:0 20px;}
.ac-profile{display:flex;align-items:center;gap:14px;padding:18px 20px;}
.ac-avatar{width:44px;height:44px;border-radius:50%;background:#D94F3A;color:var(--white);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;flex-shrink:0;}
.ac-name{font-size:16px;font-weight:700;color:var(--black);margin-bottom:2px;}
.ac-role{font-size:13px;color:var(--text2);}
.ac-fields{display:grid;grid-template-columns:1fr 1fr;gap:0;margin:0 20px 16px;background:var(--off);border-radius:10px;overflow:hidden;}
.ac-field{padding:14px 16px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);}
.ac-field:nth-child(2){border-right:none;}
.ac-field:nth-child(3){border-bottom:none;}
.ac-field:nth-child(4){border-right:none;border-bottom:none;}
.ac-field-label{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:5px;}
.ac-field-val{font-size:14px;font-weight:700;color:var(--black);}
.ac-quote{margin:0 20px 16px;background:var(--dark);border-radius:10px;padding:16px;}
.ac-quote-label{font-size:9px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:var(--lime);margin-bottom:8px;}
.ac-quote-text{font-size:13px;color:rgba(255,255,255,0.82);line-height:1.65;font-style:italic;}
.ac-actions{display:flex;gap:10px;padding:0 20px 20px;}
.ac-unlock{flex:1;background:var(--black);color:var(--white);border:none;padding:13px 20px;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;}
.ac-unlock:hover{background:var(--lime);color:var(--black);}
.ac-save{background:none;border:1.5px solid var(--border);color:var(--text2);padding:13px 16px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;}
.ac-save:hover{border-color:var(--black);color:var(--black);}

.advisor-text{padding-top:40px;}
.advisor-text-h{font-size:clamp(20px,2.4vw,28px);font-weight:800;color:var(--black);letter-spacing:-0.02em;line-height:1.2;margin-bottom:16px;}
.advisor-text-p{font-size:16px;color:var(--text2);line-height:1.7;margin-bottom:24px;}
.advisor-callout{background:var(--off);border-left:3px solid var(--lime);padding:16px 20px;border-radius:0 10px 10px 0;font-size:14px;color:var(--text);line-height:1.65;margin-bottom:32px;}
.advisor-fields-explained{display:flex;flex-direction:column;gap:16px;}
.aff-row{display:flex;align-items:flex-start;gap:14px;}
.aff-icon{width:36px;height:36px;border-radius:10px;background:var(--off);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.aff-h{font-size:14px;font-weight:700;color:var(--black);margin-bottom:3px;}
.aff-p{font-size:13px;color:var(--text2);line-height:1.55;}

/* ═══ HOW WE GET LEADS / ACQUISITION ═══ */
.acq-channels{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:48px;}
.acq-channel{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:24px 20px;text-align:center;transition:all 0.2s;}
.acq-channel:hover{border-color:var(--black);transform:translateY(-3px);box-shadow:0 12px 28px -8px rgba(0,0,0,0.1);}
.acq-icon{font-size:28px;margin-bottom:12px;}
.acq-name{font-size:15px;font-weight:800;color:var(--black);margin-bottom:6px;letter-spacing:-0.01em;}
.acq-desc{font-size:12px;color:var(--text2);line-height:1.55;}
.persona-card{background:var(--black);border-radius:20px;padding:40px 44px;margin-top:24px;display:grid;grid-template-columns:1fr 1.2fr;gap:48px;align-items:center;position:relative;overflow:hidden;}
.persona-card::before{content:'';position:absolute;top:-40%;right:-5%;width:45%;height:180%;background:radial-gradient(ellipse,rgba(170,255,69,0.1),transparent 60%);pointer-events:none;}
.persona-left{position:relative;z-index:2;}
.persona-eyebrow{font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:rgba(170,255,69,0.7);margin-bottom:12px;}
.persona-title{font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.03em;line-height:1.15;margin-bottom:14px;}
.persona-sub{font-size:14px;color:rgba(255,255,255,0.55);line-height:1.65;}
.persona-attrs{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.persona-attr{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 18px;}
.persona-attr-label{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(170,255,69,0.6);margin-bottom:6px;}
.persona-attr-val{font-size:16px;font-weight:700;color:#fff;letter-spacing:-0.01em;}

/* ═══ VIDEO SAMPLES ═══ */
.video-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px;}
.video-card{background:var(--white);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all 0.2s;}
.video-card:hover{transform:translateY(-4px);box-shadow:0 16px 36px -10px rgba(0,0,0,0.15);}
.video-thumb{position:relative;aspect-ratio:9/16;background:#111;overflow:hidden;cursor:pointer;}
.video-thumb img,.video-thumb video,.video-thumb iframe{width:100%;height:100%;object-fit:cover;border:none;}
.video-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:56px;height:56px;background:rgba(255,255,255,0.95);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--black);box-shadow:0 4px 16px rgba(0,0,0,0.3);transition:all 0.2s;}
.video-card:hover .video-play{transform:translate(-50%,-50%) scale(1.1);background:var(--lime);}
.video-badge{position:absolute;top:12px;left:12px;background:rgba(0,0,0,0.6);color:#fff;font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:4px 10px;border-radius:100px;backdrop-filter:blur(8px);}
.video-info{padding:20px;}
.video-stage{font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:6px;}
.video-title{font-size:15px;font-weight:700;color:var(--black);margin-bottom:6px;letter-spacing:-0.01em;}
.video-desc{font-size:12px;color:var(--text2);line-height:1.55;}

/* ═══ EMAIL NURTURE — horizontal diagram ═══ */
.nurture-diagram{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;margin-top:48px;align-items:stretch;}
.nurture-node-wrap{position:relative;display:flex;}
.nurture-node{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:28px 24px;width:100%;transition:all 0.2s;}
.nurture-node-wrap:hover .nurture-node{border-color:rgba(170,255,69,0.5);transform:translateY(-3px);box-shadow:0 14px 30px -10px rgba(0,0,0,0.12);}
.nurture-node-icon{font-size:32px;margin-bottom:14px;}
.nurture-node-num{font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:8px;}
.nurture-node-title{font-size:18px;font-weight:800;color:var(--black);letter-spacing:-0.02em;margin-bottom:10px;}
.nurture-node-desc{font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:14px;}
.nurture-node-tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--lime-dark);background:var(--lime-soft);padding:4px 12px;border-radius:100px;}
.nurture-connector{position:absolute;right:-14px;top:50%;transform:translateY(-50%);z-index:5;font-size:22px;color:var(--lime-dark);background:var(--off);width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;}
.nurture-node-wrap:not(:last-child){padding-right:28px;}

.list-asset{background:var(--black);border-radius:18px;padding:36px 40px;margin-top:32px;display:grid;grid-template-columns:1.6fr auto;gap:40px;align-items:center;}
.list-asset-left{display:flex;align-items:flex-start;gap:20px;}
.list-asset-icon{font-size:36px;flex-shrink:0;}
.list-asset-h{font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.02em;margin-bottom:10px;}
.list-asset-p{font-size:14px;color:rgba(255,255,255,0.6);line-height:1.7;}
.list-asset-badges{display:flex;flex-direction:column;gap:12px;flex-shrink:0;}
.list-asset-badge{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;}
.list-asset-check{width:20px;height:20px;border-radius:6px;background:var(--lime);color:var(--black);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;}

/* ═══ EMAIL NURTURE (old) ═══ */
/* ═══ VERIFY / DEMO CTA — white, animated call ═══ */
.demo-card{background:var(--off);border:1px solid var(--border);border-radius:24px;padding:48px;display:grid;grid-template-columns:1.3fr 1fr;gap:56px;align-items:center;}
.demo-card-left{}
.demo-live-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(217,79,58,0.1);border:1px solid rgba(217,79,58,0.25);border-radius:100px;padding:6px 16px;margin-bottom:20px;}
.demo-live-dot{width:8px;height:8px;border-radius:50%;background:#FF4444;animation:pulse 1.2s ease-in-out infinite;}
.demo-live-text{font-size:12px;font-weight:700;color:#D94F3A;letter-spacing:0.06em;}
.demo-h{font-size:clamp(26px,3.4vw,38px);font-weight:800;color:var(--black);letter-spacing:-0.03em;line-height:1.15;margin-bottom:12px;}
.demo-h-accent{color:var(--lime-dark);}
.demo-sub{font-size:16px;color:var(--text2);line-height:1.65;max-width:480px;margin-bottom:28px;}
.demo-btn{display:inline-flex;align-items:center;gap:10px;background:var(--black);color:var(--lime);text-decoration:none;font-size:16px;font-weight:800;padding:16px 34px;border-radius:12px;white-space:nowrap;transition:all 0.2s;}
.demo-btn:hover{background:var(--dark2);transform:translateY(-2px);box-shadow:0 12px 32px -8px rgba(0,0,0,0.3);}
.demo-note{font-size:13px;color:var(--muted);margin-top:14px;}

/* Animated call window */
.demo-call{display:flex;justify-content:center;}
.demo-call-window{width:100%;max-width:320px;background:linear-gradient(160deg,#0F1A08,#0A0A0A);border-radius:24px;padding:24px 22px;box-shadow:0 24px 60px -12px rgba(0,0,0,0.4);border:1px solid rgba(170,255,69,0.15);}
.demo-call-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;}
.demo-call-status{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);}
.demo-call-ring{width:8px;height:8px;border-radius:50%;background:var(--lime);animation:pulse 1s ease-in-out infinite;}
.demo-call-time{font-size:12px;color:rgba(255,255,255,0.5);font-variant-numeric:tabular-nums;}
.demo-call-sec{animation:demoSecBlink 1s steps(1) infinite;}
@keyframes demoSecBlink{50%{opacity:0.3;}}
.demo-call-body{text-align:center;margin-bottom:32px;}
.demo-call-avatar{position:relative;width:96px;height:96px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;}
.demo-call-avatar-ring{position:absolute;inset:0;border-radius:50%;border:2px solid var(--lime);opacity:0;}
.demo-ring-1{animation:demoRing 2s ease-out infinite;}
.demo-ring-2{animation:demoRing 2s ease-out infinite 1s;}
@keyframes demoRing{0%{transform:scale(0.7);opacity:0.7;}100%{transform:scale(1.4);opacity:0;}}
.demo-call-avatar-inner{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--lime),var(--lime2));color:var(--black);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;position:relative;z-index:2;}
.demo-call-name{font-size:18px;font-weight:800;color:#fff;margin-bottom:4px;}
.demo-call-role{font-size:12px;color:rgba(255,255,255,0.45);margin-bottom:20px;}
.demo-call-wave{display:flex;align-items:center;justify-content:center;gap:4px;height:32px;}
.demo-wave-bar{width:4px;height:8px;background:var(--lime);border-radius:2px;animation:demoWave 0.9s ease-in-out infinite;}
@keyframes demoWave{0%,100%{height:8px;}50%{height:28px;}}
.demo-call-actions{display:flex;align-items:center;justify-content:center;gap:16px;}
.demo-call-btn{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;transition:transform 0.15s;}
.demo-call-btn:hover{transform:scale(1.08);}
.demo-call-mute,.demo-call-video{background:rgba(255,255,255,0.1);}
.demo-call-end{background:#FF4444;transform:rotate(0deg);}

/* ═══ 5-STEP FORMULA ═══ */
.formula-section{padding:96px 0;background:var(--white);border-bottom:1px solid var(--border);}
.formula-pipeline{display:flex;flex-direction:column;gap:10px;margin-top:48px;}
.formula-step{display:grid;grid-template-columns:56px 1fr auto;align-items:center;gap:20px;padding:20px 24px;background:var(--off);border:1px solid var(--border);border-radius:14px;cursor:default;transition:all 0.2s;}
.formula-step:hover{background:var(--white);border-color:var(--black);transform:translateX(4px);}
.formula-step.last-step{background:var(--black);border-color:var(--black);}
.formula-step.last-step:hover{transform:translateX(4px);box-shadow:0 8px 24px rgba(0,0,0,0.15);}
.formula-icon{width:48px;height:48px;border-radius:12px;background:var(--white);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;transition:all 0.2s;}
.formula-step:hover .formula-icon{border-color:var(--lime);}
.formula-step.last-step .formula-icon{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.15);}
.formula-step-body{display:flex;flex-direction:column;gap:2px;}
.formula-num{font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:var(--lime-dark);}
.formula-step.last-step .formula-num{color:rgba(170,255,69,0.7);}
.formula-name{font-size:16px;font-weight:800;color:var(--black);letter-spacing:-0.02em;}
.formula-step.last-step .formula-name{color:var(--white);}
.formula-desc{font-size:13px;color:var(--text2);line-height:1.5;}
.formula-step.last-step .formula-desc{color:rgba(255,255,255,0.55);}
.formula-badge{display:inline-flex;align-items:center;font-size:11px;font-weight:700;padding:5px 12px;border-radius:100px;border:1px solid var(--border);background:var(--white);color:var(--black);white-space:nowrap;flex-shrink:0;}
.formula-step.last-step .formula-badge{background:var(--lime);border-color:var(--lime);color:var(--black);}
.formula-step:hover .formula-badge{border-color:var(--black);}
.formula-connector{display:none;}

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

/* ═══ INBOUND / OUTBOUND ═══ */
.io-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:48px;}
.io-card{border-radius:20px;padding:40px 36px;display:flex;flex-direction:column;gap:0;}
.io-inbound{background:var(--lime-soft);border:1px solid rgba(170,255,69,0.4);}
.io-outbound{background:var(--black);border:1px solid #1a1a1a;}
.io-badge{display:inline-flex;align-items:center;font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;padding:4px 12px;border-radius:100px;margin-bottom:20px;width:fit-content;}
.io-badge-in{background:var(--lime);color:var(--black);}
.io-badge-out{background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);}
.io-title{font-size:24px;font-weight:800;color:var(--black);letter-spacing:-0.02em;margin-bottom:12px;line-height:1.15;}
.io-outbound .io-title{color:var(--white);}
.io-desc{font-size:14px;color:var(--text2);line-height:1.7;margin-bottom:28px;}
.io-outbound .io-desc{color:rgba(255,255,255,0.55);}
.io-when{margin-bottom:24px;}
.io-when-label{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:12px;}
.io-outbound .io-when-label{color:rgba(170,255,69,0.7);}
.io-when-items{display:flex;flex-direction:column;gap:10px;}
.io-when-item{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--text);}
.io-outbound .io-when-item{color:rgba(255,255,255,0.75);}
.io-check{width:18px;height:18px;border-radius:5px;background:var(--lime);color:var(--black);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex-shrink:0;margin-top:1px;}
.io-check-dark{background:rgba(170,255,69,0.15);color:var(--lime);}
.io-examples{display:flex;flex-wrap:wrap;gap:8px;padding-top:20px;border-top:1px solid rgba(90,138,32,0.2);}
.io-examples span{font-size:12px;font-weight:600;padding:4px 12px;border-radius:100px;background:var(--white);color:var(--black);border:1px solid rgba(90,138,32,0.2);}
.io-examples-dark{border-top-color:rgba(255,255,255,0.08);}
.io-examples-dark span{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.7);border-color:rgba(255,255,255,0.1);}
.io-note{background:var(--off);border:1px solid var(--border);border-radius:14px;padding:24px 28px;margin-top:24px;display:flex;align-items:flex-start;gap:18px;}
.io-note-icon{font-size:24px;flex-shrink:0;margin-top:2px;}
.io-note-h{font-size:15px;font-weight:700;color:var(--black);margin-bottom:6px;}
.io-note-p{font-size:13px;color:var(--text2);line-height:1.65;}

/* ═══ TIMELINE ═══ */
.tl-wrapper{margin-top:56px;}
.tl-phases{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px;}
.tl-phase{background:var(--white);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all 0.2s;}
.tl-phase:hover{transform:translateY(-3px);box-shadow:0 12px 32px -8px rgba(0,0,0,0.1);}
.tl-phase-head{padding:20px 20px 16px;border-left:3px solid;}
.tl-phase-tag{font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px;}
.tl-phase-label{font-size:16px;font-weight:800;color:var(--black);margin-bottom:4px;letter-spacing:-0.01em;}
.tl-phase-weeks{font-size:12px;color:var(--muted);font-weight:600;}
.tl-phase-body{padding:0 20px 20px;}
.tl-items{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}
.tl-item{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--text2);line-height:1.45;}
.tl-item-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:4px;}
.tl-outcome{border-left:2px solid;padding:8px 12px;font-size:12px;font-weight:700;color:var(--black);background:var(--off);border-radius:0 6px 6px 0;}
.tl-summary{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:28px 32px;display:flex;flex-direction:column;gap:24px;}
.tl-track-label{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:12px;}
.tl-track-bar{display:flex;height:36px;border-radius:8px;overflow:hidden;margin-bottom:8px;}
.tl-bar-seg{display:flex;align-items:center;justify-content:center;}
.tl-bar-lbl{font-size:11px;font-weight:800;letter-spacing:0.06em;}
.tl-track-marks{display:flex;justify-content:space-between;padding:0 2px;}
.tl-mark{font-size:10px;color:var(--muted);font-weight:500;}
.tl-summary-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-top:24px;border-top:1px solid var(--border);}
.tl-stat{text-align:center;}
.tl-stat-val{font-size:26px;font-weight:900;color:var(--black);letter-spacing:-0.03em;line-height:1;}
.tl-stat-unit{font-size:14px;font-weight:500;color:var(--muted);}
.tl-stat-label{font-size:11px;color:var(--muted);margin-top:2px;}

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
  .io-grid{grid-template-columns:1fr;}
  .tl-phases{grid-template-columns:1fr 1fr;}
  .tl-summary-stats{grid-template-columns:1fr 1fr 1fr;}
  .tl-stat{text-align:center;}
  .hsteps-grid{grid-template-columns:repeat(4,1fr);}
  .hstep:nth-child(4){border-right:1px solid var(--border);border-radius:0 14px 0 0;}
  .hstep:nth-child(5){border-radius:0 0 0 14px;}
  .hstep:nth-child(7){border-radius:0 0 14px 0;}
  .hstep-arrow{display:none;}
  .advisor-grid{grid-template-columns:1fr;gap:40px;}
  .advisor-text{padding-top:0;}
  .funnel-hero-grid{grid-template-columns:1fr;}
  .gms-top-grid{grid-template-columns:1fr;}
  .tiers-row{grid-template-columns:1fr 1fr;}
  .db-stats{grid-template-columns:1fr 1fr;}
  .formula-badge{font-size:10px;padding:4px 8px;}
  .acq-channels{grid-template-columns:1fr 1fr;}
  .persona-card{grid-template-columns:1fr;gap:28px;}
  .video-grid{grid-template-columns:1fr 1fr;}
  .nurture-diagram{grid-template-columns:1fr;gap:32px;}
  .nurture-node-wrap:not(:last-child){padding-right:0;}
  .nurture-connector{display:none;}
  .list-asset{grid-template-columns:1fr;gap:24px;}
  .demo-card{grid-template-columns:1fr;gap:36px;}
  .demo-call-window{max-width:280px;}
  .ovdash-kpi-row{grid-template-columns:1fr 1fr;}
}
@media(max-width:768px){
  .nav-right .nav-link{display:none;}
  /* Hero stats: 2x2 grid */
  .stats-strip{display:grid;grid-template-columns:1fr 1fr;gap:0;}
  .stat-item{padding:20px 16px 20px 0;border-right:none;margin-right:0;border-bottom:1px solid var(--border);}
  .stat-item:nth-child(odd){border-right:1px solid var(--border);}
  .stat-item:nth-child(3),.stat-item:nth-child(4){border-bottom:none;}
  /* Formula rectangular: hide badge on small screens */
  .formula-badge{display:none;}
  .formula-step{grid-template-columns:44px 1fr;gap:12px;padding:14px 16px;}
  /* Hsteps */
  .hsteps-grid{grid-template-columns:1fr 1fr;}
  .hstep{border-right:1px solid var(--border) !important;border-radius:0 !important;}
  .hstep:first-child{border-radius:14px 0 0 0 !important;}
  .hstep:last-child{border-radius:0 0 14px 14px !important;}
  /* Advisor card fields */
  .ac-fields{grid-template-columns:1fr;}
  .ac-field{border-right:none !important;border-bottom:1px solid var(--border) !important;}
  .ac-field:last-child{border-bottom:none !important;}
  /* Timeline */
  .tl-phases{grid-template-columns:1fr;}
  /* Tiers */
  .tiers-row{grid-template-columns:1fr;}
  /* Deep dive */
  .deepdive-step{grid-template-columns:56px 1fr;gap:14px;}
  .deepdive-icon{width:56px;height:56px;font-size:22px;}
  .deepdive-steps::before{left:27px;}
  /* Dashboard stats */
  .db-stats{grid-template-columns:1fr 1fr;}
  .acq-channels{grid-template-columns:1fr 1fr;}
  .video-grid{grid-template-columns:1fr;}
  .persona-attrs{grid-template-columns:1fr;}
  .nurture-diagram{grid-template-columns:1fr;}
  .list-asset{padding:28px 24px;}
  .demo-card{padding:28px 24px;}
  .demo-btn{width:100%;justify-content:center;}
  .ovdash-main{padding:16px;}
  .ovdash-kpi-row{grid-template-columns:1fr 1fr;}
  .ovdash-table-head{display:none;}
  .ovdash-row{grid-template-columns:1fr 1fr;gap:6px;padding:12px;}
  .demo-card{padding:28px 24px;}
  .demo-btn{width:100%;justify-content:center;}
  .wrap{padding:0 16px;}
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
          <a href="#funnel" className="nav-link">Funnel</a>
          <a href="#acquisition" className="nav-link">Acquisition</a>
          <a href="#nurture" className="nav-link">Nurture</a>
          <a href="#scoring" className="nav-link">Scoring</a>
          <a href="#demo" className="nav-link">Demo</a>
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

        {/* HORIZONTAL STEPS */}
        <div className="hsteps-grid">
          {[
            {n:"01",e:"🎯",t:"We learn your offer",d:"Discovery call: your jurisdiction, programme, client profile, what a qualified lead looks like.",tag:"Onboarding"},
            {n:"02",e:"👤",t:"We define your ICP",d:"We build an Ideal Client Profile — capital range, geography, motivation, timeline.",tag:"Strategy"},
            {n:"03",e:"🎬",t:"We run video ads",d:"Sponsored video on Meta, Instagram, LinkedIn and YouTube targeting your exact ICP.",tag:"Acquisition"},
            {n:"04",e:"📋",t:"We run the survey",d:"Prospects complete the 14-question Global Mobility Survey. Full UTM attribution captured.",tag:"Qualification"},
            {n:"05",e:"📅",t:"We invite to webinar",d:"Qualified respondents register for a mini-webinar on global mobility for their jurisdiction.",tag:"Registration"},
            {n:"06",e:"📊",t:"We score & verify",d:"Each response is scored 0–100. Score 40+ leads go through intent verification.",tag:"Scoring"},
            {n:"07",e:"📥",t:"Leads in your dashboard",d:"Matched, scored, verified leads with full Advisor Brief — ready for contact.",tag:"Delivery"},
          ].map((s,i)=>(
            <Reveal key={i} delay={i*50} className="hstep">
              <div className="hstep-emoji">{s.e}</div>
              <div className="hstep-num">{s.n}</div>
              <div className="hstep-title">{s.t}</div>
              <div className="hstep-desc">{s.d}</div>
              <div className="hstep-tag">{s.tag}</div>
              {i < 6 && <div className="hstep-arrow">→</div>}
            </Reveal>
          ))}
        </div>

        {/* DASHBOARD TEMPLATE — from main page */}
        <div style={{marginTop:80,paddingTop:80,borderTop:"1px solid var(--border)"}}>
        <Reveal delay={80}>
          <div className="eyebrow"><span className="eyebrow-line"/>What you receive</div>
          <h2 className="sh2" style={{fontSize:"clamp(28px,3.6vw,48px)",marginBottom:16}}>Your live<br/><span className="hl">lead dashboard.</span></h2>
          <p className="sp" style={{marginBottom:8}}>Every lead lands scored, matched, and ready to contact. Score &amp; tier tells you priority. The prospect's own words tell you what to lead with. Profile context gives you the rest.</p>
        </Reveal>

        <Reveal delay={140}>
          <div className="ovdash-mockup">
            <div className="ovdash-chrome">
              <div className="ovdash-dots">
                <span style={{background:"#FF5F57"}}/>
                <span style={{background:"#FEBC2E"}}/>
                <span style={{background:"#28C840"}}/>
              </div>
              <div className="ovdash-url">app.fbsintelligence.com/dashboard</div>
            </div>
            <div className="ovdash-main">
              <div className="ovdash-greeting">
                <div>
                  <h3>Good morning, <span style={{color:"var(--lime2)"}}>Andreas</span> 👋</h3>
                  <p><strong>4 new HOT leads</strong> matched overnight.</p>
                </div>
                <button className="ovdash-cta">Review →</button>
              </div>
              <div className="ovdash-kpi-row">
                {[
                  {tag:"TODAY",num:"12",label:"New leads",trend:"↑ 23%"},
                  {tag:"PIPELINE",num:"$1.4M",label:"Estimated",trend:"↑ 18%"},
                  {tag:"CONTACT",num:"68%",label:"Within 24h",trend:"↑ 4%"},
                  {tag:"CLOSE",num:"22%",label:"HOT tier",trend:"↑ 7%"},
                ].map((k,i)=>(
                  <div key={i} className="ovdash-kpi">
                    <div className="ovdash-kpi-tag">{k.tag}</div>
                    <div className="ovdash-kpi-num">{k.num}</div>
                    <div className="ovdash-kpi-label">{k.label}</div>
                    <div className="ovdash-kpi-trend">{k.trend}</div>
                  </div>
                ))}
              </div>
              <div className="ovdash-section-head">
                <h4>Live Leads Feed</h4>
                <div className="ovdash-filters">
                  <span className="ovdash-filter active">All</span>
                  <span className="ovdash-filter"><span className="ovdash-hot-dot"/> HOT</span>
                  <span className="ovdash-filter"><span className="ovdash-warm-dot"/> WARM</span>
                  <span className="ovdash-filter"><span className="ovdash-cold-dot"/> COLD</span>
                </div>
              </div>
              <div className="ovdash-table">
                <div className="ovdash-table-head">
                  <div>Lead</div><div>Country</div><div>Tier</div><div>Score</div><div>Programme</div><div>Status</div>
                </div>
                {[
                  {initials:"JM",name:"J. Marchetti",time:"12 min ago",flag:"🇮🇹",country:"Italy",tier:"HOT",tierCls:"hot",gmsi:87,prog:"St. Kitts CBI",status:"new",color:"#D94F3A"},
                  {initials:"RK",name:"R. Kapoor",time:"34 min ago",flag:"🇮🇳",country:"India",tier:"HOT",tierCls:"hot",gmsi:79,prog:"Portugal Golden Visa",status:"new",color:"#8EE032"},
                  {initials:"SO",name:"S. Olusegun",time:"1 hr ago",flag:"🇳🇬",country:"Nigeria",tier:"WARM",tierCls:"warm",gmsi:58,prog:"Grenada CBI",status:"contacted",color:"#C07D10"},
                  {initials:"DH",name:"D. Harrison",time:"2 hr ago",flag:"🇺🇸",country:"USA",tier:"HOT",tierCls:"hot",gmsi:73,prog:"Malta MEIN",status:"called",color:"#4A7FC1"},
                  {initials:"ED",name:"E. Dubois",time:"3 hr ago",flag:"🇫🇷",country:"France",tier:"WARM",tierCls:"warm",gmsi:52,prog:"Malta MEIN",status:"new",color:"#7C5BA8"},
                ].map((l,i)=>(
                  <div key={i} className="ovdash-row">
                    <div className="ovdash-cell">
                      <div className="ovdash-avatar" style={{background:l.color}}>{l.initials}</div>
                      <div><div className="ovdash-name">{l.name}</div><div className="ovdash-time">{l.time}</div></div>
                    </div>
                    <div className="ovdash-cell">{l.flag} {l.country}</div>
                    <div className="ovdash-cell"><span className={`ovdash-tier ${l.tierCls}`}>{l.tier}</span></div>
                    <div className="ovdash-cell"><span className="ovdash-gmsi">{l.gmsi}</span><span className="ovdash-gmsi-of">/100</span></div>
                    <div className="ovdash-cell ovdash-prog">{l.prog}</div>
                    <div className="ovdash-cell">
                      {l.status==="new"&&<span className="ovdash-status new">● New</span>}
                      {l.status==="contacted"&&<span className="ovdash-status contacted">✓ Contacted</span>}
                      {l.status==="called"&&<span className="ovdash-status called">📞 Reached</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        </div>
      </div>
    </section>

    {/* HOW WE GET LEADS */}
    <section id="acquisition" style={{padding:"96px 0",background:"var(--off)",borderBottom:"1px solid var(--border)"}}>
      <div className="wrap">
        <Reveal>
          <div className="eyebrow lime"><span className="eyebrow-line"/>Acquisition</div>
          <h2 className="sh2">How we get your leads.</h2>
          <p className="sp">We run paid campaigns across the platforms where high-net-worth prospects actually spend time — then filter for real intent. No cold lists, no scraped data. Every lead opts in.</p>
        </Reveal>

        <div className="acq-channels">
          {[
            {icon:"📱",name:"Meta Ads",desc:"Facebook & Instagram video campaigns targeting by geography, income, interests, and behavior."},
            {icon:"🟠",name:"Reddit",desc:"Native placements in expat, investing, and relocation communities where research happens."},
            {icon:"🏡",name:"Nextdoor",desc:"Hyper-local targeting of affluent neighborhoods — homeowners with real assets and mobility intent."},
            {icon:"🎥",name:"YouTube",desc:"Pre-roll and in-feed video ads reaching prospects actively researching global mobility."},
          ].map((c,i)=>(
            <Reveal key={i} delay={i*60} className="acq-channel">
              <div className="acq-icon">{c.icon}</div>
              <div className="acq-name">{c.name}</div>
              <div className="acq-desc">{c.desc}</div>
            </Reveal>
          ))}
        </div>

        {/* PERSONA */}
        <Reveal delay={120}>
          <div className="persona-card">
            <div className="persona-left">
              <div className="persona-eyebrow">Example · US Market</div>
              <div className="persona-title">We target the exact person likely to invest.</div>
              <div className="persona-sub">For the US outbound market, that's an established homeowner with the assets and motivation to build a Plan B. We tune targeting to each jurisdiction and programme.</div>
            </div>
            <div className="persona-attrs">
              {[
                {l:"Age",v:"40+ years old"},
                {l:"Status",v:"Homeowner"},
                {l:"Household income",v:"~$200K / year"},
                {l:"Intent",v:"Second passport / residency"},
              ].map((a,i)=>(
                <div key={i} className="persona-attr">
                  <div className="persona-attr-label">{a.l}</div>
                  <div className="persona-attr-val">{a.v}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    {/* VIDEO SAMPLES */}
    <section id="creative" style={{padding:"96px 0",background:"var(--white)",borderBottom:"1px solid var(--border)"}}>
      <div className="wrap">
        <Reveal>
          <div className="eyebrow lime"><span className="eyebrow-line"/>Creative</div>
          <h2 className="sh2">The ads that bring them in.</h2>
          <p className="sp">Every campaign moves the prospect through three stages — grab attention, build awareness, deliver the message. Here's what that looks like in the field.</p>
        </Reveal>

        <div className="video-grid">
          {[
            {id:"b01C02DcwOHKl7dcvxdKtbV7sXnw8iYi00t2qlgXdLw2Pg",stage:"Stage 1",title:"Grab attention",desc:"Scroll-stopping hook in the first 3 seconds — a bold claim or question that speaks to mobility intent.",badge:"Attention"},
            {id:"IpjmtckTnJzwVNEIv3YT01WbTsPAqtPzlR02DMy4gD6JA",stage:"Stage 2",title:"Build awareness",desc:"Educate on the opportunity — why now, which programmes, what's changed. Positions the summit as the answer.",badge:"Awareness"},
            {id:"bjA29v9I8dDjJoYQHsLzRK9yiNCpUGmX3As6GOmjjF4",stage:"Stage 3",title:"Deliver the message",desc:"Clear call to action — register, take the survey, get your mobility score. Drives the qualified opt-in.",badge:"Conversion"},
          ].map((v,i)=>(
            <VideoCard key={i} v={v} i={i} />
          ))}
        </div>
      </div>
    </section>

    {/* EMAIL NURTURE */}
    <section id="nurture" style={{padding:"96px 0",background:"var(--off)",borderBottom:"1px solid var(--border)"}}>
      <div className="wrap">
        <Reveal>
          <div className="eyebrow lime"><span className="eyebrow-line"/>Nurture</div>
          <h2 className="sh2">We warm them up<br/><span className="hl">before the webinar.</span></h2>
          <p className="sp">Registrants don't just wait for the webinar. We build a segmented list, run it through email marketing software, and send an educational sequence that warms every prospect and filters for real intent — so the room is full of qualified, engaged attendees.</p>
        </Reveal>

        {/* Horizontal 3-step diagram */}
        <div className="nurture-diagram">
          {[
            {n:"01",icon:"🗂",title:"Build segmented list",desc:"Every survey response is tagged by jurisdiction, budget, timeline, and intent — creating clean, segmented audiences.",tag:"Segmentation"},
            {n:"02",icon:"⚙️",title:"Email marketing software",desc:"Segments sync into MailerLite. Automated sender domain, deliverability, and tracking configured per partner.",tag:"Automation"},
            {n:"03",icon:"✉️",title:"Warm-up sequence",desc:"An educational email sequence before the webinar builds trust and anticipation. Opens and clicks flag the hottest leads.",tag:"Warm-up"},
          ].map((s,i)=>(
            <Reveal key={i} delay={i*80} className="nurture-node-wrap">
              <div className="nurture-node">
                <div className="nurture-node-icon">{s.icon}</div>
                <div className="nurture-node-num">{s.n}</div>
                <div className="nurture-node-title">{s.title}</div>
                <div className="nurture-node-desc">{s.desc}</div>
                <div className="nurture-node-tag">{s.tag}</div>
              </div>
              {i<2&&<div className="nurture-connector">→</div>}
            </Reveal>
          ))}
        </div>

        {/* THE LIST IS AN ASSET */}
        <Reveal delay={200}>
          <div className="list-asset">
            <div className="list-asset-left">
              <div className="list-asset-icon">💎</div>
              <div>
                <div className="list-asset-h">The list is an asset — and it's yours.</div>
                <div className="list-asset-p">Every prospect we warm up becomes part of a segmented, opt-in email list built around your jurisdiction. As a partner, you keep the list. It compounds in value with every campaign — a durable audience you own, not a one-time batch of leads.</div>
              </div>
            </div>
            <div className="list-asset-badges">
              {["Partner keeps the list","GDPR opt-in consent","Grows every campaign"].map((b,i)=>(
                <div key={i} className="list-asset-badge"><span className="list-asset-check">✓</span>{b}</div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    {/* VERIFY INTENT / DEMO */}
    <section id="demo" style={{padding:"96px 0",background:"var(--white)",borderBottom:"1px solid var(--border)"}}>
      <div className="wrap">
        <Reveal>
          <div className="demo-card">
            <div className="demo-card-left">
              <div className="demo-live-badge">
                <span className="demo-live-dot"/>
                <span className="demo-live-text">LIVE · RIGHT NOW</span>
              </div>
              <h2 className="demo-h">See the Intelligence Platform <span className="demo-h-accent">in action.</span></h2>
              <p className="demo-sub">Leave your details. Our platform demo connects within 30 seconds and walks you through exactly how we qualify and deliver leads to partner firms.</p>
              <a href="https://platform.fsummit.net/demo" className="demo-btn" target="_blank" rel="noopener noreferrer">
                Try the Live Demo →
              </a>
              <div className="demo-note">Real demo call · connects in ~30 seconds</div>
            </div>

            {/* Animated call visual */}
            <div className="demo-call">
              <div className="demo-call-window">
                <div className="demo-call-header">
                  <div className="demo-call-status"><span className="demo-call-ring"/>Connecting…</div>
                  <div className="demo-call-time">00:0<span className="demo-call-sec">3</span></div>
                </div>
                <div className="demo-call-body">
                  <div className="demo-call-avatar">
                    <div className="demo-call-avatar-ring demo-ring-1"/>
                    <div className="demo-call-avatar-ring demo-ring-2"/>
                    <div className="demo-call-avatar-inner">FS</div>
                  </div>
                  <div className="demo-call-name">FBS Intelligence</div>
                  <div className="demo-call-role">Platform Demo · Live Agent</div>
                  <div className="demo-call-wave">
                    {[...Array(9)].map((_,i)=><span key={i} className="demo-wave-bar" style={{animationDelay:`${i*0.08}s`}}/>)}
                  </div>
                </div>
                <div className="demo-call-actions">
                  <div className="demo-call-btn demo-call-mute">🎤</div>
                  <div className="demo-call-btn demo-call-end">✕</div>
                  <div className="demo-call-btn demo-call-video">📹</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    {/* 5-STEP FORMULA — hidden */}
    {false && <section className="formula-section">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow lime"><span className="eyebrow-line"/>The 5-Step Formula</div>
          <h2 className="sh2">From ad impression to<br/><span className="hl">qualified lead in dashboard.</span></h2>
          <p className="sp">Five steps, all managed by FBS Intelligence. Each step filters, qualifies, and enriches — so only serious prospects matched to your jurisdiction reach your firm.</p>
        </Reveal>

        <div className="formula-pipeline">
          {[
            {n:"01",e:"🎬",name:"Attract",desc:"Sponsored video targeting your exact ICP and jurisdiction across Meta, LinkedIn and YouTube.",badge:"Your ICP targeted",last:false},
            {n:"02",e:"📥",name:"Capture",desc:"Webinar registration page with UTM attribution and pixel tracking from day one.",badge:"UTM tracked",last:false},
            {n:"03",e:"📋",name:"Qualify",desc:"14-question Global Mobility Survey: budget, timeline, family, motivation and jurisdiction interest.",badge:"14 questions",last:false},
            {n:"04",e:"📊",name:"Score",desc:"Global Mobility Score 0–100 across 6 dimensions. Intent verification for all 40+ scores.",badge:"GMS 0–100",last:false},
            {n:"05",e:"📥",name:"Deliver",desc:"Matched lead in your dashboard with a full Advisor Brief. Profile visible, contact unlocks with 1 credit.",badge:"72h delivery",last:true},
          ].map((s,i)=>(
            <Reveal key={i} delay={i*60} className={`formula-step ${s.last?"last-step":""}`}>
              <div className="formula-icon">{s.e}</div>
              <div className="formula-step-body">
                <div className="formula-num">{s.n}</div>
                <div className="formula-name">{s.name}</div>
                <div className="formula-desc">{s.desc}</div>
              </div>
              <div className="formula-badge">{s.badge}</div>
            </Reveal>
          ))}

        </div>
      </div>
    </section>}

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


    {/* ── INBOUND VS OUTBOUND ── */}
    <section style={{padding:"96px 0",background:"var(--white)",borderBottom:"1px solid var(--border)"}}>
      <div className="wrap">
        <Reveal>
          <div className="eyebrow lime"><span className="eyebrow-line"/>Jurisdiction Analysis</div>
          <h2 className="sh2">We study your market first.<br/><span className="hl">Inbound or outbound?</span></h2>
          <p className="sp">Before running a single ad, we analyse your jurisdiction and firm positioning to determine the right acquisition strategy. Not every market works the same way.</p>
        </Reveal>

        <div className="io-grid">
          <Reveal delay={80} className="io-card io-inbound">
            <div className="io-badge io-badge-in">Inbound</div>
            <h3 className="io-title">Leads come to you.</h3>
            <p className="io-desc">We create educational content and paid campaigns that attract investors actively searching for your programme. They register, complete the survey, and arrive in your dashboard already interested.</p>
            <div className="io-when">
              <div className="io-when-label">Works best when</div>
              <div className="io-when-items">
                {["Your jurisdiction has strong organic search demand (Portugal GV, UAE, Malta MEIN)","Prospects are actively researching online before making decisions","Your firm can follow up within 24–48 hours of lead delivery"].map((t,i)=>(
                  <div key={i} className="io-when-item"><span className="io-check">✓</span>{t}</div>
                ))}
              </div>
            </div>
            <div className="io-examples">
              <span>Portugal</span><span>Malta</span><span>UAE</span><span>Singapore</span><span>Greece</span>
            </div>
          </Reveal>

          <Reveal delay={160} className="io-card io-outbound">
            <div className="io-badge io-badge-out">Outbound</div>
            <h3 className="io-title">You reach out to leads.</h3>
            <p className="io-desc">We identify and warm prospects in specific target markets — founders, HNW individuals, and internationally mobile professionals — before your team initiates contact. Higher touch, higher conversion.</p>
            <div className="io-when">
              <div className="io-when-label">Works best when</div>
              <div className="io-when-items">
                {["Your programme has lower search demand but strong appeal (Caribbean CBI, Paraguay)","You want to target a specific country, industry, or wealth demographic","Your firm has capacity for proactive outreach and follow-up sequences"].map((t,i)=>(
                  <div key={i} className="io-when-item"><span className="io-check io-check-dark">✓</span>{t}</div>
                ))}
              </div>
            </div>
            <div className="io-examples io-examples-dark">
              <span>St. Kitts</span><span>Dominica</span><span>Grenada</span><span>Paraguay</span><span>Antigua</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="io-note">
            <div className="io-note-icon">🔍</div>
            <div>
              <div className="io-note-h">We determine this on the discovery call.</div>
              <div className="io-note-p">During onboarding, we review your jurisdiction, your firm's current lead sources, and your team's capacity. Some partners run both inbound and outbound simultaneously — we build the funnel accordingly.</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    {/* ── TIMELINE ── */}
    <section style={{padding:"96px 0",background:"var(--off)",borderBottom:"1px solid var(--border)"}}>
      <div className="wrap">
        <Reveal>
          <div className="eyebrow lime"><span className="eyebrow-line"/>Timeline to First Lead</div>
          <h2 className="sh2">From signed agreement<br/>to <span className="hl">leads in your dashboard.</span></h2>
          <p className="sp">Setup takes 4–8 weeks in total. The first weeks are foundation — funnel, copy, pixels, ICP. Then we test traffic, optimise, and scale. Most partners receive their first verified leads within 6–8 weeks of signing.</p>
        </Reveal>

        {/* Timeline visual */}
        <div className="tl-wrapper">
          <div className="tl-phases">
            {[
              {
                phase:"Phase 1",label:"Discovery & Setup",weeks:"Weeks 1–2",color:"var(--lime)",
                items:["Discovery call — offer, ICP, jurisdiction","Global Mobility Score framework built","Landing page + survey configured","Pixel, UTM, analytics stack connected","Onboarding documentation delivered"],
                outcome:"Funnel ready to receive traffic"
              },
              {
                phase:"Phase 2",label:"Funnel Creation",weeks:"Weeks 2–4",color:"#0A0A0A",
                items:["Video ad scripts and creatives produced","Webinar script + slides prepared","MailerLite sequences configured","CRM integration set up","ICP targeting brief finalised"],
                outcome:"All assets live and tested"
              },
              {
                phase:"Phase 3",label:"Traffic Testing",weeks:"Weeks 4–8",color:"#4A7FC1",
                items:["First ad campaigns launched (test budget)","A/B testing: creatives, audiences, copy","Conversion rate optimisation on survey","First webinar run — registrations collected","Initial leads scored and verified"],
                outcome:"First qualified leads delivered"
              },
              {
                phase:"Phase 4",label:"Scale",weeks:"Week 8+",color:"var(--hot-color)",
                items:["Winning campaigns scaled","ICP persona updated from real data","Lead volume increases with budget","Monthly reporting begins","Quarterly ICP review scheduled (Premium)"],
                outcome:"Consistent lead flow at scale"
              },
            ].map((ph,i)=>(
              <Reveal key={i} delay={i*80} className="tl-phase">
                <div className="tl-phase-head" style={{borderLeftColor:ph.color}}>
                  <div className="tl-phase-tag" style={{color:ph.color}}>{ph.phase}</div>
                  <div className="tl-phase-label">{ph.label}</div>
                  <div className="tl-phase-weeks">{ph.weeks}</div>
                </div>
                <div className="tl-phase-body">
                  <ul className="tl-items">
                    {ph.items.map((item,j)=>(
                      <li key={j} className="tl-item">
                        <span className="tl-item-dot" style={{background:ph.color}}/>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="tl-outcome" style={{borderLeftColor:ph.color}}>
                    <span className="tl-outcome-label">→</span> {ph.outcome}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Summary bar */}
          <Reveal delay={200}>
            <div className="tl-summary">
              <div className="tl-summary-track">
                <div className="tl-track-label">Timeline to first leads</div>
                <div className="tl-track-bar">
                  {[
                    {label:"Setup",w:"25%",color:"var(--lime)"},
                    {label:"Build",w:"25%",color:"#0A0A0A"},
                    {label:"Test",w:"25%",color:"#4A7FC1"},
                    {label:"Scale",w:"25%",color:"var(--hot-color)"},
                  ].map((s,i)=>(
                    <div key={i} className="tl-bar-seg" style={{width:s.w,background:s.color}}>
                      <span className="tl-bar-lbl" style={{color:s.color==="var(--lime)"||s.color==="var(--hot-color)"?"var(--black)":"var(--white)"}}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="tl-track-marks">
                  {["Week 0","Week 2","Week 4","Week 6–8","Week 8+"].map((m,i)=>(
                    <span key={i} className="tl-mark">{m}</span>
                  ))}
                </div>
              </div>
              <div className="tl-summary-stats">
                {[
                  {val:"2–3",unit:"weeks",label:"Funnel creation"},
                  {val:"4",unit:"weeks",label:"Traffic testing"},
                  {val:"4–8",unit:"weeks",label:"Total to first lead"},
                ].map((s,i)=>(
                  <div key={i} className="tl-stat">
                    <div className="tl-stat-val">{s.val}<span className="tl-stat-unit"> {s.unit}</span></div>
                    <div className="tl-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
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
          <p>Leads delivered exclusively for your jurisdiction and offer. Apply and we'll review your profile within 24 hours.</p>
          <a href="https://calendly.com/freedomsummit/30min" className="btn-lime">Schedule a Discovery Call →</a>
          <div style={{marginTop:16,display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap"}}>
            {["Discovery call within 48h","First leads in 4–8 weeks","Exclusive to your jurisdiction & offer"].map(t=>(
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
          <a href="/overview" style={{fontSize:13,color:"#AAA",textDecoration:"none"}}>How it works</a>
        </div>
        <div style={{fontSize:12,color:"#444"}}>© 2026 Freedom Business Summit</div>
      </div>
    </footer>
  </>);
}
