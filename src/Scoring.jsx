/* ──────────────────────────────────────────────
   /scoring — the Global Mobility Score (GMS)
   explained: a 14–25 question survey scored 0–100.
   Same stack + design language as the main site.
   ────────────────────────────────────────────── */

const STATS = [
  { big: "14–25", label: "questions in the survey" },
  { big: "6", label: "readiness dimensions" },
  { big: "0–100", label: "score range" },
  { big: "~37%", label: "of registrants complete it" },
];

const TIERS = [
  {
    name: "Nurture",
    range: "0–39",
    color: "#8A8F98",
    desc: "Early interest. Worth staying in touch with, but not ready for a conversation yet.",
  },
  {
    name: "Qualified",
    range: "40–59",
    color: "#4A7FC1",
    desc: "Completed the full survey and cleared the threshold - a concrete budget range, a timeline, and a decision-making role.",
  },
  {
    name: "Warm",
    range: "60–79",
    color: "#C07D10",
    desc: "A stronger signal across the board - actively weighing a move.",
  },
  {
    name: "Hot",
    range: "80–100",
    color: "#D94F3A",
    desc: "High intent. The people your team should reach out to first.",
  },
];

const CRITERIA = [
  { t: "Budget range", d: "A concrete, self-reported investment budget." },
  { t: "Timeline", d: "How soon they intend to make a move." },
  { t: "Decision-making role", d: "Whether they are the one who decides." },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  :root{
    --black:#0A0A0A;--off:#F4F4F2;--cream:#EBEBEB;--white:#FFFFFF;
    --lime:#AAFF45;--lime2:#8EE032;--lime-soft:#E8F5DF;--lime-dark:#5A8A20;
    --muted:#6B6B6B;--border:#E5E5E5;--text:#0A0A0A;--text2:#3A3A3A;
  }
  html{scroll-behavior:smooth}
  body{background:var(--white);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  .sc-wrap{max-width:1200px;margin:0 auto;padding:0 32px}
  .scoring a{color:inherit;text-decoration:none}

  @keyframes scFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scPulseLime{0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,.5)}50%{box-shadow:0 0 0 10px rgba(170,255,69,0)}}
  @keyframes scGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  .scoring .fade-up{animation:scFadeUp .7s cubic-bezier(.16,1,.3,1) both}
  .scoring .fu2{animation-delay:.1s}.scoring .fu3{animation-delay:.18s}.scoring .fu4{animation-delay:.26s}

  .scoring nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
  .scoring .nav-inner{display:flex;align-items:center;justify-content:space-between;height:62px}
  .scoring .nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-.02em}
  .scoring .nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:scPulseLime 2.5s ease-in-out infinite}
  .scoring .nav-logo em{font-style:normal;font-weight:400;color:var(--muted);font-size:12px}
  .scoring .nav-right{display:flex;align-items:center;gap:24px}
  .scoring .nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);position:relative;padding:4px 0;transition:color .15s}
  .scoring .nav-link::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:var(--lime);transform:scaleX(0);transition:transform .2s}
  .scoring .nav-link:hover{color:var(--black)}.scoring .nav-link:hover::after{transform:scaleX(1)}
  .scoring .nav-btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--black);color:var(--white);padding:9px 18px;border-radius:7px;transition:all .15s}
  .scoring .nav-btn:hover{background:var(--lime);color:var(--black)}

  .scoring .hero{padding:132px 0 64px;background:var(--white);border-bottom:1px solid var(--border);position:relative;overflow:hidden}
  .scoring .hero-grid-bg{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,.04) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);-webkit-mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);pointer-events:none}
  .scoring .hero>.sc-wrap{position:relative;z-index:2}
  .scoring .eyebrow{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:20px;display:inline-flex;align-items:center;gap:10px}
  .scoring .eyebrow-line{width:24px;height:1px;background:currentColor;opacity:.4}
  .scoring .hero h1{font-size:clamp(38px,5.2vw,64px);font-weight:800;line-height:1.03;letter-spacing:-.035em;color:var(--black);max-width:900px}
  .scoring .accent{position:relative;display:inline-block}
  .scoring .accent::after{content:'';position:absolute;bottom:.04em;left:-2px;right:-2px;height:.3em;background:var(--lime);z-index:-1;border-radius:2px}
  .scoring .hero-desc{font-size:18px;line-height:1.65;color:var(--text2);max-width:640px;margin-top:24px}

  .scoring .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:44px}
  .scoring .stat{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:20px 22px}
  .scoring .stat-big{font-size:clamp(24px,3vw,34px);font-weight:900;letter-spacing:-.03em;color:var(--black);font-variant-numeric:tabular-nums}
  .scoring .stat-label{font-size:12.5px;color:var(--text2);margin-top:6px;line-height:1.35}

  .scoring .section{padding:88px 0}
  .scoring .section-off{background:var(--off);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
  .scoring .section h2{font-size:clamp(28px,3.4vw,44px);font-weight:800;letter-spacing:-.03em;line-height:1.06;color:var(--black);margin-bottom:16px;max-width:760px}
  .scoring .hl-sm{background:linear-gradient(120deg,var(--lime),var(--lime));background-repeat:no-repeat;background-size:100% .32em;background-position:0 88%;padding:0 4px}
  .scoring .section-body{font-size:17px;line-height:1.62;color:var(--text2);max-width:640px;margin-bottom:40px}

  /* the 0–100 scale bar */
  .scoring .scale{margin-bottom:16px}
  .scoring .scale-bar{display:flex;height:56px;border-radius:12px;overflow:hidden;border:1px solid var(--border);transform-origin:left;animation:scGrow .8s cubic-bezier(.16,1,.3,1) both}
  .scoring .scale-seg{flex:1;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
  .scoring .scale-marks{display:flex;justify-content:space-between;margin-top:8px;font-size:11px;font-weight:700;color:var(--muted);font-variant-numeric:tabular-nums}
  .scoring .scale-note{font-size:12px;color:var(--muted);margin-top:10px}

  .scoring .tiers{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:32px}
  .scoring .tier{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:20px 20px;border-top:3px solid var(--tc)}
  .scoring .tier-head{display:flex;align-items:center;gap:9px;margin-bottom:10px}
  .scoring .tier-dot{width:10px;height:10px;border-radius:50%;background:var(--tc)}
  .scoring .tier-name{font-size:15px;font-weight:800;letter-spacing:-.01em;color:var(--black)}
  .scoring .tier-range{margin-left:auto;font-size:12px;font-weight:700;color:var(--muted);font-variant-numeric:tabular-nums}
  .scoring .tier-desc{font-size:13.5px;line-height:1.5;color:var(--text2)}

  .scoring .measure{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
  .scoring .criteria{display:flex;flex-direction:column;gap:10px}
  .scoring .crit{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start;background:var(--white);border:1px solid var(--border);border-radius:12px;padding:16px 18px}
  .scoring .crit-check{width:24px;height:24px;border-radius:7px;background:var(--lime);color:var(--black);display:grid;place-items:center;font-size:13px;font-weight:900}
  .scoring .crit-t{font-size:15px;font-weight:700;color:var(--black)}
  .scoring .crit-d{font-size:13.5px;color:var(--text2);margin-top:3px;line-height:1.45}
  .scoring .measure-note{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:24px 26px}
  .scoring .measure-note h3{font-size:18px;font-weight:800;letter-spacing:-.02em;color:var(--black);margin-bottom:10px}
  .scoring .measure-note p{font-size:15px;line-height:1.6;color:var(--text2)}
  .scoring .measure-note p+p{margin-top:12px}

  .scoring .use{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}
  .scoring .use-panel{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:8px;box-shadow:0 16px 40px -18px rgba(0,0,0,.18)}
  .scoring .use-row{display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:center;padding:13px 16px;border-bottom:1px solid var(--border);font-size:13px}
  .scoring .use-row:last-child{border-bottom:none}
  .scoring .use-name{font-weight:600;color:var(--black)}
  .scoring .use-score{font-weight:800;color:var(--black);font-variant-numeric:tabular-nums}
  .scoring .use-score small{color:var(--muted);font-weight:500}
  .scoring .badge{font-size:10px;font-weight:800;padding:3px 9px;border-radius:5px;letter-spacing:.04em;color:#fff}

  .scoring .cta{background:var(--black);border-radius:20px;padding:44px 44px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
  .scoring .cta-t{font-size:clamp(22px,2.6vw,30px);font-weight:800;letter-spacing:-.025em;color:var(--white);max-width:560px;line-height:1.12}
  .scoring .cta-actions{display:flex;gap:10px;flex-wrap:wrap}
  .scoring .btn{font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:.01em;padding:14px 24px;border-radius:8px;border:1px solid var(--border);background:var(--white);color:var(--text2);cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px}
  .scoring .btn:hover{color:var(--black);border-color:#cfcfcf}
  .scoring .btn.primary{background:var(--lime);color:var(--black);border-color:var(--lime)}
  .scoring .btn.primary:hover{box-shadow:0 12px 32px -8px rgba(170,255,69,.5)}
  .scoring .btn.ghost{background:transparent;color:var(--white);border-color:rgba(255,255,255,.25)}
  .scoring .btn.ghost:hover{border-color:var(--white);color:var(--white)}

  .scoring footer{padding:48px 0;background:var(--white);border-top:1px solid var(--border)}
  .scoring .foot-inner{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
  .scoring .foot-logo{font-size:14px;font-weight:800;display:flex;align-items:center;gap:9px}
  .scoring .foot-note{font-size:12.5px;color:var(--muted);margin-top:8px}
  .scoring .foot-links{display:flex;gap:22px}
  .scoring .foot-links a{font-size:12.5px;color:var(--text2)}
  .scoring .foot-links a:hover{color:var(--black)}

  @media(max-width:880px){
    .scoring .hero{padding:120px 0 48px}
    .scoring .stats{grid-template-columns:1fr 1fr}
    .scoring .tiers{grid-template-columns:1fr 1fr}
    .scoring .measure,.scoring .use{grid-template-columns:1fr;gap:24px}
    .scoring .scale-seg{font-size:11px}
    .scoring .cta{padding:30px 24px}
  }
  @media(max-width:560px){.scoring .tiers{grid-template-columns:1fr}}
  @media(prefers-reduced-motion:reduce){.scoring *{animation:none!important;transition:none!important}}
`;

export default function Scoring() {
  return (
    <div className="scoring">
      <style>{css}</style>

      <nav>
        <div className="sc-wrap nav-inner">
          <a className="nav-logo" href="/"><span className="nav-logo-dot" />FBS Intelligence <em>/ Scoring</em></a>
          <div className="nav-right">
            <a className="nav-link" href="/overview">Overview</a>
            <a className="nav-link" href="/questions">Questions</a>
            <a className="nav-btn" href="/">fbsintelligence.com ↗</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-grid-bg" />
        <div className="sc-wrap">
          <div className="eyebrow fade-up"><span className="eyebrow-line" />The methodology</div>
          <h1 className="fade-up fu2">The <span className="accent">Global Mobility Score</span>.</h1>
          <p className="hero-desc fade-up fu3">Every webinar registrant is invited to complete a short survey - 14 to 25 questions across six readiness dimensions. Their answers become a single number from 0 to 100 that tells you how ready they are to make a move.</p>
          <div className="stats fade-up fu4">
            {STATS.map((s) => (
              <div className="stat" key={s.big}>
                <div className="stat-big">{s.big}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="section section-off">
        <div className="sc-wrap">
          <div className="eyebrow"><span className="eyebrow-line" />The scale</div>
          <h2>One score, four <span className="hl-sm">levels of intent</span></h2>
          <p className="section-body">The 0–100 score maps to four statuses, so every lead arrives already sorted by how ready they are - not just whether they clicked.</p>

          <div className="scale">
            <div className="scale-bar">
              {TIERS.map((t) => (
                <div className="scale-seg" style={{ background: t.color }} key={t.name}>{t.name}</div>
              ))}
            </div>
            <div className="scale-marks">
              <span>0</span><span>40</span><span>60</span><span>80</span><span>100</span>
            </div>
            <div className="scale-note">Score bands are indicative and can be tuned per program.</div>
          </div>

          <div className="tiers">
            {TIERS.map((t) => (
              <div className="tier" style={{ "--tc": t.color }} key={t.name}>
                <div className="tier-head">
                  <span className="tier-dot" />
                  <span className="tier-name">{t.name}</span>
                  <span className="tier-range">{t.range}</span>
                </div>
                <div className="tier-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sc-wrap">
          <div className="eyebrow"><span className="eyebrow-line" />What it measures</div>
          <h2>Readiness, <span className="hl-sm">not just interest</span></h2>
          <p className="section-body">The survey covers six dimensions of readiness. To clear the Qualified threshold, a lead has to state - at minimum - three concrete things:</p>

          <div className="measure">
            <div className="criteria">
              {CRITERIA.map((c) => (
                <div className="crit" key={c.t}>
                  <span className="crit-check">✓</span>
                  <div>
                    <div className="crit-t">{c.t}</div>
                    <div className="crit-d">{c.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="measure-note">
              <h3>Completion is itself a signal</h3>
              <p>The survey takes real effort - 14 to 25 questions - and people who aren't seriously considering a move simply don't finish it.</p>
              <p>On average around 37% of registrants complete it. The ones who do have already told you they are worth your team's time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-off">
        <div className="sc-wrap">
          <div className="use">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" />On your dashboard</div>
              <h2>Start with the <span className="hl-sm">right people first</span></h2>
              <p className="section-body">The score flows straight into your dashboard. Sort by intent, focus on the Hot leads, and stop reading every lead by hand to figure out who matters.</p>
              <a className="btn primary" href="https://platform.fsummit.net/dashboard/leads" target="_blank" rel="noopener noreferrer">See it in the platform ↗</a>
            </div>
            <div className="use-panel">
              {[
                { n: "A. Karim · Portugal GV", s: 86, t: "Hot", c: "#D94F3A" },
                { n: "M. Reyes · Malta MEIN", s: 61, t: "Warm", c: "#C07D10" },
                { n: "J. Tan · Greece GV", s: 48, t: "Qualified", c: "#4A7FC1" },
                { n: "L. Okafor · US EB-5", s: 22, t: "Nurture", c: "#8A8F98" },
              ].map((r) => (
                <div className="use-row" key={r.n}>
                  <span className="use-name">{r.n}</span>
                  <span className="use-score">{r.s}<small>/100</small></span>
                  <span className="badge" style={{ background: r.c }}>{r.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sc-wrap">
          <div className="cta">
            <div className="cta-t">Every lead, scored the moment it reaches you.</div>
            <div className="cta-actions">
              <a className="btn primary" href="/pricing">See pricing</a>
              <a className="btn ghost" href="/questions">Read the FAQ</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="sc-wrap foot-inner">
          <div>
            <div className="foot-logo"><span className="nav-logo-dot" />FBS Intelligence</div>
            <div className="foot-note">Part of Freedom Business Summit · Lead intelligence for global mobility firms</div>
          </div>
          <div className="foot-links">
            <a href="/overview">Overview</a>
            <a href="/questions">Questions</a>
            <a href="/">fbsintelligence.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
