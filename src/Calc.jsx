import { useState, Fragment } from "react";

/* ──────────────────────────────────────────────
   /calc — unit-economics calculator for investment
   migration firms. Simple, readable ROI model:
   a visual funnel with inline, editable conversions.
   ────────────────────────────────────────────── */

const DEFAULTS = {
  adBudget: "1500",
  cpc: "1.80",
  landingCR: "13",
  leadToSurvey: "40",
  leadToWebinar: "30",
  webinarToConsult: "18",
  consultToSigned: "20",
  revPerClient: "15000",
  margin: "70",
  mgmtFee: "499",
  emailCost: "40",
  webinarCost: "50",
  otherTools: "0",
};

const num = (v) => {
  const n = parseFloat(v);
  return isFinite(n) ? n : 0;
};
const money0 = (n) => "$" + Math.round(n).toLocaleString("en-US");
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

  .calc .hero{padding:112px 0 8px;text-align:center}
  .calc .eyebrow{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:16px}
  .calc .hero h1{font-size:clamp(30px,4vw,44px);font-weight:800;line-height:1.06;letter-spacing:-.035em;color:var(--black)}
  .calc .accent{position:relative;display:inline-block}
  .calc .accent::after{content:'';position:absolute;bottom:.04em;left:-2px;right:-2px;height:.3em;background:var(--lime);z-index:-1;border-radius:2px}
  .calc .hero p{font-size:16.5px;line-height:1.6;color:var(--text2);max-width:560px;margin:16px auto 0}

  .calc .body{padding:36px 0 72px}

  /* outcome tiles */
  .calc .tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:34px}
  .calc .tile{background:var(--white);border:1px solid var(--border);border-radius:18px;padding:24px 22px;text-align:center}
  .calc .tile.hi{background:var(--black)}
  .calc .tile-l{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted)}
  .calc .tile.hi .tile-l{color:rgba(255,255,255,.55)}
  .calc .tile-v{font-size:clamp(28px,4vw,40px);font-weight:900;letter-spacing:-.03em;margin-top:10px;font-variant-numeric:tabular-nums;color:var(--black)}
  .calc .tile.hi .tile-v{color:var(--lime)}
  .calc .tile-v.pos{color:var(--lime-dark)}.calc .tile-v.neg{color:var(--red)}
  .calc .tile-sub{font-size:11.5px;color:var(--muted);margin-top:8px;line-height:1.3}
  .calc .tile.hi .tile-sub{color:rgba(255,255,255,.5)}

  /* input rows */
  .calc .block{background:var(--white);border:1px solid var(--border);border-radius:18px;padding:26px 28px;margin-bottom:16px}
  .calc .block-h{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px}
  .calc .block-t{font-size:13px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--black)}
  .calc .card-sub{font-size:13px;color:var(--muted);margin-top:-10px;margin-bottom:18px;line-height:1.4}

  /* how it's calculated */
  .calc .math-row{display:grid;grid-template-columns:1fr auto;column-gap:16px;row-gap:2px;padding:12px 2px;border-bottom:1px solid var(--border)}
  .calc .math-row:last-child{border-bottom:none}
  .calc .math-l{grid-column:1;grid-row:1;font-size:14.5px;font-weight:700;color:var(--black)}
  .calc .math-f{grid-column:1;grid-row:2;font-size:12.5px;color:var(--muted)}
  .calc .math-v{grid-column:2;grid-row:1 / span 2;align-self:center;font-size:16px;font-weight:800;color:var(--black);font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
  .calc .math-v.neg{color:var(--red)}
  .calc .math-row.total{background:var(--lime-soft);border:1px solid rgba(170,255,69,.45);border-radius:11px;padding:13px 14px;margin:6px 0;border-bottom:none}
  .calc .math-row.total .math-l,.calc .math-row.total .math-v{font-size:16px}
  .calc .reset{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);background:var(--off);border:1px solid var(--border);padding:8px 13px;border-radius:8px;cursor:pointer;transition:all .15s}
  .calc .reset:hover{color:var(--black);border-color:#cfcfcf}
  .calc .rows{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .calc .rows.three{grid-template-columns:repeat(3,1fr)}
  .calc .row{display:flex;align-items:center;justify-content:space-between;gap:16px;background:var(--off);border:1px solid var(--border);border-radius:12px;padding:14px 18px}
  .calc .row label{font-size:15px;font-weight:600;color:var(--black);line-height:1.25}
  .calc .rows.three .row{flex-direction:column;align-items:flex-start;gap:10px}
  .calc .rows.three .row label{font-size:13px;font-weight:700;color:var(--text2)}
  .calc .rows.three .cin{height:46px}
  .calc .rows.three .cin input,.calc .rows.three .cin.sm input{width:96px}
  .calc .block .rows + .rows{margin-top:14px}
  .calc .readout{display:inline-flex;align-items:center;justify-content:flex-end;height:46px;min-width:132px;padding:0 14px;font-size:18px;font-weight:800;color:var(--black);font-variant-numeric:tabular-nums;background:var(--lime-soft);border:1px solid rgba(170,255,69,.5);border-radius:10px}
  .calc .readout.mirror{background:var(--white);border-color:#e2e2e2;color:var(--text2)}
  .calc .breakeven{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:16px;background:var(--black);border-radius:12px;padding:16px 20px}
  .calc .be-l{font-size:13.5px;font-weight:700;letter-spacing:.02em;color:rgba(255,255,255,.7)}
  .calc .be-v{font-size:24px;font-weight:900;letter-spacing:-.02em;color:var(--lime);font-variant-numeric:tabular-nums}
  .calc .cin{display:inline-flex;align-items:center;gap:3px;background:var(--white);border:1px solid #d9d9d9;border-radius:10px;padding:0 12px;height:48px;flex:0 0 auto}
  .calc .cin:focus-within{border-color:var(--lime2);box-shadow:0 0 0 3px rgba(170,255,69,.22)}
  .calc .cin .aff{font-size:15px;font-weight:700;color:var(--muted)}
  .calc .cin input{border:none;background:none;font-family:'Inter',sans-serif;font-size:18px;font-weight:800;color:var(--black);text-align:right;width:88px;outline:none;font-variant-numeric:tabular-nums;-moz-appearance:textfield}
  .calc .cin input::-webkit-outer-spin-button,.calc .cin input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
  .calc .cin.sm input{width:52px}

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

  .calc .note{font-size:12.5px;line-height:1.55;color:var(--muted);text-align:center;margin-top:22px;max-width:620px;margin-left:auto;margin-right:auto}

  .calc footer{padding:40px 0;background:var(--white);border-top:1px solid var(--border)}
  .calc .foot-inner{max-width:920px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
  .calc .foot-logo{font-size:14px;font-weight:800;display:flex;align-items:center;gap:9px}
  .calc .foot-note{font-size:12.5px;color:var(--muted);margin-top:8px}
  .calc .foot-links{display:flex;gap:22px}
  .calc .foot-links a{font-size:12.5px;color:var(--text2)}
  .calc .foot-links a:hover{color:var(--black)}

  @media(max-width:720px){
    .calc .tiles{grid-template-columns:1fr}
    .calc .rows,.calc .rows.three{grid-template-columns:1fr}
    .calc .seg{grid-template-columns:72px 1fr;column-gap:14px}
  }
`;

export default function Calc() {
  const [v, setV] = useState(DEFAULTS);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const reset = () => setV(DEFAULTS);

  const adBudget = num(v.adBudget);
  const cpc = num(v.cpc);
  const clicks = cpc > 0 ? adBudget / cpc : 0;
  const leads = clicks * (num(v.landingCR) / 100);
  // Survey and webinar attendance are both measured from registered leads:
  // a lead can skip the survey and still attend the webinar.
  const survey = leads * (num(v.leadToSurvey) / 100);
  const webinar = leads * (num(v.leadToWebinar) / 100);
  // Consultations come from webinar attendees, signed clients from consultations.
  const consultations = webinar * (num(v.webinarToConsult) / 100);
  const signed = consultations * (num(v.consultToSigned) / 100);

  const revPerClient = num(v.revPerClient);
  const margin = num(v.margin) / 100;
  const mgmtFee = num(v.mgmtFee);
  const profitPerClient = revPerClient * margin;
  const emailCost = num(v.emailCost);
  const webinarCost = num(v.webinarCost);
  const otherTools = num(v.otherTools);
  const toolsCost = emailCost + webinarCost + otherTools;
  const revenue = signed * revPerClient;
  const grossProfit = revenue * margin;
  const spend = adBudget + mgmtFee + toolsCost;
  const netProfit = grossProfit - spend;
  const roi = spend > 0 ? netProfit / spend : 0;
  const breakEvenClients = profitPerClient > 0 ? spend / profitPerClient : 0;
  const costPer = (x) => (x > 0 ? adBudget / x : 0);
  const cpl = costPer(leads);
  const cac = signed > 0 ? spend / signed : 0;

  const mainStages = [
    { name: "Clicks", value: clicks },
    { name: "Leads", value: leads, conv: "landingCR", convLabel: "Landing page conversion", costLabel: "Cost per lead", costVal: money2(cpl) },
    { name: "Survey completed", value: survey, conv: "leadToSurvey", convLabel: "Registration → survey completed", note: "From registered leads — not required to attend the webinar.", costLabel: "Cost per survey", costVal: money2(costPer(survey)) },
    { name: "Webinar attendees", value: webinar, conv: "leadToWebinar", convLabel: "Registration → webinar attendance", note: "Also from registered leads.", costLabel: "Cost per attendee", costVal: money2(costPer(webinar)) },
    { name: "Consultations", value: consultations, conv: "webinarToConsult", convLabel: "Webinar → consultation", costLabel: "Cost per consultation", costVal: money2(costPer(consultations)) },
    { name: "Signed clients", value: signed, conv: "consultToSigned", convLabel: "Consultation → signed client", costLabel: "Cost per client", costVal: money0(cac), signed: true },
  ];

  const renderStages = (items, base) =>
    items.map((s) => (
      <Fragment key={s.name}>
        {s.conv && (
          <div className="seg conv-seg">
            <div className="gut"><span className="conv-arrow">↓</span></div>
            <div className="conv-ctrl">
              <span className="conv-label">{s.convLabel}</span>
              <span className="conv-in">
                <input type="number" inputMode="decimal" step="1" value={v[s.conv]} onChange={set(s.conv)} />
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
                <span className="stage-cost">{s.costLabel} <b>{s.costVal}</b></span>
              )}
            </div>
            {s.note && <div className="stage-note">{s.note}</div>}
            <div className="stage-bar" style={{ width: `${Math.max(6, (s.value / (base || 1)) * 100)}%` }} />
          </div>
        </div>
      </Fragment>
    ));

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
          <h1>What your ad spend <span className="accent">turns into</span>.</h1>
          <p>Set your budget and click cost, adjust the conversions to match your firm, and see the funnel and return update as you go.</p>
        </div>
      </header>

      <div className="body">
        <div className="calc-wrap">
          {/* headline outcome */}
          <div className="tiles">
            <div className="tile hi">
              <div className="tile-l">Net profit / month</div>
              <div className="tile-v">{money0(netProfit)}</div>
              <div className="tile-sub">gross profit − spend</div>
            </div>
            <div className="tile">
              <div className="tile-l">Return on cost</div>
              <div className={`tile-v ${roi >= 0 ? "pos" : "neg"}`}>{(roi * 100).toFixed(0)}%</div>
              <div className="tile-sub">net profit ÷ spend</div>
            </div>
            <div className="tile">
              <div className="tile-l">Revenue / month</div>
              <div className="tile-v">{money0(revenue)}</div>
              <div className="tile-sub">signed clients × revenue each</div>
            </div>
          </div>

          {/* traffic inputs */}
          <div className="block">
            <div className="block-h">
              <div className="block-t">Your spend</div>
              <button className="reset" onClick={reset}>Reset example</button>
            </div>
            <div className="rows">
              <div className="row">
                <label htmlFor="adBudget">Monthly ad budget</label>
                <span className="cin"><span className="aff">$</span><input id="adBudget" type="number" inputMode="decimal" step="100" value={v.adBudget} onChange={set("adBudget")} /></span>
              </div>
              <div className="row">
                <label htmlFor="cpc">Cost per click</label>
                <span className="cin"><span className="aff">$</span><input id="cpc" type="number" inputMode="decimal" step="0.1" value={v.cpc} onChange={set("cpc")} /></span>
              </div>
            </div>
          </div>

          {/* funnel — revenue path */}
          <div className="block">
            <div className="funnel-h">
              <div className="block-t">Your funnel</div>
              <div className="funnel-cap">per month · edit any conversion</div>
            </div>
            {renderStages(mainStages, clicks)}
          </div>

          {/* economics — per client */}
          <div className="block">
            <div className="block-h"><div className="block-t">Per signed client</div></div>
            <div className="card-sub">What one signed client is worth to you.</div>
            <div className="rows three">
              <div className="row">
                <label htmlFor="revPerClient">Revenue per client</label>
                <span className="cin"><span className="aff">$</span><input id="revPerClient" type="number" inputMode="decimal" step="500" value={v.revPerClient} onChange={set("revPerClient")} /></span>
              </div>
              <div className="row">
                <label htmlFor="margin">Profit margin</label>
                <span className="cin sm"><input id="margin" type="number" inputMode="decimal" step="1" value={v.margin} onChange={set("margin")} /><span className="aff">%</span></span>
              </div>
              <div className="row">
                <label>Profit per client</label>
                <span className="readout">{money0(profitPerClient)}</span>
              </div>
            </div>
          </div>

          {/* economics — monthly spend */}
          <div className="block">
            <div className="block-h"><div className="block-t">Monthly spend</div></div>
            <div className="card-sub">Everything you pay each month — media, management, and the third-party tools that run the funnel.</div>
            <div className="rows three">
              <div className="row">
                <label>Ad spend</label>
                <span className="readout mirror">{money0(adBudget)}</span>
              </div>
              <div className="row">
                <label htmlFor="mgmtFee">Management fee</label>
                <span className="cin"><span className="aff">$</span><input id="mgmtFee" type="number" inputMode="decimal" step="50" value={v.mgmtFee} onChange={set("mgmtFee")} /></span>
              </div>
              <div className="row">
                <label htmlFor="emailCost">Email marketing</label>
                <span className="cin"><span className="aff">$</span><input id="emailCost" type="number" inputMode="decimal" step="10" value={v.emailCost} onChange={set("emailCost")} /></span>
              </div>
              <div className="row">
                <label htmlFor="webinarCost">Webinar platform</label>
                <span className="cin"><span className="aff">$</span><input id="webinarCost" type="number" inputMode="decimal" step="10" value={v.webinarCost} onChange={set("webinarCost")} /></span>
              </div>
              <div className="row">
                <label htmlFor="otherTools">Other tools</label>
                <span className="cin"><span className="aff">$</span><input id="otherTools" type="number" inputMode="decimal" step="10" value={v.otherTools} onChange={set("otherTools")} /></span>
              </div>
              <div className="row">
                <label>Total spend</label>
                <span className="readout">{money0(spend)}</span>
              </div>
            </div>
            <div className="breakeven">
              <span className="be-l">Clients to break even each month</span>
              <span className="be-v">{count(breakEvenClients)}</span>
            </div>
          </div>

          {/* how it's calculated */}
          <div className="block">
            <div className="block-h"><div className="block-t">How it's calculated</div></div>
            <div className="math">
              <div className="math-row">
                <span className="math-l">Revenue / month</span>
                <span className="math-f">{count(signed)} signed clients × {money0(revPerClient)}</span>
                <span className="math-v">{money0(revenue)}</span>
              </div>
              <div className="math-row">
                <span className="math-l">Gross profit</span>
                <span className="math-f">revenue × {num(v.margin)}% profit margin</span>
                <span className="math-v">{money0(grossProfit)}</span>
              </div>
              <div className="math-row">
                <span className="math-l">Spend / month</span>
                <span className="math-f">ad {money0(adBudget)} + management {money0(mgmtFee)} + tools {money0(toolsCost)}</span>
                <span className="math-v neg">−{money0(spend)}</span>
              </div>
              <div className="math-row total">
                <span className="math-l">Net profit / month</span>
                <span className="math-f">gross profit − spend</span>
                <span className="math-v">{money0(netProfit)}</span>
              </div>
              <div className="math-row">
                <span className="math-l">Return on cost</span>
                <span className="math-f">net profit ÷ spend</span>
                <span className="math-v">{(roi * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          <p className="note">These default numbers are an example to show how the model works - not benchmarks. Replace them with your own and everything updates instantly.</p>
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
