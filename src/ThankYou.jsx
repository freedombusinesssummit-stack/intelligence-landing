import { useEffect, useState, useRef } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{
  --black:#0A0A0A;--off:#F4F4F2;--white:#FFFFFF;
  --lime:#AAFF45;--lime2:#8EE032;--lime-soft:#E8F5DF;--lime-dark:#5A8A20;
  --muted:#6B6B6B;--border:#E5E5E5;--dark:#0F0F0F;--text:#0A0A0A;--text2:#5A5A56;
  --warn:#FF6B35;--warn-bg:#FFF3EE;
}
html{scroll-behavior:smooth;}
body{background:var(--off);color:var(--black);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;}

@keyframes pulseLime{0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,0.5)}50%{box-shadow:0 0 0 10px rgba(170,255,69,0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes checkPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
@keyframes slideDown{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}

/* NAV */
nav{background:var(--white);border-bottom:1px solid var(--border);padding:0 32px;height:62px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;}
.nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-0.02em;text-decoration:none;}
.nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:pulseLime 2.5s ease-in-out infinite;}
.nav-right{display:flex;align-items:center;gap:20px;}
.nav-text{font-size:12px;color:var(--muted);font-weight:500;}
.nav-back{font-size:12px;color:var(--muted);text-decoration:none;font-weight:500;}
.nav-back:hover{color:var(--black);}

/* STICKY REMINDER BAR */
.sticky-bar{position:fixed;top:62px;left:0;right:0;z-index:90;background:#1A1A1A;color:var(--white);padding:10px 32px;display:flex;align-items:center;justify-content:space-between;gap:16px;animation:slideDown 0.4s cubic-bezier(0.16,1,0.3,1);border-bottom:1px solid rgba(255,255,255,0.08);}
.sticky-bar.hidden{display:none;}
.sticky-bar-left{display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(255,255,255,0.75);font-weight:500;}
.sticky-dot{width:6px;height:6px;border-radius:50%;background:var(--lime);animation:pulse 1.5s ease-in-out infinite;flex-shrink:0;}
.sticky-bar-btn{background:var(--lime);color:var(--black);font-family:'Inter',sans-serif;font-size:12px;font-weight:800;padding:7px 18px;border-radius:7px;border:none;cursor:pointer;white-space:nowrap;transition:all 0.15s;}
.sticky-bar-btn:hover{background:var(--lime2);}
.sticky-bar-close{background:none;border:none;color:rgba(255,255,255,0.35);cursor:pointer;font-size:16px;padding:0 4px;line-height:1;flex-shrink:0;transition:color 0.15s;}
.sticky-bar-close:hover{color:rgba(255,255,255,0.7);}

/* HERO */
.ty-hero{padding:56px 32px 40px;text-align:center;animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;}
.ty-check{width:72px;height:72px;background:var(--lime);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:var(--black);margin-bottom:24px;animation:checkPop 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both;}
.ty-pill{display:inline-flex;align-items:center;gap:7px;background:var(--lime-soft);border:1px solid rgba(170,255,69,0.4);border-radius:100px;padding:5px 14px 5px 8px;margin-bottom:18px;font-size:12px;font-weight:700;color:var(--lime-dark);letter-spacing:0.04em;}
.ty-pill-dot{width:6px;height:6px;background:var(--lime);border-radius:50%;}
.ty-hero h1{font-size:clamp(26px,3.8vw,42px);font-weight:800;letter-spacing:-0.03em;color:var(--black);margin-bottom:12px;line-height:1.1;}
.ty-hero p{font-size:16px;color:var(--text2);max-width:480px;margin:0 auto;line-height:1.65;}

/* PROGRESS STEPS */
.ty-steps-wrap{max-width:680px;margin:32px auto 0;padding:0 24px;}
.ty-steps{background:var(--white);border:1px solid var(--border);border-radius:14px;overflow:hidden;display:flex;}
.ty-step{flex:1;padding:16px 14px;text-align:center;border-right:1px solid var(--border);transition:all 0.2s;}
.ty-step:last-child{border-right:none;}
.ty-step.done{background:var(--lime-soft);}
.ty-step.active{background:var(--black);}
.ty-step-icon{font-size:18px;margin-bottom:6px;}
.ty-step-num{font-size:9px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:4px;}
.ty-step.done .ty-step-num{color:var(--lime-dark);}
.ty-step.active .ty-step-num{color:rgba(170,255,69,0.6);}
.ty-step-label{font-size:12px;font-weight:700;color:var(--black);}
.ty-step.done .ty-step-label{color:var(--lime-dark);}
.ty-step.active .ty-step-label{color:var(--white);}
.ty-step-sub{font-size:11px;color:var(--muted);margin-top:2px;}
.ty-step.active .ty-step-sub{color:rgba(255,255,255,0.5);}

/* WHAT HAPPENS NEXT */
.next-section{max-width:900px;margin:0 auto;padding:48px 24px 0;}
.next-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:28px;}
.next-card{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:24px;display:flex;align-items:flex-start;gap:16px;transition:all 0.2s;}
.next-card:hover{border-color:var(--black);transform:translateY(-2px);}
.next-icon{width:40px;height:40px;border-radius:10px;background:var(--off);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.next-h{font-size:14px;font-weight:700;color:var(--black);margin-bottom:4px;}
.next-p{font-size:13px;color:var(--text2);line-height:1.55;}
.next-time{display:inline-block;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--lime-dark);margin-top:6px;}

