/* ──────────────────────────────────────────────
   /questions — the questions clients most often ask
   about the product, before an engagement begins.
   Same stack + design language as the main site.
   ────────────────────────────────────────────── */

const QUESTIONS = [
  { title: "How do you define a qualified lead?" },
  { title: "What is the average conversion rate from registration → qualified lead → consultation?" },
  { title: "Can you share actual results from other immigration / Citizenship by Investment clients?" },
  { title: "Are the leads exclusive to us?" },
  { title: "What monthly ad budget do you recommend?" },
  { title: "Apart from the $1,950 setup, $499/month, and ad spend, are there any additional costs?" },
  { title: "Is there a minimum contract period, and can we cancel monthly?" },
  { title: "Do we own the leads and data if we stop working together?" },
  {
    title: "Target jurisdictions & ideal client profile (ICP)",
    detail: "How do you handle routing and jurisdiction targeting for multi-program firms - for example, Canadian business immigration (PNPs / SUV), US programs (EB-5 / E-2), and key European Golden Visas such as Portugal and Greece? Can campaigns be tailored specifically to focus on these exact program streams?",
  },
  {
    title: "Territorial exclusivity & lead routing",
    detail: "Are the leads, webinar registrants, and territorial slots generated during these campaigns strictly exclusive to us, or are they shared or re-routed with other network partners in your ecosystem?",
  },
  {
    title: "Ad account ownership & audience data",
    detail: "For the media budget spent on advertising platforms, do campaigns run through our own dedicated ad accounts (or via our custom domains / tracking pixels), so that we retain full long-term ownership of the pixel data, retargeting assets, and custom audiences?",
  },
  {
    title: "Full commercial & fee structure",
    detail: "Beyond the $1,950 setup fee, $499/month management fee, and ad spend, are there any additional pay-per-lead charges, success / commission fees, or revenue-sharing models on converted retainers?",
  },
  {
    title: "Conversion benchmarks & pilot cohort",
    detail: "Based on past campaigns for investment migration advisors in top-tier markets, what are your typical benchmarks for Cost Per Qualified Lead (CPQL) and webinar-to-consultation conversion rates? And can the initial 8-week launch be structured as a trial cohort to evaluate the conversion of high-intent leads (70+ score) into active consultations before committing long-term?",
  },
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
  .q-wrap{max-width:1200px;margin:0 auto;padding:0 32px}
  .questions a{color:inherit;text-decoration:none}

  @keyframes qFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes qPulseLime{0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,.5)}50%{box-shadow:0 0 0 10px rgba(170,255,69,0)}}
  .questions .fade-up{animation:qFadeUp .7s cubic-bezier(.16,1,.3,1) both}
  .questions .fu2{animation-delay:.1s}.questions .fu3{animation-delay:.18s}

  .questions nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
  .questions .nav-inner{display:flex;align-items:center;justify-content:space-between;height:62px}
  .questions .nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-.02em}
  .questions .nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:qPulseLime 2.5s ease-in-out infinite}
  .questions .nav-logo em{font-style:normal;font-weight:400;color:var(--muted);font-size:12px}
  .questions .nav-right{display:flex;align-items:center;gap:24px}
  .questions .nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);position:relative;padding:4px 0;transition:color .15s}
  .questions .nav-link::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:var(--lime);transform:scaleX(0);transition:transform .2s}
  .questions .nav-link:hover{color:var(--black)}.questions .nav-link:hover::after{transform:scaleX(1)}
  .questions .nav-btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--black);color:var(--white);padding:9px 18px;border-radius:7px;transition:all .15s}
  .questions .nav-btn:hover{background:var(--lime);color:var(--black)}

  .questions .hero{padding:132px 0 56px;background:var(--white);border-bottom:1px solid var(--border);position:relative;overflow:hidden}
  .questions .hero-grid-bg{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,.04) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);-webkit-mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);pointer-events:none}
  .questions .hero>.q-wrap{position:relative;z-index:2}
  .questions .eyebrow{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:20px;display:inline-flex;align-items:center;gap:10px}
  .questions .eyebrow-line{width:24px;height:1px;background:currentColor;opacity:.4}
  .questions .hero h1{font-size:clamp(38px,5vw,60px);font-weight:800;line-height:1.04;letter-spacing:-.035em;color:var(--black);max-width:900px}
  .questions .accent{position:relative;display:inline-block}
  .questions .accent::after{content:'';position:absolute;bottom:.04em;left:-2px;right:-2px;height:.3em;background:var(--lime);z-index:-1;border-radius:2px}
  .questions .hero-desc{font-size:18px;line-height:1.65;color:var(--text2);max-width:640px;margin-top:24px}

  .questions .section{padding:72px 0 96px}
  .questions .section-head{margin-bottom:36px}
  .questions .section-head .eyebrow{margin-bottom:14px}
  .questions .section h2{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.03em;line-height:1.08;color:var(--black);max-width:760px}
  .questions .hl-sm{background:linear-gradient(120deg,var(--lime),var(--lime));background-repeat:no-repeat;background-size:100% .32em;background-position:0 88%;padding:0 4px}

  .questions .q-list{display:flex;flex-direction:column;gap:12px}
  .questions .q-item{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:start;background:var(--white);border:1px solid var(--border);border-radius:16px;padding:22px 26px;transition:border-color .2s,box-shadow .2s}
  .questions .q-item:hover{border-color:var(--lime2);box-shadow:0 0 0 3px rgba(170,255,69,.18)}
  .questions .q-num{width:32px;height:32px;border-radius:9px;background:var(--off);color:var(--lime-dark);display:grid;place-items:center;font-size:13px;font-weight:800;font-variant-numeric:tabular-nums}
  .questions .q-item:hover .q-num{background:var(--lime);color:var(--black)}
  .questions .q-body{padding-top:3px}
  .questions .q-text{display:block;font-size:17.5px;font-weight:600;letter-spacing:-.01em;color:var(--black);line-height:1.4}
  .questions .q-detail{font-size:15px;line-height:1.6;color:var(--text2);margin-top:8px;max-width:820px}

  .questions .cta{margin-top:40px;background:var(--off);border:1px solid var(--border);border-radius:18px;padding:32px 34px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
  .questions .cta-t{font-size:19px;font-weight:800;letter-spacing:-.02em;color:var(--black)}
  .questions .cta-d{font-size:14.5px;color:var(--text2);margin-top:6px;max-width:520px;line-height:1.5}
  .questions .cta-actions{display:flex;gap:10px;flex-wrap:wrap}
  .questions .btn{font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:.01em;padding:13px 22px;border-radius:8px;border:1px solid var(--border);background:var(--white);color:var(--text2);cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px}
  .questions .btn:hover{color:var(--black);border-color:#cfcfcf}
  .questions .btn.primary{background:var(--black);color:var(--white);border-color:var(--black)}
  .questions .btn.primary:hover{background:var(--lime);color:var(--black);border-color:var(--lime);box-shadow:0 12px 32px -8px rgba(170,255,69,.4)}

  .questions footer{padding:48px 0;background:var(--white);border-top:1px solid var(--border)}
  .questions .foot-inner{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
  .questions .foot-logo{font-size:14px;font-weight:800;display:flex;align-items:center;gap:9px}
  .questions .foot-note{font-size:12.5px;color:var(--muted);margin-top:8px}
  .questions .foot-links{display:flex;gap:22px}
  .questions .foot-links a{font-size:12.5px;color:var(--text2)}
  .questions .foot-links a:hover{color:var(--black)}

  @media(max-width:880px){
    .questions .hero{padding:120px 0 48px}
    .questions .q-item{padding:20px 20px;gap:14px}
    .questions .cta{flex-direction:column;align-items:flex-start;padding:26px 22px}
  }
  @media(prefers-reduced-motion:reduce){.questions *{animation:none!important;transition:none!important}}
`;

export default function Questions() {
  return (
    <div className="questions">
      <style>{css}</style>

      <nav>
        <div className="q-wrap nav-inner">
          <a className="nav-logo" href="/"><span className="nav-logo-dot" />FBS Intelligence <em>/ Questions</em></a>
          <div className="nav-right">
            <a className="nav-link" href="/overview">Overview</a>
            <a className="nav-link" href="/pricing">Pricing</a>
            <a className="nav-btn" href="/">fbsintelligence.com ↗</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-grid-bg" />
        <div className="q-wrap">
          <div className="eyebrow fade-up"><span className="eyebrow-line" />Client questions</div>
          <h1 className="fade-up fu2">The questions we <span className="accent">hear most</span>.</h1>
          <p className="hero-desc fade-up fu3">Before moving ahead, these are the points clients most often want cleared up about the product. Once we have clarity on them, we can discuss the next steps together.</p>
        </div>
      </header>

      <section className="section">
        <div className="q-wrap">
          <div className="section-head">
            <div className="eyebrow"><span className="eyebrow-line" />Frequently asked</div>
            <h2>Everything clients ask <span className="hl-sm">before we begin</span></h2>
          </div>

          <div className="q-list">
            {QUESTIONS.map((q, i) => (
              <div className="q-item" key={i}>
                <span className="q-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="q-body">
                  <span className="q-text">{q.title}</span>
                  {q.detail && <p className="q-detail">{q.detail}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="cta">
            <div>
              <div className="cta-t">Have a different question?</div>
              <div className="cta-d">These are the essentials, but every firm is different. We are happy to walk through anything specific to your jurisdiction and goals.</div>
            </div>
            <div className="cta-actions">
              <a className="btn primary" href="/pricing">See pricing</a>
              <a className="btn" href="/intro">Back to the walkthrough</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="q-wrap foot-inner">
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
