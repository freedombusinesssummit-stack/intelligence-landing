import { useState } from "react";

/* ──────────────────────────────────────────────
   /questions — the questions clients most often ask
   about the product, with answers. Accordion FAQ.
   Same stack + design language as the main site.
   ────────────────────────────────────────────── */

const QUESTIONS = [
  {
    title: "How do you define a qualified lead?",
    answer: [
      "Every webinar registrant is invited to complete the Global Mobility Score (GMS) - a 14–25 question survey covering six readiness dimensions. Responses generate a 0–100 score that maps to four statuses: Nurture, Qualified, Warm, and Hot.",
      "A Qualified lead has completed the full survey and cleared the scoring threshold - meaning they've stated a concrete budget range, a timeline, and their decision-making role.",
      "Completion itself is a signal: it takes real effort, and people who aren't seriously considering a move don't finish it.",
      { link: { label: "See a scoring sample inside the FBS platform", href: "https://platform.fsummit.net/dashboard/leads" } },
    ],
  },
  {
    title: "What is the average conversion rate from registration → qualified lead → consultation?",
    answer: [
      "Registration → survey completion averages around 37%, though it varies by offer, geography, and jurisdiction.",
      "On the consultation step, the funnel isn't built to drive consultations directly - it's built to drive webinar attendance. In investment migration, a consultation request from someone who hasn't yet seen your process, your team, and your jurisdiction comparison is a low-intent request; it fills your calendar without filling your pipeline.",
      "So the invitation to a consultation comes after the webinar, to people who have already spent 45 minutes with you.",
    ],
  },
  {
    title: "Can you share actual results from other immigration / Citizenship by Investment clients?",
    answer: [
      "One honest observation about this market: many firms can't produce reliable numbers even for their own campaigns, because there's no tracking infrastructure between the ad click and the signed engagement.",
      "We regularly see leads worked with a single email, or not followed up at all. Part of what we build for you is the ability to answer this question about yourself.",
      "Because the sales cycle in this space typically runs three to six months, we do quarterly reviews with each partner rather than judging results month to month.",
    ],
  },
  {
    title: "Are the leads exclusive to us?",
    answer: [
      "Yes - fully exclusive. We build the funnel individually for you: your offer, your jurisdiction, your audience, your creative.",
      "The leads it generates come from that funnel and go to you alone. No other client receives them.",
    ],
  },
  {
    title: "What monthly ad budget do you recommend?",
    answer: [
      "Minimum $1,000/month to generate statistically meaningful data. For Tier 1 markets (US, UK, Canada, Western Europe) budget can be higher - the idea is to give the funnel enough volume to optimize.",
      "Budget is paid directly to the ad platforms - it never passes through us.",
    ],
  },
  {
    title: "Apart from the $1,950 setup, $499/month, and ad spend, are there any additional costs?",
    answer: [
      "No. We take no commission or markup on ad spend. Landing pages and survey infrastructure are built on our side.",
      "We'd suggest an email marketing service, or we can use yours.",
      "Third-party services - such as the email marketing platform or the webinar hosting service - are treated as third-party tools and billed separately: their subscription is paid by you directly, at whatever tier your volume requires, not through us.",
    ],
  },
  {
    title: "Is there a minimum contract period, and can we cancel monthly?",
    answer: [
      "No minimum term. Cancel any time with 30 days' written notice - though we'd recommend planning for three months. That's three webinar cycles: enough to test creative, tune targeting, and see what converts.",
      "Over that time you're also building a lead and email list as an asset.",
    ],
  },
  {
    title: "Do we own the leads and data if we stop working together?",
    answer: [
      "Yes. Every lead generated for you is yours - full export in a standard format at any time, during or after the engagement, at no charge. We build and run the infrastructure; the assets it produces are yours.",
    ],
  },
  {
    title: "Target jurisdictions & ideal client profile (ICP)",
    detail:
      "How do you handle routing and jurisdiction targeting for multi-program firms - for example, Canadian business immigration (PNPs / SUV), US programs (EB-5 / E-2), and key European Golden Visas such as Portugal and Greece? Can campaigns be tailored specifically to focus on these exact program streams?",
    answer: [
      "Yes. We don't run a generic \"immigration\" funnel and hope it fits - each company we work with gets a dedicated funnel built around the specific program(s) you want leads for. For your firm, that means building separately around your priority directions - Canadian PNP/SUV, US EB-5/E-2, and Portugal/Greece Golden Visa - rather than one blended campaign.",
      "We'd recommend launching with one or two jurisdictions first (based on where your capacity and demand for consultations is strongest), proving the funnel, then extending to the rest. Happy to map that sequencing with you on a call.",
    ],
  },
  {
    title: "Territorial exclusivity & lead routing",
    detail:
      "Are the leads, webinar registrants, and territorial slots generated during these campaigns strictly exclusive to us, or are they shared or re-routed with other network partners in your ecosystem?",
    answer: [
      "Leads and registrations generated in your campaigns are 100% exclusive to you. They are never shared with, or re-routed to, any other partner in our network - during the engagement or after it ends.",
      "Every lead your funnel generates is yours alone. Your registrant data isn't reused for our own marketing or handed to other advisory firms, including competitors.",
      "One thing we want to be upfront about: FBS Intelligence doesn't provide jurisdiction-wide market exclusivity. If another firm wanted a Portugal Golden Visa funnel, for example, we could in principle build one for them too - but it would be a fully separate, independently-run funnel, and their leads would never touch yours or vice versa. What's exclusive is the individual lead and the individual funnel, not the jurisdiction itself.",
    ],
  },
  {
    title: "Ad account ownership & audience data",
    detail:
      "For the media budget spent on advertising platforms, do campaigns run through our own dedicated ad accounts (or via our custom domains / tracking pixels), so that we retain full long-term ownership of the pixel data, retargeting assets, and custom audiences?",
    answer: [
      "Yes - campaigns run directly through your own ad accounts. Domains and tracking pixels stay with you, so the retargeting data and custom audiences you build up are yours to keep, regardless of what happens with the engagement down the line.",
    ],
  },
  {
    title: "Full commercial & fee structure",
    detail:
      "Beyond the $1,950 setup fee, $499/month management fee, and ad spend, are there any additional pay-per-lead charges, success / commission fees, or revenue-sharing models on converted retainers?",
    answer: [
      "No additional pay-per-lead charges or success / commission fees at this time - the $1,950 setup, $499/month management, and your ad spend are the full fee structure. Ad spend runs exclusively through your own ad account.",
      "One item worth flagging early: third-party tools like the email marketing platform and webinar hosting platform are billed separately, outside our fees, at whatever tier your registration and lead volume requires. These are external services (not something FBS provides or marks up) - we'll help you pick and set them up, but the subscription cost itself sits with you.",
      "We're open to discussing revenue-sharing models in the future if that's something you'd want to explore, but nothing like that is baked into the current offer. As it stands, the fees above cover everything involved in running the campaigns.",
    ],
  },
  {
    title: "Conversion benchmarks & pilot cohort",
    detail:
      "Based on past campaigns for investment migration advisors in top-tier markets, what are your typical benchmarks for Cost Per Qualified Lead (CPQL) and webinar-to-consultation conversion rates? And can the initial 8-week launch be structured as a trial cohort to evaluate the conversion of high-intent leads (70+ score) into active consultations before committing long-term?",
    answer: [
      "Straight answer: there isn't one clean CPQL number we can hand you, and anyone quoting a single figure across geographies wouldn't be giving you the full picture. Cost varies a lot by market - within the US alone we typically see three meaningfully different cost tiers:",
      {
        ul: [
          "A simple lead (registered on the landing page): typically $8–$25",
          "A qualified lead (completed the qualifying survey): typically $25–$60",
          "A webinar lead (registered and actually attended): typically $25–$80",
        ],
      },
      "On top of that, offer and speaker matter a lot - two funnels for the identical program can produce very different lead costs depending on the creative and landing page alone. Rather than quote a benchmark, we'd rather show you the real numbers once your campaign is running.",
      "On the pilot structure - yes, this is exactly what the 8-week launch is built for:",
      {
        ol: [
          "Build the registration and survey funnel",
          "Reach 100 registrations",
          "Run the webinar",
          "Track how many of those registrations convert into booked consultations",
          "Evaluate lead quality - including how the 70+ GMS score segment specifically converts",
        ],
      },
      "At the end of that window, the decision to scale further is based on your actual numbers, not a projection.",
      "And those 100 registrations are your asset, not ours - it's your lead list and your data, a real dataset you keep regardless of what happens after the pilot.",
    ],
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
  .questions .q-item{background:var(--white);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:border-color .2s,box-shadow .2s}
  .questions .q-item.open{border-color:var(--lime2);box-shadow:0 0 0 3px rgba(170,255,69,.18)}
  .questions .q-item:hover{border-color:var(--lime2)}
  .questions .q-head{display:grid;grid-template-columns:auto 1fr auto;gap:18px;align-items:center;width:100%;text-align:left;background:none;border:none;cursor:pointer;padding:22px 26px;font-family:'Inter',sans-serif;color:inherit}
  .questions .q-num{width:32px;height:32px;border-radius:9px;background:var(--off);color:var(--lime-dark);display:grid;place-items:center;font-size:13px;font-weight:800;font-variant-numeric:tabular-nums;transition:all .2s}
  .questions .q-item.open .q-num,.questions .q-head:hover .q-num{background:var(--lime);color:var(--black)}
  .questions .q-text{font-size:17.5px;font-weight:600;letter-spacing:-.01em;color:var(--black);line-height:1.4}
  .questions .q-toggle{width:30px;height:30px;border-radius:8px;border:1px solid var(--border);display:grid;place-items:center;font-size:18px;font-weight:500;color:var(--text2);transition:all .2s}
  .questions .q-item.open .q-toggle{background:var(--black);color:var(--white);border-color:var(--black);transform:rotate(45deg)}

  .questions .q-panel{padding:0 26px 26px 76px}
  .questions .q-detail{font-size:15px;line-height:1.55;color:var(--text2);font-style:italic;padding:2px 0 16px;border-bottom:1px solid var(--border);margin-bottom:6px}
  .questions .q-answer p{font-size:15.5px;line-height:1.66;color:var(--text2);margin-top:14px}
  .questions .q-answer p:first-child{margin-top:8px}
  .questions .q-answer ul,.questions .q-answer ol{margin:14px 0 0;padding-left:22px}
  .questions .q-answer li{font-size:15.5px;line-height:1.55;color:var(--text2);margin-top:8px;padding-left:4px}
  .questions .q-answer ul li::marker{color:var(--lime2)}
  .questions .ans-link{display:inline-flex;align-items:center;gap:8px;margin-top:18px;font-size:13px;font-weight:700;color:var(--black);background:var(--off);border:1px solid var(--border);padding:11px 16px;border-radius:9px;transition:all .18s}
  .questions .ans-link:hover{background:var(--lime);border-color:var(--lime)}

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
    .questions .q-head{padding:20px 18px;gap:12px}
    .questions .q-panel{padding:0 18px 22px 18px}
    .questions .cta{flex-direction:column;align-items:flex-start;padding:26px 22px}
  }
  @media(prefers-reduced-motion:reduce){.questions *{animation:none!important;transition:none!important}}
`;

function AnswerBlocks({ blocks }) {
  return (
    <div className="q-answer">
      {blocks.map((b, i) => {
        if (typeof b === "string") return <p key={i}>{b}</p>;
        if (b.ul)
          return (
            <ul key={i}>
              {b.ul.map((x, j) => (
                <li key={j}>{x}</li>
              ))}
            </ul>
          );
        if (b.ol)
          return (
            <ol key={i}>
              {b.ol.map((x, j) => (
                <li key={j}>{x}</li>
              ))}
            </ol>
          );
        if (b.link)
          return (
            <a
              key={i}
              className="ans-link"
              href={b.link.href}
              {...(/^https?:/.test(b.link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {b.link.label} ↗
            </a>
          );
        return null;
      })}
    </div>
  );
}

export default function Questions() {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen((cur) => (cur === i ? null : i));

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
          <p className="hero-desc fade-up fu3">Before moving ahead, these are the points clients most often want cleared up about the product. Tap any question to see the answer.</p>
        </div>
      </header>

      <section className="section">
        <div className="q-wrap">
          <div className="section-head">
            <div className="eyebrow"><span className="eyebrow-line" />Frequently asked</div>
            <h2>Everything clients ask <span className="hl-sm">before we begin</span></h2>
          </div>

          <div className="q-list">
            {QUESTIONS.map((q, i) => {
              const isOpen = open === i;
              return (
                <div className={`q-item ${isOpen ? "open" : ""}`} key={i}>
                  <button
                    className="q-head"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                  >
                    <span className="q-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="q-text">{q.title}</span>
                    <span className="q-toggle" aria-hidden>+</span>
                  </button>
                  {isOpen && (
                    <div className="q-panel">
                      {q.detail && <div className="q-detail">{q.detail}</div>}
                      <AnswerBlocks blocks={q.answer} />
                    </div>
                  )}
                </div>
              );
            })}
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
