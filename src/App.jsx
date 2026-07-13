import { useState, useEffect, useRef } from "react";

/* ──────────────────────────────────────────────
   HOOKS
   ────────────────────────────────────────────── */
function useInView(threshold = 0.2, once = true) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); else if (!once) setInView(false); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold, once]);
  return [ref, inView];
}

function useMousePos(ref) {
  const [pos, setPos] = useState({ x: -200, y: -200, in: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top, in: true });
    };
    const onLeave = () => setPos((p) => ({ ...p, in: false }));
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
  return pos;
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const [ref, inView] = useInView(0.15);
  return (
    <Tag ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

function AnimNum({ target, inView, delay = 0, duration = 1500 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      let s = null;
      const step = (ts) => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / duration, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setV(Math.floor(e * target));
        if (p < 1) requestAnimationFrame(step); else setV(target);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [inView, target, delay, duration]);
  return <>{v.toLocaleString()}</>;
}

function Typewriter({ words, speed = 90, pause = 1600 }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[idx];
    if (!del && text === word) { const t = setTimeout(() => setDel(true), pause); return () => clearTimeout(t); }
    if (del && text === "") { setDel(false); setIdx((i) => (i + 1) % words.length); return; }
    const t = setTimeout(() => {
      setText((cur) => del ? cur.slice(0, -1) : word.slice(0, cur.length + 1));
    }, del ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [text, del, idx, words, speed, pause]);
  return <span className="tw-text">{text}<span className="tw-cursor">│</span></span>;
}

function MagneticButton({ children, className = "", onClick, primary = false }) {
  const ref = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      setT({ x: (e.clientX - cx) * 0.25, y: (e.clientY - cy) * 0.25 });
    };
    const reset = () => setT({ x: 0, y: 0 });
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", reset);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", reset); };
  }, []);
  return (
    <button ref={ref} className={`mag-btn ${primary ? "primary" : ""} ${className}`} onClick={onClick} style={{ transform: `translate(${t.x}px, ${t.y}px)` }}>
      <span className="mag-btn-inner">{children}</span>
    </button>
  );
}

function SpotlightCard({ children, className = "" }) {
  const ref = useRef(null);
  const m = useMousePos(ref);
  return (
    <div ref={ref} className={`spot-card ${className}`} style={{ "--mx": `${m.x}px`, "--my": `${m.y}px`, "--op": m.in ? 1 : 0 }}>
      <div className="spot-glow" />
      <div className="spot-body">{children}</div>
    </div>
  );
}

