import { useState, useEffect } from "react";

/* ──────────────────────────────────────────────
   /how-it-works — step-by-step walkthrough of one
   real funnel, for use on client calls. Scroll top
   to bottom; the client sees a lead's journey from
   click to their CRM.

   Running example: Golden Visa Portugal for US investors.
   Every step has a screenshot placeholder (drop your
   own images into .hiw-shot) and a "What you get" line.

   NOTE ON NAMING: the live event is called "workshop"
   everywhere here — consistent with the real /workshop
   route. There is ONE event, not a workshop + a webinar.

   NOTE ON BENCHMARKS: the conversion figures in
   BENCHMARKS are typical/illustrative. Replace with the
   real Malta/Portugal numbers before using on calls.
   ────────────────────────────────────────────── */

const DEMO_URL = "https://platform.fsummit.net/demo";

const STEPS = [
  {
    id: "landing",
    label: "Landing",
    title: "Landing page",
    shot: "Landing page + ad creative",
    desc: "A targeted ad brings the investor to a landing page built around one program and one audience. They register for a free workshop on the program.",
    get: "Only people who chose your program — not generic “relocation” traffic.",
  },
  {
    id: "call",
    label: "AI call",
    title: "AI verification call",
    shot: "Call transcript / audio snippet",
    desc: "Within minutes of registering, our AI assistant calls the lead to confirm their details, interest, and whether they'd like to speak with an advisor.",
    get: "Verified contact details and a first read on intent.",
  },
  {
    id: "emails",
    label: "Emails",
    title: "Trigger email sequence",
    shot: "2–3 sequence emails",
    desc: "The lead receives a sequence of emails triggered by their actions: confirmation, program insights, reminders. Each email moves them one step closer to the survey.",
    get: "A lead who already knows the program basics before your first call.",
  },
  {
    id: "survey",
    label: "Survey",
    title: "Profiling survey",
    shot: "Survey form",
    desc: "The lead completes a detailed survey: budget, timeline, family, current residency, goals.",
    get: "A full client profile before you ever pick up the phone.",
  },
  {
    id: "playbook",
    label: "Playbook",
    title: "Jurisdiction playbook",
    shot: "Playbook cover + 2 pages",
    desc: "After the survey, the lead receives a playbook on the jurisdiction: costs, requirements, timelines, plus prep and reminders for the upcoming workshop.",
    get: "An educated lead, positioned to see you as the expert.",
  },
  {
    id: "workshop",
    label: "Workshop",
    title: "Workshop & follow-up",
    shot: "Workshop + follow-up emails",
    desc: "The lead attends the workshop and receives a follow-up sequence. Engagement is tracked at every step.",
    get: "Leads who have spent real time with the program — not a cold form fill.",
  },
  {
    id: "platform",
    label: "Platform",
    title: "FBS Intelligence Platform",
    shot: "Lead card in the platform (data anonymized)",
    desc: "The scored lead appears in your FBS Intelligence dashboard: survey answers, call summary, engagement history and lead score. Only leads above the threshold reach you.",
    get: "A ready-to-call lead with full context. AI sorts. Your expert closes.",
  },
];

// Illustrative benchmarks between steps — replace with real Malta/Portugal data.
const BENCHMARKS = [
  "≈ 60% of registrants answer the verification call",
  "100% enter the automated email sequence",
  "≈ 40% of registrants complete the profiling survey",
  "Every survey completer receives the playbook",
  "≈ 30% of registrants attend the workshop",
  "Only leads above the score threshold reach your dashboard",
];

