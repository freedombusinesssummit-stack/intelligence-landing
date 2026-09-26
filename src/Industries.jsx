import { useState } from "react";

/* ──────────────────────────────────────────────
   /industries — general "what we do" page for
   non-migration contacts (QR target at SBC).
   Same stack + design language as the main site.
   All lead-economics figures are EXPECTED / forecast,
   not our fee. "proven" applies to investment
   migration only; other verticals are "same model".
   ────────────────────────────────────────────── */

const MAILERLITE_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMjkwMjI2ODdkNTJlNjk4ZjYwMzVkODk4YTI0MmFhMzgxNTlmMWQwMmRhN2ZlMDI2MGYxMTMzZGE0NWUyNDViZmQ1OTJiMjI5YjEzZjdjOTMiLCJpYXQiOjE3Nzc4MDQxNDEuMDU2ODcsIm5iZiI6MTc3NzgwNDE0MS4wNTY4NzMsImV4cCI6NDkzMzQ3Nzc0MS4wNTI3NTUsInN1YiI6IjkzMDA0MyIsInNjb3BlcyI6W119.Apd5ihW7N-KluBSDf-dovqu0O_Ia30wPUVjClBzRyOej5nne5be0poXt21OvB2PluTK4EyJO7ZBcOsitkoMG2Q6DSkjThmx0cjn-1APSFbWRAkp0VqXAljYyag-6LebecLKFjiSHNn5uAx441wje7CtSi4-qvb2UAIAYUX3El-upwv1TPges-H5dXbfvU0dOPOpStwNwg_neJOM1B7FyhZ8GOC2aVvaRkmsMJ_Q668dWd_1mhg21Bw35mXe6uzdQA90XENbpEjkn7ezw9Uv0jXDj-qHYs1EE6A08ulWRd-w2LERgr4MA_hJoz2IgjSn5cJWUfM-KtpGd9DxApaCZ_xbkx-zJRIQQXCQKC8WmDNLfDfjpsDGCMxdhcJ2j94fPX66aBNZTWq1DbEH4Z8SWGvgbwYdFEmBeUld552x8x_iGXRFLmicL6EOeng0bXmFlMwD2twukjkWsoVIQW8Vbdyza8XaNi-dtnDVLuMOqNhb2DDa0UbaHwW0DsEPPvHznrd2ut0zVtq-qr9MwiI1kAVwFcKgvJ5NXvjjXH0dgD0Z4iTn6KhHQuGoTav6vQazCsmtG0iicIvbVNcz_eXbi7G2sr_uUQZxRP_G2E-hya_NsnZmspqsTr4JRTckWgrTBYYH1QK8Zbd-cTPNx9y3vDlmsQx_N_5UG1JHIvQGBb2U";

const STEPS = [
  { n: "01", t: "You define the client", d: "Industry, target geo, deal size, who you want to talk to." },
  { n: "02", t: "We build the acquisition layer", d: "Ads, landing pages, qualification survey and scoring — all on our infrastructure." },
  { n: "03", t: "You get scored leads", d: "Every lead is checked on budget, timeline and fit. AI sorts. Your expert closes." },
];

const INDUSTRIES = [
  {
    title: "Investment migration",
    tag: "Proven",
    tone: "proven",
    body: "Residency and citizenship programs, Golden Visas, CBI. Investors screened on budget, program fit and timeline.",
    note: "Tested with US investors for Malta and Portugal: expected cost per qualified lead from $25.",
  },
  {
    title: "Company incorporation & licensing",
    tag: "Same model",
    tone: "same",
    body: "Founders and business owners who need a company, a license or a new jurisdiction. Qualified on business type, urgency and budget.",
  },
  {
    title: "Fintech, payments & banking",
    tag: "Same model",
    tone: "same",
    body: "Business owners looking for accounts, payment solutions and cross-border banking. Qualified on company size, volume and need.",
  },
  {
    title: "Adjacent services",
    tag: "Same model",
    tone: "same",
    body: "International health insurance, tax and wealth structuring for globally mobile clients.",
  },
];

const QUALIFIED = [
  "Budget matching your offer",
  "Realistic timeline",
  "Fit with your service and geo",
  "Verified contact details",
];

