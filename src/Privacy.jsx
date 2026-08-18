import { useEffect } from "react";

const CSS = `
  :root{
    --black:#0A0A0A;--off:#F4F4F2;--white:#FFFFFF;--lime:#AAFF45;--lime2:#8EE032;
    --lime-soft:#E8F5DF;--lime-dark:#5A8A20;--muted:#6B6B6B;--border:#E5E5E5;--text2:#5A5A56;
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  .legal-root{font-family:'Inter',-apple-system,sans-serif;background:var(--off);color:var(--black);min-height:100vh;-webkit-font-smoothing:antialiased;}
  .wrap{max-width:820px;margin:0 auto;padding:0 24px;}

  nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);}
  .nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:62px;}
  .nav-logo{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:700;color:var(--black);text-decoration:none;letter-spacing:-0.02em;}
  .nav-logo-dot{width:9px;height:9px;border-radius:50%;background:var(--lime);}
  .nav-right{display:flex;align-items:center;gap:22px;}
  .nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);text-decoration:none;}
  .nav-link:hover{color:var(--black);}
  .nav-btn{background:var(--black);color:var(--white);font-size:13px;font-weight:600;padding:9px 18px;border-radius:8px;text-decoration:none;}

  .legal-hero{padding:64px 0 40px;border-bottom:1px solid var(--border);background:var(--white);}
  .legal-eyebrow{font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:14px;}
  .legal-title{font-size:clamp(32px,5vw,48px);font-weight:800;letter-spacing:-0.03em;line-height:1.05;margin-bottom:14px;}
  .legal-updated{font-size:14px;color:var(--muted);}

  .legal-body{padding:48px 0 96px;}
  .legal-body h2{font-size:22px;font-weight:800;letter-spacing:-0.02em;margin:40px 0 14px;padding-top:20px;border-top:1px solid var(--border);}
  .legal-body h2:first-child{border-top:none;padding-top:0;margin-top:0;}
  .legal-body h3{font-size:16px;font-weight:700;margin:24px 0 8px;}
  .legal-body p{font-size:15px;line-height:1.75;color:var(--text2);margin-bottom:14px;}
  .legal-body ul{margin:0 0 16px 0;padding-left:0;list-style:none;}
  .legal-body li{font-size:15px;line-height:1.7;color:var(--text2);margin-bottom:10px;padding-left:26px;position:relative;}
  .legal-body li::before{content:'';position:absolute;left:8px;top:11px;width:5px;height:5px;border-radius:50%;background:var(--lime2);}
  .legal-body strong{color:var(--black);font-weight:600;}
  .legal-body a{color:var(--lime-dark);text-decoration:none;font-weight:500;}
  .legal-body a:hover{text-decoration:underline;}
  .legal-table{width:100%;border-collapse:collapse;margin:8px 0 20px;font-size:14px;}
  .legal-table th,.legal-table td{text-align:left;padding:12px 14px;border:1px solid var(--border);vertical-align:top;line-height:1.5;}
  .legal-table th{background:var(--off);font-weight:700;color:var(--black);font-size:13px;}
  .legal-table td{color:var(--text2);}
  .legal-callout{background:var(--lime-soft);border:1px solid rgba(170,255,69,0.4);border-radius:12px;padding:20px 24px;margin:20px 0;}
  .legal-callout p{margin-bottom:0;color:var(--black);font-size:14px;}

  footer{background:var(--black);padding:48px 0 40px;}
  .footer-inner{max-width:1200px;margin:0 auto;padding:0 24px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;}
  .footer-left{font-size:13px;color:#888;display:flex;align-items:center;gap:8px;}
  .footer-dot{width:8px;height:8px;border-radius:50%;background:var(--lime);}
  .footer-links{display:flex;gap:20px;}
  .footer-links a{font-size:13px;color:#888;text-decoration:none;}
  .footer-links a:hover{color:#fff;}

  @media(max-width:600px){.nav-right .nav-link{display:none;}}
`;

