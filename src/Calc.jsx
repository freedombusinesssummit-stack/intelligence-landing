import { useState } from "react";

/* ──────────────────────────────────────────────
   /calc — unit-economics calculator for investment
   migration firms. Live ROI model, mirrors the
   internal Google Sheet. Edit the blue fields;
   everything else is calculated.
   ────────────────────────────────────────────── */

const DEFAULTS = {
  cpc: "1.80",
  adBudget: "1500",
  landingCR: "13",
  leadToQ: "30",
  qToCall: "35",
  callToWebinar: "40",
  webinarToApp: "25",
  appToSigned: "30",
  revPerClient: "15000",
  margin: "70",
  mgmtFee: "499",
};

const GROUPS = [
  {
    title: "Traffic & budget",
    items: [
      { key: "cpc", label: "CPC (cost per click)", prefix: "$", step: "0.1" },
      { key: "adBudget", label: "Monthly ad budget", prefix: "$", step: "100" },
    ],
  },
  {
    title: "Funnel conversion",
    items: [
      { key: "landingCR", label: "Landing page CR (click → lead)", suffix: "%", step: "1" },
      { key: "leadToQ", label: "Lead → questionnaire (GMS)", suffix: "%", step: "1" },
      { key: "qToCall", label: "Questionnaire → call", suffix: "%", step: "1" },
      { key: "callToWebinar", label: "Call → webinar attendance", suffix: "%", step: "1" },
      { key: "webinarToApp", label: "Webinar → application submitted", suffix: "%", step: "1" },
      { key: "appToSigned", label: "Application → signed client", suffix: "%", step: "1" },
    ],
  },
  {
    title: "Economics",
    items: [
      { key: "revPerClient", label: "Revenue per client", prefix: "$", step: "500" },
      { key: "margin", label: "Profit margin", suffix: "%", step: "1" },
      { key: "mgmtFee", label: "Monthly management fee", prefix: "$", step: "50" },
    ],
  },
];

