import { useState, Fragment } from "react";

/* ──────────────────────────────────────────────
   /calc — acquisition-funnel unit economics for
   investment migration firms. Illustrative model.
   Registration → (survey / webinar) → consultation
   → signed client, with monthly economics and a
   90-day ROI that folds in the one-time setup fee.
   ────────────────────────────────────────────── */

const SETUP_FEE = 1950; // fixed, one-time

const BENCHMARKS = {
  "United States": { registration: { min: 13, max: 17, label: "US" } },
};

const DEFAULTS = {
  market: "United States",
  adBudget: "1500",
  cpc: "1.80",
  clickToReg: "13",
  regToSurvey: "40",
  regToWebinar: "30",
  webinarToBooked: "30",
  bookedToAttended: "70",
  attendedToSigned: "25",
  revPerClient: "15000",
  margin: "70",
  mgmtFee: "499",
  otherTools: "0",
};

const num = (v) => {
  const n = parseFloat(v);
  return isFinite(n) ? n : 0;
};
const money0 = (n) =>
  (n < 0 ? "−$" : "$") + Math.round(Math.abs(n)).toLocaleString("en-US");
const money2 = (n) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const count = (n) =>
  n >= 10
    ? Math.round(n).toLocaleString("en-US")
    : n.toLocaleString("en-US", { maximumFractionDigits: 1 });

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  :root{
    --black:#0A0A0A;--off:#F4F4F2;--cream:#EBEBEB;--white:#FFFFFF;
    --lime:#AAFF45;--lime2:#8EE032;--lime-soft:#E8F5DF;--lime-dark:#5A8A20;
    --muted:#6B6B6B;--border:#E5E5E5;--text:#0A0A0A;--text2:#3A3A3A;--red:#D94F3A;
  }
  html{scroll-behavior:smooth}
  body{background:var(--white);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  .calc-wrap{max-width:920px;margin:0 auto;padding:0 32px}
  .calc a{color:inherit;text-decoration:none}

  @keyframes cPulseLime{0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,.5)}50%{box-shadow:0 0 0 10px rgba(170,255,69,0)}}

  .calc nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
  .calc .nav-inner{max-width:920px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:62px}
  .calc .nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-.02em}
  .calc .nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:cPulseLime 2.5s ease-in-out infinite}
  .calc .nav-logo em{font-style:normal;font-weight:400;color:var(--muted);font-size:12px}
  .calc .nav-right{display:flex;align-items:center;gap:24px}
  .calc .nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);padding:4px 0;transition:color .15s}
  .calc .nav-link:hover{color:var(--black)}
  .calc .nav-btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--black);color:var(--white);padding:9px 18px;border-radius:7px;transition:all .15s}
  .calc .nav-btn:hover{background:var(--lime);color:var(--black)}

  .calc .hero{padding:112px 0 6px;text-align:center}
  .calc .eyebrow{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:16px}
  .calc .hero h1{font-size:clamp(29px,3.9vw,44px);font-weight:800;line-height:1.06;letter-spacing:-.035em;color:var(--black)}
  .calc .accent{position:relative;display:inline-block}
  .calc .accent::after{content:'';position:absolute;bottom:.04em;left:-2px;right:-2px;height:.3em;background:var(--lime);z-index:-1;border-radius:2px}
  .calc .hero p{font-size:16.5px;line-height:1.6;color:var(--text2);max-width:560px;margin:16px auto 0}

  .calc .body{padding:28px 0 72px}

  .calc .disclaimer{display:flex;gap:10px;align-items:flex-start;background:var(--off);border:1px solid var(--border);border-radius:12px;padding:14px 18px;margin-bottom:22px;font-size:13.5px;line-height:1.5;color:var(--text2)}
  .calc .disclaimer b{color:var(--black);font-weight:800}
  .calc .disclaimer .dot{flex:0 0 auto;width:8px;height:8px;border-radius:50%;background:#C07D10;margin-top:6px}

  .calc .tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
  .calc .tile{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:20px 18px;text-align:center}
  .calc .tile.hi{background:var(--black)}
  .calc .tile.accent{border-color:var(--lime2);box-shadow:0 0 0 3px rgba(170,255,69,.2)}
  .calc .tile.accent .tile-v{color:var(--lime-dark)}
  .calc .tile-l{font-size:11.5px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);line-height:1.25}
  .calc .tile.hi .tile-l{color:rgba(255,255,255,.55)}
  .calc .tile-v{font-size:clamp(22px,2.7vw,30px);font-weight:900;letter-spacing:-.03em;margin-top:9px;font-variant-numeric:tabular-nums;color:var(--black)}
  .calc .tile.hi .tile-v{color:var(--lime)}
  .calc .tile-v.pos{color:var(--lime-dark)}.calc .tile-v.neg{color:var(--red)}
  .calc .tile-sub{font-size:11px;color:var(--muted);margin-top:6px;line-height:1.3}
  .calc .tile.hi .tile-sub{color:rgba(255,255,255,.5)}

  .calc .block{background:var(--white);border:1px solid var(--border);border-radius:18px;padding:26px 28px;margin-bottom:16px}
  .calc .block-h{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px}
  .calc .block-t{font-size:13px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--black)}
  .calc .card-sub{font-size:13px;color:var(--muted);margin-top:-10px;margin-bottom:18px;line-height:1.4}
  .calc .reset{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);background:var(--off);border:1px solid var(--border);padding:8px 13px;border-radius:8px;cursor:pointer;transition:all .15s}
  .calc .reset:hover{color:var(--black);border-color:#cfcfcf}

  .calc .rows{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .calc .row{display:flex;align-items:center;justify-content:space-between;gap:16px;background:var(--off);border:1px solid var(--border);border-radius:12px;padding:14px 18px;margin-bottom:12px}
  .calc .rows .row{margin-bottom:0}
  .calc .row label{font-size:15px;font-weight:600;color:var(--black);line-height:1.25}
  .calc .cin{display:inline-flex;align-items:center;gap:3px;background:var(--white);border:1px solid #d9d9d9;border-radius:10px;padding:0 12px;height:48px;flex:0 0 auto}
  .calc .cin:focus-within{border-color:var(--lime2);box-shadow:0 0 0 3px rgba(170,255,69,.22)}
  .calc .cin .aff{font-size:15px;font-weight:700;color:var(--muted)}
  .calc .cin input{border:none;background:none;font-family:'Inter',sans-serif;font-size:18px;font-weight:800;color:var(--black);text-align:right;width:96px;outline:none;font-variant-numeric:tabular-nums;-moz-appearance:textfield}
  .calc .cin input::-webkit-outer-spin-button,.calc .cin input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
  .calc .cin.sm input{width:60px}
  .calc .selbox{display:inline-flex;align-items:center;background:var(--white);border:1px solid #d9d9d9;border-radius:10px;height:48px;padding:0 6px 0 12px}
  .calc .selbox:focus-within{border-color:var(--lime2);box-shadow:0 0 0 3px rgba(170,255,69,.22)}
  .calc .selbox select{border:none;background:none;font-family:'Inter',sans-serif;font-size:15px;font-weight:700;color:var(--black);outline:none;cursor:pointer;padding-right:6px}

  .calc .benchmark-box{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:var(--lime-soft);border:1px solid var(--lime2);border-radius:12px;padding:14px 18px;margin:2px 0 4px}
  .calc .bm-tag{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--black);background:var(--lime);border-radius:6px;padding:5px 11px}
  .calc .bm-text{font-size:15.5px;font-weight:800;color:var(--black)}
  .calc .bm-note{font-size:12.5px;color:var(--lime-dark);font-weight:600;margin-left:auto}

  /* funnel */
  .calc .funnel-h{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:14px}
  .calc .funnel-cap{font-size:12.5px;color:var(--muted)}
  .calc .seg{display:grid;grid-template-columns:96px 1fr;column-gap:20px;align-items:center}
  .calc .gut{text-align:right;line-height:1}
  .calc .stage-seg{padding:14px 0}
  .calc .stage-num{font-size:clamp(26px,3.4vw,34px);font-weight:900;letter-spacing:-.03em;color:var(--black);font-variant-numeric:tabular-nums}
  .calc .stage-seg.signed .stage-num{color:var(--lime-dark)}
  .calc .stage-content{min-width:0}
  .calc .stage-name{font-size:16.5px;font-weight:700;letter-spacing:-.01em;color:var(--black);display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .calc .stage-cost{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--lime-dark);background:var(--lime-soft);border:1px solid rgba(170,255,69,.5);border-radius:100px;padding:3px 12px;letter-spacing:0;white-space:nowrap;max-width:100%}
  .calc .stage-cost b{font-weight:800;color:var(--black);font-variant-numeric:tabular-nums}
  .calc .stage-note{font-size:12px;color:var(--muted);margin-top:4px;line-height:1.4}
  .calc .stage-bar{height:8px;border-radius:6px;background:var(--lime2);margin-top:12px;transition:width .35s cubic-bezier(.16,1,.3,1);min-width:6px}
  .calc .stage-seg.signed .stage-bar{background:var(--black)}

  .calc .conv-seg{padding:4px 0}
  .calc .conv-arrow{font-size:17px;color:#c4c4c4}
  .calc .conv-ctrl{display:flex;align-items:center;justify-content:space-between;gap:14px;background:var(--off);border:1px solid var(--border);border-radius:11px;padding:8px 10px 8px 16px}
  .calc .conv-label{font-size:13.5px;font-weight:600;color:var(--text2)}
  .calc .conv-in{display:inline-flex;align-items:center;gap:2px;background:var(--white);border:1px solid #d9d9d9;border-radius:9px;padding:0 12px;height:40px;flex:0 0 auto}
  .calc .conv-in:focus-within{border-color:var(--lime2);box-shadow:0 0 0 3px rgba(170,255,69,.22)}
  .calc .conv-in input{border:none;background:none;font-family:'Inter',sans-serif;font-size:16px;font-weight:800;color:var(--black);text-align:right;width:46px;outline:none;font-variant-numeric:tabular-nums;-moz-appearance:textfield}
  .calc .conv-in input::-webkit-outer-spin-button,.calc .conv-in input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
  .calc .conv-in .aff{font-size:15px;font-weight:700;color:var(--muted)}

  /* readouts + tables */
  .calc .rows.three{grid-template-columns:repeat(3,1fr)}
  .calc .rows.three .row{flex-direction:column;align-items:flex-start;gap:10px}
  .calc .rows.three .row label{font-size:13px;font-weight:700;color:var(--text2)}
  .calc .rows.three .cin input,.calc .rows.three .cin.sm input{width:96px}
  .calc .math-row{display:grid;grid-template-columns:1fr auto;column-gap:16px;row-gap:2px;padding:12px 2px;border-bottom:1px solid var(--border)}
  .calc .math-row:last-child{border-bottom:none}
  .calc .math-l{grid-column:1;grid-row:1;font-size:14.5px;font-weight:700;color:var(--black)}
  .calc .math-f{grid-column:1;grid-row:2;font-size:12.5px;color:var(--muted)}
  .calc .math-v{grid-column:2;grid-row:1 / span 2;align-self:center;font-size:16px;font-weight:800;color:var(--black);font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
  .calc .math-v.neg{color:var(--red)}
  .calc .math-row.total{background:var(--lime-soft);border:1px solid rgba(170,255,69,.45);border-radius:11px;padding:13px 14px;margin:6px 0;border-bottom:none}
  .calc .math-row.total .math-l,.calc .math-row.total .math-v{font-size:16px}
  .calc .fixed-tag{font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);background:var(--off);border:1px solid var(--border);border-radius:5px;padding:2px 6px;margin-left:8px;vertical-align:middle}

  .calc footer{padding:40px 0;background:var(--white);border-top:1px solid var(--border)}
  .calc .foot-inner{max-width:920px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
  .calc .foot-logo{font-size:14px;font-weight:800;display:flex;align-items:center;gap:9px}
  .calc .foot-note{font-size:12.5px;color:var(--muted);margin-top:8px}
  .calc .foot-links{display:flex;gap:22px}
  .calc .foot-links a{font-size:12.5px;color:var(--text2)}
  .calc .foot-links a:hover{color:var(--black)}

  @media(max-width:900px){.calc .tiles{grid-template-columns:1fr 1fr}}
  @media(max-width:640px){
    .calc .tiles{grid-template-columns:1fr}
    .calc .rows,.calc .rows.three{grid-template-columns:1fr}
    .calc .seg{grid-template-columns:66px 1fr;column-gap:12px}
  }
`;

export default function Calc() {
  const [v, setV] = useState(DEFAULTS);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const reset = () => setV(DEFAULTS);

  const adBudget = Math.max(0, num(v.adBudget));
  const cpc = Math.max(0, num(v.cpc));
  const revPerClient = Math.max(0, num(v.revPerClient));
  const margin = Math.min(100, Math.max(0, num(v.margin))) / 100;
  const mgmtFee = Math.max(0, num(v.mgmtFee));
  const otherTools = Math.max(0, num(v.otherTools));
  const pct = (k) => Math.min(100, Math.max(0, num(v[k]))) / 100;

  const clicks = cpc > 0 ? adBudget / cpc : 0;
  const reg = clicks * pct("clickToReg");
  // Survey and webinar are BOTH measured from registrations (parallel):
  // a registrant can complete the survey, attend the webinar, or both.
  const survey = reg * pct("regToSurvey");
  const webinar = reg * pct("regToWebinar");
  // A lead is "qualified" if they did the survey OR attended the webinar.
  // With no overlap data we assume independence: 1 − (1−s)(1−w).
  const qualified = reg * (1 - (1 - pct("regToSurvey")) * (1 - pct("regToWebinar")));
  // The revenue path runs through webinar attendees.
  const booked = webinar * pct("webinarToBooked");
  const attended = booked * pct("bookedToAttended");
  const signed = Math.round(attended * pct("attendedToSigned")); // whole clients

  const costPer = (vol) => (vol > 0 ? adBudget / vol : null);
  const c2 = (vol) => {
    const c = costPer(vol);
    return c == null ? "—" : money2(c);
  };

  // Monthly economics.
  const monthlyRevenue = signed * revPerClient;
  const monthlyExpense = adBudget + mgmtFee + otherTools;
  const monthlyGross = monthlyRevenue * margin;
  const monthlyNet = monthlyGross - monthlyExpense;

  // 90-day return (folds in the one-time setup fee).
  const rev90 = monthlyRevenue * 3;
  const gross90 = rev90 * margin;
  const invest90 = adBudget * 3 + mgmtFee * 3 + otherTools * 3 + SETUP_FEE;
  const net90 = gross90 - invest90;
  const roi90 = invest90 > 0 ? net90 / invest90 : null;

  const stages = [
    { name: "Clicks", value: clicks },
    { name: "Registrations", value: reg, conv: "clickToReg", convLabel: "Click → registration", costLabel: "Cost per registration", cost: c2(reg) },
    { name: "Survey completed", value: survey, conv: "regToSurvey", convLabel: "Registration → survey submitted", note: "From registrations — the survey is optional.", costLabel: "Cost per survey", cost: c2(survey) },
    { name: "Webinar attendees", value: webinar, conv: "regToWebinar", convLabel: "Registration → webinar attendance", note: "Also from registrations — attendance does not require the survey.", costLabel: "Cost per attendee", cost: c2(webinar) },
    { name: "Consultations booked", value: booked, conv: "webinarToBooked", convLabel: "Webinar attendee → consultation booked" },
    { name: "Consultations attended", value: attended, conv: "bookedToAttended", convLabel: "Booked → attended", costLabel: "Cost per consultation", cost: c2(attended) },
    { name: "Signed clients", value: signed, conv: "attendedToSigned", convLabel: "Consultation attended → signed client", costLabel: "Cost per client", cost: c2(signed), signed: true },
  ];
  const base = clicks || 1;

  const settings = [
    { key: "revPerClient", label: "Revenue per client", prefix: "$", step: "500" },
    { key: "margin", label: "Profit margin", suffix: "%", step: "1", sm: true, max: "100" },
    { key: "mgmtFee", label: "Management fee / mo", prefix: "$", step: "50" },
    { key: "otherTools", label: "Other tools / mo", prefix: "$", step: "10" },
  ];

  return (
    <div className="calc">
      <style>{css}</style>

      <nav>
        <div className="nav-inner">
          <a className="nav-logo" href="/"><span className="nav-logo-dot" />FBS Intelligence <em>/ Calculator</em></a>
          <div className="nav-right">
            <a className="nav-link" href="/scoring">Scoring</a>
            <a className="nav-link" href="/questions">Questions</a>
            <a className="nav-btn" href="/">fbsintelligence.com ↗</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="calc-wrap">
          <div className="eyebrow">Unit economics</div>
          <h1>What your acquisition funnel <span className="accent">turns into</span>.</h1>
          <p>Adjust the assumptions and model the path from ad spend to signed clients.</p>
        </div>
      </header>

      <div className="body">
        <div className="calc-wrap">
          <div className="disclaimer">
            <span className="dot" />
            <span><b>Illustrative scenario — not a performance forecast.</b> Replace the assumptions with your own numbers.</span>
          </div>

          {/* headline outcome */}
          <div className="tiles">
            <div className="tile">
              <div className="tile-l">Registrations / mo</div>
              <div className="tile-v">{count(reg)}</div>
              <div className="tile-sub">what the funnel is built to drive (~100+).</div>
            </div>
            <div className="tile accent">
              <div className="tile-l">Qualified leads / mo</div>
              <div className="tile-v">{count(qualified)}</div>
              <div className="tile-sub">of those registrations — survey or webinar.</div>
            </div>
            <div className="tile">
              <div className="tile-l">Signed clients / mo</div>
              <div className="tile-v">{count(signed)}</div>
              <div className="tile-sub">rounded — expected monthly average.</div>
            </div>
            <div className="tile hi">
              <div className="tile-l">90-day ROI</div>
              <div className={`tile-v ${roi90 == null ? "" : roi90 >= 0 ? "" : "neg"}`}>{roi90 == null ? "—" : (roi90 * 100).toFixed(0) + "%"}</div>
            </div>
          </div>

          {/* traffic + market */}
          <div className="block">
            <div className="block-h">
              <div className="block-t">Traffic</div>
              <button className="reset" onClick={reset}>Reset example</button>
            </div>
            <div className="row">
              <label htmlFor="market">Market</label>
              <span className="selbox">
                <select id="market" value={v.market} onChange={set("market")}>
                  <option value="United States">United States</option>
                </select>
              </span>
            </div>
            <div className="benchmark-box">
              <span className="bm-tag">US benchmark</span>
              <span className="bm-text">$13–$17 per registration</span>
              <span className="bm-note">a healthy cost-per-registration range</span>
            </div>
            <div className="rows" style={{ marginTop: "14px" }}>
              <div className="row">
                <label htmlFor="adBudget">Monthly ad budget</label>
                <span className="cin"><span className="aff">$</span><input id="adBudget" type="number" inputMode="decimal" min="0" step="100" value={v.adBudget} onChange={set("adBudget")} /></span>
              </div>
              <div className="row">
                <label htmlFor="cpc">Cost per click</label>
                <span className="cin"><span className="aff">$</span><input id="cpc" type="number" inputMode="decimal" min="0" step="0.1" value={v.cpc} onChange={set("cpc")} /></span>
              </div>
            </div>
          </div>

          {/* funnel */}
          <div className="block">
            <div className="funnel-h">
              <div className="block-t">Your funnel</div>
              <div className="funnel-cap">per month · edit any conversion</div>
            </div>
            {stages.map((s) => (
              <Fragment key={s.name}>
                {s.conv && (
                  <div className="seg conv-seg">
                    <div className="gut"><span className="conv-arrow">↓</span></div>
                    <div className="conv-ctrl">
                      <span className="conv-label">{s.convLabel}</span>
                      <span className="conv-in">
                        <input type="number" inputMode="decimal" min="0" max="100" step="1" value={v[s.conv]} onChange={set(s.conv)} />
                        <span className="aff">%</span>
                      </span>
                    </div>
                  </div>
                )}
                <div className={`seg stage-seg ${s.signed ? "signed" : ""}`}>
                  <div className="gut stage-num">{count(s.value)}</div>
                  <div className="stage-content">
                    <div className="stage-name">
                      {s.name}
                      {s.costLabel && (
                        <span className="stage-cost">{s.costLabel} <b>{s.cost}</b></span>
                      )}
                    </div>
                    {s.note && <div className="stage-note">{s.note}</div>}
                    <div className="stage-bar" style={{ width: `${Math.max(6, (s.value / base) * 100)}%` }} />
                  </div>
                </div>
              </Fragment>
            ))}
          </div>

          {/* economics — monthly */}
          <div className="block">
            <div className="block-h"><div className="block-t">Economics · per month</div></div>
            <div className="card-sub">What a client is worth, and what you spend to run the funnel each month.</div>
            <div className="rows">
              {settings.map((it) => (
                <div className="row" key={it.key}>
                  <label htmlFor={it.key}>{it.label}</label>
                  <span className={`cin ${it.sm ? "sm" : ""}`}>
                    {it.prefix && <span className="aff">{it.prefix}</span>}
                    <input id={it.key} type="number" inputMode="decimal" min="0" max={it.max} step={it.step} value={v[it.key]} onChange={set(it.key)} />
                    {it.suffix && <span className="aff">{it.suffix}</span>}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "8px" }}>
              <div className="math-row">
                <span className="math-l">Revenue</span>
                <span className="math-f">{count(signed)} signed clients × {money0(revPerClient)}</span>
                <span className="math-v">{money0(monthlyRevenue)}</span>
              </div>
              <div className="math-row">
                <span className="math-l">Expense</span>
                <span className="math-f">ad {money0(adBudget)} + management {money0(mgmtFee)} + tools {money0(otherTools)}</span>
                <span className="math-v neg">−{money0(monthlyExpense)}</span>
              </div>
              <div className="math-row">
                <span className="math-l">Gross profit</span>
                <span className="math-f">revenue × {Math.round(margin * 100)}% profit margin</span>
                <span className="math-v">{money0(monthlyGross)}</span>
              </div>
              <div className="math-row total">
                <span className="math-l">Net profit / month</span>
                <span className="math-f">gross profit − expense</span>
                <span className="math-v">{money0(monthlyNet)}</span>
              </div>
            </div>
          </div>

          {/* 90-day return */}
          <div className="block">
            <div className="block-h"><div className="block-t">Return · first 90 days</div></div>
            <div className="card-sub">Three months of operation plus the one-time setup fee — the fair window to judge ROI.</div>
            <div className="math-row">
              <span className="math-l">Revenue</span>
              <span className="math-f">monthly revenue × 3</span>
              <span className="math-v">{money0(rev90)}</span>
            </div>
            <div className="math-row">
              <span className="math-l">Gross profit</span>
              <span className="math-f">revenue × {Math.round(margin * 100)}% profit margin</span>
              <span className="math-v">{money0(gross90)}</span>
            </div>
            <div className="math-row">
              <span className="math-l">Investment<span className="fixed-tag">incl. $1,950 setup</span></span>
              <span className="math-f">ad×3 + management×3 + tools×3 + {money0(SETUP_FEE)} setup</span>
              <span className="math-v neg">−{money0(invest90)}</span>
            </div>
            <div className="math-row total">
              <span className="math-l">Net profit · 90 days</span>
              <span className="math-f">gross profit − investment</span>
              <span className="math-v">{money0(net90)}</span>
            </div>
            <div className="math-row">
              <span className="math-l">ROI · 90 days</span>
              <span className="math-f">net profit ÷ investment</span>
              <span className="math-v">{roi90 == null ? "—" : (roi90 * 100).toFixed(0) + "%"}</span>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="foot-inner">
          <div>
            <div className="foot-logo"><span className="nav-logo-dot" />FBS Intelligence</div>
            <div className="foot-note">Part of Freedom Business Summit · Lead intelligence for global mobility firms</div>
          </div>
          <div className="foot-links">
            <a href="/scoring">Scoring</a>
            <a href="/questions">Questions</a>
            <a href="/">fbsintelligence.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