const LEAD = {
  initials: "M R",
  name: "M. R.",
  sub: "US investor · Golden Visa Portugal",
  score: 82,
  tier: "HOT",
  fields: [
    ["Program", "Golden Visa Portugal"],
    ["Route", "United States → Portugal"],
    ["Budget", "€500k+ liquid"],
    ["Timeline", "3–6 months"],
    ["Family", "Spouse + 2 children"],
    ["Residency", "United States"],
  ],
  call: "Answered — requested an advisor call",
  engagement: "Opened 6 of 7 emails · Completed survey · Attended workshop",
  words: "“Looking for an EU base for the family and a Plan B — ready to move this year.”",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  :root{
    --black:#0A0A0A;--off:#F4F4F2;--white:#FFFFFF;
    --lime:#AAFF45;--lime2:#8EE032;--lime-soft:#E8F5DF;--lime-dark:#5A8A20;
    --muted:#6B6B6B;--border:#E5E5E5;--text:#0A0A0A;--text2:#3A3A3A;
  }
  html{scroll-behavior:smooth}
  body{background:var(--white);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  .hiw-wrap{max-width:1000px;margin:0 auto;padding:0 32px}
  .hiw a{color:inherit;text-decoration:none}

  @keyframes hiwPulse{0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,.5)}50%{box-shadow:0 0 0 10px rgba(170,255,69,0)}}

  .hiw nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
  .hiw .nav-inner{max-width:1000px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:62px}
  .hiw .nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-.02em;white-space:nowrap}
  .hiw .nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:hiwPulse 2.5s ease-in-out infinite}
  .hiw .nav-right{display:flex;align-items:center;gap:22px}
  .hiw .nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);transition:color .15s}
  .hiw .nav-link:hover{color:var(--black)}
  .hiw .nav-btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--black);color:var(--white);padding:9px 18px;border-radius:7px;transition:all .15s;border:none;cursor:pointer;font-family:inherit;white-space:nowrap}
  .hiw .nav-btn:hover{background:var(--lime);color:var(--black)}

  .hiw .hero{padding:120px 0 44px;position:relative;overflow:hidden}
  .hiw .hero-grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,.04) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 70% 55% at 50% 30%,black 40%,transparent 100%);-webkit-mask-image:radial-gradient(ellipse 70% 55% at 50% 30%,black 40%,transparent 100%);pointer-events:none}
  .hiw .hero>.hiw-wrap{position:relative;z-index:2}
  .hiw .eyebrow{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:16px;display:inline-flex;align-items:center;gap:10px}
  .hiw .eyebrow-line{width:24px;height:1px;background:currentColor;opacity:.4}
  .hiw .hero h1{font-size:clamp(32px,5vw,56px);font-weight:800;line-height:1.04;letter-spacing:-.035em;color:var(--black);max-width:820px}
  .hiw .hero-sub{font-size:18px;line-height:1.6;color:var(--text2);max-width:680px;margin-top:22px}
  .hiw .example-tag{display:inline-flex;align-items:center;gap:9px;margin-top:24px;background:var(--black);color:var(--white);font-size:13px;font-weight:600;padding:9px 16px;border-radius:100px}
  .hiw .example-tag b{color:var(--lime)}
  .hiw .hero-note{font-size:12.5px;color:var(--muted);margin-top:18px;font-style:italic;max-width:640px}

  /* sticky stepper */
  .hiw .stepper-bar{position:sticky;top:62px;z-index:100;background:rgba(255,255,255,.96);backdrop-filter:blur(12px);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
  .hiw .stepper{max-width:1000px;margin:0 auto;padding:12px 32px;display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}
  .hiw .stepper::-webkit-scrollbar{display:none}
  .hiw .stp{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;padding:8px 14px 8px 8px;border-radius:100px;border:1px solid var(--border);background:var(--white);cursor:pointer;transition:all .15s;font-family:inherit}
  .hiw .stp:hover{border-color:#c9c9c9}
  .hiw .stp-n{width:22px;height:22px;flex:0 0 auto;border-radius:50%;background:var(--off);color:var(--text2);display:grid;place-items:center;font-size:12px;font-weight:800}
  .hiw .stp-l{font-size:12.5px;font-weight:700;letter-spacing:-.01em;color:var(--text2);white-space:nowrap}
  .hiw .stp.active{background:var(--black);border-color:var(--black)}
  .hiw .stp.active .stp-n{background:var(--lime);color:var(--black)}
  .hiw .stp.active .stp-l{color:var(--white)}

  /* steps */
  .hiw .steps{padding:24px 0 40px}
  .hiw .step{scroll-margin-top:130px;padding:36px 0}
  .hiw .step + .step{border-top:1px solid var(--border)}
  .hiw .step-head{display:flex;align-items:baseline;gap:16px;margin-bottom:20px}
  .hiw .step-num{font-size:14px;font-weight:800;color:var(--black);background:var(--lime);width:38px;height:38px;flex:0 0 auto;border-radius:11px;display:grid;place-items:center;transform:translateY(4px)}
  .hiw .step-kicker{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:5px}
  .hiw .step-title{font-size:clamp(22px,3vw,30px);font-weight:800;letter-spacing:-.03em;color:var(--black);line-height:1.1}
  .hiw .step-body{display:grid;grid-template-columns:1.15fr 1fr;gap:28px;align-items:start}
  .hiw .shot{border:1.5px dashed #cfcfcf;border-radius:16px;background:linear-gradient(135deg,#fafafa,#f2f2f0);min-height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center}
  .hiw .shot-ic{width:44px;height:44px;border-radius:12px;background:var(--white);border:1px solid var(--border);display:grid;place-items:center;color:var(--lime-dark)}
  .hiw .shot-cap{font-size:13px;font-weight:600;color:var(--muted);max-width:240px;line-height:1.45}
  .hiw .shot-tag{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#b3b3b3}
  .hiw .step-desc{font-size:16.5px;line-height:1.6;color:var(--text2)}
  .hiw .get{margin-top:18px;background:var(--off);border:1px solid var(--border);border-left:3px solid var(--lime2);border-radius:10px;padding:14px 16px}
  .hiw .get-label{font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:5px}
  .hiw .get-text{font-size:15px;line-height:1.5;font-weight:600;color:var(--black)}

  /* benchmark connector */
  .hiw .bench{display:flex;justify-content:center;padding:2px 0}
  .hiw .bench-pill{display:inline-flex;align-items:center;gap:10px;background:var(--black);color:var(--white);font-size:13px;font-weight:600;padding:9px 18px;border-radius:100px}
  .hiw .bench-arrow{color:var(--lime);font-weight:800}
  .hiw .bench-pill b{color:var(--lime);font-weight:800}

  /* lead card */
  .hiw .platform-wrap{margin-top:8px}
  .hiw .lead-card{border:1px solid var(--border);border-radius:18px;background:var(--white);box-shadow:0 24px 60px -28px rgba(0,0,0,.28);overflow:hidden;max-width:520px}
  .hiw .lc-top{display:flex;align-items:center;gap:14px;padding:20px 22px;border-bottom:1px solid var(--border);background:linear-gradient(180deg,#fbfbfa,#fff)}
  .hiw .lc-avatar{width:46px;height:46px;flex:0 0 auto;border-radius:12px;background:var(--black);color:var(--lime);display:grid;place-items:center;font-size:15px;font-weight:800;letter-spacing:.06em}
  .hiw .lc-id{flex:1;min-width:0}
  .hiw .lc-name{font-size:17px;font-weight:800;letter-spacing:-.02em;color:var(--black)}
  .hiw .lc-sub{font-size:12.5px;color:var(--muted);margin-top:2px}
  .hiw .lc-score{text-align:center;flex:0 0 auto}
  .hiw .lc-score-n{font-size:24px;font-weight:900;letter-spacing:-.03em;color:var(--black);line-height:1}
  .hiw .lc-score-n span{font-size:13px;color:var(--muted);font-weight:700}
  .hiw .lc-tier{display:inline-block;margin-top:5px;font-size:10px;font-weight:800;letter-spacing:.08em;background:var(--lime);color:var(--black);padding:3px 9px;border-radius:100px}
  .hiw .lc-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border)}
  .hiw .lc-cell{background:var(--white);padding:14px 16px}
  .hiw .lc-k{font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
  .hiw .lc-v{font-size:14.5px;font-weight:700;color:var(--black)}
  .hiw .lc-rows{padding:4px 0}
  .hiw .lc-row{display:flex;gap:12px;padding:13px 18px;border-top:1px solid var(--border);align-items:flex-start}
  .hiw .lc-row-ic{width:22px;height:22px;flex:0 0 auto;border-radius:6px;background:var(--lime-soft);color:var(--lime-dark);display:grid;place-items:center;font-size:12px;font-weight:900}
  .hiw .lc-row-k{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin-bottom:3px}
  .hiw .lc-row-v{font-size:14px;font-weight:600;color:var(--black);line-height:1.4}
  .hiw .lc-words{padding:16px 18px;border-top:1px solid var(--border);background:var(--off)}
  .hiw .lc-words-q{font-size:14.5px;line-height:1.55;font-weight:600;color:var(--black);font-style:italic}

  /* CTA */
  .hiw .cta-sec{padding:20px 0 88px}
  .hiw .cta{background:var(--black);border-radius:22px;padding:48px 44px;text-align:center}
  .hiw .cta h2{font-size:clamp(24px,3.2vw,36px);font-weight:800;letter-spacing:-.03em;color:var(--white);line-height:1.1;max-width:640px;margin:0 auto 26px}
  .hiw .cta h2 b{color:var(--lime)}
  .hiw .cta-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  .hiw .btn{font-family:'Inter',sans-serif;font-size:14px;font-weight:700;letter-spacing:.01em;padding:15px 28px;border-radius:9px;border:1px solid rgba(255,255,255,.22);background:transparent;color:var(--white);cursor:pointer;transition:all .2s}
  .hiw .btn:hover{border-color:rgba(255,255,255,.5)}
  .hiw .btn.primary{background:var(--lime);color:var(--black);border-color:var(--lime)}
  .hiw .btn.primary:hover{box-shadow:0 12px 32px -8px rgba(170,255,69,.5)}

  .hiw footer{padding:40px 0;background:var(--white);border-top:1px solid var(--border)}
  .hiw .foot-inner{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
  .hiw .foot-logo{font-size:14px;font-weight:800;display:flex;align-items:center;gap:9px}
  .hiw .foot-note{font-size:12.5px;color:var(--muted);margin-top:8px}
  .hiw .foot-links{display:flex;gap:22px}
  .hiw .foot-links a{font-size:12.5px;color:var(--text2)}
  .hiw .foot-links a:hover{color:var(--black)}

  @media(max-width:820px){
    .hiw .step-body{grid-template-columns:1fr;gap:18px}
    .hiw .lead-card{max-width:none}
  }
  @media(max-width:640px){
    .hiw .nav-inner{height:56px;padding:0 18px}
    .hiw .nav-right{gap:12px}
    .hiw .nav-link{display:none}
    .hiw .nav-btn{font-size:11px;padding:9px 14px}
    .hiw-wrap{padding:0 18px}
    .hiw .stepper{padding:10px 18px}
    .hiw .stepper-bar{top:56px}
    .hiw .step{scroll-margin-top:118px}
    .hiw .cta{padding:34px 22px}
    .hiw .lc-grid{grid-template-columns:1fr}
  }
`;

function ShotIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState("landing");

  useEffect(() => {
    document.title = "How it works — FBS Intelligence";
    const opts = { rootMargin: "-45% 0px -50% 0px", threshold: 0 };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, opts);
    STEPS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="hiw">
      <style>{css}</style>

      <nav>
        <div className="nav-inner">
          <a className="nav-logo" href="/"><span className="nav-logo-dot" />FBS Intelligence</a>
          <div className="nav-right">
            <a className="nav-link" href="/overview">Overview</a>
            <a className="nav-link" href="/calc">Calculator</a>
            <a className="nav-btn" href={DEMO_URL} target="_blank" rel="noreferrer">Book a demo</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="hero-grid" />
        <div className="hiw-wrap">
          <div className="eyebrow"><span className="eyebrow-line" />How it works</div>
          <h1>See exactly how a lead reaches you</h1>
          <p className="hero-sub">Every lead passes through 7 steps of verification and warm-up before it lands in your pipeline. Here is the full journey, using a real campaign.</p>
          <div className="example-tag">Live example: <b>Golden Visa Portugal</b> · US investors</div>
          <p className="hero-note">Conversion figures shown between steps are typical benchmarks for this program type and adjust to your market.</p>
        </div>
      </header>

      {/* STICKY STEPPER */}
      <div className="stepper-bar">
        <div className="stepper">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              className={`stp${active === s.id ? " active" : ""}`}
              onClick={() => jump(s.id)}
            >
              <span className="stp-n">{i + 1}</span>
              <span className="stp-l">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEPS */}
      <main className="steps">
        <div className="hiw-wrap">
          {STEPS.map((s, i) => (
            <div key={s.id}>
              <section className="step" id={s.id}>
                <div className="step-head">
                  <div className="step-num">{i + 1}</div>
                  <div>
                    <div className="step-kicker">Step {i + 1}</div>
                    <h2 className="step-title">{s.title}</h2>
                  </div>
                </div>
                <div className="step-body">
                  <div className="shot">
                    <div className="shot-ic"><ShotIcon /></div>
                    <div className="shot-cap">{s.shot}</div>
                    <div className="shot-tag">Screenshot</div>
                  </div>
                  <div>
                    <p className="step-desc">{s.desc}</p>
                    <div className="get">
                      <div className="get-label">What you get</div>
                      <div className="get-text">{s.get}</div>
                    </div>
                    {s.id === "platform" && (
                      <div className="platform-wrap" style={{ marginTop: "22px" }}>
                        <div className="lead-card">
                          <div className="lc-top">
                            <div className="lc-avatar">{LEAD.initials}</div>
                            <div className="lc-id">
                              <div className="lc-name">{LEAD.name}</div>
                              <div className="lc-sub">{LEAD.sub}</div>
                            </div>
                            <div className="lc-score">
                              <div className="lc-score-n">{LEAD.score}<span>/100</span></div>
                              <div className="lc-tier">{LEAD.tier}</div>
                            </div>
                          </div>
                          <div className="lc-grid">
                            {LEAD.fields.map(([k, v]) => (
                              <div className="lc-cell" key={k}>
                                <div className="lc-k">{k}</div>
                                <div className="lc-v">{v}</div>
                              </div>
                            ))}
                          </div>
                          <div className="lc-rows">
                            <div className="lc-row">
                              <span className="lc-row-ic">✓</span>
                              <div>
                                <div className="lc-row-k">Verification call</div>
                                <div className="lc-row-v">{LEAD.call}</div>
                              </div>
                            </div>
                            <div className="lc-row">
                              <span className="lc-row-ic">✓</span>
                              <div>
                                <div className="lc-row-k">Engagement</div>
                                <div className="lc-row-v">{LEAD.engagement}</div>
                              </div>
                            </div>
                          </div>
                          <div className="lc-words">
                            <div className="lc-row-k" style={{ marginBottom: "6px" }}>In their words</div>
                            <div className="lc-words-q">{LEAD.words}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
              {i < BENCHMARKS.length && (
                <div className="bench">
                  <div className="bench-pill"><span className="bench-arrow">↓</span>{BENCHMARKS[i]}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* CTA */}
      <section className="cta-sec">
        <div className="hiw-wrap">
          <div className="cta">
            <h2>Want to see this built for <b>your program and geo</b>?</h2>
            <div className="cta-actions">
              <a className="btn primary" href={DEMO_URL} target="_blank" rel="noreferrer">Book a walkthrough</a>
              <a className="btn" href="/industries#estimate">Get your CPL estimate</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="hiw-wrap foot-inner">
          <div>
            <div className="foot-logo"><span className="nav-logo-dot" />FBS Intelligence</div>
            <div className="foot-note">Part of Freedom Business Summit · Lead intelligence for high-ticket services</div>
          </div>
          <div className="foot-links">
            <a href="/overview">Overview</a>
            <a href="/calc">Calculator</a>
            <a href="/industries">Industries</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