const num = (v) => {
  const n = parseFloat(v);
  return isFinite(n) ? n : 0;
};
const money0 = (n) => "$" + Math.round(n).toLocaleString("en-US");
const money2 = (n) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const vol = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  :root{
    --black:#0A0A0A;--off:#F4F4F2;--cream:#EBEBEB;--white:#FFFFFF;
    --lime:#AAFF45;--lime2:#8EE032;--lime-soft:#E8F5DF;--lime-dark:#5A8A20;
    --muted:#6B6B6B;--border:#E5E5E5;--text:#0A0A0A;--text2:#3A3A3A;
    --blue:#2E6BD6;--blue-soft:#EAF1FC;--red:#D94F3A;
  }
  html{scroll-behavior:smooth}
  body{background:var(--white);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  .calc-wrap{max-width:1200px;margin:0 auto;padding:0 32px}
  .calc a{color:inherit;text-decoration:none}

  @keyframes cPulseLime{0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,.5)}50%{box-shadow:0 0 0 10px rgba(170,255,69,0)}}

  .calc nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
  .calc .nav-inner{display:flex;align-items:center;justify-content:space-between;height:62px}
  .calc .nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-.02em}
  .calc .nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:cPulseLime 2.5s ease-in-out infinite}
  .calc .nav-logo em{font-style:normal;font-weight:400;color:var(--muted);font-size:12px}
  .calc .nav-right{display:flex;align-items:center;gap:24px}
  .calc .nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);padding:4px 0;transition:color .15s}
  .calc .nav-link:hover{color:var(--black)}
  .calc .nav-btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--black);color:var(--white);padding:9px 18px;border-radius:7px;transition:all .15s}
  .calc .nav-btn:hover{background:var(--lime);color:var(--black)}

  .calc .hero{padding:104px 0 28px;background:var(--white)}
  .calc .eyebrow{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:16px;display:inline-flex;align-items:center;gap:10px}
  .calc .eyebrow-line{width:24px;height:1px;background:currentColor;opacity:.4}
  .calc .hero h1{font-size:clamp(30px,4vw,46px);font-weight:800;line-height:1.05;letter-spacing:-.035em;color:var(--black);max-width:820px}
  .calc .accent{position:relative;display:inline-block}
  .calc .accent::after{content:'';position:absolute;bottom:.04em;left:-2px;right:-2px;height:.3em;background:var(--lime);z-index:-1;border-radius:2px}
  .calc .hero-desc{font-size:16.5px;line-height:1.6;color:var(--text2);max-width:640px;margin-top:16px}

  .calc .grid{display:grid;grid-template-columns:390px 1fr;gap:24px;align-items:start;padding-bottom:64px}

  .calc .card{background:var(--white);border:1px solid var(--border);border-radius:18px;padding:24px 24px}
  .calc .card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:6px}
  .calc .card-title{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--black)}
  .calc .card-sub{font-size:12.5px;color:var(--muted);margin-bottom:18px;line-height:1.4}
  .calc .reset{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);background:var(--off);border:1px solid var(--border);padding:7px 12px;border-radius:7px;cursor:pointer;transition:all .15s}
  .calc .reset:hover{color:var(--black);border-color:#cfcfcf}

  .calc .in-group{margin-top:18px}
  .calc .in-group:first-of-type{margin-top:0}
  .calc .in-group-t{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:10px}
  .calc .field{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}
  .calc .field label{font-size:13px;color:var(--text2);line-height:1.3;flex:1}
  .calc .in-box{display:inline-flex;align-items:center;gap:2px;background:var(--blue-soft);border:1px solid #cadcf6;border-radius:8px;padding:0 10px;height:38px;min-width:104px;transition:border-color .15s,box-shadow .15s}
  .calc .in-box:focus-within{border-color:var(--blue);box-shadow:0 0 0 3px rgba(46,107,214,.16)}
  .calc .in-box .aff{font-size:13px;font-weight:700;color:var(--blue)}
  .calc .in-box input{width:100%;border:none;background:transparent;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;color:var(--black);text-align:right;outline:none;font-variant-numeric:tabular-nums;-moz-appearance:textfield}
  .calc .in-box input::-webkit-outer-spin-button,.calc .in-box input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}

  .calc .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
  .calc .kpi{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:16px 16px}
  .calc .kpi.hi{background:var(--black)}
  .calc .kpi-l{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
  .calc .kpi.hi .kpi-l{color:rgba(255,255,255,.55)}
  .calc .kpi-v{font-size:clamp(20px,2.4vw,27px);font-weight:900;letter-spacing:-.03em;margin-top:8px;font-variant-numeric:tabular-nums;color:var(--black)}
  .calc .kpi.hi .kpi-v{color:var(--lime)}
  .calc .kpi-v.pos{color:var(--lime-dark)}.calc .kpi-v.neg{color:var(--red)}
  .calc .kpi-sub{font-size:11.5px;color:var(--muted);margin-top:4px}
  .calc .kpi.hi .kpi-sub{color:rgba(255,255,255,.6)}

  .calc .fn-title{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--black);margin-bottom:14px}
  .calc table{width:100%;border-collapse:collapse}
  .calc thead th{font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);text-align:right;padding:0 0 10px;border-bottom:1px solid var(--border)}
  .calc thead th:first-child{text-align:left}
  .calc tbody td{font-size:13.5px;padding:11px 0;border-bottom:1px solid var(--border);text-align:right;font-variant-numeric:tabular-nums;color:var(--text2)}
  .calc tbody td:first-child{text-align:left;font-weight:600;color:var(--black)}
  .calc tbody tr:last-child td{border-bottom:none}
  .calc tbody tr.hl td{background:var(--lime-soft)}
  .calc tbody tr.hl td:first-child{font-weight:800}
  .calc .vbar{display:inline-block;height:4px;background:var(--lime2);border-radius:2px;vertical-align:middle;margin-right:8px;min-width:2px}

  .calc .results{margin-top:16px}
  .calc .res-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:11px 0;border-bottom:1px solid var(--border);font-size:14px}
  .calc .res-row:last-child{border-bottom:none}
  .calc .res-l{color:var(--text2)}
  .calc .res-v{font-weight:800;color:var(--black);font-variant-numeric:tabular-nums}

  .calc .notes{margin-top:22px;background:var(--off);border:1px solid var(--border);border-radius:14px;padding:18px 20px}
  .calc .notes p{font-size:12.5px;line-height:1.55;color:var(--text2);padding-left:16px;position:relative;margin-top:8px}
  .calc .notes p:first-child{margin-top:0}
  .calc .notes p::before{content:'';position:absolute;left:2px;top:8px;width:5px;height:5px;border-radius:50%;background:var(--lime2)}

  .calc footer{padding:40px 0;background:var(--white);border-top:1px solid var(--border)}
  .calc .foot-inner{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
  .calc .foot-logo{font-size:14px;font-weight:800;display:flex;align-items:center;gap:9px}
  .calc .foot-note{font-size:12.5px;color:var(--muted);margin-top:8px}
  .calc .foot-links{display:flex;gap:22px}
  .calc .foot-links a{font-size:12.5px;color:var(--text2)}
  .calc .foot-links a:hover{color:var(--black)}

  @media(max-width:920px){
    .calc .grid{grid-template-columns:1fr}
    .calc .kpis{grid-template-columns:1fr 1fr}
  }
  @media(max-width:520px){.calc .kpis{grid-template-columns:1fr}}
`;

export default function Calc() {
  const [v, setV] = useState(DEFAULTS);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const reset = () => setV(DEFAULTS);

  const cpc = num(v.cpc);
  const adBudget = num(v.adBudget);
  const landingCR = num(v.landingCR) / 100;
  const leadToQ = num(v.leadToQ) / 100;
  const qToCall = num(v.qToCall) / 100;
  const callToWebinar = num(v.callToWebinar) / 100;
  const webinarToApp = num(v.webinarToApp) / 100;
  const appToSigned = num(v.appToSigned) / 100;
  const revPerClient = num(v.revPerClient);
  const margin = num(v.margin) / 100;
  const mgmtFee = num(v.mgmtFee);

  const clicks = cpc > 0 ? adBudget / cpc : 0;
  const leads = clicks * landingCR;
  const gms = leads * leadToQ;
  const calls = gms * qToCall;
  const webinar = calls * callToWebinar;
  const apps = webinar * webinarToApp;
  const signed = apps * appToSigned;
  const endToEnd = clicks > 0 ? signed / clicks : 0;

  const revenue = signed * revPerClient;
  const totalCost = adBudget + mgmtFee;
  const grossProfit = revenue * margin;
  const netProfit = grossProfit - totalCost;
  const cpl = leads > 0 ? adBudget / leads : 0;
  const costPerApp = apps > 0 ? adBudget / apps : 0;
  const cac = signed > 0 ? totalCost / signed : 0;
  const breakevenCAC = revPerClient * margin;
  const roas = adBudget > 0 ? revenue / adBudget : 0;
  const roi = totalCost > 0 ? netProfit / totalCost : 0;

  const costPer = (volume) => (volume > 0 ? adBudget / volume : 0);
  const funnel = [
    { name: "Clicks", volume: clicks, conv: null },
    { name: "Leads", volume: leads, conv: landingCR },
    { name: "Questionnaires (GMS)", volume: gms, conv: leadToQ },
    { name: "Calls / consultations", volume: calls, conv: qToCall },
    { name: "Webinar attendees", volume: webinar, conv: callToWebinar },
    { name: "Applications", volume: apps, conv: webinarToApp },
    { name: "Signed clients", volume: signed, conv: appToSigned, hl: true },
  ];
  const maxVol = clicks || 1;

  return (
    <div className="calc">
      <style>{css}</style>

      <nav>
        <div className="calc-wrap nav-inner">
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
          <div className="eyebrow"><span className="eyebrow-line" />Unit economics</div>
          <h1>See your <span className="accent">real ROI</span>, live.</h1>
          <p className="hero-desc">A working unit-economics model for investment migration firms. Edit the blue fields on the left - clicks, conversions, and deal value - and watch the funnel, cost per stage, and return update instantly.</p>
        </div>
      </header>

      <div className="calc-wrap">
        <div className="grid">
          {/* INPUTS */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">Inputs</div>
              <button className="reset" onClick={reset}>Reset example</button>
            </div>
            <div className="card-sub">Edit the blue fields only. Everything else is calculated.</div>
            {GROUPS.map((g) => (
              <div className="in-group" key={g.title}>
                <div className="in-group-t">{g.title}</div>
                {g.items.map((it) => (
                  <div className="field" key={it.key}>
                    <label htmlFor={it.key}>{it.label}</label>
                    <span className="in-box">
                      {it.prefix && <span className="aff">{it.prefix}</span>}
                      <input
                        id={it.key}
                        type="number"
                        inputMode="decimal"
                        step={it.step}
                        value={v[it.key]}
                        onChange={set(it.key)}
                      />
                      {it.suffix && <span className="aff">{it.suffix}</span>}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* RESULTS */}
          <div>
            <div className="kpis">
              <div className="kpi hi">
                <div className="kpi-l">Net profit / mo</div>
                <div className="kpi-v">{money0(netProfit)}</div>
                <div className="kpi-sub">after ad spend + fee</div>
              </div>
              <div className="kpi">
                <div className="kpi-l">ROI on cost</div>
                <div className={`kpi-v ${roi >= 0 ? "pos" : "neg"}`}>{(roi * 100).toFixed(1)}%</div>
                <div className="kpi-sub">net profit ÷ total cost</div>
              </div>
              <div className="kpi">
                <div className="kpi-l">ROAS</div>
                <div className="kpi-v">{roas.toFixed(2)}x</div>
                <div className="kpi-sub">revenue ÷ ad spend</div>
              </div>
              <div className="kpi">
                <div className="kpi-l">CAC</div>
                <div className="kpi-v">{money0(cac)}</div>
                <div className="kpi-sub">breakeven {money0(breakevenCAC)}</div>
              </div>
            </div>

            <div className="card">
              <div className="fn-title">The funnel · per month</div>
              <table>
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Volume</th>
                    <th>Conv.</th>
                    <th>Cost / stage</th>
                  </tr>
                </thead>
                <tbody>
                  {funnel.map((s) => (
                    <tr key={s.name} className={s.hl ? "hl" : ""}>
                      <td>{s.name}</td>
                      <td>
                        <span className="vbar" style={{ width: `${Math.max(2, (s.volume / maxVol) * 64)}px` }} />
                        {vol(s.volume)}
                      </td>
                      <td>{s.conv == null ? "—" : (s.conv * 100).toFixed(1) + "%"}</td>
                      <td>{money2(costPer(s.volume))}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Click → client (end to end)</td>
                    <td>—</td>
                    <td>{(endToEnd * 100).toFixed(3)}%</td>
                    <td>—</td>
                  </tr>
                </tbody>
              </table>

              <div className="results">
                <div className="res-row"><span className="res-l">Revenue / month</span><span className="res-v">{money0(revenue)}</span></div>
                <div className="res-row"><span className="res-l">Total cost (ad spend + fee)</span><span className="res-v">{money0(totalCost)}</span></div>
                <div className="res-row"><span className="res-l">Gross profit (revenue × margin)</span><span className="res-v">{money0(grossProfit)}</span></div>
                <div className="res-row"><span className="res-l">Net profit / month</span><span className="res-v">{money0(netProfit)}</span></div>
                <div className="res-row"><span className="res-l">Cost per lead (CPL)</span><span className="res-v">{money2(cpl)}</span></div>
                <div className="res-row"><span className="res-l">Cost per application</span><span className="res-v">{money2(costPerApp)}</span></div>
                <div className="res-row"><span className="res-l">CAC (cost per signed client)</span><span className="res-v">{money0(cac)}</span></div>
                <div className="res-row"><span className="res-l">Max allowable CAC (breakeven)</span><span className="res-v">{money0(breakevenCAC)}</span></div>
                <div className="res-row"><span className="res-l">ROAS</span><span className="res-v">{roas.toFixed(2)}x</span></div>
                <div className="res-row"><span className="res-l">ROI on total cost</span><span className="res-v">{(roi * 100).toFixed(1)}%</span></div>
              </div>
            </div>

            <div className="notes">
              <p>Default values are a placeholder example to test the logic - not industry benchmarks. Replace them with your own data.</p>
              <p>Conversion rates compound: each stage is calculated from the previous one, not from clicks.</p>
              <p>Revenue per client = commission or lifetime value of one signed client. This is a monthly view; deal lag is not modelled.</p>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="calc-wrap foot-inner">
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