/* PROOF STRIP */
.proof-section{max-width:900px;margin:0 auto;padding:48px 24px 0;}
.proof-strip{background:var(--black);border-radius:16px;padding:32px 40px;display:grid;grid-template-columns:repeat(4,1fr);gap:0;}
.proof-stat{padding-right:28px;margin-right:28px;border-right:1px solid rgba(255,255,255,0.1);}
.proof-stat:last-child{border-right:none;padding-right:0;margin-right:0;}
.proof-num{font-size:32px;font-weight:900;letter-spacing:-0.03em;color:var(--lime);line-height:1;margin-bottom:6px;}
.proof-label{font-size:12px;color:rgba(255,255,255,0.5);line-height:1.45;}

/* TESTIMONIALS */
.test-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:16px;}
.test-card{background:var(--white);border:1px solid var(--border);border-radius:12px;padding:20px;}
.test-stars{color:var(--lime-dark);font-size:12px;margin-bottom:10px;letter-spacing:2px;}
.test-quote{font-size:13px;color:var(--text);line-height:1.65;margin-bottom:14px;font-style:italic;}
.test-meta{display:flex;align-items:center;gap:10px;}
.test-av{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--white);flex-shrink:0;}
.test-name{font-size:13px;font-weight:700;color:var(--black);}
.test-role{font-size:11px;color:var(--muted);}

