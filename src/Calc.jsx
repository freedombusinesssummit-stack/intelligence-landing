import { useState, Fragment } from "react";

/* ──────────────────────────────────────────────
   /calc — acquisition-funnel unit economics for
   investment migration firms. Illustrative model:
   ad spend → registration → qualified → webinar →
   consultation → signed client, with a 90-day P&L.
   ────────────────────────────────────────────── */

const MGMT_FEE = 499; // fixed, $/month
const SETUP_FEE = 1950; // fixed, one-time

// Benchmarks live in config so ranges can change without touching formulas.
const BENCHMARKS = {
  "United States": { registration: { min: 13, max: 17, label: "US" } },
};

const DEFAULTS = {
  market: "United States",
  adBudget: "1500",
  cpc: "1.80",
  revPerClient: "15000",
  margin: "70",
  clickToReg: "13",
  regToSurvey: "40",
  qualToWebinar: "35",
  webinarToBooked: "30",
  bookedToAttended: "70",
  attendedToSigned: "25",
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
    --blue:#4A7FC1;--green:#2F8A3E;--amber:#C07D10;
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
  .calc .disclaimer .dot{flex:0 0 auto;width:8px;height:8px;border-radius:50%;background:var(--amber);margin-top:6px}

  /* outcome tiles */
  .calc .tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
  .calc .tile{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:20px 18px;text-align:center}
  .calc .tile.hi{background:var(--black)}
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
  .calc .bench-hint{font-size:12.5px;color:var(--lime-dark);font-weight:600;margin:2px 0 16px}

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
  .calc .bench{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;border-radius:100px;padding:3px 11px;margin-top:6px}
  .calc .bench::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor}
  .calc .bench-within{color:var(--lime-dark);background:var(--lime-soft);border:1px solid rgba(170,255,69,.5)}
  .calc .bench-below{color:var(--green);background:rgba(47,138,62,.1);border:1px solid rgba(47,138,62,.3)}
  .calc .bench-above{color:var(--red);background:rgba(217,79,58,.1);border:1px solid rgba(217,79,58,.3)}
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

  /* investment + how it's calculated tables */
  .calc .math-row{display:grid;grid-template-columns:1fr auto;column-gap:16px;row-gap:2px;padding:12px 2px;border-bottom:1px solid var(--border)}
  .calc .math-row:last-child{border-bottom:none}
  .calc .math-l{grid-column:1;grid-row:1;font-size:14.5px;font-weight:700;color:var(--black)}
  .calc .math-f{grid-column:1;grid-row:2;font-size:12.5px;color:var(--muted)}
  .calc .math-v{grid-column:2;grid-row:1 / span 2;align-self:center;font-size:16px;font-weight:800;color:var(--black);font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap;display:flex;align-items:center;gap:10px;justify-content:flex-end}
  .calc .math-v.neg{color:var(--red)}
  .calc .math-v .mini-in{display:inline-flex;align-items:center;gap:2px;background:var(--white);border:1px solid #d9d9d9;border-radius:9px;padding:0 10px;height:38px}
  .calc .math-v .mini-in:focus-within{border-color:var(--lime2);box-shadow:0 0 0 3px rgba(170,255,69,.22)}
  .calc .math-v .mini-in input{border:none;background:none;font-family:'Inter',sans-serif;font-size:15px;font-weight:800;color:var(--black);text-align:right;width:70px;outline:none;font-variant-numeric:tabular-nums;-moz-appearance:textfield}
  .calc .math-v .mini-in input::-webkit-outer-spin-button,.calc .math-v .mini-in input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
  .calc .math-v .mini-in .aff{font-size:14px;font-weight:700;color:var(--muted)}
  .calc .math-row.total{background:var(--lime-soft);border:1px solid rgba(170,255,69,.45);border-radius:11px;padding:13px 14px;margin:6px 0;border-bottom:none}
  .calc .math-row.total .math-l,.calc .math-row.total .math-v{font-size:16px}
  .calc .fixed-tag{font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);background:var(--off);border:1px solid var(--border);border-radius:5px;padding:2px 6px;margin-left:8px;vertical-align:middle}

  footer.calc-foot,.calc footer{padding:40px 0;background:var(--white);border-top:1px solid var(--border)}
  .calc .foot-inner{max-width:920px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
  .calc .foot-logo{font-size:14px;font-weight:800;display:flex;align-items:center;gap:9px}
  .calc .foot-note{font-size:12.5px;color:var(--muted);margin-top:8px}
  .calc .foot-links{display:flex;gap:22px}
  .calc .foot-links a{font-size:12.5px;color:var(--text2)}
  .calc .foot-links a:hover{color:var(--black)}

  @media(max-width:900px){.calc .tiles{grid-template-columns:1fr 1fr}}
  @media(max-width:640px){
    .calc .tiles{grid-template-columns:1fr}
    .calc .rows{grid-template-columns:1fr}
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
  const otherTools = Math.max(0, num(v.otherTools));
  const pct = (k) => Math.min(100, Math.max(0, num(v[k]))) / 100;

  const clicks = cpc > 0 ? adBudget / cpc : 0;
  const reg = clicks * pct("clickToReg");
  const qualified = reg * pct("regToSurvey");
  const webinar = qualified * pct("qualToWebinar");
  const booked = webinar * pct("webinarToBooked");
  const attended = booked * pct("bookedToAttended");
  const signed = attended * pct("attendedToSigned");

  // Cost per stage = monthly ad spend / stage volume. Div-by-zero → null → "—".
  const costPer = (vol) => (vol > 0 ? adBudget / vol : null);
  const c2 = (vol) => {
    const c = costPer(vol);
    return c == null ? "—" : money2(c);
  };
  const costPerReg = costPer(reg);

  // Registration benchmark status (from config).
  const bench = BENCHMARKS[v.market] && BENCHMARKS[v.market].registration;
  let benchStatus = null;
  if (bench && costPerReg != null) {
    if (costPerReg < bench.min) benchStatus = { tone: "below", label: `Below ${bench.label} benchmark` };
    else if (costPerReg <= bench.max) benchStatus = { tone: "within", label: `Within ${bench.label} benchmark of $${bench.min}–$${bench.max}` };
    else benchStatus = { tone: "above", label: `Above ${bench.label} benchmark` };
  }

  // 90-day economics.
  const signed90 = signed * 3;
  const revenue90 = signed90 * revPerClient;
  const grossProfit90 = revenue90 * margin;
  const investment90 = adBudget * 3 + MGMT_FEE * 3 + SETUP_FEE + otherTools;
  const netProfit90 = grossProfit90 - investment90;
  const roi90 = investment90 > 0 ? netProfit90 / investment90 : null;

  const fractionalSigned = signed > 0 && signed % 1 !== 0;

  const stages = [
    { name: "Clicks", value: clicks },
    { name: "Registrations", value: reg, conv: "clickToReg", convLabel: "Click → registration", costLabel: "Cost per registration", cost: c2(reg), bench: true },
    { name: "Qualified leads", value: qualified, conv: "regToSurvey", convLabel: "Registration → survey submitted", note: "A lead becomes qualified after submitting the survey.", costLabel: "Cost per qualified lead", cost: c2(qualified) },
    { name: "Webinar attendees", value: webinar, conv: "qualToWebinar", convLabel: "Qualified lead → webinar attended", costLabel: "Cost per webinar attendee", cost: c2(webinar) },
    { name: "Consultations booked", value: booked, conv: "webinarToBooked", convLabel: "Webinar attendee → consultation booked" },
    { name: "Consultations attended", value: attended, conv: "bookedToAttended", convLabel: "Booked → attended", costLabel: "Cost per consultation attended", cost: c2(attended) },
    { name: "Signed clients", value: signed, conv: "attendedToSigned", convLabel: "Consultation attended → signed client", costLabel: "Cost per signed client", cost: c2(signed), signed: true },
  ];
  const base = clicks || 1;

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
              <div className="tile-l">Qualified leads / mo</div>
              <div className="tile-v">{count(qualified)}</div>
            </div>
            <div className="tile">
              <div className="tile-l">Signed clients / mo</div>
              <div className="tile-v">{count(signed)}</div>
              {fractionalSigned && <div className="tile-sub">Expected monthly average — actual results will vary.</div>}
            </div>
            <div className="tile hi">
              <div className="tile-l">90-day net profit</div>
              <div className="tile-v">{money0(netProfit90)}</div>
            </div>
            <div className="tile">
              <div className="tile-l">90-day ROI</div>
              <div className={`tile-v ${roi90 == null ? "" : roi90 >= 0 ? "pos" : "neg"}`}>{roi90 == null ? "—" : (roi90 * 100).toFixed(0) + "%"}</div>
            </div>
          </div>

          {/* assumptions */}
          <div className="block">
            <div className="block-h">
              <div className="block-t">Assumptions</div>
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
            <div className="bench-hint">US market benchmark: $13–$17 per registration</div>
            <div className="rows">
              <div className="row">
                <label htmlFor="adBudget">Monthly ad budget</label>
                <span className="cin"><span className="aff">$</span><input id="adBudget" type="number" inputMode="decimal" min="0" step="100" value={v.adBudget} onChange={set("adBudget")} /></span>
              </div>
              <div className="row">
                <label htmlFor="cpc">Cost per click</label>
                <span className="cin"><span className="aff">$</span><input id="cpc" type="number" inputMode="decimal" min="0" step="0.1" value={v.cpc} onChange={set("cpc")} /></span>
              </div>
              <div className="row">
                <label htmlFor="revPerClient">Revenue per signed client</label>
                <span className="cin"><span className="aff">$</span><input id="revPerClient" type="number" inputMode="decimal" min="0" step="500" value={v.revPerClient} onChange={set("revPerClient")} /></span>
              </div>
              <div className="row">
                <label htmlFor="margin">Profit margin</label>
                <span className="cin sm"><input id="margin" type="number" inputMode="decimal" min="0" max="100" step="1" value={v.margin} onChange={set("margin")} /><span className="aff">%</span></span>
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
                    {s.bench && benchStatus && <div className={`bench bench-${benchStatus.tone}`}>{benchStatus.label}</div>}
                    <div className="stage-bar" style={{ width: `${Math.max(6, (s.value / base) * 100)}%` }} />
                  </div>
                </div>
              </Fragment>
            ))}
          </div>

          {/* investment */}
          <div className="block">
            <div className="block-h"><div className="block-t">Your investment · first 90 days</div></div>
            <div className="card-sub">Everything you put in over the first three months.</div>
            <div className="math-row">
              <span className="math-l">Ad spend</span>
              <span className="math-f">{money0(adBudget)} / month × 3</span>
              <span className="math-v">{money0(adBudget * 3)}</span>
            </div>
            <div className="math-row">
              <span className="math-l">FBS management fee<span className="fixed-tag">fixed</span></span>
              <span className="math-f">{money0(MGMT_FEE)} / month × 3</span>
              <span className="math-v">{money0(MGMT_FEE * 3)}</span>
            </div>
            <div className="math-row">
              <span className="math-l">FBS setup fee<span className="fixed-tag">fixed</span></span>
              <span className="math-f">{money0(SETUP_FEE)} one-time</span>
              <span className="math-v">{money0(SETUP_FEE)}</span>
            </div>
            <div className="math-row">
              <span className="math-l">Other tools</span>
              <span className="math-f">optional (email, webinar, CRM…)</span>
              <span className="math-v">
                <span className="mini-in"><span className="aff">$</span><input type="number" inputMode="decimal" min="0" step="10" value={v.otherTools} onChange={set("otherTools")} /></span>
              </span>
            </div>
            <div className="math-row total">
              <span className="math-l">Total 90-day investment</span>
              <span className="math-v">{money0(investment90)}</span>
            </div>
          </div>

          {/* how it's calculated */}
          <div className="block">
            <div className="block-h"><div className="block-t">How it's calculated · first 90 days</div></div>
            <div className="math-row">
              <span className="math-l">Expected signed clients</span>
              <span className="math-f">{count(signed)} / month × 3</span>
              <span className="math-v">{count(signed90)}</span>
            </div>
            <div className="math-row">
              <span className="math-l">Revenue</span>
              <span className="math-f">{count(signed90)} signed clients × {money0(revPerClient)}</span>
              <span className="math-v">{money0(revenue90)}</span>
            </div>
            <div className="math-row">
              <span className="math-l">Gross profit</span>
              <span className="math-f">revenue × {Math.round(margin * 100)}% profit margin</span>
              <span className="math-v">{money0(grossProfit90)}</span>
            </div>
            <div className="math-row">
              <span className="math-l">Total 90-day investment</span>
              <span className="math-f">ad + management + setup + tools</span>
              <span className="math-v neg">−{money0(investment90)}</span>
            </div>
            <div className="math-row total">
              <span className="math-l">Net profit</span>
              <span className="math-f">gross profit − investment</span>
              <span className="math-v">{money0(netProfit90)}</span>
            </div>
            <div className="math-row">
              <span className="math-l">ROI</span>
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