function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="acc">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`acc-item ${isOpen ? "is-open" : ""}`}>
            <button className="acc-trigger" onClick={() => setOpen(isOpen ? -1 : i)}>
              <span className="acc-q">{it.q}</span>
              <span className="acc-icon">{isOpen ? "−" : "+"}</span>
            </button>
            <div className="acc-content" style={{ maxHeight: isOpen ? 400 : 0 }}>
              <div className="acc-body">{it.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MovingCards({ items, direction = "left" }) {
  const dir = direction === "left" ? "marquee-left" : "marquee-right";
  const list = [...items, ...items];
  return (
    <div className="mc-wrap">
      <div className={`mc-track ${dir}`}>
        {list.map((t, i) => (
          <div key={i} className="mc-card">
            <div className="mc-stars">{"★".repeat(5)}</div>
            <p className="mc-quote">"{t.quote}"</p>
            <div className="mc-meta">
              <div className="mc-avatar" style={{ background: t.bgGradient }}>
                <span className="mc-initials">{t.initials}</span>
              </div>
              <div>
                <div className="mc-name">{t.name}</div>
                <div className="mc-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ num, suffix = "", prefix = "", label, inView, delay }) {
  return (
    <div className="hero-stat">
      <div className="hero-stat-num">{prefix}<AnimNum target={num} inView={inView} delay={delay} />{suffix}</div>
      <div className="hero-stat-label">{label}</div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   DASHBOARD MOCKUP — sidebar removed (no dropdown nav)
   ────────────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div className="dash-mockup">
      <div className="dash-chrome">
        <div className="dash-dots">
          <span style={{ background: "#FF5F57" }} />
          <span style={{ background: "#FEBC2E" }} />
          <span style={{ background: "#28C840" }} />
        </div>
        <div className="dash-url">app.fbsintelligence.com/dashboard</div>
      </div>
      <div className="dash-body">
        <main className="dash-main">
          <div className="dash-greeting">
            <div>
              <h3>Good morning, <span style={{ color: "var(--lime2)" }}>Andreas</span> 👋</h3>
              <p><strong>4 new HOT leads</strong> matched overnight.</p>
            </div>
            <button className="dash-cta">Review →</button>
          </div>
          <div className="dash-kpi-row">
            <div className="dash-kpi"><div className="dash-kpi-tag">TODAY</div><div className="dash-kpi-num">12</div><div className="dash-kpi-label">New leads</div><div className="dash-kpi-trend up">↑ 23%</div></div>
            <div className="dash-kpi"><div className="dash-kpi-tag">PIPELINE</div><div className="dash-kpi-num">$1.4M</div><div className="dash-kpi-label">Estimated</div><div className="dash-kpi-trend up">↑ 18%</div></div>
            <div className="dash-kpi"><div className="dash-kpi-tag">CONTACT</div><div className="dash-kpi-num">68%</div><div className="dash-kpi-label">Within 24h</div><div className="dash-kpi-trend up">↑ 4%</div></div>
            <div className="dash-kpi"><div className="dash-kpi-tag">CLOSE</div><div className="dash-kpi-num">22%</div><div className="dash-kpi-label">HOT tier</div><div className="dash-kpi-trend up">↑ 7%</div></div>
          </div>
          <div className="dash-section-head">
            <h4>Live Leads Feed</h4>
            <div className="dash-filters">
              <span className="dash-filter active">All</span>
              <span className="dash-filter"><span className="hot-dot"/> HOT</span>
              <span className="dash-filter"><span className="warm-dot"/> WARM</span>
              <span className="dash-filter"><span className="cold-dot"/> COLD</span>
            </div>
          </div>
          <div className="dash-table">
            <div className="dash-table-head">
              <div>Lead</div><div>Country</div><div>Tier</div><div>Score</div><div>Programme</div><div>Status</div>
            </div>
            {DASHBOARD_LEADS.map((l, i) => (
              <div key={i} className="dash-row">
                <div className="dash-cell">
                  <div className="dash-avatar" style={{ background: l.color }}>{l.initials}</div>
                  <div><div className="dash-name">{l.name}</div><div className="dash-time">{l.time}</div></div>
                </div>
                <div className="dash-cell">{l.flag} {l.country}</div>
                <div className="dash-cell"><span className={`dash-tier ${l.tierCls}`}>{l.tier}</span></div>
                <div className="dash-cell"><span className="dash-gmsi">{l.gmsi}</span><span className="dash-gmsi-of">/100</span></div>
                <div className="dash-cell dash-prog">{l.prog}</div>
                <div className="dash-cell">
                  {l.status === "new" && <span className="dash-status new">● New</span>}
                  {l.status === "contacted" && <span className="dash-status contacted">✓ Contacted</span>}
                  {l.status === "called" && <span className="dash-status called">📞 Reached</span>}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

const DASHBOARD_LEADS = [
  { initials: "JM", name: "J. Marchetti", time: "12 min ago", flag: "🇮🇹", country: "Italy", tier: "HOT", tierCls: "hot", gmsi: 87, prog: "St. Kitts CBI", status: "new", color: "#D94F3A" },
  { initials: "RK", name: "R. Kapoor", time: "34 min ago", flag: "🇮🇳", country: "India", tier: "HOT", tierCls: "hot", gmsi: 79, prog: "Portugal Golden Visa", status: "new", color: "#8EE032" },
  { initials: "SO", name: "S. Olusegun", time: "1 hr ago", flag: "🇳🇬", country: "Nigeria", tier: "WARM", tierCls: "warm", gmsi: 58, prog: "Grenada CBI", status: "contacted", color: "#C07D10" },
  { initials: "DH", name: "D. Harrison", time: "2 hr ago", flag: "🇺🇸", country: "USA", tier: "HOT", tierCls: "hot", gmsi: 73, prog: "Malta MEIN", status: "called", color: "#4A7FC1" },
  { initials: "ED", name: "E. Dubois", time: "3 hr ago", flag: "🇫🇷", country: "France", tier: "WARM", tierCls: "warm", gmsi: 52, prog: "Malta MEIN", status: "new", color: "#7C5BA8" },
];

/* ──────────────────────────────────────────────
   LEAD CARD — no AI call language
   ────────────────────────────────────────────── */
function LeadCardMockup() {
  return (
    <div className="lead-card">
      <div className="lead-card-head">
        <div className="lead-card-tier">
          <span className="hot-dot pulse" />
          <span>HOT</span>
          <span className="lead-card-score">Score 87/100</span>
        </div>
        <div className="lead-card-time">12 min ago</div>
      </div>
      <div className="lead-card-profile">
        <div className="lead-card-avatar">JM</div>
        <div>
          <h4>J. Marchetti</h4>
          <p>Founder · 🇮🇹 Milan, Italy</p>
        </div>
      </div>
      <div className="lead-card-grid">
        <div className="lc-field"><div className="lc-label">Income</div><div className="lc-val">$2M – $5M / yr</div></div>
        <div className="lc-field"><div className="lc-label">Timeline</div><div className="lc-val">Within 60 days</div></div>
        <div className="lc-field"><div className="lc-label">Family</div><div className="lc-val">Spouse + 2 kids</div></div>
        <div className="lc-field"><div className="lc-label">Programme</div><div className="lc-val">St. Kitts CBI</div></div>
      </div>
      <div className="lead-card-quote">
        <div className="lc-quote-label">PROSPECT'S OWN WORDS</div>
        <p>"We've been planning this for two years. The Italian tax situation is becoming impossible. We have $400k ready to deploy and we want our second passport before the kids start international school in September."</p>
      </div>
      <div className="lead-card-actions">
        <button className="lc-btn-primary">📞 Unlock contact (1 credit)</button>
        <button className="lc-btn-secondary">📥 Save</button>
      </div>
    </div>
  );
}

function OrbitGraphic() {
  return (
    <div className="orbit">
      <div className="orbit-center"><div className="orbit-center-inner">GMS</div></div>
      <div className="orbit-ring r1" />
      <div className="orbit-ring r2" />
      <div className="orbit-ring r3" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`orbit-dot d${i}`}><span className="orbit-dot-inner" /></div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   ICP PERSONA — for Intelligence section
   ────────────────────────────────────────────── */
function ICPPersona() {
  return (
    <div className="icp-card">
      <div className="icp-head">
        <div className="icp-tag">IDEAL CLIENT PROFILE — UPDATED</div>
        <div className="icp-version">
          <span className="icp-pulse" />
          v6.2 · 487 leads analyzed
        </div>
      </div>

      <div className="icp-persona">
        <div className="icp-persona-avatar">
          <div className="icp-avatar-ring">
            <div className="icp-avatar-inner">👤</div>
          </div>
        </div>
        <div className="icp-persona-text">
          <h4>The "US Founder, Looking Out"</h4>
          <p>Auto-generated from your matched lead pool</p>
        </div>
      </div>

      <div className="icp-grid">
        <div className="icp-row">
          <div className="icp-row-label">Demographic</div>
          <div className="icp-row-val">Founders & tech executives, 36–54, married with 1–3 children</div>
        </div>
        <div className="icp-row">
          <div className="icp-row-label">Origin</div>
          <div className="icp-row-val">🇺🇸 United States (58%) · 🇨🇦 Canada (16%) · 🇬🇧 UK (9%)</div>
        </div>
        <div className="icp-row">
          <div className="icp-row-label">Capital range</div>
          <div className="icp-row-val">$300k – $1.5M deployable in 60–120 days</div>
        </div>
        <div className="icp-row">
          <div className="icp-row-label">Top motivations</div>
          <div className="icp-row-val">Tax exposure (38%) · Political climate (31%) · Plan B passport (24%)</div>
        </div>
        <div className="icp-row">
          <div className="icp-row-label">Programme preference</div>
          <div className="icp-row-val">Portugal Golden Visa · Grenada CBI · Malta MEIN</div>
        </div>
        <div className="icp-row">
          <div className="icp-row-label">Decision pattern</div>
          <div className="icp-row-val">58% are sole decision-makers · close 3.2x faster than couples</div>
        </div>
      </div>

      <div className="icp-progress">
        <div className="icp-progress-head">
          <span>Profile depth</span>
          <span className="icp-progress-val">487 / 600 leads to v7.0</span>
        </div>
        <div className="icp-progress-bar">
          <div className="icp-progress-fill" style={{ width: "81%" }} />
        </div>
        <div className="icp-progress-meta">
          Next unlock at 600 leads: <strong>Behavioral micro-segments + churn prediction</strong>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   AUDIENCE INSIGHTS DASHBOARD (analytics view)
   ────────────────────────────────────────────── */
function AudienceInsights() {
  const tierData = { hot: 27, warm: 40, notReady: 33 };
  const jurInterest = [
    { name: "Portugal Golden Visa", val: 34, max: 34 },
    { name: "Malta CBI", val: 26, max: 34 },
    { name: "UAE Residency", val: 20, max: 34 },
    { name: "Caribbean CBI", val: 17, max: 34 },
    { name: "Greece Golden Visa", val: 14, max: 34 },
    { name: "Australia / NZ", val: 11, max: 34 },
  ];
  const timeline = [
    { label: "1–3 months (urgent)", val: 19, color: "#D94F3A" },
    { label: "3–6 months", val: 34, color: "#E8853D" },
    { label: "6–12 months", val: 28, color: "#E8853D" },
    { label: "12+ months", val: 19, color: "#999" },
  ];
  const income = [
    { label: "€500k+ / year", val: 11, color: "#D94F3A" },
    { label: "€200–500k / year", val: 31, color: "#E8853D" },
    { label: "€100–200k / year", val: 38, color: "#C07D10" },
    { label: "Under €100k", val: 20, color: "#999" },
  ];
  const family = [
    { label: "Family with children", val: 44 },
    { label: "Couple (no children)", val: 29 },
    { label: "Solo mover", val: 27 },
  ];

  // Donut chart values
  const total = tierData.hot + tierData.warm + tierData.notReady;
  const c = 2 * Math.PI * 50; // circumference
  const hotLen = (tierData.hot / total) * c;
  const warmLen = (tierData.warm / total) * c;
  const notReadyLen = (tierData.notReady / total) * c;

  return (
    <div className="ai-dash">
      <div className="ai-dash-head">
        <h3>Audience Intelligence</h3>
        <p>Real portrait of your leads — built from verified survey responses and qualification calls. Grows richer as more leads enter the system.</p>
      </div>

      <div className="ai-dash-banner">
        <div className="ai-dash-banner-icon">◈</div>
        <div className="ai-dash-banner-text">
          <strong>Currently based on 47 leads across 22 countries.</strong> Portrait accuracy improves with volume — at 100+ leads, geo distribution and source attribution unlock. At 200+ leads, income-by-jurisdiction matrix activates. At 300+ leads, predictive scoring and intent forecasting become available.
        </div>
      </div>

      <div className="ai-kpi-row">
        <div className="ai-kpi">
          <div className="ai-kpi-label">AVG GMSI SCORE</div>
          <div className="ai-kpi-num">14.8</div>
          <div className="ai-kpi-trend up">↑ +1.2 vs last month</div>
        </div>
        <div className="ai-kpi">
          <div className="ai-kpi-label">HOT LEAD RATE</div>
          <div className="ai-kpi-num">27%</div>
          <div className="ai-kpi-meta">Score 18+ on GMSI</div>
        </div>
        <div className="ai-kpi">
          <div className="ai-kpi-label">COUNTRIES</div>
          <div className="ai-kpi-num">22</div>
          <div className="ai-kpi-meta">Top: 🇺🇸 🇨🇦 🇨🇳 🇧🇷 🇮🇳</div>
        </div>
        <div className="ai-kpi">
          <div className="ai-kpi-label">CALL COMPLETION</div>
          <div className="ai-kpi-num">81%</div>
          <div className="ai-kpi-meta">38 of 47 leads</div>
        </div>
      </div>

      <div className="ai-row-2col">
        {/* Tier distribution */}
        <div className="ai-card">
          <div className="ai-card-tag">LEAD QUALITY</div>
          <h4>Tier Distribution</h4>
          <div className="ai-tier-row">
            <svg className="ai-donut" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#EFEFEF" strokeWidth="14" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#D94F3A" strokeWidth="14"
                strokeDasharray={`${hotLen} ${c}`} strokeDashoffset="0" transform="rotate(-90 60 60)" strokeLinecap="round" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#E8853D" strokeWidth="14"
                strokeDasharray={`${warmLen} ${c}`} strokeDashoffset={`${-hotLen}`} transform="rotate(-90 60 60)" strokeLinecap="round" />
              <text x="60" y="58" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0A0A0A">47</text>
              <text x="60" y="74" textAnchor="middle" fontSize="9" fill="#999" letterSpacing="1">leads</text>
            </svg>
            <div className="ai-tier-legend">
              <div className="ai-tier-row-item">
                <span className="ai-tier-dot" style={{ background: "#D94F3A" }} />
                <span className="ai-tier-name">HOT</span>
                <span className="ai-tier-val" style={{ color: "#D94F3A" }}>{tierData.hot}%</span>
              </div>
              <div className="ai-tier-row-item">
                <span className="ai-tier-dot" style={{ background: "#E8853D" }} />
                <span className="ai-tier-name">WARM</span>
                <span className="ai-tier-val" style={{ color: "#E8853D" }}>{tierData.warm}%</span>
              </div>
              <div className="ai-tier-row-item">
                <span className="ai-tier-dot" style={{ background: "#CCC" }} />
                <span className="ai-tier-name">NOT READY</span>
                <span className="ai-tier-val" style={{ color: "#999" }}>{tierData.notReady}%</span>
              </div>
              <div className="ai-tier-note">27% HOT rate is above industry benchmark of ~15%</div>
            </div>
          </div>
        </div>

        {/* Jurisdiction interest bars */}
        <div className="ai-card">
          <div className="ai-card-tag">DESTINATION DEMAND</div>
          <h4>Jurisdiction Interest</h4>
          <div className="ai-bars">
            {jurInterest.map((j, i) => (
              <div key={i} className="ai-bar-row">
                <div className="ai-bar-label">{j.name}</div>
                <div className="ai-bar-track">
                  <div className="ai-bar-fill" style={{ width: `${(j.val / j.max) * 100}%`, background: i === 0 ? "#0A0A0A" : "#999" }} />
                </div>
                <div className="ai-bar-val">{j.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ai-row-3col">
        <div className="ai-card">
          <div className="ai-card-tag">URGENCY</div>
          <h4>Decision Timeline</h4>
          <div className="ai-pcts">
            {timeline.map((t, i) => (
              <div key={i} className="ai-pct-row">
                <span className="ai-pct-label">{t.label}</span>
                <span className="ai-pct-val" style={{ color: t.color }}>{t.val}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ai-card">
          <div className="ai-card-tag">WEALTH SIGNAL</div>
          <h4>Income Brackets</h4>
          <div className="ai-pcts">
            {income.map((t, i) => (
              <div key={i} className="ai-pct-row">
                <span className="ai-pct-label">{t.label}</span>
                <span className="ai-pct-val" style={{ color: t.color }}>{t.val}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ai-card">
          <div className="ai-card-tag">LIFE STAGE</div>
          <h4>Family Situation</h4>
          <div className="ai-pcts">
            {family.map((t, i) => (
              <div key={i} className="ai-pct-row">
                <span className="ai-pct-label">{t.label}</span>
                <span className="ai-pct-val">{t.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   STYLES
   ────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --black:#0A0A0A; --off:#F4F4F2; --cream:#EBEBEB; --white:#FFFFFF;
    --lime:#AAFF45; --lime2:#8EE032; --lime-soft:#E8F5DF; --lime-dark:#5A8A20;
    --muted:#6B6B6B; --border:#E5E5E5; --dark:#0F0F0F; --dark2:#181818;
    --text:#0A0A0A; --text2:#3A3A3A;
    --green-text:#2A6010; --green-bg:#E8F5DF;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--white); color: var(--text); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  .wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulseLime { 0%,100% { box-shadow: 0 0 0 0 rgba(170,255,69,0.5); } 50% { box-shadow: 0 0 0 10px rgba(170,255,69,0); } }
  @keyframes scaleDot { 0%,100% { transform:scale(1); } 50% { transform:scale(1.4); } }
  @keyframes pulseRed { 0%,100% { box-shadow: 0 0 0 0 rgba(217,79,58,0.5); } 50% { box-shadow: 0 0 0 6px rgba(217,79,58,0); } }
  @keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
  @keyframes auroraMove { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,-30px); } }
  @keyframes pingDot { 0% { transform: scale(0.8); opacity:1; } 100% { transform: scale(2.4); opacity:0; } }
  @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes spinReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes glowPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(170,255,69,0.5), 0 0 60px 0 rgba(170,255,69,0.2); } 50% { box-shadow: 0 0 0 16px rgba(170,255,69,0), 0 0 80px 0 rgba(170,255,69,0.3); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  .fade-up { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
  .fade-up-1 { animation-delay: 0.05s; } .fade-up-2 { animation-delay: 0.12s; }
  .fade-up-3 { animation-delay: 0.2s; } .fade-up-4 { animation-delay: 0.28s; } .fade-up-5 { animation-delay: 0.36s; }
  .fade-up-6 { animation-delay: 0.44s; }

  .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .reveal.is-in { opacity: 1; transform: translateY(0); }

  /* ── NAV ── */
  nav { position: fixed; top:0; left:0; right:0; z-index:200; background: rgba(255,255,255,0.95); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
  .nav-progress { position: absolute; bottom: 0; left: 0; height: 2px; background: var(--lime); transition: width 0.05s linear; }
  .nav-inner { display:flex; align-items:center; justify-content:space-between; height:62px; }
  .nav-logo { font-size:14px; font-weight:800; color:var(--black); display:flex; align-items:center; gap:10px; letter-spacing:-0.02em; }
  .nav-logo-dot { width:8px; height:8px; background:var(--lime); border-radius:50%; animation: pulseLime 2.5s ease-in-out infinite; }
  .nav-logo span { font-weight:400; color:var(--muted); font-size: 12px; }
  .nav-right { display:flex; align-items:center; gap:24px; }
  .nav-link { font-size:12px; font-weight:500; letter-spacing:.04em; text-transform:uppercase; color:var(--text2); cursor:pointer; background:none; border:none; font-family:'Inter',sans-serif; transition:color 0.15s; position:relative; padding:4px 0; }
  .nav-link::after { content:''; position:absolute; bottom: 0; left: 0; right: 0; height: 1px; background: var(--lime); transform: scaleX(0); transition: transform 0.2s; }
  .nav-link:hover { color:var(--black); } .nav-link:hover::after { transform: scaleX(1); }
  .nav-btn { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; background:var(--black); color:var(--white); border:none; cursor:pointer; padding:9px 20px; border-radius:7px; font-family:'Inter',sans-serif; transition:all 0.15s; }
  .nav-btn:hover { background: var(--lime); color: var(--black); }

  /* ── MAGNETIC BUTTON ── */
  .mag-btn { background: transparent; border: none; cursor: pointer; padding: 0; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); font-family: 'Inter', sans-serif; }
  .mag-btn-inner { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; letter-spacing: .01em; padding: 14px 28px; border-radius: 8px; background: transparent; color: var(--text2); transition: all 0.2s; }
  .mag-btn:hover .mag-btn-inner { color: var(--black); }
  .mag-btn.primary .mag-btn-inner { background: var(--black); color: var(--white); }
  .mag-btn.primary:hover .mag-btn-inner { background: var(--lime); color: var(--black); box-shadow: 0 12px 32px -8px rgba(170,255,69,0.4); }

  /* ════════ HERO — SUBTLE / EDITORIAL ════════ */
  .hero {
    padding: 140px 0 80px;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }
  .hero-grid-bg {
    position: absolute; inset: 0;
    background-image: linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse 70% 50% at 50% 30%, black 40%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 30%, black 40%, transparent 100%);
    pointer-events: none;
  }
  .hero > .wrap { position: relative; z-index: 2; }

  .hero-pill-row { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 28px; padding: 6px 14px 6px 6px; background: var(--white); border: 1px solid var(--border); border-radius: 100px; }
  .hero-pill-badge { background: var(--lime); color: var(--black); font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 100px; letter-spacing: 0.08em; text-transform: uppercase; }
  .hero-pill-text { font-size: 12px; color: var(--text); font-weight: 500; }

  /* Heading — bold but subtle, with lime underline accent only */
  .hero h1 {
    font-size: clamp(40px, 5.6vw, 70px);
    font-weight: 800;
    line-height: 1.02;
    letter-spacing: -0.035em;
    color: var(--black);
    max-width: 940px;
    margin-bottom: 0;
  }
  .hero h1 .accent {
    position: relative;
    display: inline-block;
  }
  .hero h1 .accent::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0.32em;
    background: var(--lime);
    z-index: -1;
    border-radius: 2px;
  }
  .hero-subtitle {
    font-size: clamp(28px, 4vw, 52px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.035em;
    color: #AAAAAA;
    margin-top: 6px;
    margin-bottom: 32px;
    max-width: 940px;
  }

  .hero-desc {
    font-size: 18px;
    font-weight: 400;
    line-height: 1.65;
    color: var(--text2);
    max-width: 620px;
    margin-bottom: 36px;
  }
  .hero-desc strong {
    display: block;
    margin-top: 12px;
    font-weight: 700;
    color: var(--black);
  }

  .hero-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 28px; }

  /* ── HERO SOCIAL PROOF ── */
  .hero-social {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
  }
  .hero-avatars { display: flex; align-items: center; }
  .hero-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-left: -8px;
    background-size: cover;
    background-position: center;
    display: flex; align-items: center; justify-content: center;
    color: var(--white);
    font-weight: 600;
    font-size: 12px;
    transition: transform 0.2s;
  }
  .hero-avatar:first-child { margin-left: 0; }
  .hero-avatar:hover { transform: translateY(-2px) scale(1.05); z-index: 2; }
  .hero-social-text { display: flex; flex-direction: column; gap: 2px; }
  .hero-social-stars { display: flex; align-items: center; gap: 6px; }
  .hero-social-stars-icon { color: var(--lime2); font-size: 14px; letter-spacing: 1px; }
  .hero-social-rating { font-size: 13px; font-weight: 700; color: var(--black); }
  .hero-social-label { font-size: 12px; color: var(--text2); }
  .hero-social-label strong { color: var(--black); font-weight: 600; }

  /* ── LOGOS ROW (press) ── */
  .logos-row {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid var(--border);
  }
  .logos-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
    text-align: center;
  }
  .logos-list {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 48px;
    flex-wrap: wrap;
  }
  .logo-item {
    font-family: serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text2);
    opacity: 0.6;
    transition: opacity 0.2s;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }
  .logo-item:hover { opacity: 1; }
  .logo-item.bold-sans { font-family: 'Inter', sans-serif; font-weight: 900; letter-spacing: -0.02em; }
  .logo-item.italic { font-style: italic; }

  /* ── HERO MOCKUP ── */
  .hero-mockup-wrap { margin-top: 56px; position: relative; }
  .hero-mockup-shadow { position: absolute; inset: 30px 60px -20px 60px; background: radial-gradient(ellipse at center, rgba(170,255,69,0.4), transparent 60%); filter: blur(40px); z-index: 0; }
  .hero-mockup-float { animation: float 6s ease-in-out infinite; }

  /* DASHBOARD */
  .dash-mockup { position:relative; z-index:2; border-radius: 14px; overflow: hidden; box-shadow: 0 24px 60px -10px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06); background: var(--white); }
  .dash-chrome { background: #f5f4f0; padding: 12px 16px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border); }
  .dash-dots { display: flex; gap: 6px; }
  .dash-dots span { width: 11px; height: 11px; border-radius: 50%; }
  .dash-url { flex: 1; text-align: center; font-size: 12px; color: #999; background: var(--white); padding: 4px 16px; border-radius: 6px; max-width: 360px; margin: 0 auto; border: 1px solid var(--border); }
  .dash-body { min-height: 540px; }
  .dash-main { padding: 24px 32px; overflow: hidden; }
  .dash-greeting { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .dash-greeting h3 { font-size: 22px; font-weight: 700; color: var(--black); margin-bottom: 4px; letter-spacing: -0.02em; }
  .dash-greeting p { font-size: 13px; color: var(--text2); }
  .dash-cta { background: var(--black); color: var(--white); border: none; padding: 10px 18px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; }
  .dash-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
  .dash-kpi { background: var(--off); border-radius: 10px; padding: 16px; transition: all 0.2s; }
  .dash-kpi:hover { background: var(--lime-soft); }
  .dash-kpi-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 8px; }
  .dash-kpi-num { font-size: 26px; font-weight: 800; color: var(--black); letter-spacing: -0.02em; line-height: 1; margin-bottom: 4px; }
  .dash-kpi-label { font-size: 11px; color: var(--text2); }
  .dash-kpi-trend { font-size: 11px; color: var(--lime-dark); margin-top: 6px; font-weight: 600; }
  .dash-section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .dash-section-head h4 { font-size: 14px; font-weight: 700; color: var(--black); }
  .dash-filters { display: flex; gap: 4px; }
  .dash-filter { font-size: 11px; padding: 4px 10px; border-radius: 4px; color: var(--muted); cursor: pointer; display: inline-flex; align-items: center; gap: 5px; }
  .dash-filter.active { background: var(--black); color: var(--white); }
  .dash-table { background: var(--white); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
  .dash-table-head, .dash-row { display: grid; grid-template-columns: 1.6fr 1fr 0.7fr 0.7fr 1.2fr 0.9fr; gap: 8px; padding: 10px 14px; align-items: center; font-size: 11px; }
  .dash-table-head { background: #fafaf6; color: var(--muted); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; font-size: 10px; }
  .dash-row { border-top: 1px solid var(--border); transition: background 0.15s; }
  .dash-row:hover { background: var(--lime-soft); }
  .dash-cell { display: flex; align-items: center; gap: 8px; }
  .dash-avatar { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; color: var(--white); flex-shrink: 0; }
  .dash-name { font-size: 12px; font-weight: 600; color: var(--black); }
  .dash-time { font-size: 10px; color: var(--muted); }
  .dash-tier { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.04em; }
  .dash-tier.hot { background: rgba(217,79,58,0.12); color: #D94F3A; }
  .dash-tier.warm { background: rgba(192,125,16,0.12); color: #C07D10; }
  .dash-tier.cold { background: rgba(74,127,193,0.12); color: #4A7FC1; }
  .dash-gmsi { font-size: 13px; font-weight: 700; color: var(--black); }
  .dash-gmsi-of { font-size: 10px; color: var(--muted); margin-left: 1px; }
  .dash-prog { font-size: 11px; color: var(--text2); }
  .dash-status { font-size: 10px; padding: 3px 8px; border-radius: 4px; }
  .dash-status.new { color: var(--lime-dark); font-weight: 700; }
  .dash-status.contacted { background: var(--off); color: var(--text2); }
  .dash-status.called { background: var(--lime-soft); color: var(--lime-dark); font-weight: 600; }
  .hot-dot { width: 7px; height: 7px; background: #D94F3A; border-radius: 50%; display: inline-block; }
  .warm-dot { width: 7px; height: 7px; background: #C07D10; border-radius: 50%; display: inline-block; }
  .cold-dot { width: 7px; height: 7px; background: #4A7FC1; border-radius: 50%; display: inline-block; }
  .pulse { animation: pulseRed 1.6s ease-out infinite; }

  /* HERO STATS */
  .stats-bar { display:flex; align-items:stretch; gap:0; margin-top:64px; padding-top:40px; border-top:1px solid var(--border); }
  .hero-stat { flex:1; padding-right:32px; border-right:1px solid var(--border); margin-right:32px; }
  .hero-stat:last-child { border-right:none; margin-right:0; padding-right:0; }
  .hero-stat-num { font-size:36px; font-weight:800; letter-spacing:-0.03em; color:var(--black); line-height:1; margin-bottom:6px; font-variant-numeric:tabular-nums; }
  .hero-stat-label { font-size:13px; color:var(--text2); line-height:1.45; }

  /* MARQUEE */
  .marquee-wrap { overflow:hidden; border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:var(--off); padding:14px 0; }
  .marquee-track-banner { display:flex; white-space:nowrap; animation: marquee-left 40s linear infinite; }
  .marquee-item { font-size:12px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--text2); padding:0 24px; }
  .marquee-dot { color:var(--lime); }

  /* SECTIONS */
  .section { padding:100px 0; }
  .section-light { background:var(--white); border-bottom:1px solid var(--border); position:relative; }
  .section-off { background:var(--off); border-bottom:1px solid var(--border); position:relative; }
  .section-cream { background: var(--cream); border-bottom: 1px solid var(--border); position: relative; }
  .section-dark { background:var(--dark); position:relative; overflow:hidden; }
  .section-dark.has-aurora::before { content:''; position:absolute; top:-30%; left:-10%; width:60%; height:80%; background: radial-gradient(ellipse at center, rgba(170,255,69,0.15) 0%, transparent 60%); filter: blur(60px); animation: auroraMove 14s ease-in-out infinite; }
  .section-dark > .wrap { position:relative; z-index:2; }

  .eyebrow { font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--text2); margin-bottom:18px; display:inline-flex; align-items:center; gap:10px; }
  .eyebrow-lime { color:var(--lime-dark); }
  .eyebrow-line { width:24px; height:1px; background: currentColor; opacity:0.4; }
  .section h2 { font-size:clamp(30px,3.8vw,52px); font-weight:800; letter-spacing:-0.03em; line-height:1.05; color:var(--black); margin-bottom:18px; max-width:900px; }
  .section h2 .hl-sm { background: linear-gradient(120deg, var(--lime) 0%, var(--lime) 100%); background-repeat: no-repeat; background-size: 100% 0.32em; background-position: 0 88%; padding: 0 4px; }
  .section h2 .gray-tail { color: #AAAAAA; }
  .section-dark h2 { color:var(--white); }
  .section-body { font-size:17px; font-weight:400; line-height:1.6; color:var(--text2); max-width:680px; margin-bottom:48px; }
  .section-dark .section-body { color:#AAA; }

  /* PROMISE */
  .promise-hero { padding: 90px 0; background: var(--off); border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
  .promise-hero::before { content:''; position:absolute; top:50%; left:-200px; width:400px; height:400px; background: radial-gradient(circle, rgba(170,255,69,0.2), transparent 60%); filter: blur(60px); transform: translateY(-50%); }
  .promise-hero > .wrap { position: relative; z-index: 2; }
  .promise-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px; align-items: center; }
  .promise-text h2 { font-size: clamp(28px, 3.4vw, 42px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.08; color: var(--black); margin-bottom: 20px; }
  .promise-text h2 .hl-sm { background: linear-gradient(120deg, var(--lime) 0%, var(--lime) 100%); background-repeat: no-repeat; background-size: 100% 0.32em; background-position: 0 88%; padding: 0 4px; }
  .promise-text p { font-size: 16px; line-height: 1.7; color: var(--text2); margin-bottom: 16px; }
  .promise-text p strong { color: var(--black); font-weight: 600; }

  /* WHAT'S INSIDE */
  .inside-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 48px; }
  .inside-card { background: var(--white); border: 1px solid var(--border); border-radius: 18px; padding: 48px 40px; position: relative; overflow: hidden; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
  .inside-card:hover { transform: translateY(-4px); border-color: var(--black); box-shadow: 0 20px 48px -12px rgba(0,0,0,0.1); }
  .inside-card.dark { background: var(--dark); border-color: #1f1f1f; }
  .inside-card.dark:hover { border-color: rgba(170,255,69,0.4); }
  .inside-num { font-size: 12px; font-weight: 800; letter-spacing: 0.14em; color: var(--lime-dark); margin-bottom: 24px; }
  .inside-card.dark .inside-num { color: var(--lime); }
  .inside-card h3 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: var(--black); margin-bottom: 12px; line-height: 1.1; }
  .inside-card.dark h3 { color: var(--white); }
  .inside-card .inside-tag { font-size: 14px; font-weight: 500; color: var(--text2); margin-bottom: 24px; }
  .inside-card.dark .inside-tag { color: #AAA; }
  .inside-card .inside-desc { font-size: 14px; font-weight: 400; line-height: 1.7; color: var(--text2); margin-bottom: 28px; }
  .inside-card.dark .inside-desc { color: #AAA; }
  .inside-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; padding-top: 24px; border-top: 1px solid var(--border); }
  .inside-card.dark .inside-list { border-color: #2a2a2a; }
  .inside-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--text); line-height: 1.6; }
  .inside-card.dark .inside-list li { color: #DDD; }
  .inside-list .check { flex-shrink: 0; width: 16px; height: 16px; background: var(--lime); color: var(--black); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; margin-top: 2px; }

  /* HOW IT WORKS */
  .stages { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 48px; position: relative; }
  .stage { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 32px 28px; position: relative; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); cursor: default; }
  .stage:hover { transform: translateY(-4px); border-color: var(--black); box-shadow: 0 16px 40px -10px rgba(0,0,0,0.1); }
  .stage:hover .stage-arrow { transform: translateX(4px); color: var(--lime-dark); }
  .stage-num { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; color: var(--lime-dark); margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .stage-num-circle { width: 22px; height: 22px; border-radius: 50%; background: var(--lime); color: var(--black); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; }
  .stage h3 { font-size: 18px; font-weight: 700; color: var(--black); margin-bottom: 12px; line-height: 1.25; letter-spacing: -0.01em; }
  .stage p { font-size: 13px; color: var(--text2); line-height: 1.65; margin-bottom: 16px; min-height: 72px; }
  .stage-meta { display: flex; flex-direction: column; gap: 6px; padding-top: 16px; border-top: 1px solid var(--border); }
  .stage-meta-item { font-size: 11px; color: var(--text2); display: flex; align-items: center; gap: 8px; }
  .stage-meta-dot { width: 4px; height: 4px; background: var(--lime-dark); border-radius: 50%; flex-shrink: 0; }
  .stage-arrow { position: absolute; right: -12px; top: 50%; transform: translateY(-50%); color: var(--border); font-size: 16px; z-index: 3; transition: all 0.3s; }
  .stage:last-child .stage-arrow { display: none; }

  .stage-timing { display: flex; justify-content: space-between; margin-top: 32px; padding: 20px 24px; background: var(--lime-soft); border: 1px solid rgba(170,255,69,0.4); border-radius: 12px; flex-wrap: wrap; gap: 16px; }
  .stage-timing-item { display: flex; align-items: center; gap: 10px; }
  .stage-timing-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--white); display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .stage-timing-text { font-size: 13px; color: var(--text); }
  .stage-timing-text strong { color: var(--black); font-weight: 800; }

  /* WHO THIS IS FOR */
  .who-section { padding: 100px 0; background: var(--cream); border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
  .who-section::before { content:''; position:absolute; top:-200px; right:-200px; width:500px; height:500px; background: radial-gradient(circle, rgba(170,255,69,0.15), transparent 70%); filter: blur(80px); }
  .who-section > .wrap { position: relative; z-index: 2; }
  .who-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: start; }
  .who-text-side h2 { font-size: clamp(28px, 3.6vw, 44px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 24px; color: var(--black); }
  .who-text-side .who-callout { background: var(--lime); border: 1px solid var(--lime); border-radius: 14px; padding: 24px 28px; margin-top: 24px; }
  .who-callout-tag { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--black); margin-bottom: 8px; opacity: 0.7; }
  .who-callout-text { font-size: 15px; line-height: 1.6; color: var(--black); font-weight: 500; }
  .who-callout-text strong { font-weight: 700; }
  .who-cards-side { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .who-card { background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 24px 22px; transition: all 0.25s; position: relative; overflow: hidden; }
  .who-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--lime); transform: scaleX(0); transform-origin:left; transition:transform 0.3s; }
  .who-card:hover::before { transform: scaleX(1); }
  .who-card:hover { transform: translateY(-2px); border-color: var(--black); }
  .who-card-icon { font-size: 22px; margin-bottom: 16px; display: inline-block; transition: transform 0.3s; }
  .who-card:hover .who-card-icon { transform: scale(1.15) rotate(-5deg); }
  .who-card h4 { font-size: 14px; font-weight: 700; color: var(--black); margin-bottom: 6px; line-height: 1.3; }
  .who-card p { font-size: 12px; color: var(--text2); line-height: 1.55; }

  /* LEAD CARD SHOWCASE */
  .lead-showcase { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .lead-showcase-text h3 { font-size: 26px; font-weight: 800; color: var(--black); margin-bottom: 16px; letter-spacing: -0.02em; line-height: 1.15; }
  .lead-showcase-text p { font-size: 15px; color: var(--text2); line-height: 1.7; margin-bottom: 16px; }
  .lead-showcase-text strong { color: var(--black); font-weight: 600; }

  .lead-card { background: var(--white); border-radius: 14px; box-shadow: 0 16px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px var(--border); padding: 26px; position: relative; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); animation: float 7s ease-in-out infinite; }
  .lead-card:hover { transform: translateY(-6px) scale(1.01); }
  .lead-card-head { display:flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
  .lead-card-tier { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; color: #D94F3A; letter-spacing: 0.06em; }
  .lead-card-score { background: rgba(217,79,58,0.1); color: #D94F3A; font-size: 11px; padding: 3px 8px; border-radius: 4px; margin-left: 4px; }
  .lead-card-time { font-size: 11px; color: var(--muted); }
  .lead-card-profile { display:flex; align-items:center; gap: 14px; margin-bottom: 20px; }
  .lead-card-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #D94F3A, #C07D10); color: var(--white); display:flex; align-items:center; justify-content:center; font-weight: 600; font-size: 16px; }
  .lead-card-profile h4 { font-size: 16px; font-weight: 700; color: var(--black); margin-bottom: 2px; }
  .lead-card-profile p { font-size: 12px; color: var(--text2); }
  .lead-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; padding: 16px; background: var(--off); border-radius: 10px; }
  .lc-field .lc-label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
  .lc-field .lc-val { font-size: 12px; font-weight: 600; color: var(--black); }
  .lead-card-quote { background: linear-gradient(135deg, #1A1A1A, #0C0C0C); color: var(--white); padding: 16px; border-radius: 10px; margin-bottom: 14px; position: relative; border-left: 3px solid var(--lime); }
  .lc-quote-label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; color: var(--lime); margin-bottom: 8px; }
  .lead-card-quote p { font-size: 12px; line-height: 1.6; color: rgba(255,255,255,0.92); font-style: italic; }
  .lead-card-actions { display: flex; gap: 8px; }
  .lc-btn-primary { flex: 1; background: var(--black); color: var(--white); border: none; padding: 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.2s; }
  .lc-btn-primary:hover { background: var(--lime); color: var(--black); }
  .lc-btn-secondary { background: var(--off); color: var(--text2); border: none; padding: 12px 16px; border-radius: 6px; font-size: 12px; cursor: pointer; font-family: 'Inter', sans-serif; }

  /* JURISDICTIONS */
  .jur-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap:1px; background: var(--border); border:1px solid var(--border); border-radius:14px; overflow:hidden; }
  .jur-cell { background: var(--white); padding:24px 22px; transition: all 0.2s; cursor:default; position:relative; }
  .jur-cell:hover { background: var(--lime-soft); }
  .jur-cell::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--lime); transform: scaleX(0); transform-origin:left; transition:transform 0.3s; }
  .jur-cell:hover::before { transform: scaleX(1); }
  .jur-flag { font-size:24px; margin-bottom:14px; line-height:1; transition: transform 0.3s; }
  .jur-cell:hover .jur-flag { transform: scale(1.15) rotate(-5deg); }
  .jur-name { font-size:14px; font-weight:700; color:var(--black); margin-bottom:6px; }
  .jur-prog { font-size:12px; color:var(--text2); line-height:1.5; }
  .jur-strip { margin-top:16px; padding:12px 0; display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--text2); }
  .jur-strip strong { color: var(--lime-dark); font-weight:700; }

  /* ORBIT */
  .orbit { position: relative; width: 100%; max-width: 420px; aspect-ratio: 1; margin: 0 auto; }
  .orbit-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 110px; height: 110px; background: var(--lime); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 5; box-shadow: 0 0 0 8px rgba(170,255,69,0.2), 0 0 0 16px rgba(170,255,69,0.1); animation: pulseLime 2.5s ease-in-out infinite; }
  .orbit-center-inner { font-size: 22px; font-weight: 800; color: var(--black); letter-spacing: -0.01em; }
  .orbit-ring { position: absolute; top: 50%; left: 50%; border-radius: 50%; border: 1px dashed rgba(0,0,0,0.15); transform: translate(-50%, -50%); }
  .orbit-ring.r1 { width: 220px; height: 220px; animation: spinSlow 30s linear infinite; }
  .orbit-ring.r2 { width: 320px; height: 320px; animation: spinReverse 40s linear infinite; }
  .orbit-ring.r3 { width: 100%; height: 100%; animation: spinSlow 50s linear infinite; }
  .orbit-dot { position: absolute; top: 50%; left: 50%; width: 0; height: 0; }
  .orbit-dot-inner { position: absolute; width: 14px; height: 14px; background: var(--black); border: 2px solid var(--white); border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 0 1px var(--border); }
  .orbit-dot.d0 { transform: rotate(0deg) translateX(110px); animation: spinSlow 30s linear infinite; }
  .orbit-dot.d1 { transform: rotate(60deg) translateX(110px); animation: spinSlow 30s linear infinite; }
  .orbit-dot.d2 { transform: rotate(120deg) translateX(110px); animation: spinSlow 30s linear infinite; }
  .orbit-dot.d3 { transform: rotate(180deg) translateX(160px); animation: spinReverse 40s linear infinite; }
  .orbit-dot.d4 { transform: rotate(240deg) translateX(160px); animation: spinReverse 40s linear infinite; }
  .orbit-dot.d5 { transform: rotate(300deg) translateX(160px); animation: spinReverse 40s linear infinite; }

  /* QUALIFICATION */
  .qual-bento { display:grid; grid-template-columns: 1fr 1fr 1fr; gap:14px; }
  .spot-card { position:relative; border-radius: 14px; background: var(--dark2); border: 1px solid #1e1e1e; overflow:hidden; cursor:default; transition: border-color 0.2s; }
  .spot-card:hover { border-color: rgba(170,255,69,0.4); }
  .spot-glow { position:absolute; inset:0; pointer-events:none; background: radial-gradient(420px circle at var(--mx) var(--my), rgba(170,255,69,0.18), transparent 40%); opacity: var(--op); transition: opacity 0.3s; }
  .spot-body { position:relative; z-index:2; padding: 26px 24px; }
  .qual-num { font-size:11px; font-weight:800; letter-spacing:0.12em; color:var(--lime); margin-bottom:14px; }
  .qual-card h3 { font-size:16px; font-weight:700; color:var(--white); margin-bottom:10px; line-height:1.3; }
  .qual-card p { font-size:13px; color:#AAA; line-height:1.6; margin-bottom:18px; }
  .qual-bar { height: 4px; background: #222; border-radius:2px; overflow:hidden; margin-top:auto; }
  .qual-bar-fill { height:100%; background: linear-gradient(90deg, var(--lime), var(--lime2)); border-radius:2px; transform-origin: left; transform: scaleX(0); transition: transform 1s cubic-bezier(0.16,1,0.3,1); transition-delay: 0.3s; }
  .reveal.is-in .qual-bar-fill { transform: scaleX(1); }
  .qual-weight { font-size:11px; color:#888; margin-top:8px; display:flex; justify-content:space-between; }
  .qual-weight .w { color:var(--lime); font-weight:800; }

  /* SCORE TABLE */
  .score-table { border-top:1px solid var(--border); }
  .score-row { display:grid; grid-template-columns:160px 1fr 140px; align-items:start; gap:32px; padding:32px 0; border-bottom:1px solid var(--border); }
  .score-tier { font-size:12px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; display:flex; align-items:center; gap:10px; padding-top:2px; }
  .score-tier .tier-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .score-tier.hot { color:#D94F3A; } .score-tier.hot .tier-dot { background:#D94F3A; animation:scaleDot 2s ease-in-out infinite; }
  .score-tier.warm { color:#C07D10; } .score-tier.warm .tier-dot { background:#C07D10; }
  .score-tier.cold { color:#4A7FC1; } .score-tier.cold .tier-dot { background:#4A7FC1; }
  .score-desc { font-size:14px; color:var(--text2); line-height:1.7; }
  .score-range { font-size:13px; font-weight:700; color:var(--lime-dark); text-align:right; white-space:nowrap; padding-top:2px; }

  /* INLINE CTA — STANDOUT VARIANT */
  .inline-cta {
    background: var(--dark);
    border-top: 1px solid #1a1a1a;
    border-bottom: 1px solid #1a1a1a;
    padding: 56px 0;
    position: relative;
    overflow: hidden;
  }
  .inline-cta::before {
    content: '';
    position: absolute;
    top: 50%; left: 0;
    width: 600px; height: 400px;
    background: radial-gradient(ellipse at center, rgba(170,255,69,0.25), transparent 60%);
    filter: blur(80px);
    transform: translateY(-50%);
    pointer-events: none;
  }
  .inline-cta::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%);
    pointer-events: none;
  }
  .inline-cta-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
  }
  .inline-cta-text { flex: 1; min-width: 280px; }
  .inline-cta-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--lime);
    color: var(--black);
    font-size: 10px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 100px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .inline-cta-tag-dot {
    width: 6px;
    height: 6px;
    background: var(--black);
    border-radius: 50%;
    animation: pulseLime 2s ease-in-out infinite;
  }
  .inline-cta h3 {
    font-size: clamp(22px, 2.6vw, 30px);
    font-weight: 800;
    color: var(--white);
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
  }
  .inline-cta p {
    font-size: 14px;
    color: #999;
  }
  .inline-cta-btn {
    background: var(--lime);
    color: var(--black);
    border: none;
    cursor: pointer;
    padding: 16px 32px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.01em;
    transition: all 0.2s;
    box-shadow: 0 8px 24px -4px rgba(170, 255, 69, 0.4);
  }
  .inline-cta-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px -8px rgba(170, 255, 69, 0.6);
  }

  /* ════════ EXCLUSIVE LEADS SECTION (replaces "stop competing") ════════ */
  .excl-section { background: var(--white); padding: 100px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
  .excl-bg { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 600px; background: radial-gradient(ellipse at center, rgba(170,255,69,0.12) 0%, transparent 60%); filter: blur(60px); pointer-events: none; }
  .excl-section > .wrap { position: relative; z-index: 2; }

  .excl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .excl-text h2 { font-size: clamp(28px, 3.6vw, 44px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.08; color: var(--black); margin-bottom: 20px; }
  .excl-text h2 .hl-sm { background: linear-gradient(120deg, var(--lime) 0%, var(--lime) 100%); background-repeat: no-repeat; background-size: 100% 0.32em; background-position: 0 88%; padding: 0 4px; }
  .excl-text > p { font-size: 16px; color: var(--text2); line-height: 1.7; margin-bottom: 24px; }
  .excl-text strong { color: var(--black); font-weight: 600; }

  .excl-features { display: flex; flex-direction: column; gap: 14px; margin-top: 28px; }
  .excl-feature { display: flex; gap: 14px; align-items: flex-start; padding: 16px 20px; background: var(--off); border-radius: 10px; border-left: 3px solid var(--lime); }
  .excl-feature-icon { width: 32px; height: 32px; flex-shrink: 0; background: var(--lime); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--black); font-size: 14px; }
  .excl-feature h4 { font-size: 14px; font-weight: 700; color: var(--black); margin-bottom: 4px; }
  .excl-feature p { font-size: 13px; color: var(--text2); line-height: 1.55; }

  /* exclusive visual */
  .excl-visual {
    position: relative;
    height: 480px;
    background: linear-gradient(135deg, #fafaf6 0%, #ffffff 100%);
    border: 1px solid var(--border);
    border-radius: 18px;
    overflow: hidden;
    padding: 32px;
    box-shadow: 0 16px 48px -10px rgba(0,0,0,0.08);
  }
  .excl-visual-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .excl-visual-tag { display: inline-flex; align-items: center; gap: 8px; background: var(--lime); padding: 6px 12px; border-radius: 100px; font-size: 11px; font-weight: 800; color: var(--black); letter-spacing: 0.06em; }
  .excl-visual-tag-dot { width: 6px; height: 6px; background: var(--black); border-radius: 50%; animation: pulseLime 2s ease-in-out infinite; }
  .excl-visual-jur { font-size: 12px; color: var(--text2); font-weight: 600; }

  .excl-jur-flag {
    text-align: center;
    margin-bottom: 24px;
  }
  .excl-jur-flag .flag-big { font-size: 56px; display: inline-block; animation: float 4s ease-in-out infinite; }
  .excl-jur-flag .flag-name { font-size: 18px; font-weight: 800; color: var(--black); letter-spacing: -0.02em; margin-top: 4px; }
  .excl-jur-flag .flag-tag { font-size: 11px; color: var(--lime-dark); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }

  .excl-flow { display: flex; flex-direction: column; gap: 12px; }
  .excl-flow-item { display: flex; align-items: center; gap: 14px; padding: 14px; border-radius: 10px; transition: all 0.3s; }
  .excl-flow-item.you { background: var(--lime-soft); border: 1px solid var(--lime); }
  .excl-flow-item.them { background: var(--off); border: 1px solid var(--border); opacity: 0.5; }
  .excl-flow-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 800; }
  .excl-flow-item.you .excl-flow-icon { background: var(--lime); color: var(--black); }
  .excl-flow-item.them .excl-flow-icon { background: var(--border); color: var(--muted); }
  .excl-flow-name { font-size: 13px; font-weight: 700; color: var(--black); }
  .excl-flow-meta { font-size: 11px; color: var(--text2); margin-top: 2px; }
  .excl-flow-item.them .excl-flow-name, .excl-flow-item.them .excl-flow-meta { text-decoration: line-through; color: var(--muted); }
  .excl-flow-status { margin-left: auto; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 100px; letter-spacing: 0.06em; text-transform: uppercase; }
  .excl-flow-item.you .excl-flow-status { background: var(--black); color: var(--lime); }
  .excl-flow-item.them .excl-flow-status { background: var(--border); color: var(--muted); }

  /* PHOTO TESTIMONIALS — editorial layout */
  .test-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 40px;
    align-items: stretch;
  }
  .test-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .test-stack .test-card { flex: 1; }

  /* ════════ SOCIAL PROOF SECTION — dark bg ════════ */
  .social-proof-section {
    background: var(--off);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 80px 0;
    position: relative;
    overflow: hidden;
  }
  .social-proof-section > .wrap { position: relative; z-index: 2; }
  .social-proof-section h2 { color: var(--black); }
  .social-proof-section .section-body { color: var(--text2); }
  .eyebrow-lime-on-light { color: var(--lime-dark) !important; }

  /* ── PARTNER LOGOS GRID ── */
  .partner-logos-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin-bottom: 12px;
  }
  .partner-logos-row.row2 {
    grid-template-columns: repeat(5, 1fr);
  }
  .partner-logo-item {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 20px;
    transition: all 0.2s;
  }
  .partner-logo-item:hover {
    border-color: var(--black);
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }
  .partner-logo-item img {
    max-height: 36px;
    max-width: 100%;
    width: auto;
    object-fit: contain;
    filter: none;
    opacity: 0.75;
    transition: opacity 0.2s;
  }
  .partner-logo-item:hover img { opacity: 1; }

  /* Media logos strip */
  .media-logos-strip {
    margin-top: 36px;
    padding-top: 28px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 36px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .media-logos-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
  }
  .media-logo-img {
    height: 22px;
    width: auto;
    max-width: 110px;
    object-fit: contain;
    opacity: 0.4;
    filter: grayscale(1);
    transition: all 0.2s;
  }
  .media-logo-img:hover { opacity: 0.75; filter: grayscale(0); }

  /* ── DARK TESTIMONIALS GRID ── */
  .test-dark-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 16px;
    align-items: stretch;
  }
  .test-dark-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 0;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
  }
  .test-dark-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--lime);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s ease;
  }
  .test-dark-card:hover { border-color: rgba(170,255,69,0.3); transform: translateY(-3px); }
  .test-dark-card:hover::before { transform: scaleX(1); }
  .test-dark-card.featured-dark {
    background: rgba(170,255,69,0.06);
    border-color: rgba(170,255,69,0.2);
  }
  .test-dark-stars { color: var(--lime); font-size: 14px; margin-bottom: 14px; letter-spacing: 2px; }
  .test-dark-quote {
    font-size: 15px;
    line-height: 1.65;
    color: rgba(255,255,255,0.85);
    flex: 1;
    margin-bottom: 24px;
    font-weight: 300;
  }
  .test-dark-card.featured-dark .test-dark-quote { font-size: 17px; color: var(--white); }
  .test-dark-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 18px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }
  .test-dark-avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: var(--white);
    flex-shrink: 0;
  }
  .test-dark-name { font-size: 13px; font-weight: 700; color: var(--white); margin-bottom: 2px; }
  .test-dark-role { font-size: 11px; color: #888; line-height: 1.4; }
  .test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 32px; }
  .test-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 26px; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; }
  .test-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background: var(--lime); transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; }
  .test-card:hover { border-color: var(--black); transform: translateY(-4px); box-shadow: 0 12px 32px -8px rgba(0,0,0,0.1); }
  .test-card:hover::before { transform: scaleX(1); }
  .test-card.featured { background: var(--dark); border-color: #1f1f1f; color: var(--white); grid-column: span 2; }
  .test-card.featured::before { background: var(--lime); }
  .test-stars { display: flex; gap: 2px; color: var(--lime-dark); font-size: 14px; margin-bottom: 14px; }
  .test-quote { font-size: 13px; line-height: 1.65; color: var(--text); margin-bottom: 22px; }
  .test-card.featured .test-quote { color: var(--white); font-size: 17px; line-height: 1.55; font-weight: 300; }
  .test-card.featured .test-stars { color: var(--lime); }
  .test-meta { display: flex; align-items: center; gap: 14px; padding-top: 18px; border-top: 1px solid var(--border); }
  .test-card.featured .test-meta { border-color: #2a2a2a; }
  .test-photo { width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: var(--white); font-weight: 600; font-size: 14px; position: relative; overflow: hidden; }
  .test-photo::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent); }
  .test-name { font-size: 13px; font-weight: 700; color: var(--black); margin-bottom: 2px; }
  .test-card.featured .test-name { color: var(--white); }
  .test-role { font-size: 11px; color: var(--text2); line-height: 1.4; }
  .test-card.featured .test-role { color: #888; }
  .test-flag { margin-right: 4px; }

  /* MOVING CARDS */
  .mc-wrap { overflow:hidden; padding:8px 0; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
  .mc-track { display:flex; gap:14px; width:max-content; }
  .mc-track.marquee-left { animation: marquee-left 60s linear infinite; }
  .mc-track.marquee-right { animation: marquee-right 60s linear infinite; }
  .mc-wrap:hover .mc-track { animation-play-state: paused; }
  .mc-card { flex-shrink:0; width:340px; background: var(--white); border:1px solid var(--border); border-radius:12px; padding:22px; }
  .mc-stars { color: var(--lime-dark); font-size: 12px; margin-bottom: 10px; }
  .mc-quote { font-size:13px; line-height:1.6; color:var(--text); margin-bottom:16px; min-height: 70px; }
  .mc-meta { display:flex; align-items:center; gap:10px; }
  .mc-avatar { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; color: var(--white); flex-shrink:0; position:relative; overflow:hidden; }
  .mc-avatar::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent); }
  .mc-initials { font-size:11px; font-weight:600; position: relative; z-index: 1; }
  .mc-name { font-size:12px; font-weight:600; color:var(--black); }
  .mc-role { font-size:11px; color:var(--text2); }

  /* ════════ AUDIENCE INSIGHTS DASHBOARD ════════ */
  .ai-dash { background: var(--off); border: 1px solid var(--border); border-radius: 18px; padding: 32px; margin-top: 48px; }
  .ai-dash-head { margin-bottom: 24px; }
  .ai-dash-head h3 { font-size: 22px; font-weight: 800; color: var(--black); margin-bottom: 6px; letter-spacing: -0.02em; }
  .ai-dash-head p { font-size: 13px; color: var(--text2); line-height: 1.55; max-width: 620px; }
  .ai-dash-banner { display: flex; align-items: flex-start; gap: 14px; background: var(--lime-soft); border: 1px solid rgba(170,255,69,0.4); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; }
  .ai-dash-banner-icon { width: 28px; height: 28px; background: var(--white); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--lime-dark); font-size: 13px; flex-shrink: 0; font-weight: 800; }
  .ai-dash-banner-text { font-size: 13px; line-height: 1.55; color: var(--text); }
  .ai-dash-banner-text strong { font-weight: 700; color: var(--black); }
  .ai-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 12px; }
  .ai-kpi { background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; transition: all 0.2s; }
  .ai-kpi:hover { border-color: var(--black); transform: translateY(-2px); }
  .ai-kpi-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 12px; }
  .ai-kpi-num { font-size: 36px; font-weight: 800; color: var(--black); letter-spacing: -0.03em; line-height: 1; margin-bottom: 8px; font-variant-numeric: tabular-nums; }
  .ai-kpi-meta { font-size: 11px; color: var(--text2); }
  .ai-kpi-trend { font-size: 11px; color: var(--lime-dark); font-weight: 600; }
  .ai-row-2col { display: grid; grid-template-columns: 1fr 1.4fr; gap: 12px; margin-bottom: 12px; }
  .ai-row-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .ai-card { background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 20px 22px; transition: all 0.2s; }
  .ai-card:hover { border-color: var(--black); }
  .ai-card-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 6px; }
  .ai-card h4 { font-size: 16px; font-weight: 800; color: var(--black); margin-bottom: 18px; letter-spacing: -0.02em; }
  .ai-tier-row { display: grid; grid-template-columns: 120px 1fr; gap: 20px; align-items: center; }
  .ai-donut { width: 120px; height: 120px; }
  .ai-tier-legend { display: flex; flex-direction: column; gap: 10px; }
  .ai-tier-row-item { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; }
  .ai-tier-dot { width: 8px; height: 8px; border-radius: 50%; }
  .ai-tier-name { font-size: 11px; font-weight: 700; color: var(--black); letter-spacing: 0.04em; }
  .ai-tier-val { font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .ai-tier-note { font-size: 11px; color: var(--text2); margin-top: 6px; line-height: 1.5; padding-top: 8px; border-top: 1px solid var(--border); }
  .ai-bars { display: flex; flex-direction: column; gap: 10px; }
  .ai-bar-row { display: grid; grid-template-columns: 140px 1fr 30px; gap: 10px; align-items: center; }
  .ai-bar-label { font-size: 12px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ai-bar-track { height: 10px; background: #EFEFEF; border-radius: 5px; overflow: hidden; }
  .ai-bar-fill { height: 100%; border-radius: 5px; transition: width 1s cubic-bezier(0.16,1,0.3,1); }
  .ai-bar-val { font-size: 12px; font-weight: 700; color: var(--black); text-align: right; font-variant-numeric: tabular-nums; }
  .ai-pcts { display: flex; flex-direction: column; gap: 0; }
  .ai-pct-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .ai-pct-row:last-child { border-bottom: none; }
  .ai-pct-label { font-size: 12px; color: var(--text); }
  .ai-pct-val { font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; }

  /* ════════ INTELLIGENCE LAYER — ICP PERSONA ════════ */
  .intel-layer { padding: 100px 0; background: var(--off); border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
  .intel-layer::before { content:''; position:absolute; top:-200px; right:-100px; width:500px; height:500px; background: radial-gradient(circle, rgba(170,255,69,0.18), transparent 70%); filter: blur(60px); }
  .intel-layer > .wrap { position: relative; z-index: 2; }

  .intel-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 60px; align-items: stretch; }
  .intel-text { display: flex; flex-direction: column; }
  .intel-text h2 { font-size: clamp(28px, 3.5vw, 42px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.08; color: var(--black); margin-bottom: 20px; }
  .intel-text h2 .hl-sm { background: linear-gradient(120deg, var(--lime) 0%, var(--lime) 100%); background-repeat: no-repeat; background-size: 100% 0.32em; background-position: 0 88%; padding: 0 4px; }
  .intel-text > p { font-size: 16px; line-height: 1.7; color: var(--text2); margin-bottom: 16px; }
  .intel-text strong { color: var(--black); font-weight: 600; }

  .intel-milestones { display: flex; flex-direction: column; gap: 12px; margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); }
  .intel-milestone { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: var(--white); border: 1px solid var(--border); border-radius: 10px; transition: all 0.2s; }
  .intel-milestone:hover { border-color: var(--lime); transform: translateX(4px); }
  .intel-milestone-num { width: 36px; height: 36px; border-radius: 8px; background: var(--lime); color: var(--black); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; flex-shrink: 0; letter-spacing: -0.02em; }
  .intel-milestone-num.locked { background: var(--off); color: var(--muted); border: 1px dashed var(--border); }
  .intel-milestone-text { flex: 1; }
  .intel-milestone-h { font-size: 13px; font-weight: 700; color: var(--black); margin-bottom: 2px; }
  .intel-milestone-p { font-size: 12px; color: var(--text2); line-height: 1.45; }
  .intel-milestone-tag { font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 4px; letter-spacing: 0.06em; flex-shrink: 0; }
  .intel-milestone-tag.live { background: var(--lime-soft); color: var(--lime-dark); }
  .intel-milestone-tag.locked { background: var(--off); color: var(--muted); }

  /* ICP CARD */
  .icp-card { background: var(--white); border-radius: 18px; box-shadow: 0 16px 48px -8px rgba(0,0,0,0.1), 0 0 0 1px var(--border); padding: 32px; position: relative; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
  .icp-card::before { content:''; position:absolute; top:0; left:0; right:0; height: 4px; background: linear-gradient(90deg, var(--lime), var(--lime2)); }
  .icp-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .icp-tag { font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--lime-dark); text-transform: uppercase; }
  .icp-version { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--text2); font-weight: 600; background: var(--lime-soft); padding: 4px 10px; border-radius: 100px; }
  .icp-pulse { width: 6px; height: 6px; background: var(--lime-dark); border-radius: 50%; animation: pulseLime 1.5s ease-in-out infinite; }

  .icp-persona { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 20px; background: linear-gradient(135deg, var(--lime-soft) 0%, transparent 100%); border-radius: 12px; border: 1px solid rgba(170,255,69,0.4); }
  .icp-persona-avatar { flex-shrink: 0; }
  .icp-avatar-ring { width: 56px; height: 56px; border-radius: 50%; background: var(--lime); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px rgba(170,255,69,0.2), 0 0 0 8px rgba(170,255,69,0.1); animation: pulseLime 3s ease-in-out infinite; }
  .icp-avatar-inner { font-size: 28px; }
  .icp-persona-text h4 { font-size: 18px; font-weight: 800; color: var(--black); margin-bottom: 4px; letter-spacing: -0.01em; }
  .icp-persona-text p { font-size: 12px; color: var(--text2); }

  .icp-grid { display: flex; flex-direction: column; gap: 0; margin-bottom: 24px; flex: 1; }
  .icp-row { display: grid; grid-template-columns: 130px 1fr; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .icp-row:last-child { border-bottom: none; }
  .icp-row-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
  .icp-row-val { font-size: 13px; color: var(--black); line-height: 1.45; font-weight: 500; }

  .icp-progress { background: var(--off); padding: 16px; border-radius: 10px; }
  .icp-progress-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 11px; font-weight: 700; color: var(--text); }
  .icp-progress-val { color: var(--lime-dark); font-variant-numeric: tabular-nums; }
  .icp-progress-bar { height: 6px; background: var(--white); border-radius: 3px; overflow: hidden; margin-bottom: 10px; border: 1px solid var(--border); }
  .icp-progress-fill { height: 100%; background: linear-gradient(90deg, var(--lime), var(--lime2)); border-radius: 3px; transform-origin: left; animation: shimmer 2s linear infinite; background-size: 200% 100%; }
  .icp-progress-meta { font-size: 11px; color: var(--text2); }
  .icp-progress-meta strong { color: var(--black); font-weight: 700; }

  /* ACCORDION */
  .acc { border-top:1px solid var(--border); }
  .acc-item { border-bottom:1px solid var(--border); }
  .acc-trigger { width:100%; background:none; border:none; padding:24px 0; font-family:'Inter',sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:20px; text-align:left; transition: padding 0.2s; }
  .acc-trigger:hover { padding-left: 8px; }
  .acc-q { font-size:16px; font-weight:600; color:var(--black); line-height:1.4; }
  .acc-icon { font-size:20px; font-weight:300; color:var(--lime-dark); width:28px; height:28px; border:1px solid var(--border); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition: all 0.3s; }
  .acc-item.is-open .acc-icon { background: var(--lime); border-color: var(--lime); color: var(--black); transform: rotate(180deg); }
  .acc-content { overflow:hidden; transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1); }
  .acc-body { padding-bottom:24px; font-size:14px; line-height:1.75; color:var(--text2); max-width:760px; }

  /* ════════ FINAL CTA — LIME CARD ON WHITE ════════ */
  .final-cta { background: var(--white); padding: 100px 0; border-top: 1px solid var(--border); position: relative; overflow: hidden; }
  .final-cta::before { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:1000px; height:600px; background: radial-gradient(ellipse at center, rgba(170,255,69,0.15), transparent 60%); filter: blur(60px); pointer-events: none; }
  .final-cta > .wrap { position: relative; z-index: 2; }

  .lime-cta-box {
    background: var(--lime);
    border-radius: 24px;
    padding: 64px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 24px 64px -16px rgba(170,255,69,0.5), 0 0 0 1px rgba(0,0,0,0.05);
  }
  .lime-cta-box::before {
    content:'';
    position:absolute;
    inset:0;
    background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%);
    pointer-events:none;
  }
  .lime-cta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; position: relative; z-index: 2; }
  .lime-cta-text .lime-cta-eyebrow { font-size:11px; font-weight:800; letter-spacing:0.14em; color:var(--black); text-transform:uppercase; margin-bottom:20px; display: inline-flex; align-items: center; gap: 10px; opacity: 0.7; }
  .lime-cta-text h2 { font-size:clamp(32px, 4.2vw, 56px); font-weight:900; color:var(--black); line-height:1.0; letter-spacing:-0.04em; margin-bottom:24px; }
  .lime-cta-text > p { font-size:17px; color: rgba(0,0,0,0.7); line-height:1.65; margin-bottom: 28px; max-width: 460px; }
  .lime-cta-meta { display:flex; flex-direction: column; gap: 12px; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(0,0,0,0.15); }
  .lime-cta-meta span { display:inline-flex; align-items:center; gap:10px; font-size: 14px; color: var(--black); font-weight: 500; }
  .lime-cta-meta .check { width: 22px; height: 22px; background: var(--black); color: var(--lime); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; }

  /* CTA FORM (white card on lime bg) */
  .cta-form { background: var(--white); border-radius: 16px; padding: 32px; box-shadow: 0 12px 32px -8px rgba(0,0,0,0.15); }
  .cta-form-head { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .cta-form-head h3 { font-size: 22px; font-weight: 800; color: var(--black); margin-bottom: 6px; letter-spacing: -0.02em; }
  .cta-form-head p { font-size: 13px; color: var(--text2); }
  .cta-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .cta-field { display: flex; flex-direction: column; }
  .cta-field.full { grid-column: span 2; }
  .cta-field label { font-size: 11px; font-weight: 700; color: var(--text2); margin-bottom: 6px; letter-spacing: 0.04em; text-transform: uppercase; }
  .cta-field input, .cta-field select, .cta-field textarea { width: 100%; border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--black); background: var(--white); outline: none; transition: all 0.15s; }
  .cta-field input::placeholder, .cta-field textarea::placeholder { color: #aaa; }
  .cta-field input:focus, .cta-field select:focus, .cta-field textarea:focus { border-color: var(--black); box-shadow: 0 0 0 3px rgba(170,255,69,0.25); }
  .cta-field textarea { resize: vertical; min-height: 80px; font-family: inherit; }
  .cta-form-submit { width: 100%; margin-top: 12px; background: var(--black); color: var(--white); border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; padding: 16px; border-radius: 8px; transition: all 0.2s; letter-spacing: 0.01em; }
  .cta-form-submit:hover:not(:disabled) { background: var(--dark2); transform: translateY(-2px); box-shadow: 0 12px 32px -8px rgba(0,0,0,0.4); }
  .cta-form-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .cta-form-disclaimer { font-size: 11px; color: var(--text2); text-align: center; margin-top: 12px; line-height: 1.5; }

  .cta-form .success { text-align: center; padding: 32px 0; }
  .cta-form .success .check-big { width: 56px; height: 56px; background: var(--lime); color: var(--black); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; margin-bottom: 20px; }
  .cta-form .success h3 { font-size: 22px; font-weight: 800; color: var(--black); margin-bottom: 10px; letter-spacing: -0.02em; }
  .cta-form .success p { font-size: 14px; color: var(--text2); line-height: 1.6; }

  /* FOOTER */
  footer { background:var(--black); border-top:1px solid #1a1a1a; padding:64px 0 40px; }
  .footer-grid { display:grid; grid-template-columns: 2fr 1fr 1fr; gap:48px; margin-bottom:48px; }
  .footer-brand h4 { font-size:14px; font-weight:700; color:var(--white); margin-bottom:12px; display:flex; align-items:center; gap:8px; letter-spacing: -0.02em; }
  .footer-brand h4 .dot { width:8px; height:8px; background:var(--lime); border-radius:50%; }
  .footer-brand p { font-size:13px; color:#888; max-width:360px; line-height:1.7; }
  .footer-col h5 { font-size:11px; font-weight:700; color:#AAA; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:16px; }
  .footer-col a { display:block; font-size:13px; color:#888; text-decoration:none; padding:6px 0; transition:all 0.15s; cursor:pointer; }
  .footer-col a:hover { color: var(--lime); padding-left: 4px; }
  .footer-bottom { padding-top: 32px; border-top:1px solid #1a1a1a; display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }
  .footer-bottom p { font-size:12px; color:#666; }

  @media (max-width:1024px) {
    .ai-row-2col { grid-template-columns: 1fr; }
    .ai-row-3col { grid-template-columns: 1fr; }
    .ai-kpi-row { grid-template-columns: repeat(2, 1fr); }
    .stages { grid-template-columns: 1fr 1fr; gap: 12px; }
    .stage-arrow { display: none; }
    .lead-showcase { grid-template-columns: 1fr; gap: 40px; }
    .promise-grid { grid-template-columns: 1fr; gap: 60px; }
    .test-layout { grid-template-columns: 1fr; }
    .test-dark-grid { grid-template-columns: 1fr 1fr; }
    .who-grid { grid-template-columns: 1fr; gap: 48px; }
    .inside-grid { grid-template-columns: 1fr; }
    .lime-cta-grid { grid-template-columns: 1fr; gap: 40px; }
    .excl-grid { grid-template-columns: 1fr; gap: 40px; }
    .intel-grid { grid-template-columns: 1fr; gap: 40px; }
    .partner-logos-row { gap: 10px; }
    .partner-logo-item { height: 64px; padding: 10px 14px; }
  }
  @media (max-width:768px) {
    .ai-kpi-row { grid-template-columns: 1fr 1fr; }
    .ai-tier-row { grid-template-columns: 1fr; gap: 16px; justify-items: center; }
    .ai-bar-row { grid-template-columns: 100px 1fr 30px; }
    .ai-dash { padding: 20px; }
    .stages { grid-template-columns: 1fr; }
    .who-cards-side { grid-template-columns: 1fr; }
    .qual-bento { grid-template-columns: 1fr; }
    .jur-grid { grid-template-columns: repeat(2, 1fr); }
    .stats-bar { flex-wrap:wrap; gap:24px; }
    .hero-stat { flex: 1 1 calc(50% - 12px); border-right:none; padding-right:0; margin-right:0; }
    .nav-right .nav-link { display:none; }
    .footer-grid { grid-template-columns: 1fr; gap:32px; }
    .score-row { grid-template-columns:1fr; gap:8px; }
    .score-range { text-align:left; }
    .inline-cta-inner { flex-direction:column; align-items:flex-start; }
    .test-layout { grid-template-columns: 1fr; }
    .test-dark-grid { grid-template-columns: 1fr; }
    .partner-logos-row { grid-template-columns: repeat(3, 1fr); }
    .partner-logos-row.row2 { grid-template-columns: repeat(3, 1fr); }
    .media-logos-strip { gap: 20px; }
    .media-logo-img { height: 18px; }
    .lead-card-grid { grid-template-columns: 1fr; }
    .dash-kpi-row { grid-template-columns: repeat(2, 1fr); }
    .stage-timing { flex-direction: column; gap: 12px; }
    .cta-form-grid { grid-template-columns: 1fr; }
    .cta-field.full { grid-column: span 1; }
    .lime-cta-box { padding: 36px 24px; }
    .logos-list { gap: 24px; }
    .icp-row { grid-template-columns: 1fr; gap: 4px; }
  }
`;

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const HERO_AVATARS = [
  { initials: "AK", bg: "linear-gradient(135deg, #2C5F8D, #4A7FC1)" },
  { initials: "MS", bg: "linear-gradient(135deg, #8E4A3D, #D94F3A)" },
  { initials: "TR", bg: "linear-gradient(135deg, #5C8E3D, #8EE032)" },
  { initials: "LP", bg: "linear-gradient(135deg, #2C8E5C, #5BC487)" },
  { initials: "RA", bg: "linear-gradient(135deg, #C07D10, #E8A93D)" },
];

const PRESS_LOGOS = [
  { name: "AP", className: "bold-sans" },
  { name: "Khaleej Times", className: "" },
  { name: "Gulf News", className: "" },
  { name: "Forbes", className: "italic" },
  { name: "Bloomberg", className: "bold-sans" },
];

const INSIDE_FEATURES = [
  {
    num: "01",
    title: "Qualified Leads",
    tag: "Pre-verified prospects delivered to your dashboard",
    desc: "Every lead has completed our Global Mobility Survey, been scored 0–100 on readiness and programme fit, and had their intent confirmed. You receive a full Advisor Brief before the first contact.",
    bullets: [
      "Name, location, passport, programme interest",
      "Global Mobility Score + score breakdown",
      "Income range, current setup, main blocker",
      "Verified intent — confirmation completed",
      "Matched to your jurisdiction and service vertical",
    ],
    dark: false,
  },
  {
    num: "02",
    title: "Audience Intelligence",
    tag: "Structured data on where demand is moving",
    desc: "Our survey dataset captures declared intent from 5,500+ founders, investors, and internationally mobile individuals. Updated quarterly. Segmented by jurisdiction, programme type, capital readiness, and relocation timeline.",
    bullets: [
      "Destination preferences by region and nationality",
      "Programme demand by jurisdiction (EB-5, Malta, UAE, PT GV…)",
      "Budget ranges and capital readiness signals",
      "Relocation and execution timelines",
      "Quarterly reports — movement trends and demand shifts",
    ],
    dark: true,
  },
];

const STAGES = [
  { n: "01", h: "Audience Acquisition", p: "Continuous Meta and content campaigns targeting global mobility intent across 60+ countries.", meta: ["$240k+ annual ad spend", "60+ countries reached", "Continuous testing"] },
  { n: "02", h: "Survey & Self-Declaration", p: "Prospects complete our 14-question Global Mobility Survey — capturing jurisdiction, capital, family, and timing.", meta: ["~3 min completion", "100% structured", "GDPR compliant"] },
  { n: "03", h: "Intent Verification", p: "Each respondent goes through a structured verification step that confirms readiness, depth, and decision authority.", meta: ["Live confirmation", "Avg. 6 min", "92% completion rate"] },
  { n: "04", h: "Scoring, Matching & Delivery", p: "Each lead is scored 0–100, matched to your ICP and jurisdiction, and delivered with a full Advisor Brief.", meta: ["Real-time delivery", "ICP filtering", "Full Advisor Brief"] },
];

const WHO_CARDS = [
  { icon: "⚖️", h: "Immigration Law Firms", p: "Practices closing $25k–$250k+ retainers." },
  { icon: "🛂", h: "CBI Agencies", p: "St. Kitts, Dominica, Grenada, Antigua, Türkiye." },
  { icon: "🌐", h: "Golden Visa Specialists", p: "Portugal, Greece, Malta, UAE programmes." },
  { icon: "📊", h: "Tax & Structuring Advisors", p: "Founders restructuring fiscal & physical presence." },
  { icon: "🏛", h: "Real Estate Developers", p: "Qualifying properties in CBI/GV jurisdictions." },
  { icon: "🎯", h: "Family Offices", p: "Multi-generational mobility & second-passport mandates." },
];

const JURISDICTIONS = [
  { flag: "🇵🇹", name: "Portugal", prog: "Golden Visa · D7 · NHR" },
  { flag: "🇲🇹", name: "Malta", prog: "MEIN · PR" },
  { flag: "🇨🇾", name: "Cyprus", prog: "PR · Naturalisation" },
  { flag: "🇬🇷", name: "Greece", prog: "Golden Visa · Tax Non-Dom" },
  { flag: "🇦🇪", name: "UAE", prog: "Golden Visa · Tax Residency" },
  { flag: "🇸🇬", name: "Singapore", prog: "GIP · EntrePass" },
  { flag: "🇲🇾", name: "Malaysia", prog: "MM2H · Premium Visa" },
  { flag: "🇦🇺", name: "Australia / NZ", prog: "Investor & Skilled Visas" },
  { flag: "🇺🇸", name: "USA", prog: "EB-5 Investor Visa" },
  { flag: "🇵🇾", name: "Paraguay", prog: "Permanent Residency" },
  { flag: "🇰🇳", name: "St. Kitts & Nevis", prog: "CBI · Donation / RE" },
  { flag: "🇩🇲", name: "Dominica", prog: "CBI · EDF / RE" },
  { flag: "🇬🇩", name: "Grenada", prog: "CBI · USA E-2 Treaty" },
  { flag: "🇦🇬", name: "Antigua", prog: "CBI · NDF / RE" },
  { flag: "🇹🇷", name: "Türkiye", prog: "CBI · Real Estate" },
  { flag: "🇲🇽", name: "Mexico", prog: "Temp / Permanent Residency" },
];

const QUAL_DIMS = [
  { num: "01", h: "Budget Confirmation", weight: "20%", fill: 80, p: "Real budget vs. aspirational. Where it sits, in what currency, how liquid." },
  { num: "02", h: "Decision Timeline", weight: "20%", fill: 80, p: "3 months, 12 months, or 'someday'? Time-to-decision predicts conversion." },
  { num: "03", h: "Jurisdiction Specificity", weight: "15%", fill: 60, p: "Specific country in mind, or comparing options? Narrower = closer to commitment." },
  { num: "04", h: "Primary Motivation", weight: "15%", fill: 60, p: "Tax pressure, political risk, family, business, or lifestyle? Each drives a different sale." },
  { num: "05", h: "Family Complexity", weight: "15%", fill: 60, p: "Solo, couple, family with kids, multi-generational? Complexity = revenue per engagement." },
  { num: "06", h: "Decision Authority", weight: "15%", fill: 60, p: "Sole decision-maker, or spouse/family involved? Solo closes 3–4x faster." },
];

const TIERS = [
  { cls: "hot", name: "HOT", range: "70–100 / 100", desc: "Confirmed budget, decision authority, clear timeline within 90 days. Recommended for immediate outreach." },
  { cls: "warm", name: "WARM", range: "40–69 / 100", desc: "Active research with 3–12 month horizon. Budget & jurisdiction interest present but not yet locked." },
  { cls: "cold", name: "COLD", range: "0–39 / 100", desc: "Early-stage exploration. Real motivation but timeline unclear. Best for long-cycle nurture." },
];

const PHOTO_TESTIMONIALS = [
  { quote: "After 6 months on the platform, the HOT-tier leads we've closed represent over $1.4M in retainers. The unit economics destroy anything we got from cold outbound.", name: "Andreas Kyriakou", role: "Managing Partner", firm: "Cyprus CBI Advisory", flag: "🇨🇾", initials: "AK", bgGradient: "linear-gradient(135deg, #2C5F8D 0%, #4A7FC1 100%)", featured: true },
  { quote: "The Advisor Brief changed our first-call script entirely. Close rate up 3.2x.", name: "Maria Santos", role: "Director, Immigration", firm: "Lisbon Mobility Partners", flag: "🇵🇹", initials: "MS", bgGradient: "linear-gradient(135deg, #8E4A3D 0%, #D94F3A 100%)" },
  { quote: "Time-to-contract dropped from 47 days to 18 once we claimed exclusive jurisdiction access.", name: "Tomás Rivera", role: "Head of Sales", firm: "Iberian Golden Visa Co.", flag: "🇪🇸", initials: "TR", bgGradient: "linear-gradient(135deg, #5C8E3D 0%, #8EE032 100%)" },
];

const TESTIMONIALS_MARQUEE = [
  { quote: "I've worked with three lead gen platforms in this space. FBS is the only one where leads actually pick up the phone.", name: "Rashid Al-Mansoori", role: "Senior Partner · 🇦🇪 Dubai", initials: "RA", bgGradient: "linear-gradient(135deg, #C07D10, #E8A93D)" },
  { quote: "Our close rate is 4.2x higher than Meta direct response. The math just works.", name: "Elena Volkov", role: "Sales Director · 🇹🇷 Istanbul", initials: "EV", bgGradient: "linear-gradient(135deg, #7C5BA8, #B689D8)" },
  { quote: "The dashboard is clean. The leads are real. The contact unlock is instant.", name: "James Whitmore", role: "Principal · 🇬🇧 London", initials: "JW", bgGradient: "linear-gradient(135deg, #3D5C8E, #6B8AC4)" },
  { quote: "Six months in and I have a richer view of my market than my analytics team has built in two years.", name: "Sofia Marques", role: "Head of Growth · 🇵🇹 Lisbon", initials: "SM", bgGradient: "linear-gradient(135deg, #8E3D5C, #C46B8A)" },
  { quote: "Within 90 days we closed three CBI mandates. Not even close to what we got before.", name: "Linh Pham", role: "Founder · 🇸🇬 Singapore", initials: "LP", bgGradient: "linear-gradient(135deg, #2C8E5C, #5BC487)" },
];

const INTEL_MILESTONES = [
  { num: "100", h: "First ICP draft", p: "Demographic, motivation, capital range, programme preference", live: true },
  { num: "250", h: "Behavioral patterns added", p: "Decision speed, family dynamics, common objections", live: true },
  { num: "500", h: "Sub-segment splits unlock", p: "Detailed micro-personas with conversion likelihood", live: true },
  { num: "1k+", h: "Predictive ICP modeling", p: "Forward-looking persona shifts and demand forecasts", live: false },
];

const FAQ = [
  { q: "How is FBS different from Facebook lead ads or Sales Navigator?", a: "Facebook ads give you contact info. We deliver the full intent profile, qualified through a multi-step verification process, scored on a 100-point framework, and matched to your jurisdictions. The leads cost more per unit, but the close rate isn't comparable." },
  { q: "What happens after I request access?", a: "We review your firm profile within 24 hours. If there's a fit, we book a discovery call. Onboarding takes 5–7 days: ICP build, dashboard setup, exclusivity scoping, and your first matched leads." },
  { q: "Can I get exclusive leads in my jurisdiction?", a: "Yes. We onboard up to 5 partners per jurisdiction in most regions. In addition to the shared pool, partners can subscribe to an exclusive feed — leads that bypass the shared pool entirely and are routed only to your firm. Exclusive volume depends on your package." },
  { q: "How many leads do I receive?", a: "Each partner package includes a defined monthly lead volume — agreed during onboarding based on your jurisdiction, capacity, and tier mix. Both shared-pool and exclusive feed allocations are outlined in the agreement, with quarterly reviews to adjust." },
  { q: "What's the typical close rate?", a: "HOT-tier leads contacted within 24h: 18–28% close rate. WARM with proper nurture: 6–12%. COLD: <3% but useful for audience intelligence." },
  { q: "Do you offer a trial?", a: "No free trials — every lead has real acquisition cost. We offer a 30-day pilot with reduced commitment, discussed on the discovery call." },
  { q: "CRM integration?", a: "Direct integrations with HubSpot, Salesforce, Pipedrive, Zoho, Airtable. Custom webhooks on Partner plan and above." },
  { q: "What jurisdictions?", a: "14+ active: Portugal, Malta, Cyprus, Greece, UAE, Singapore, Malaysia, Australia / New Zealand, St. Kitts & Nevis, Dominica, Grenada, Antigua & Barbuda, Türkiye, Mexico — new programmes added quarterly." },
];

/* ──────────────────────────────────────────────
   APP
   ────────────────────────────────────────────── */

export default function App() {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", role: "", jurisdiction: "", capacity: "", message: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    if (e) e.preventDefault();
    if (!form.name || !form.email || !form.company) return;
    setSubmitting(true);
    try {
      const MAILERLITE_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMjkwMjI2ODdkNTJlNjk4ZjYwMzVkODk4YTI0MmFhMzgxNTlmMWQwMmRhN2ZlMDI2MGYxMTMzZGE0NWUyNDViZmQ1OTJiMjI5YjEzZjdjOTMiLCJpYXQiOjE3Nzc4MDQxNDEuMDU2ODcsIm5iZiI6MTc3NzgwNDE0MS4wNTY4NzMsImV4cCI6NDkzMzQ3Nzc0MS4wNTI3NTUsInN1YiI6IjkzMDA0MyIsInNjb3BlcyI6W119.Apd5ihW7N-KluBSDf-dovqu0O_Ia30wPUVjClBzRyOej5nne5be0poXt21OvB2PluTK4EyJO7ZBcOsitkoMG2Q6DSkjThmx0cjn-1APSFbWRAkp0VqXAljYyag-6LebecLKFjiSHNn5uAx441wje7CtSi4-qvb2UAIAYUX3El-upwv1TPges-H5dXbfvU0dOPOpStwNwg_neJOM1B7FyhZ8GOC2aVvaRkmsMJ_Q668dWd_1mhg21Bw35mXe6uzdQA90XENbpEjkn7ezw9Uv0jXDj-qHYs1EE6A08ulWRd-w2LERgr4MA_hJoz2IgjSn5cJWUfM-KtpGd9DxApaCZ_xbkx-zJRIQQXCQKC8WmDNLfDfjpsDGCMxdhcJ2j94fPX66aBNZTWq1DbEH4Z8SWGvgbwYdFEmBeUld552x8x_iGXRFLmicL6EOeng0bXmFlMwD2twukjkWsoVIQW8Vbdyza8XaNi-dtnDVLuMOqNhb2DDa0UbaHwW0DsEPPvHznrd2ut0zVtq-qr9MwiI1kAVwFcKgvJ5NXvjjXH0dgD0Z4iTn6KhHQuGoTav6vQazCsmtG0iicIvbVNcz_eXbi7G2sr_uUQZxRP_G2E-hya_NsnZmspqsTr4JRTckWgrTBYYH1QK8Zbd-cTPNx9y3vDlmsQx_N_5UG1JHIvQGBb2U";

      // Split name into first / last
      const nameParts = form.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // 1. Create or update subscriber
      const subRes = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MAILERLITE_TOKEN}`,
        },
        body: JSON.stringify({
          email: form.email,
          fields: {
            name: firstName,
            last_name: lastName,
            company: form.company,
            phone: form.phone || "",
            city: form.jurisdiction || "",
            country: form.role || "",
          },
        }),
      });

      const subData = await subRes.json();
      const subscriberId = subData?.data?.id;

      // 2. Find group "FBS Intelligence Landing" and assign subscriber
      if (subscriberId) {
        // Get groups list to find the right group ID
        const groupsRes = await fetch("https://connect.mailerlite.com/api/groups?limit=50", {
          headers: { "Authorization": `Bearer ${MAILERLITE_TOKEN}` },
        });
        const groupsData = await groupsRes.json();
        const group = groupsData?.data?.find((g) => g.name === "FBS Intelligence Landing");

        if (group) {
          await fetch(`https://connect.mailerlite.com/api/subscribers/${subscriberId}/groups/${group.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${MAILERLITE_TOKEN}`,
            },
          });
        }
      }

      // Redirect to thank-you page with Calendly
      window.location.href = "/thank-you";
    } catch (err) {
      console.error("MailerLite error:", err);
      // Still redirect even on API errors — don't block the user
      window.location.href = "/thank-you";
    } finally {
      setSubmitting(false);
    }
  };
  const scrollToForm = () => document.getElementById("apply").scrollIntoView({ behavior: "smooth" });

  const [statsRef, statsInView] = useInView(0.3);
  const scrollY = useScrollY();
  const docHeight = typeof document !== "undefined" ? document.documentElement.scrollHeight - window.innerHeight : 1;
  const progress = Math.min((scrollY / docHeight) * 100, 100);

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav>
        <div className="wrap nav-inner">
          <div className="nav-logo">
            <div className="nav-logo-dot" />
            FBS Intelligence
          </div>
          <div className="nav-right">
            <button className="nav-link" onClick={() => document.getElementById("inside").scrollIntoView({ behavior: "smooth" })}>What's inside</button>
            <button className="nav-link" onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}>How it works</button>
            <button className="nav-link" onClick={() => document.getElementById("who").scrollIntoView({ behavior: "smooth" })}>Who it's for</button>
            <button className="nav-link" onClick={() => document.getElementById("faq").scrollIntoView({ behavior: "smooth" })}>FAQ</button>
            <button className="nav-btn" onClick={scrollToForm}>Apply</button>
          </div>
        </div>
        <div className="nav-progress" style={{ width: `${progress}%` }} />
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="wrap">
          <div className="hero-pill-row fade-up">
            <span className="hero-pill-badge">NEW</span>
            <span className="hero-pill-text">B2B Lead Intelligence · Global Mobility</span>
          </div>

          <h1 className="fade-up fade-up-1">
            Qualified leads. <span className="accent">Audience Intelligence.</span>
          </h1>
          <div className="hero-subtitle fade-up fade-up-2">
            One platform for investment migration firms.
          </div>
          <p className="hero-desc fade-up fade-up-3">
            FBS Intelligence delivers pre-qualified investment migration prospects — matched to your jurisdiction and ready to engage.
            <strong>The lead generation network built exclusively for citizenship, residency and global mobility firms.</strong>
          </p>
          <div className="hero-actions fade-up fade-up-4">
            <MagneticButton primary onClick={scrollToForm}>Apply for Access →</MagneticButton>
            <MagneticButton onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}>See how it works →</MagneticButton>
          </div>

          {/* SOCIAL PROOF UNDER BUTTON */}
          <div className="hero-social fade-up fade-up-5">
            <div className="hero-avatars">
              {HERO_AVATARS.map((a, i) => (
                <div key={i} className="hero-avatar" style={{ background: a.bg }}>{a.initials}</div>
              ))}
            </div>
            <div className="hero-social-text">
              <div className="hero-social-stars">
                <span className="hero-social-stars-icon">★★★★★</span>
                <span className="hero-social-rating">4.9</span>
              </div>
              <div className="hero-social-label">Trusted by <strong>30+ firms</strong> across 16 jurisdictions</div>
            </div>
          </div>

          {/* HERO MOCKUP */}
          <div className="hero-mockup-wrap fade-up fade-up-6">
            <div className="hero-mockup-shadow" />
            <div className="hero-mockup-float">
              <DashboardMockup />
            </div>
          </div>

          <div className="stats-bar" ref={statsRef}>
            <Stat num={800} suffix="+" label="Survey respondents from 60+ countries" inView={statsInView} delay={0} />
            <Stat num={16} suffix="+" label="Active jurisdictions covered" inView={statsInView} delay={120} />
            <Stat num={92} suffix="%" label="Verification completion within 24h" inView={statsInView} delay={240} />
            <Stat num={30} suffix="+" label="Partner firms onboarded" inView={statsInView} delay={360} />
          </div>

          {/* PRESS LOGOS */}
          <div className="logos-row">
            <div className="logos-label">As seen in</div>
            <div className="logos-list">
              {PRESS_LOGOS.map((l, i) => (
                <div key={i} className={`logo-item ${l.className}`}>{l.name}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track-banner">
          {[...Array(2)].flatMap((_, k) => ["Global Mobility Score", "Verified Intent", "Jurisdiction Matching", "HOT · WARM · COLD Tiers", "Exclusive Lead Access", "Audience Intelligence", "Investment Migration", "Second Citizenship", "Golden Visa", "Tax Optimisation"].map((t, i) => (
            <span key={`${k}-${i}`} className="marquee-item">{t} <span className="marquee-dot">·</span></span>
          )))}
        </div>
      </div>

      {/* PROMISE */}
      <section className="promise-hero">
        <div className="wrap">
          <div className="promise-grid">
            <Reveal>
              <div className="promise-text">
                <div className="eyebrow"><span className="eyebrow-line" />The Promise</div>
                <h2>Every prospect already <span className="hl-sm">scored, qualified, matched</span>.</h2>
                <p>You don't qualify. You convert.</p>
                <p>By the time a lead lands in your feed, it has passed through a 14-question intake, intent verification, six-dimension scoring, and ICP-based matching to your firm.</p>
                <p>You walk into the first call <strong>already knowing the budget, timeline, family situation, and the prospect's own words about why now</strong>.</p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <OrbitGraphic />
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="section section-light" id="inside">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow"><span className="eyebrow-line" />What's Inside</div>
            <h2>Qualified leads. <span className="gray-tail">Plus the data on where more are coming from.</span></h2>
            <p className="section-body">
              Ready-to-talk prospects delivered to your inbox — and the audience intelligence to understand where demand is moving.
            </p>
          </Reveal>

          <div className="inside-grid">
            {INSIDE_FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 120} className={`inside-card ${f.dark ? "dark" : ""}`}>
                <div className="inside-num">{f.num}</div>
                <h3>{f.title}</h3>
                <div className="inside-tag">{f.tag}</div>
                <p className="inside-desc">{f.desc}</p>
                <ul className="inside-list">
                  {f.bullets.map((b, j) => (
                    <li key={j}><span className="check">✓</span><span>{b}</span></li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INLINE CTA */}
      <div className="inline-cta">
        <div className="wrap inline-cta-inner">
          <div className="inline-cta-text">
            <div className="inline-cta-tag">
              <span className="inline-cta-tag-dot" />
              Limited Capacity
            </div>
            <h3>Get matched to your first 10 pre-qualified leads in under 7 days.</h3>
            <p>Limited capacity per jurisdiction. Up to 5 service providers per market.</p>
          </div>
          <button className="inline-cta-btn" onClick={scrollToForm}>Apply for Access →</button>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="section section-off" id="how">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow"><span className="eyebrow-line" />How It Works</div>
            <h2>From declared intent to your inbox in <span className="hl-sm">72 hours</span>.</h2>
            <p className="section-body">
              Four stages. Fully managed. You only see prospects who are ready to talk.
            </p>
          </Reveal>

          <div className="stages">
            {STAGES.map((s, i) => (
              <Reveal key={i} delay={i * 100} className="stage">
                <div className="stage-num">
                  <span className="stage-num-circle">{s.n}</span>
                  STAGE {s.n}
                </div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
                <div className="stage-meta">
                  {s.meta.map((m, j) => (
                    <div key={j} className="stage-meta-item">
                      <span className="stage-meta-dot" />{m}
                    </div>
                  ))}
                </div>
                <div className="stage-arrow">→</div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={500}>
            <div className="stage-timing">
              <div className="stage-timing-item">
                <div className="stage-timing-icon">⏱</div>
                <div className="stage-timing-text"><strong>72h</strong> from declared intent to your dashboard</div>
              </div>
              <div className="stage-timing-item">
                <div className="stage-timing-icon">🤝</div>
                <div className="stage-timing-text"><strong>Fully managed.</strong> No setup required from your team</div>
              </div>
              <div className="stage-timing-item">
                <div className="stage-timing-icon">✓</div>
                <div className="stage-timing-text"><strong>Only ready-to-talk</strong> prospects reach your feed</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* LEAD CARD SHOWCASE */}
      <section className="section section-light">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow"><span className="eyebrow-line" />What You Receive</div>
            <h2>Anatomy of a HOT-tier <span className="hl-sm">Advisor Brief</span></h2>
          </Reveal>

          <div className="lead-showcase">
            <Reveal delay={100}>
              <LeadCardMockup />
            </Reveal>
            <Reveal delay={200}>
              <div className="lead-showcase-text">
                <h3>Every field captured before the lead touches your dashboard.</h3>
                <p>
                  <strong>Score & tier</strong> tells you priority. <strong>Prospect's own words</strong> tells you what to lead with. <strong>Profile context</strong> gives you the rest.
                </p>
                <p style={{ background:"var(--off)", padding:"16px 20px", borderRadius:10, fontSize:14, color:"var(--text)", borderLeft:"3px solid var(--lime)", marginTop:24 }}>
                  <strong>The shift:</strong> instead of qualifying 100 leads to find 5 worth pursuing, you receive 15 — and 12 are worth pursuing on day one.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="who-section" id="who">
        <div className="wrap">
          <div className="who-grid">
            <Reveal>
              <div className="who-text-side">
                <div className="eyebrow"><span className="eyebrow-line" />Who This Is For</div>
                <h2>Built for firms where client quality <span className="hl-sm">determines revenue</span>.</h2>
                <p style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.7 }}>
                  FBS Intelligence is a closed network. We onboard a limited number of service providers per jurisdiction in most regions.
                </p>
                <div className="who-callout">
                  <div className="who-callout-tag">Selective Onboarding</div>
                  <div className="who-callout-text">
                    <strong>Up to 5 service providers per jurisdiction.</strong> Plus exclusive lead feeds — leads that bypass the shared pool entirely and are delivered only to you.
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="who-cards-side">
              {WHO_CARDS.map((w, i) => (
                <Reveal key={i} delay={i * 70} className="who-card">
                  <span className="who-card-icon">{w.icon}</span>
                  <h4>{w.h}</h4>
                  <p>{w.p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JURISDICTIONS */}
      <section className="section section-light" id="jur">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow"><span className="eyebrow-line" />Jurisdictions</div>
            <h2>16+ active jurisdictions. <span className="hl-sm">Continuous flow</span>.</h2>
          </Reveal>

          <div className="jur-grid">
            {JURISDICTIONS.map((j, i) => (
              <Reveal key={i} delay={i * 30} className="jur-cell">
                <div className="jur-flag">{j.flag}</div>
                <div className="jur-name">{j.name}</div>
                <div className="jur-prog">{j.prog}</div>
              </Reveal>
            ))}
          </div>

          <div className="jur-strip">
            <span>+ Custom jurisdictions on Partner-tier</span>
            <span>Updated <strong>April 2026</strong></span>
          </div>
        </div>
      </section>

      {/* ════════ SECOND CTA FORM — after Jurisdictions ════════ */}
      <section className="final-cta" id="apply-early">
        <div className="wrap">
          <Reveal>
            <div className="lime-cta-box">
              <div className="lime-cta-grid">
                <div className="lime-cta-text">
                  <div className="lime-cta-eyebrow">
                    <span style={{ width: 6, height: 6, background: "var(--black)", borderRadius: "50%" }} />
                    Selective Onboarding
                  </div>
                  <h2>Apply to join the FBS Intelligence network.</h2>
                  <p>
                    We onboard a limited number of service providers per jurisdiction in most regions. Submit your firm profile — we respond within 24 hours.
                  </p>
                  <div className="lime-cta-meta">
                    <span><span className="check">✓</span> 24-hour review of your application</span>
                    <span><span className="check">✓</span> Discovery call within the same week</span>
                    <span><span className="check">✓</span> First matched leads in 7 days</span>
                    <span><span className="check">✓</span> Pricing shared after discovery call</span>
                  </div>
                </div>
                <div className="cta-form">
                  {!done ? (
                    <>
                      <div className="cta-form-head">
                        <h3>Apply for Partner Access</h3>
                        <p>Tell us about your firm. We'll be in touch within 24 hours.</p>
                      </div>
                      <div className="cta-form-grid">
                        <div className="cta-field">
                          <label>Full name</label>
                          <input value={form.name} onChange={set("name")} placeholder="Your full name" />
                        </div>
                        <div className="cta-field">
                          <label>Business email</label>
                          <input type="email" value={form.email} onChange={set("email")} placeholder="you@firm.com" />
                        </div>
                        <div className="cta-field">
                          <label>Firm name</label>
                          <input value={form.company} onChange={set("company")} placeholder="Company / firm" />
                        </div>
                        <div className="cta-field">
                          <label>Phone (optional)</label>
                          <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
                        </div>
                        <div className="cta-field">
                          <label>Type of firm</label>
                          <select value={form.role} onChange={set("role")}>
                            <option value="">Select…</option>
                            <option>Immigration Law Firm</option>
                            <option>CBI / Golden Visa Agent</option>
                            <option>Tax & Structuring Advisor</option>
                            <option>Real Estate Developer</option>
                            <option>Family Office</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className="cta-field">
                          <label>Primary jurisdiction</label>
                          <select value={form.jurisdiction} onChange={set("jurisdiction")}>
                            <option value="">Select…</option>
                            <option>Portugal</option><option>Malta</option><option>Cyprus</option>
                            <option>Greece</option><option>UAE</option><option>Singapore</option>
                            <option>Malaysia</option><option>Australia / NZ</option><option>USA (EB-5)</option>
                            <option>Paraguay</option><option>St. Kitts & Nevis</option><option>Dominica</option>
                            <option>Grenada</option><option>Antigua & Barbuda</option><option>Türkiye</option>
                            <option>Mexico</option><option>Other</option>
                          </select>
                        </div>
                        <div className="cta-field full">
                          <label>Monthly capacity</label>
                          <select value={form.capacity} onChange={set("capacity")}>
                            <option value="">Select…</option>
                            <option>Under 10</option><option>10 – 25</option>
                            <option>25 – 50</option><option>50 – 100</option><option>100+</option>
                          </select>
                        </div>
                        <div className="cta-field full">
                          <label>Anything else? (optional)</label>
                          <textarea value={form.message} onChange={set("message")} placeholder="Tell us about your practice…" />
                        </div>
                      </div>
                      <button type="button" className="cta-form-submit" onClick={submit} disabled={submitting}>
                        {submitting ? "Submitting…" : "Submit Application →"}
                      </button>
                      <div className="cta-form-disclaimer">
                        By submitting, you agree to be contacted by FBS Intelligence. We don't share your data.
                      </div>
                    </>
                  ) : (
                    <div className="success">
                      <div className="check-big">✓</div>
                      <h3>Application received</h3>
                      <p>We'll review your firm profile within 24 hours and reach out with next steps.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ SOCIAL PROOF — PARTNER LOGOS + TESTIMONIALS ════════ */}
      <section className="section social-proof-section">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow eyebrow-lime-on-light" style={{display:"inline-flex",alignItems:"center",gap:10,fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:18}}>
              <span style={{width:24,height:1,background:"var(--lime-dark)",opacity:0.5,display:"inline-block"}}/>
              Partner Ecosystem
            </div>
            <h2>Trusted by firms across <span className="hl-sm">16+ jurisdictions</span></h2>
            <p className="section-body">
              From boutique CBI agencies to global immigration practices — these firms work with our audience every day.
            </p>
          </Reveal>

          {/* Row 1 — 5 logos */}
          <Reveal delay={80}>
            <div className="partner-logos-row">
              {[
                { src: "https://fsummit.net/checkout/wp-content/uploads/2025/11/ocorian-logo-vector.png-3d9db7bf.webp", alt: "Ocorian" },
                { src: "https://fsummit.net/images/Virtuzone-logo-01.svg", alt: "Virtuzone" },
                { src: "https://fsummit.net/checkout/wp-content/uploads/2025/10/Intermark-Global_idrYOGloae_0.png", alt: "Intermark Global" },
                { src: "https://fsummit.net/images/InCorpLogo White2.svg", alt: "InCorp" },
                { src: "https://fsummit.net/checkout/wp-content/uploads/2025/09/osome_logo_blue.png", alt: "Osome" },
              ].map((logo, i) => (
                <div key={i} className="partner-logo-item">
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
          </Reveal>

          {/* Row 2 — 5 logos */}
          <Reveal delay={140}>
            <div className="partner-logos-row row2">
              {[
                { src: "https://fsummit.net/checkout/wp-content/uploads/2026/03/Msgi-V-teal.webp", alt: "MSGI" },
                { src: "https://fsummit.net/checkout/wp-content/uploads/2025/12/CRS_Logo__1_-removebg-preview-1.png", alt: "CRS" },
                { src: "https://fsummit.net/images/WorldTalents_logo all-01.svg", alt: "WorldTalents" },
                { src: "https://fsummit.net/checkout/wp-content/uploads/2025/11/e-residency-white.png", alt: "e-Residency Estonia" },
                { src: "https://fsummit.net/checkout/wp-content/uploads/2025/10/Logo-LACA-White.png", alt: "LACA" },
              ].map((logo, i) => (
                <div key={i} className="partner-logo-item">
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
          </Reveal>

          {/* Media strip */}
          <Reveal delay={200}>
            <div className="media-logos-strip">
              <span className="media-logos-label">As seen in</span>
              {[
                { src: "https://fsummit.net/assets/img/associated-press.png", alt: "Associated Press" },
                { src: "https://fsummit.net/assets/img/khaleej-times.png", alt: "Khaleej Times" },
                { src: "https://fsummit.net/checkout/wp-content/uploads/2025/11/gulf-news-logo-vector-removebg-preview.png", alt: "Gulf News" },
                { src: "https://fsummit.net/assets/img/CoinMarketCap.png", alt: "CoinMarketCap" },
                { src: "https://fsummit.net/assets/img/founder-institute-2.png", alt: "Founder Institute" },
              ].map((logo, i) => (
                <img key={i} src={logo.src} alt={logo.alt} className="media-logo-img" />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* QUALIFICATION DARK */}
      <section className="section section-dark has-aurora">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow eyebrow-lime"><span className="eyebrow-line" />Qualification Process</div>
            <h2>Six dimensions. One score. <span className="hl-sm">Every single lead</span>.</h2>
          </Reveal>

          <div className="qual-bento">
            {QUAL_DIMS.map((d, i) => (
              <Reveal key={i} delay={i * 60}>
                <SpotlightCard className="qual-spot">
                  <div className="qual-num">DIMENSION {d.num}</div>
                  <div className="qual-card">
                    <h3>{d.h}</h3>
                    <p>{d.p}</p>
                    <div className="qual-bar">
                      <div className="qual-bar-fill" style={{ width: `${d.fill}%` }} />
                    </div>
                    <div className="qual-weight">
                      <span>Weight</span>
                      <span className="w">{d.weight}</span>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="section section-light">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow"><span className="eyebrow-line" />Lead Tiers</div>
            <h2>Three tiers. Clear thresholds.</h2>
          </Reveal>

          <div className="score-table">
            {TIERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 80} className="score-row">
                <div className={`score-tier ${t.cls}`}><span className="tier-dot" />{t.name}</div>
                <div className="score-desc">{t.desc}</div>
                <div className="score-range">{t.range}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ INTELLIGENCE LAYER — ICP PERSONA ════════ */}
      <section className="intel-layer">
        <div className="wrap">
          <div className="intel-grid">
            <Reveal>
              <div className="intel-text">
                <div className="eyebrow eyebrow-lime"><span className="eyebrow-line" />Intelligence Layer</div>
                <h2>Your <span className="hl-sm">Ideal Client Profile</span> gets sharper with every lead.</h2>
                <p>
                  Beyond delivering prospects, FBS Intelligence builds a living <strong>ICP persona</strong> from your matched lead pool — auto-generated, auto-updating, and segmented for your firm specifically.
                </p>
                <p>
                  Every <strong>100 new leads</strong> deepens the profile: from broad demographics at lead 100, to behavioral patterns at 250, to detailed micro-personas at 500. Your data asset compounds month after month.
                </p>

                <div className="intel-milestones">
                  {INTEL_MILESTONES.map((m, i) => (
                    <Reveal key={i} delay={i * 80} className="intel-milestone">
                      <div className={`intel-milestone-num ${m.live ? "" : "locked"}`}>{m.num}</div>
                      <div className="intel-milestone-text">
                        <div className="intel-milestone-h">{m.h}</div>
                        <div className="intel-milestone-p">{m.p}</div>
                      </div>
                      <div className={`intel-milestone-tag ${m.live ? "live" : "locked"}`}>
                        {m.live ? "● LIVE" : "🔒 SOON"}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <ICPPersona />
            </Reveal>
          </div>

          <Reveal delay={200}>
            <AudienceInsights />
          </Reveal>
        </div>
      </section>

      {/* ════════ EXCLUSIVE LEADS ════════ */}
      <section className="excl-section">
        <div className="excl-bg" />
        <div className="wrap">
          <div className="excl-grid">
            <Reveal>
              <div className="excl-text">
                <div className="eyebrow eyebrow-lime"><span className="eyebrow-line" />Exclusive Lead Flow</div>
                <h2>Beyond the shared pool: <span className="hl-sm">your own exclusive feed</span>.</h2>
                <p>
                  Every matched lead is visible to qualifying partners in your jurisdiction's <strong>shared pool</strong>. For example: 10 prospects researching Malta — every Malta-focused partner can reach out.
                </p>
                <p>
                  Beyond that, your firm can receive an additional <strong>exclusive feed</strong> — leads from your jurisdiction that never enter the shared pool, and are delivered only to you.
                </p>

                <div className="excl-features">
                  <div className="excl-feature">
                    <div className="excl-feature-icon">1</div>
                    <div>
                      <h4>Shared pool access</h4>
                      <p>All qualifying leads from your jurisdiction visible to all partner firms covering it.</p>
                    </div>
                  </div>
                  <div className="excl-feature">
                    <div className="excl-feature-icon">2</div>
                    <div>
                      <h4>Plus your private feed</h4>
                      <p>Additional leads routed only to you. Other partners never see them.</p>
                    </div>
                  </div>
                  <div className="excl-feature">
                    <div className="excl-feature-icon">3</div>
                    <div>
                      <h4>Volume guarantees</h4>
                      <p>Minimum monthly lead floors negotiated as part of your exclusive package.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Visual showing exclusive vs shared */}
            <Reveal delay={150}>
              <div className="excl-visual">
                <div className="excl-visual-head">
                  <div className="excl-visual-tag">
                    <span className="excl-visual-tag-dot" />
                    EXCLUSIVE ACCESS
                  </div>
                  <div className="excl-visual-jur">Malta · Active</div>
                </div>

                <div className="excl-jur-flag">
                  <div className="flag-big">🇲🇹</div>
                  <div className="flag-name">Malta</div>
                  <div className="flag-tag">your exclusive feed</div>
                </div>

                <div className="excl-flow">
                  <div className="excl-flow-item you">
                    <div className="excl-flow-icon">✓</div>
                    <div>
                      <div className="excl-flow-name">Your firm</div>
                      <div className="excl-flow-meta">Receives exclusive leads + shared pool access</div>
                    </div>
                    <div className="excl-flow-status">Exclusive</div>
                  </div>
                  <div className="excl-flow-item them">
                    <div className="excl-flow-icon">✕</div>
                    <div>
                      <div className="excl-flow-name">Other partner firm A</div>
                      <div className="excl-flow-meta">Sees only shared-pool leads</div>
                    </div>
                    <div className="excl-flow-status">Shared only</div>
                  </div>
                  <div className="excl-flow-item them">
                    <div className="excl-flow-icon">✕</div>
                    <div>
                      <div className="excl-flow-name">Other partner firm B</div>
                      <div className="excl-flow-meta">Sees only shared-pool leads</div>
                    </div>
                    <div className="excl-flow-status">Shared only</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-light" id="faq">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow"><span className="eyebrow-line" />FAQ</div>
            <h2>Questions partners ask before signing</h2>
          </Reveal>
          <Reveal delay={100}>
            <Accordion items={FAQ} />
          </Reveal>
        </div>
      </section>

      {/* ════════ FINAL CTA — LIME CARD ON WHITE ════════ */}
      <section className="final-cta" id="apply">
        <div className="wrap">
          <Reveal>
            <div className="lime-cta-box">
              <div className="lime-cta-grid">
                <div className="lime-cta-text">
                  <div className="lime-cta-eyebrow">
                    <span style={{ width: 6, height: 6, background: "var(--black)", borderRadius: "50%" }} />
                    Selective Onboarding
                  </div>
                  <h2>Apply to join the FBS Intelligence network.</h2>
                  <p>
                    We onboard a limited number of service providers per jurisdiction in most regions. Submit your firm profile — we respond within 24 hours.
                  </p>
                  <div className="lime-cta-meta">
                    <span><span className="check">✓</span> 24-hour review of your application</span>
                    <span><span className="check">✓</span> Discovery call within the same week</span>
                    <span><span className="check">✓</span> First matched leads in 7 days</span>
                    <span><span className="check">✓</span> Pricing shared after discovery call</span>
                  </div>
                </div>

                <div className="cta-form">
                  {!done ? (
                    <>
                      <div className="cta-form-head">
                        <h3>Apply for Partner Access</h3>
                        <p>Tell us about your firm. We'll be in touch within 24 hours.</p>
                      </div>
                      <div className="cta-form-grid">
                        <div className="cta-field">
                          <label>Full name</label>
                          <input value={form.name} onChange={set("name")} placeholder="Your full name" />
                        </div>
                        <div className="cta-field">
                          <label>Business email</label>
                          <input type="email" value={form.email} onChange={set("email")} placeholder="you@firm.com" />
                        </div>
                        <div className="cta-field">
                          <label>Firm name</label>
                          <input value={form.company} onChange={set("company")} placeholder="Company / firm" />
                        </div>
                        <div className="cta-field">
                          <label>Phone (optional)</label>
                          <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
                        </div>
                        <div className="cta-field">
                          <label>Type of firm</label>
                          <select value={form.role} onChange={set("role")}>
                            <option value="">Select…</option>
                            <option>Immigration Law Firm</option>
                            <option>CBI / Golden Visa Agent</option>
                            <option>Tax & Structuring Advisor</option>
                            <option>Real Estate Developer</option>
                            <option>Family Office</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className="cta-field">
                          <label>Primary jurisdiction</label>
                          <select value={form.jurisdiction} onChange={set("jurisdiction")}>
                            <option value="">Select…</option>
                            <option>Portugal</option>
                            <option>Malta</option>
                            <option>Cyprus</option>
                            <option>Greece</option>
                            <option>UAE</option>
                            <option>Singapore</option>
                            <option>St. Kitts & Nevis</option>
                            <option>Dominica</option>
                            <option>Grenada</option>
                            <option>Antigua & Barbuda</option>
                            <option>Türkiye</option>
                            <option>Mexico</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className="cta-field full">
                          <label>Monthly capacity (leads you can handle)</label>
                          <select value={form.capacity} onChange={set("capacity")}>
                            <option value="">Select…</option>
                            <option>Under 10</option>
                            <option>10 – 25</option>
                            <option>25 – 50</option>
                            <option>50 – 100</option>
                            <option>100+</option>
                          </select>
                        </div>
                        <div className="cta-field full">
                          <label>Anything else? (optional)</label>
                          <textarea value={form.message} onChange={set("message")} placeholder="Tell us about your practice, ICP, or specific programme focus…" />
                        </div>
                      </div>
                      <button type="button" className="cta-form-submit" onClick={submit} disabled={submitting}>
                        {submitting ? "Submitting…" : "Submit Application →"}
                      </button>
                      <div className="cta-form-disclaimer">
                        By submitting, you agree to be contacted by FBS Intelligence. We don't share your data.
                      </div>
                    </>
                  ) : (
                    <div className="success">
                      <div className="check-big">✓</div>
                      <h3>Application received</h3>
                      <p>We'll review your firm profile within 24 hours and reach out with next steps.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <h4><span className="dot" />FBS Intelligence</h4>
              <p>The B2B lead intelligence platform built on Freedom Business Summit's 7-year event ecosystem.</p>
            </div>
            <div className="footer-col">
              <h5>Platform</h5>
              <a onClick={() => document.getElementById("inside").scrollIntoView({ behavior:"smooth" })}>What's inside</a>
              <a onClick={() => document.getElementById("how").scrollIntoView({ behavior:"smooth" })}>How it works</a>
              <a onClick={() => document.getElementById("who").scrollIntoView({ behavior:"smooth" })}>Who it's for</a>
              <a onClick={() => document.getElementById("faq").scrollIntoView({ behavior:"smooth" })}>FAQ</a>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <a onClick={scrollToForm}>Apply</a>
              <a>Freedom Business Summit</a>
              <a>Press</a>
              <a>Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Freedom Business Summit · FBS Intelligence</p>
            <p>fbsintelligence.com</p>
          </div>
        </div>
      </footer>
    </>
  );
}
