/* ──────────────────────────────────────────────
   /intro — client-facing walkthrough of the FBS
   Intelligence story. Contents (table of contents)
   up top, then a scrollable stack of sections.
   Same stack + design language as the main site.
   ────────────────────────────────────────────── */

const SECTIONS = [
  {
    n: 1,
    id: "intro",
    kicker: "Starting point",
    title: "Intro",
    body: "It starts with Freedom Business Summit (FBS) - where the whole story, and the data behind it, began.",
  },
  {
    n: 2,
    id: "audience-intelligence",
    kicker: "The audience",
    title: "Audience Intelligence",
    body: "Who we actually reach and understand - the lawyer, the DP, and the partner - and the intent we capture on each.",
    link: { label: "See the platform overview", href: "/overview" },
  },
  {
    n: 3,
    id: "our-funnel",
    kicker: "The funnel",
    title: "Our funnel",
    body: "How browsers first enter our funnel, and what happens the moment they do.",
  },
  {
    n: 4,
    id: "funnel-system",
    kicker: "The system",
    title: "The high-converting funnel system",
    body: "A proven, repeatable event funnel system - built to convert, not just collect.",
  },
  {
    n: 5,
    id: "what-is-fbs",
    kicker: "The product",
    title: "What is FBS Intelligence?",
    body: "At its heart it is a dashboard: FBS Intelligence, an end-to-end lead generation network for investment migration companies to get pre-qualified prospects.",
    points: [
      "Our core product, backend product, and distribution product.",
      "A dashboard product - the dashboard is the product.",
    ],
    mock: true,
    link: { label: "Explore the platform", href: "/overview" },
  },
  {
    n: 6,
    id: "how-it-works",
    kicker: "How it works",
    title: "How it works",
    body: "A section-by-section overview of the platform in action.",
  },
  {
    n: 7,
    id: "what-is-next",
    kicker: "What is next",
    title: "What is next",
    body: "Pricing and the ways to work with us - what is included, and where to start.",
    link: { label: "View pricing in detail", href: "/pricing" },
  },
  {
    n: 8,
    id: "who-explores",
    kicker: "The buyer",
    title: "Who explores the platform",
    body: "Our original buyer - their budget, and what they actually need.",
  },
  {
    n: 9,
    id: "story",
    kicker: "The story",
    title: "Story",
    body: "The narrative we tell - stoic, emotional, and buyer-centric.",
  },
  {
    n: 10,
    id: "questions",
    kicker: "Q&A",
    title: "Questions and next steps",
    body: "Room for your questions, and a clear next move together if it is a fit.",
  },
  {
    n: 11,
    id: "order-confirmation",
    kicker: "Confirmation",
    title: "Order confirmation",
    body: "Locking in the details and confirming the order.",
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  :root{
    --black:#0A0A0A;--off:#F4F4F2;--cream:#EBEBEB;--white:#FFFFFF;
    --lime:#AAFF45;--lime2:#8EE032;--lime-soft:#E8F5DF;--lime-dark:#5A8A20;
    --muted:#6B6B6B;--border:#E5E5E5;--text:#0A0A0A;--text2:#3A3A3A;
    --hot:#D94F3A;--warm:#C07D10;--cold:#4A7FC1;
  }
  html{scroll-behavior:smooth}
  body{background:var(--white);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  .intro-wrap{max-width:1200px;margin:0 auto;padding:0 32px}
  .intro a{color:inherit;text-decoration:none}

  @keyframes introFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes introPulseLime{0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,.5)}50%{box-shadow:0 0 0 10px rgba(170,255,69,0)}}
  .intro .fade-up{animation:introFadeUp .7s cubic-bezier(.16,1,.3,1) both}
  .intro .fu2{animation-delay:.1s}.intro .fu3{animation-delay:.18s}.intro .fu4{animation-delay:.26s}

  .intro nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
  .intro .nav-inner{display:flex;align-items:center;justify-content:space-between;height:62px}
  .intro .nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-.02em}
  .intro .nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:introPulseLime 2.5s ease-in-out infinite}
  .intro .nav-logo em{font-style:normal;font-weight:400;color:var(--muted);font-size:12px}
  .intro .nav-right{display:flex;align-items:center;gap:24px}
  .intro .nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);position:relative;padding:4px 0;transition:color .15s}
  .intro .nav-link::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:var(--lime);transform:scaleX(0);transition:transform .2s}
  .intro .nav-link:hover{color:var(--black)}.intro .nav-link:hover::after{transform:scaleX(1)}
  .intro .nav-btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--black);color:var(--white);padding:9px 18px;border-radius:7px;transition:all .15s}
  .intro .nav-btn:hover{background:var(--lime);color:var(--black)}

  .intro .hero{padding:150px 0 84px;background:var(--white);border-bottom:1px solid var(--border);position:relative;overflow:hidden}
  .intro .hero-grid-bg{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,.04) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);-webkit-mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);pointer-events:none}
  .intro .hero>.intro-wrap{position:relative;z-index:2}
  .intro .eyebrow{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:20px;display:inline-flex;align-items:center;gap:10px}
  .intro .eyebrow-line{width:24px;height:1px;background:currentColor;opacity:.4}
  .intro .hero h1{font-size:clamp(40px,5.4vw,66px);font-weight:800;line-height:1.03;letter-spacing:-.035em;color:var(--black);max-width:900px}
  .intro .accent{position:relative;display:inline-block}
  .intro .accent::after{content:'';position:absolute;bottom:.04em;left:-2px;right:-2px;height:.3em;background:var(--lime);z-index:-1;border-radius:2px}
  .intro .hero-sub{font-size:clamp(24px,3.4vw,40px);font-weight:800;line-height:1.08;letter-spacing:-.035em;color:#AAAAAA;margin-top:8px;max-width:900px}
  .intro .hero-desc{font-size:18px;line-height:1.65;color:var(--text2);max-width:600px;margin-top:26px}
  .intro .hero-pill{display:inline-flex;align-items:center;gap:10px;margin-top:30px;padding:6px 16px 6px 6px;background:var(--white);border:1px solid var(--border);border-radius:100px}
  .intro .hero-pill b{background:var(--lime);color:var(--black);font-size:10px;font-weight:800;padding:4px 11px;border-radius:100px;letter-spacing:.08em;text-transform:uppercase}
  .intro .hero-pill span{font-size:13px;color:var(--text);font-weight:500}
  .intro .hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:34px}
  .intro .btn{font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:.01em;padding:14px 26px;border-radius:8px;border:1px solid var(--border);background:var(--white);color:var(--text2);cursor:pointer;transition:all .2s}
  .intro .btn:hover{color:var(--black);border-color:#cfcfcf}
  .intro .btn.primary{background:var(--black);color:var(--white);border-color:var(--black)}
  .intro .btn.primary:hover{background:var(--lime);color:var(--black);border-color:var(--lime);box-shadow:0 12px 32px -8px rgba(170,255,69,.4)}

  .intro .section{padding:96px 0}
  .intro .section-off{background:var(--off);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
  .intro .section h2{font-size:clamp(30px,3.8vw,50px);font-weight:800;letter-spacing:-.03em;line-height:1.05;color:var(--black);margin-bottom:16px;max-width:820px}
  .intro .hl-sm{background:linear-gradient(120deg,var(--lime),var(--lime));background-repeat:no-repeat;background-size:100% .32em;background-position:0 88%;padding:0 4px}
  .intro .section-body{font-size:17px;line-height:1.6;color:var(--text2);max-width:620px;margin-bottom:40px}

  /* Contents — the table of contents that sets the structure */
  .intro .toc{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
  .intro .toc-item{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:16px;background:var(--white);border:1px solid var(--border);border-radius:14px;padding:16px 18px;transition:all .18s}
  .intro .toc-item:hover{border-color:var(--lime2);box-shadow:0 0 0 3px rgba(170,255,69,.22);transform:translateY(-1px)}
  .intro .toc-num{width:32px;height:32px;border-radius:9px;background:var(--off);color:var(--muted);display:grid;place-items:center;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums;transition:all .18s}
  .intro .toc-item:hover .toc-num{background:var(--lime);color:var(--black)}
  .intro .toc-txt{display:flex;flex-direction:column;gap:3px;min-width:0}
  .intro .toc-kicker{font-size:10.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--lime-dark)}
  .intro .toc-title{font-size:15px;font-weight:700;letter-spacing:-.01em;color:var(--black)}
  .intro .toc-arrow{font-size:15px;color:var(--muted);transition:all .18s}
  .intro .toc-item:hover .toc-arrow{transform:translateY(3px);color:var(--black)}

  /* Stacked, scrollable sections */
  .intro .sections{display:flex;flex-direction:column;gap:20px}
  .intro .sec{display:grid;grid-template-columns:96px 1fr;gap:28px;align-items:start;background:var(--white);border:1px solid var(--border);border-radius:18px;padding:36px 40px;scroll-margin-top:88px;transition:border-color .2s}
  .intro .sec:hover{border-color:#d8d8d8}
  .intro .sec-num{font-size:38px;font-weight:900;letter-spacing:-.04em;color:var(--lime2);font-variant-numeric:tabular-nums;line-height:1}
  .intro .sec-kicker{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:12px}
  .intro .sec-main h3{font-size:clamp(22px,2.5vw,30px);font-weight:800;letter-spacing:-.025em;color:var(--black);margin-bottom:14px;line-height:1.12}
  .intro .sec-main p{font-size:16.5px;line-height:1.62;color:var(--text2);max-width:660px}
  .intro .sec-points{list-style:none;margin-top:16px;display:flex;flex-direction:column;gap:8px;max-width:660px}
  .intro .sec-points li{position:relative;padding-left:22px;font-size:15px;line-height:1.5;color:var(--text2)}
  .intro .sec-points li::before{content:'';position:absolute;left:2px;top:8px;width:7px;height:7px;border-radius:2px;background:var(--lime2)}
  .intro .panel-link{display:inline-flex;align-items:center;gap:8px;margin-top:22px;font-size:13px;font-weight:700;color:var(--black);background:var(--off);border:1px solid var(--border);padding:11px 16px;border-radius:9px;transition:all .18s}
  .intro .panel-link:hover{background:var(--lime);border-color:var(--lime)}

  .intro .mock{margin-top:24px;border:1px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:0 16px 40px -18px rgba(0,0,0,.2);max-width:660px}
  .intro .mock-chrome{background:#f5f4f0;padding:10px 14px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border)}
  .intro .mock-dots{display:flex;gap:6px}
  .intro .mock-dots i{width:10px;height:10px;border-radius:50%;display:block}
  .intro .mock-url{flex:1;text-align:center;font-size:11px;color:#999;background:var(--white);padding:4px 12px;border-radius:6px;max-width:260px;margin:0 auto;border:1px solid var(--border)}
  .intro .mock-head,.intro .mock-row{display:grid;grid-template-columns:1.6fr .7fr .8fr;gap:10px;padding:10px 16px;align-items:center}
  .intro .mock-head{background:#fafaf6;font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
  .intro .mock-row{border-top:1px solid var(--border);font-size:12px}
  .intro .mock-lead{display:flex;align-items:center;gap:9px}
  .intro .mock-av{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:700;color:#fff}
  .intro .mock-name{font-size:12px;font-weight:600;color:var(--black)}
  .intro .mock-gms{font-weight:800;color:var(--black);font-variant-numeric:tabular-nums}
  .intro .mock-gms small{color:var(--muted);font-weight:500}
  .intro .tier{font-size:10px;font-weight:700;padding:3px 9px;border-radius:5px;letter-spacing:.04em;justify-self:start}
  .intro .tier.hot{background:rgba(217,79,58,.12);color:var(--hot)}
  .intro .tier.warm{background:rgba(192,125,16,.12);color:var(--warm)}
  .intro .tier.cold{background:rgba(74,127,193,.12);color:var(--cold)}

  .intro footer{padding:48px 0;background:var(--white);border-top:1px solid var(--border)}
  .intro .foot-inner{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
  .intro .foot-logo{font-size:14px;font-weight:800;display:flex;align-items:center;gap:9px}
  .intro .foot-note{font-size:12.5px;color:var(--muted);margin-top:8px}
  .intro .foot-links{display:flex;gap:22px}
  .intro .foot-links a{font-size:12.5px;color:var(--text2)}
  .intro .foot-links a:hover{color:var(--black)}

  @media(max-width:880px){
    .intro .toc{grid-template-columns:1fr}
    .intro .sec{grid-template-columns:1fr;gap:10px;padding:28px 22px}
    .intro .sec-num{font-size:28px}
    .intro .hero{padding:120px 0 64px}
  }
  @media(prefers-reduced-motion:reduce){.intro *{animation:none!important;transition:none!important}}
`;

function Mock() {
  return (
    <div className="mock">
      <div className="mock-chrome">
        <div className="mock-dots">
          <i style={{ background: "#FF5F57" }} />
          <i style={{ background: "#FEBC2E" }} />
          <i style={{ background: "#28C840" }} />
        </div>
        <div className="mock-url">app.fbsintelligence.com/leads</div>
      </div>
      <div className="mock-head"><span>Prospect</span><span>GMS</span><span>Tier</span></div>
      <div className="mock-row">
        <div className="mock-lead"><div className="mock-av" style={{ background: "linear-gradient(135deg,#D94F3A,#C07D10)" }}>AK</div><span className="mock-name">A. Karim · Portugal GV</span></div>
        <div className="mock-gms">86<small>/100</small></div><span className="tier hot">Hot</span>
      </div>
      <div className="mock-row">
        <div className="mock-lead"><div className="mock-av" style={{ background: "linear-gradient(135deg,#C07D10,#8EE032)" }}>MR</div><span className="mock-name">M. Reyes · Malta MEIN</span></div>
        <div className="mock-gms">61<small>/100</small></div><span className="tier warm">Warm</span>
      </div>
      <div className="mock-row">
        <div className="mock-lead"><div className="mock-av" style={{ background: "linear-gradient(135deg,#4A7FC1,#7C5BA8)" }}>JT</div><span className="mock-name">J. Tan · Greece GV</span></div>
        <div className="mock-gms">34<small>/100</small></div><span className="tier cold">Cold</span>
      </div>
    </div>
  );
}

export default function Intro() {
  return (
    <div className="intro">
      <style>{css}</style>

      <nav>
        <div className="intro-wrap nav-inner">
          <a className="nav-logo" href="/"><span className="nav-logo-dot" />FBS Intelligence <em>/ Your session</em></a>
          <div className="nav-right">
            <a className="nav-link" href="/overview">Overview</a>
            <a className="nav-link" href="/pricing">Pricing</a>
            <a className="nav-btn" href="/">fbsintelligence.com ↗</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-grid-bg" />
        <div className="intro-wrap">
          <div className="eyebrow fade-up"><span className="eyebrow-line" />Your session · FBS Intelligence</div>
          <h1 className="fade-up fu2">Here is how our <span className="accent">conversation</span> will go.</h1>
          <div className="hero-sub fade-up fu2">The story behind FBS Intelligence, section by section.</div>
          <p className="hero-desc fade-up fu3">This page is your map. Start with the contents below to see the shape of the whole thing, then scroll for a short read on each part - with a link out wherever there is more to explore.</p>
          <div className="hero-pill fade-up fu3"><b>11 sections</b><span>starting point · Freedom Business Summit (FBS)</span></div>
          <div className="hero-actions fade-up fu4">
            <button className="btn primary" onClick={() => document.getElementById("walk").scrollIntoView({ behavior: "smooth" })}>See the contents</button>
            <a className="btn" href="/">Explore the platform</a>
          </div>
        </div>
      </header>

      <section className="section section-off" id="walk">
        <div className="intro-wrap">
          <div className="eyebrow"><span className="eyebrow-line" />Contents · Starting point: Freedom Business Summit (FBS)</div>
          <h2>The full picture, <span className="hl-sm">section by section</span></h2>
          <p className="section-body">Everything we will walk through, in order. Jump to any part, or scroll down for the short version of each.</p>

          <div className="toc">
            {SECTIONS.map((s) => (
              <a key={s.n} className="toc-item" href={`#${s.id}`}>
                <span className="toc-num">{String(s.n).padStart(2, "0")}</span>
                <span className="toc-txt">
                  <span className="toc-kicker">{s.kicker}</span>
                  <span className="toc-title">{s.title}</span>
                </span>
                <span className="toc-arrow">↓</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="intro-wrap">
          <div className="sections">
            {SECTIONS.map((s) => (
              <article key={s.n} id={s.id} className="sec">
                <div className="sec-num">{String(s.n).padStart(2, "0")}</div>
                <div className="sec-main">
                  <div className="sec-kicker">{s.kicker}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  {s.points && (
                    <ul className="sec-points">
                      {s.points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  )}
                  {s.mock && <Mock />}
                  {s.link && <a className="panel-link" href={s.link.href}>{s.link.label} ↗</a>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="intro-wrap foot-inner">
          <div>
            <div className="foot-logo"><span className="nav-logo-dot" />FBS Intelligence</div>
            <div className="foot-note">Part of Freedom Business Summit · Lead intelligence for global mobility firms</div>
          </div>
          <div className="foot-links">
            <a href="/overview">Overview</a>
            <a href="/pricing">Pricing</a>
            <a href="/">fbsintelligence.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