const WHY = [
  { t: "Exclusive leads", d: "Every lead is yours only. Never shared, never resold." },
  { t: "Any geo", d: "Middle East, US, Europe, Asia — wherever your clients are." },
  { t: "Built by industry insiders", d: "FBS has run events across 16+ jurisdictions and worked with 150+ firms in investment migration." },
];

const VERTICALS = [
  "Investment migration",
  "Company incorporation & licensing",
  "Offshore & international structuring",
  "Banking & payments",
  "Tax & wealth planning",
  "International real estate",
  "Global insurance",
];

const MODELS = [
  { t: "Done-for-you", tag: "Most exclusive", d: "Your leads only, and a campaign built around your offer." },
  { t: "Subscription · Exclusive", tag: "Exclusive", d: "A lead you open disappears for everyone else. Higher price." },
  { t: "Subscription · Shared", tag: "Best value", d: "Each lead is seen by up to 3 firms. Lower price, more volume." },
];

const INDUSTRY_OPTIONS = [
  "Investment migration",
  "Company incorporation & licensing",
  "Fintech, payments & banking",
  "International health insurance",
  "Tax & wealth structuring",
  "Other",
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  :root{
    --black:#0A0A0A;--off:#F4F4F2;--white:#FFFFFF;
    --lime:#AAFF45;--lime2:#8EE032;--lime-soft:#E8F5DF;--lime-dark:#5A8A20;
    --muted:#6B6B6B;--border:#E5E5E5;--text:#0A0A0A;--text2:#3A3A3A;--red:#D94F3A;
  }
  html{scroll-behavior:smooth}
  body{background:var(--white);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  .ind-wrap{max-width:1080px;margin:0 auto;padding:0 32px}
  .ind a{color:inherit;text-decoration:none}

  @keyframes indPulse{0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,.5)}50%{box-shadow:0 0 0 10px rgba(170,255,69,0)}}

  .ind nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
  .ind .nav-inner{max-width:1080px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:62px}
  .ind .nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-.02em}
  .ind .nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:indPulse 2.5s ease-in-out infinite}
  .ind .nav-right{display:flex;align-items:center;gap:22px}
  .ind .nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);transition:color .15s}
  .ind .nav-link:hover{color:var(--black)}
  .ind .nav-btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--black);color:var(--white);padding:9px 18px;border-radius:7px;transition:all .15s;border:none;cursor:pointer;font-family:inherit}
  .ind .nav-btn:hover{background:var(--lime);color:var(--black)}

  .ind .hero{padding:140px 0 72px;position:relative;overflow:hidden;border-bottom:1px solid var(--border)}
  .ind .hero-grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,.04) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 70% 55% at 50% 30%,black 40%,transparent 100%);-webkit-mask-image:radial-gradient(ellipse 70% 55% at 50% 30%,black 40%,transparent 100%);pointer-events:none}
  .ind .hero>.ind-wrap{position:relative;z-index:2}
  .ind .eyebrow{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:18px;display:inline-flex;align-items:center;gap:10px}
  .ind .eyebrow-line{width:24px;height:1px;background:currentColor;opacity:.4}
  .ind .hero h1{font-size:clamp(34px,5vw,60px);font-weight:800;line-height:1.03;letter-spacing:-.035em;color:var(--black);max-width:900px}
  .ind .accent{position:relative;display:inline-block}
  .ind .accent::after{content:'';position:absolute;bottom:.05em;left:-2px;right:-2px;height:.3em;background:var(--lime);z-index:-1;border-radius:2px}
  .ind .hero p{font-size:19px;line-height:1.6;color:var(--text2);max-width:620px;margin-top:24px}
  .ind .hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:34px}
  .ind .btn{font-family:'Inter',sans-serif;font-size:14px;font-weight:700;letter-spacing:.01em;padding:15px 28px;border-radius:8px;border:1px solid var(--border);background:var(--white);color:var(--text2);cursor:pointer;transition:all .2s}
  .ind .btn:hover{color:var(--black);border-color:#cfcfcf}
  .ind .btn.primary{background:var(--black);color:var(--white);border-color:var(--black)}
  .ind .btn.primary:hover{background:var(--lime);color:var(--black);border-color:var(--lime);box-shadow:0 12px 32px -8px rgba(170,255,69,.4)}
  .ind .hero-verticals{margin-top:28px;max-width:760px}
  .ind .hv-label{display:block;font-size:11.5px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:12px}
  .ind .hv-chips{display:flex;flex-wrap:wrap;gap:8px}
  .ind .hv-chip{font-size:13.5px;font-weight:700;letter-spacing:-.01em;color:var(--black);background:var(--off);border:1px solid var(--border);border-radius:100px;padding:8px 15px;transition:all .15s}
  .ind .hv-chip:first-child{background:var(--lime);border-color:var(--lime)}

  .ind .section{padding:88px 0}
  .ind .section-off{background:var(--off);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
  .ind .sec-eyebrow{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:14px}
  .ind h2{font-size:clamp(28px,3.6vw,44px);font-weight:800;letter-spacing:-.03em;line-height:1.06;color:var(--black);margin-bottom:16px;max-width:760px}
  .ind .hl{background:var(--lime);padding:0 6px;border-radius:4px}
  .ind .sec-lead{font-size:16.5px;line-height:1.6;color:var(--text2);max-width:640px;margin-bottom:40px}
  .ind .microforecast{font-size:12.5px;color:var(--muted);margin-top:18px;font-style:italic}

  .ind .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .ind .step{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:26px 24px}
  .ind .step-n{font-size:13px;font-weight:800;color:var(--lime-dark);letter-spacing:.06em;margin-bottom:16px}
  .ind .step-t{font-size:18px;font-weight:800;letter-spacing:-.02em;color:var(--black);margin-bottom:9px}
  .ind .step-d{font-size:14.5px;line-height:1.55;color:var(--text2)}

  .ind .cards{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .ind .card{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:26px 26px}
  .ind .card-head{margin-bottom:12px;line-height:1.25}
  .ind .card-t{font-size:19px;font-weight:800;letter-spacing:-.02em;color:var(--black)}
  .ind .card-head .badge{vertical-align:middle;margin-left:9px;position:relative;top:-1px}
  .ind .badge{display:inline-flex;align-items:center;flex:0 0 auto;white-space:nowrap;font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;line-height:1;padding:5px 9px;border-radius:100px}
  .ind .badge.proven{background:var(--lime);color:var(--black)}
  .ind .badge.same{background:var(--off);color:var(--muted);border:1px solid var(--border)}
  .ind .card-b{font-size:15px;line-height:1.55;color:var(--text2)}
  .ind .card-note{font-size:13px;line-height:1.5;color:var(--lime-dark);font-weight:600;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)}
  .ind .ask{background:var(--black);border-radius:16px;padding:26px 28px;margin-top:16px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
  .ind .ask-t{font-size:16px;font-weight:700;color:var(--white);max-width:640px;line-height:1.45}
  .ind .ask-t b{color:var(--lime)}

  .ind .qual{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:center}
  .ind .qual-list{display:flex;flex-direction:column;gap:10px}
  .ind .qual-item{display:flex;align-items:center;gap:14px;background:var(--white);border:1px solid var(--border);border-radius:12px;padding:16px 18px;font-size:15.5px;font-weight:600;color:var(--black)}
  .ind .qual-check{width:24px;height:24px;flex:0 0 auto;border-radius:7px;background:var(--lime);color:var(--black);display:grid;place-items:center;font-size:13px;font-weight:900}
  .ind .qual-note{font-size:17px;line-height:1.5;color:var(--text2);font-weight:500}
  .ind .qual-note strong{color:var(--black);font-weight:800}

  .ind .why{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .ind .why-item{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:24px 24px;border-top:3px solid var(--lime2)}
  .ind .why-t{font-size:17px;font-weight:800;letter-spacing:-.02em;color:var(--black);margin-bottom:8px}
  .ind .why-d{font-size:14.5px;line-height:1.55;color:var(--text2)}

  .ind .cta{background:var(--black);border-radius:22px;padding:48px 44px}
  .ind .cta h2{color:var(--white);max-width:640px}
  .ind .cta-lead{font-size:16.5px;line-height:1.6;color:rgba(255,255,255,.7);max-width:600px;margin-bottom:32px}
  .ind form{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .ind .fld{display:flex;flex-direction:column;gap:7px}
  .ind .fld.full{grid-column:1 / -1}
  .ind .fld label{font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:rgba(255,255,255,.6)}
  .ind .fld label span{color:var(--muted);text-transform:none;letter-spacing:0;font-weight:500}
  .ind .fld input,.ind .fld select{font-family:'Inter',sans-serif;font-size:15px;font-weight:500;color:var(--white);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);border-radius:9px;padding:13px 14px;outline:none;transition:all .15s;width:100%}
  .ind .fld select option{color:#111}
  .ind .fld input::placeholder{color:rgba(255,255,255,.35)}
  .ind .fld input:focus,.ind .fld select:focus{border-color:var(--lime);box-shadow:0 0 0 3px rgba(170,255,69,.25)}
  .ind .fld input.err,.ind .fld select.err{border-color:var(--red)}
  .ind .fld-err{font-size:12px;color:#ff9b8c;font-weight:600}
  .ind .cta-submit{grid-column:1 / -1;margin-top:6px}
  .ind .cta-submit button{width:100%;font-family:'Inter',sans-serif;font-size:15px;font-weight:800;letter-spacing:.01em;padding:16px;border-radius:9px;border:none;background:var(--lime);color:var(--black);cursor:pointer;transition:all .18s}
  .ind .cta-submit button:hover{box-shadow:0 12px 32px -8px rgba(170,255,69,.5)}
  .ind .cta-submit button:disabled{opacity:.6;cursor:default}
  .ind .cta-fine{grid-column:1 / -1;font-size:12px;color:rgba(255,255,255,.45);margin-top:4px;line-height:1.5}

  .ind .verify{background:var(--black);border-radius:22px;padding:44px 44px;text-align:center}
  .ind .verify-eyebrow{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--lime);margin-bottom:14px}
  .ind .verify-t{font-size:clamp(24px,3.2vw,38px);font-weight:800;letter-spacing:-.03em;color:var(--white);line-height:1.1;max-width:720px;margin:0 auto}
  .ind .verify-d{font-size:17px;line-height:1.55;color:rgba(255,255,255,.7);max-width:600px;margin:14px auto 0}

  .ind .model{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:26px 24px;border-top:3px solid var(--lime2)}
  .ind .model-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;flex-wrap:wrap}
  .ind .model-t{font-size:17px;font-weight:800;letter-spacing:-.02em;color:var(--black)}
  .ind .model-tag{font-size:10.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--lime-dark);background:var(--lime-soft);border:1px solid rgba(170,255,69,.5);border-radius:100px;padding:3px 10px;white-space:nowrap}
  .ind .model-d{font-size:14.5px;line-height:1.55;color:var(--text2)}

  .ind footer{padding:44px 0;background:var(--white);border-top:1px solid var(--border)}
  .ind .foot-inner{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
  .ind .foot-logo{font-size:14px;font-weight:800;display:flex;align-items:center;gap:9px}
  .ind .foot-note{font-size:12.5px;color:var(--muted);margin-top:8px}
  .ind .foot-links{display:flex;gap:22px}
  .ind .foot-links a{font-size:12.5px;color:var(--text2)}
  .ind .foot-links a:hover{color:var(--black)}

  @media(max-width:820px){
    .ind .steps,.ind .why{grid-template-columns:1fr}
    .ind .cards{grid-template-columns:1fr}
    .ind .qual{grid-template-columns:1fr;gap:24px}
    .ind form{grid-template-columns:1fr}
    .ind .cta{padding:32px 22px}
  }
`;

export default function Industries() {
  const [form, setForm] = useState({ name: "", email: "", company: "", industry: "", geo: "", currentCpl: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.company.trim()) e.company = "Company is required";
    if (!form.industry) e.industry = "Select your industry";
    if (!form.geo.trim()) e.geo = "Target geo is required";
    return e;
  };

  const submit = async (ev) => {
    if (ev) ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const parts = form.name.trim().split(" ");
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";

      // Fallback into the existing `message` field so nothing is lost even
      // before the dedicated industry/target_geo/current_cpl fields exist.
      const summary =
        `Industry: ${form.industry} | Target geo: ${form.geo}` +
        (form.currentCpl ? ` | Current CPL: ${form.currentCpl}` : "") +
        " (via /industries)";

      const subRes = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MAILERLITE_TOKEN}`,
        },
        body: JSON.stringify({
          email: form.email,
          fields: {
            name: firstName,
            last_name: lastName,
            company: form.company,
            industry: form.industry || "",          // custom field
            target_geo: form.geo || "",             // custom field
            current_cpl: form.currentCpl || "",     // custom field
            message: summary,                        // existing field (fallback)
          },
        }),
      });
      const subData = await subRes.json();
      const subscriberId = subData?.data?.id;

      if (subscriberId) {
        const groupsRes = await fetch("https://connect.mailerlite.com/api/groups?limit=100", {
          headers: { Authorization: `Bearer ${MAILERLITE_TOKEN}` },
        });
        const groupsData = await groupsRes.json();
        const group = groupsData?.data?.find((g) => g.name === "Industries / SBC");
        if (group) {
          await fetch(`https://connect.mailerlite.com/api/subscribers/${subscriberId}/groups/${group.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${MAILERLITE_TOKEN}`,
            },
          });
        }
      }
      window.location.href = "/thank-you";
    } catch (err) {
      console.error("MailerLite error:", err);
      window.location.href = "/thank-you";
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () =>
    document.getElementById("estimate").scrollIntoView({ behavior: "smooth" });

  return (
    <div className="ind">
      <style>{css}</style>

      <nav>
        <div className="nav-inner">
          <a className="nav-logo" href="/"><span className="nav-logo-dot" />FBS Intelligence</a>
          <div className="nav-right">
            <a className="nav-link" href="/overview">Overview</a>
            <a className="nav-link" href="/calc">Calculator</a>
            <button className="nav-btn" onClick={scrollToForm}>Get estimate</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="hero-grid" />
        <div className="ind-wrap">
          <div className="eyebrow"><span className="eyebrow-line" />Lead intelligence for high-ticket services</div>
          <h1>Pre-qualified leads for <span className="accent">high-ticket services</span>. Any geo.</h1>
          <p>We find, qualify and score your future clients before they reach your team. You get leads ready for a sales conversation, not raw traffic.</p>
          <div className="hero-verticals">
            <span className="hv-label">Built for firms in</span>
            <div className="hv-chips">
              {VERTICALS.map((vt) => (
                <span className="hv-chip" key={vt}>{vt}</span>
              ))}
            </div>
          </div>
          <div className="hero-actions">
            <button className="btn primary" onClick={scrollToForm}>Get your CPL estimate</button>
            <a className="btn" href="/calc">Check the calculator</a>
          </div>
        </div>
      </header>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="ind-wrap">
          <div className="sec-eyebrow">How it works</div>
          <h2>Three steps, <span className="hl">one clean handoff</span>.</h2>
          <p className="sec-lead">From your client definition to scored leads in your team's hands.</p>
          <div className="steps">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <div className="step-n">{s.n}</div>
                <div className="step-t">{s.t}</div>
                <div className="step-d">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section section-off">
        <div className="ind-wrap">
          <div className="sec-eyebrow">Industries we work with</div>
          <h2>One model, <span className="hl">many verticals</span>.</h2>
          <p className="sec-lead">If you sell a high-ticket service to a clear client profile, the model works.</p>
          <div className="cards">
            {INDUSTRIES.map((c) => (
              <div className="card" key={c.title}>
                <div className="card-head">
                  <span className="card-t">{c.title}</span>
                  <span className={`badge ${c.tone}`}>{c.tag}</span>
                </div>
                <div className="card-b">{c.body}</div>
                {c.note && <div className="card-note">{c.note}</div>}
              </div>
            ))}
          </div>
          <div className="ask">
            <div className="ask-t"><b>Your industry isn't listed?</b> If you sell a high-ticket service to a clear client profile, the model works. Ask us.</div>
            <button className="btn primary" onClick={scrollToForm}>Ask us</button>
          </div>
          <p className="microforecast">Any cost-per-lead figure shown is the expected acquisition economics for your market — a forecast, not our fee.</p>
        </div>
      </section>

      {/* WHAT QUALIFIED MEANS */}
      <section className="section">
        <div className="ind-wrap">
          <div className="qual">
            <div>
              <div className="sec-eyebrow">What "qualified" means</div>
              <h2>Ready for a <span className="hl">sales conversation</span>.</h2>
              <p className="qual-note">A qualified lead has completed our profiling survey and passed scoring. <strong>Leads below the threshold never reach you.</strong></p>
            </div>
            <div className="qual-list">
              {QUALIFIED.map((q) => (
                <div className="qual-item" key={q}><span className="qual-check">✓</span>{q}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTENT-VERIFIED */}
      <section className="section">
        <div className="ind-wrap">
          <div className="verify">
            <div className="verify-eyebrow">Intent-verified leads</div>
            <div className="verify-t">We call every lead before handing it over.</div>
            <div className="verify-d">You only receive people who said yes to speaking with an advisor.</div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="section section-off">
        <div className="ind-wrap">
          <div className="sec-eyebrow">Why firms work with us</div>
          <h2>Built for <span className="hl">high-ticket sales</span>.</h2>
          <div className="why">
            {WHY.map((w) => (
              <div className="why-item" key={w.t}>
                <div className="why-t">{w.t}</div>
                <div className="why-d">{w.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAYS TO WORK */}
      <section className="section">
        <div className="ind-wrap">
          <div className="sec-eyebrow">Ways to work with us</div>
          <h2>Choose your <span className="hl">access model</span>.</h2>
          <p className="sec-lead">From fully exclusive and done-for-you to a shared feed with more volume — pick what fits your budget and pipeline.</p>
          <div className="steps">
            {MODELS.map((m) => (
              <div className="model" key={m.t}>
                <div className="model-head">
                  <span className="model-t">{m.t}</span>
                  <span className="model-tag">{m.tag}</span>
                </div>
                <div className="model-d">{m.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FORM */}
      <section className="section" id="estimate">
        <div className="ind-wrap">
          <div className="cta">
            <div className="sec-eyebrow" style={{ color: "var(--lime)" }}>Get your estimate</div>
            <h2>Get your cost-per-lead estimate in 48 hours.</h2>
            <p className="cta-lead">Tell us your industry and target geo. We'll send you the expected cost per pre-qualified and qualified lead for your market.</p>
            <form onSubmit={submit} noValidate>
              <div className="fld">
                <label htmlFor="i-name">Name</label>
                <input id="i-name" className={errors.name ? "err" : ""} value={form.name} onChange={set("name")} placeholder="Jane Doe" />
                {errors.name && <span className="fld-err">{errors.name}</span>}
              </div>
              <div className="fld">
                <label htmlFor="i-email">Email</label>
                <input id="i-email" type="email" className={errors.email ? "err" : ""} value={form.email} onChange={set("email")} placeholder="jane@firm.com" />
                {errors.email && <span className="fld-err">{errors.email}</span>}
              </div>
              <div className="fld">
                <label htmlFor="i-company">Company</label>
                <input id="i-company" className={errors.company ? "err" : ""} value={form.company} onChange={set("company")} placeholder="Your firm" />
                {errors.company && <span className="fld-err">{errors.company}</span>}
              </div>
              <div className="fld">
                <label htmlFor="i-industry">Industry</label>
                <select id="i-industry" className={errors.industry ? "err" : ""} value={form.industry} onChange={set("industry")}>
                  <option value="">Select…</option>
                  {INDUSTRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.industry && <span className="fld-err">{errors.industry}</span>}
              </div>
              <div className="fld">
                <label htmlFor="i-geo">Target geo</label>
                <input id="i-geo" className={errors.geo ? "err" : ""} value={form.geo} onChange={set("geo")} placeholder="e.g. UAE, US, Western Europe" />
                {errors.geo && <span className="fld-err">{errors.geo}</span>}
              </div>
              <div className="fld">
                <label htmlFor="i-cpl">Current cost per lead <span>(optional)</span></label>
                <input id="i-cpl" value={form.currentCpl} onChange={set("currentCpl")} placeholder="e.g. $80" />
              </div>
              <div className="cta-submit">
                <button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Get my estimate →"}</button>
              </div>
              <div className="cta-fine">We reply within 48 hours with the expected cost per pre-qualified and qualified lead for your market. No spam.</div>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="ind-wrap foot-inner">
          <div>
            <div className="foot-logo"><span className="nav-logo-dot" />FBS Intelligence</div>
            <div className="foot-note">Part of Freedom Business Summit · Lead intelligence for high-ticket services</div>
          </div>
          <div className="foot-links">
            <a href="/overview">Overview</a>
            <a href="/calc">Calculator</a>
            <a href="/">fbsintelligence.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