/* OVERVIEW CTA */
.overview-cta{max-width:900px;margin:0 auto;padding:48px 24px 0;}
.overview-card{background:linear-gradient(135deg,#0F1A0A,#0A1205);border:1px solid rgba(170,255,69,0.2);border-radius:20px;padding:40px 48px;display:grid;grid-template-columns:1fr auto;gap:40px;align-items:center;position:relative;overflow:hidden;}
.overview-card::before{content:'';position:absolute;top:-40%;right:-10%;width:50%;height:180%;background:radial-gradient(ellipse at center,rgba(170,255,69,0.12),transparent 60%);filter:blur(40px);pointer-events:none;}
.overview-card-content{position:relative;z-index:2;}
.overview-eyebrow{font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:rgba(170,255,69,0.6);margin-bottom:12px;}
.overview-card h3{font-size:clamp(20px,2.4vw,26px);font-weight:800;color:var(--white);letter-spacing:-0.025em;line-height:1.2;margin-bottom:10px;}
.overview-card p{font-size:14px;color:rgba(255,255,255,0.55);line-height:1.65;}
.overview-card-visual{position:relative;z-index:2;flex-shrink:0;}
.overview-steps{display:flex;flex-direction:column;gap:10px;}
.ov-step{display:flex;align-items:center;gap:12px;padding:10px 16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:9px;white-space:nowrap;}
.ov-step-n{font-size:10px;font-weight:800;color:rgba(170,255,69,0.6);min-width:20px;}
.ov-step-t{font-size:13px;font-weight:600;color:rgba(255,255,255,0.8);}
.ov-step.active{background:rgba(170,255,69,0.1);border-color:rgba(170,255,69,0.3);}
.ov-step.active .ov-step-t{color:var(--lime);}
.overview-btn{display:inline-flex;align-items:center;gap:8px;background:var(--lime);color:var(--black);text-decoration:none;font-family:'Inter',sans-serif;font-size:14px;font-weight:800;padding:14px 28px;border-radius:10px;margin-top:24px;transition:all 0.2s;}
.overview-btn:hover{background:var(--lime2);transform:translateX(3px);}

/* CALENDLY SECTION */
.cal-section{max-width:900px;margin:0 auto;padding:48px 24px 80px;}
.cal-header{text-align:center;margin-bottom:28px;}
.cal-label{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;}
.cal-label-dot{width:7px;height:7px;border-radius:50%;background:var(--lime);animation:pulse 1.5s ease-in-out infinite;}
.cal-header h2{font-size:clamp(22px,2.8vw,32px);font-weight:800;color:var(--black);letter-spacing:-0.025em;margin-bottom:8px;}
.cal-header p{font-size:15px;color:var(--text2);}
.cal-wrap{background:var(--white);border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:0 12px 40px -8px rgba(0,0,0,0.1);}
.calendly-inline-widget{min-width:320px;height:700px;}
.cal-disclaimer{text-align:center;font-size:12px;color:var(--muted);margin-top:14px;}

/* FOOTER */
.ty-footer{text-align:center;padding:28px 32px;font-size:12px;color:var(--muted);border-top:1px solid var(--border);background:var(--white);}
.ty-footer a{color:var(--muted);text-decoration:none;}
.ty-footer a:hover{color:var(--black);}

@media(max-width:768px){
  nav{padding:0 20px;}
  .ty-hero{padding:36px 20px 28px;}
  .ty-steps-wrap{padding:0 16px;}
  .ty-steps{flex-direction:column;}
  .ty-step{border-right:none;border-bottom:1px solid var(--border);text-align:left;display:flex;align-items:center;gap:14px;padding:12px 16px;}
  .ty-step:last-child{border-bottom:none;}
  .ty-step-icon{margin-bottom:0;}
  .next-grid{grid-template-columns:1fr;}
  .overview-card{grid-template-columns:1fr;gap:24px;padding:28px 24px;}
  .overview-card-visual{display:none;}
  .sticky-bar{flex-wrap:wrap;gap:10px;}
  .calendly-inline-widget{height:580px;}
}
`;

export default function ThankYou() {
  const [stickyVisible, setStickyVisible] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);
  const calRef = useRef(null);
  const calSectionRef = useRef(null);

  useEffect(() => {
    // Load Calendly
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);

    // Show sticky bar after user scrolls past Calendly widget
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting && !stickyDismissed) setStickyVisible(true);
        if (e.isIntersecting) setStickyVisible(false);
      },
      { threshold: 0.1 }
    );
    if (calSectionRef.current) obs.observe(calSectionRef.current);

    return () => {
      document.head.removeChild(script);
      obs.disconnect();
    };
  }, [stickyDismissed]);

  const scrollToCal = () => {
    calSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    setStickyVisible(false);
  };

  return (
    <>
      <style>{css}</style>

      {/* STICKY REMINDER */}
      {stickyVisible && !stickyDismissed && (
        <div className="sticky-bar">
          <div className="sticky-bar-left">
            <span className="sticky-dot" />
            Your application is in — but your slot isn't reserved until you book a time.
          </div>
          <button className="sticky-bar-btn" onClick={scrollToCal}>
            Book your call ↓
          </button>
          <button className="sticky-bar-close" onClick={() => { setStickyDismissed(true); setStickyVisible(false); }}>✕</button>
        </div>
      )}

      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo"><div className="nav-logo-dot" />FBS Intelligence</a>
        <div className="nav-right">
          <span className="nav-text">Application submitted ✓</span>
          <a href="/" className="nav-back">← Home</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="ty-hero">
        <div className="ty-check">✓</div>
        <div className="ty-pill"><span className="ty-pill-dot" />Application received · 24h review</div>
        <h1>You're in.<br />Now book your discovery call.</h1>
        <p>We review every application within 24 hours. Pick a time below — your slot isn't reserved until you book it.</p>
      </div>

      {/* STEPS */}
      <div className="ty-steps-wrap">
        <div className="ty-steps">
          {[
            {icon:"✅",n:"01",label:"Application",sub:"Submitted just now",done:true},
            {icon:"📅",n:"02",label:"Book a call",sub:"Pick a time below",active:true},
            {icon:"📞",n:"03",label:"Discovery call",sub:"30 min · we scope the fit"},
            {icon:"📥",n:"04",label:"First leads",sub:"Within 7–14 days of signing"},
          ].map((s,i)=>(
            <div key={i} className={`ty-step ${s.done?"done":""} ${s.active?"active":""}`}>
              <div className="ty-step-icon">{s.icon}</div>
              <div>
                <div className="ty-step-num">Step {s.n}</div>
                <div className="ty-step-label">{s.label}</div>
                <div className="ty-step-sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CALENDLY — right after steps */}
      <div className="cal-section" ref={calSectionRef}>
        <div className="cal-header">
          <div className="cal-label"><span className="cal-label-dot" />Step 02 — Book your call</div>
          <h2>Pick a time for your<br />30-minute discovery call.</h2>
          <p>No pitch deck. No obligation. We'll scope your jurisdiction, confirm fit, and walk you through pricing.</p>
        </div>
        <div className="cal-wrap" ref={calRef}>
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/freedomsummit/30min?hide_event_type_details=1&hide_gdpr_banner=1"
          />
        </div>
        <div style={{textAlign:"center",marginTop:24}}>
          <a href="/overview" style={{display:"inline-flex",alignItems:"center",gap:8,background:"var(--off)",border:"1.5px solid var(--border)",color:"var(--black)",textDecoration:"none",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,padding:"13px 28px",borderRadius:10,transition:"all 0.2s",letterSpacing:"-0.01em"}}>
            Explore how it works →
          </a>
        </div>
      </div>

      {/* WHAT HAPPENS NEXT */}
      <div className="next-section">
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--muted)",marginBottom:6}}>What happens next</div>
        <h2 style={{fontSize:"clamp(20px,2.4vw,28px)",fontWeight:800,letterSpacing:"-0.025em",color:"var(--black)",marginBottom:0}}>Three things happen in the next 48 hours.</h2>
        <div className="next-grid">
          {[
            {icon:"🔍",h:"We review your firm profile",p:"Within 24 hours, we check jurisdiction fit, current lead sources, and team capacity. If there's a match, we confirm your spot.",time:"Within 24h"},
            {icon:"📧",h:"You receive a confirmation email",p:"Check your inbox — we send a summary of your application and what to expect on the discovery call.",time:"Within 2h"},
            {icon:"📞",h:"We prepare your ICP brief",p:"Before the call, we research your jurisdiction demand, typical buyer profiles, and campaign approach — so the call is specific, not generic.",time:"Before the call"},
          ].map((n,i)=>(
            <div key={i} className="next-card">
              <div className="next-icon">{n.icon}</div>
              <div>
                <div className="next-h">{n.h}</div>
                <div className="next-p">{n.p}</div>
                <div className="next-time">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OVERVIEW CTA */}
      <div className="overview-cta">
        <div className="overview-card">
          <div className="overview-card-content">
            <div className="overview-eyebrow">⚠ You haven't seen this yet</div>
            <h3>Understand exactly how we build your funnel before the call.</h3>
            <p>Most partners come to the discovery call without knowing how the acquisition process works. Read the full overview — video ads, webinar, survey, scoring, dashboard delivery — so we can skip the basics and go straight to your specific market.</p>
            <a href="/overview" className="overview-btn">
              See how the funnel works →
            </a>
          </div>
          <div className="overview-card-visual">
            <div className="overview-steps">
              {[
                {n:"01",t:"Video ads → your ICP",active:false},
                {n:"02",t:"Webinar registration",active:false},
                {n:"03",t:"GMS Survey (14 Q)",active:false},
                {n:"04",t:"Score & verify intent",active:false},
                {n:"05",t:"Leads in your dashboard",active:true},
              ].map((s,i)=>(
                <div key={i} className={`ov-step ${s.active?"active":""}`}>
                  <span className="ov-step-n">{s.n}</span>
                  <span className="ov-step-t">{s.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer style={{background:"#0A0A0A",borderTop:"1px solid #1a1a1a",padding:"64px 0 40px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 32px"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:48,marginBottom:48}}>
            <div>
              <h4 style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:12,display:"flex",alignItems:"center",gap:8,letterSpacing:"-0.02em"}}>
                <span style={{width:8,height:8,background:"#AAFF45",borderRadius:"50%",display:"inline-block"}}/>
                FBS Intelligence
              </h4>
              <p style={{fontSize:13,color:"#888",maxWidth:360,lineHeight:1.7,margin:0}}>The B2B lead intelligence platform built on Freedom Business Summit's 7-year event ecosystem.</p>
            </div>
            <div>
              <h5 style={{fontSize:11,fontWeight:700,color:"#AAA",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16,marginTop:0}}>Platform</h5>
              <a href="/" style={{display:"block",fontSize:13,color:"#888",textDecoration:"none",padding:"6px 0"}}>Home</a>
              <a href="/overview" style={{display:"block",fontSize:13,color:"#888",textDecoration:"none",padding:"6px 0"}}>How it works</a>
              <a href="/pricing" style={{display:"block",fontSize:13,color:"#888",textDecoration:"none",padding:"6px 0"}}>Pricing</a>
            </div>
            <div>
              <h5 style={{fontSize:11,fontWeight:700,color:"#AAA",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16,marginTop:0}}>Company</h5>
              <a href="/" style={{display:"block",fontSize:13,color:"#888",textDecoration:"none",padding:"6px 0"}}>Apply</a>
              <a href="https://fsummit.net" style={{display:"block",fontSize:13,color:"#888",textDecoration:"none",padding:"6px 0"}}>Freedom Business Summit</a>
              <a href="mailto:denis@fsummit.net" style={{display:"block",fontSize:13,color:"#888",textDecoration:"none",padding:"6px 0"}}>Contact</a>
            </div>
          </div>
          <div style={{paddingTop:32,borderTop:"1px solid #1a1a1a",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <p style={{fontSize:12,color:"#666",margin:0}}>© 2026 Freedom Business Summit · FBS Intelligence</p>
            <p style={{fontSize:12,color:"#666",margin:0}}>fbsintelligence.com</p>
          </div>
        </div>
      </footer>
    </>
  );
}