export default function Privacy() {
  useEffect(() => { document.title = "Privacy Policy · FBS Intelligence"; }, []);
  return (
    <>
      <style>{CSS}</style>
      <div className="legal-root">
        <nav>
          <div className="nav-inner">
            <a href="/" className="nav-logo"><div className="nav-logo-dot" />FBS Intelligence</a>
            <div className="nav-right">
              <a href="/overview" className="nav-link">How it works</a>
              <a href="/pricing" className="nav-link">Pricing</a>
              <a href="/#apply" className="nav-btn">Apply</a>
            </div>
          </div>
        </nav>

        <section className="legal-hero">
          <div className="wrap">
            <div className="legal-eyebrow">Legal</div>
            <h1 className="legal-title">Privacy Policy</h1>
            <p className="legal-updated">Last updated: [DATE] · Effective: [DATE]</p>
          </div>
        </section>

        <section className="legal-body">
          <div className="wrap">

            <div className="legal-callout">
              <p><strong>Placeholder notice:</strong> This template must be reviewed by a qualified data-protection lawyer before publication. Replace every [BRACKETED] field with your registered details. FBS Intelligence provides this as a starting structure, not legal advice.</p>
            </div>

            <h2>1. Who we are</h2>
            <p>[LEGAL ENTITY NAME] ("FBS Intelligence", "we", "us") operates the website <a href="https://fbsintelligence.com">fbsintelligence.com</a> and the lead-generation services described on it. We are the data controller for the personal data described in this policy.</p>
            <p><strong>Registered address:</strong> [ADDRESS], [EU COUNTRY]<br />
            <strong>Company registration:</strong> [REG. NUMBER]<br />
            <strong>Data protection contact:</strong> <a href="mailto:privacy@fbsintelligence.com">privacy@fbsintelligence.com</a></p>

            <h2>2. Scope — whose data this covers</h2>
            <p>This policy applies to two groups:</p>
            <ul>
              <li><strong>Partners</strong> — representatives of law firms, agencies, and advisory firms who apply to work with us or use our platform.</li>
              <li><strong>Leads (prospects)</strong> — individuals who respond to our partners' campaigns, register for webinars, and complete the Global Mobility Survey.</li>
            </ul>
            <p>For leads generated through partner campaigns, FBS Intelligence and the partner firm may act as <strong>joint controllers</strong> or independent controllers depending on the arrangement. The specifics are set out in each partner agreement.</p>

            <h2>3. What data we collect</h2>
            <h3>From partners</h3>
            <ul>
              <li>Name, business email, phone number, firm name, and role</li>
              <li>Jurisdiction, firm type, and monthly capacity indicated in the application form</li>
              <li>Any information you include in messages to us</li>
            </ul>
            <h3>From leads</h3>
            <ul>
              <li>Contact details (name, email, phone) provided at registration</li>
              <li>Survey responses — including self-reported budget range, timeline, family status, motivation, and jurisdiction interest</li>
              <li>Consent records, timestamps, and source attribution (UTM parameters)</li>
            </ul>
            <h3>Automatically</h3>
            <ul>
              <li>IP address, device and browser information, and pages visited</li>
              <li>Cookie and pixel data (see Section 8)</li>
            </ul>

            <h2>4. Why we process it (legal bases under GDPR)</h2>
            <table className="legal-table">
              <thead><tr><th>Purpose</th><th>Legal basis (Art. 6 GDPR)</th></tr></thead>
              <tbody>
                <tr><td>Delivering qualified leads to partner firms</td><td>Consent (leads) · Contract (partners)</td></tr>
                <tr><td>Sending webinar reminders and educational emails</td><td>Consent</td></tr>
                <tr><td>Scoring and qualifying survey responses</td><td>Legitimate interest / Consent</td></tr>
                <tr><td>Responding to partner applications</td><td>Steps prior to a contract</td></tr>
                <tr><td>Measuring campaign performance</td><td>Legitimate interest / Consent (cookies)</td></tr>
                <tr><td>Legal and accounting obligations</td><td>Legal obligation</td></tr>
              </tbody>
            </table>

            <h2>5. How leads' data is shared with partners</h2>
            <p>The core of our service is delivering qualified leads to partner firms. When a lead completes the survey and qualifies, their profile — including contact details and survey responses — is delivered to the matched partner firm's dashboard.</p>
            <p>Leads consent to this sharing at the point of survey completion. Each lead is delivered <strong>exclusively</strong> to one partner matched to their jurisdiction and the relevant programme; we do not resell the same lead to multiple firms.</p>
            <div className="legal-callout">
              <p>We retain the right to use <strong>aggregated, anonymised</strong> data (with no personal identifiers) for benchmarking and to improve our scoring models. This never identifies an individual.</p>
            </div>

            <h2>6. Who else we share data with (processors)</h2>
            <p>We use trusted third-party providers who process data on our behalf under data-processing agreements:</p>
            <table className="legal-table">
              <thead><tr><th>Provider</th><th>Purpose</th><th>Data location</th></tr></thead>
              <tbody>
                <tr><td>MailerLite</td><td>Email delivery and automation</td><td>EU / adequacy</td></tr>
                <tr><td>Calendly</td><td>Scheduling discovery and demo calls</td><td>US (SCCs)</td></tr>
                <tr><td>Meta &amp; Google</td><td>Ad delivery, pixel-based measurement</td><td>US (SCCs)</td></tr>
                <tr><td>Vercel</td><td>Website hosting and analytics</td><td>US / EU (SCCs)</td></tr>
              </tbody>
            </table>
            <p>Where data is transferred outside the EEA, we rely on Standard Contractual Clauses (SCCs) or adequacy decisions. [CONFIRM WITH COUNSEL that current DPAs and transfer mechanisms are in place for each provider.]</p>

            <h2>7. How long we keep it</h2>
            <ul>
              <li><strong>Partner data:</strong> for the duration of the relationship plus [X years] for legal and accounting purposes.</li>
              <li><strong>Lead data:</strong> retained while consent is valid and the lead is active in a partner's pipeline; deleted or anonymised [X months] after last engagement or on withdrawal of consent.</li>
              <li><strong>Cookie/analytics data:</strong> per the retention periods of each provider.</li>
            </ul>

            <h2>8. Cookies and tracking</h2>
            <p>We use cookies and pixels (including the Meta Pixel and Google tags) to measure campaign performance and attribute leads. Non-essential cookies are only set with your consent via our cookie banner. You can withdraw consent at any time in your browser settings.</p>

            <h2>9. Your rights under GDPR</h2>
            <p>If you are in the EEA, you have the right to: access your data; rectify it; erase it; restrict or object to processing; data portability; and to withdraw consent at any time. You also have the right to lodge a complaint with your local supervisory authority.</p>
            <p>To exercise any right, contact <a href="mailto:privacy@fbsintelligence.com">privacy@fbsintelligence.com</a>. We respond within one month.</p>

            <h2>10. Security</h2>
            <p>We apply appropriate technical and organisational measures to protect personal data, including encryption in transit, access controls, and vetted processors. No system is perfectly secure, but we work to protect your information and will notify you and the relevant authority of any qualifying breach as required by law.</p>

            <h2>11. Children</h2>
            <p>Our services are for businesses and adults. We do not knowingly collect data from anyone under 18.</p>

            <h2>12. Changes to this policy</h2>
            <p>We may update this policy. Material changes will be posted here with a revised "Last updated" date.</p>

            <h2>13. Contact</h2>
            <p>Questions about this policy or your data: <a href="mailto:privacy@fbsintelligence.com">privacy@fbsintelligence.com</a></p>

          </div>
        </section>

        <footer>
          <div className="footer-inner">
            <div className="footer-left"><span className="footer-dot" />© 2026 FBS Intelligence</div>
            <div className="footer-links">
              <a href="/">Home</a>
              <a href="/overview">How it works</a>
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
