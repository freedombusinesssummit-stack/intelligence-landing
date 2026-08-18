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

export default function Terms() {
  useEffect(() => { document.title = "Terms of Service · FBS Intelligence"; }, []);
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
            <h1 className="legal-title">Terms of Service</h1>
            <p className="legal-updated">Last updated: [DATE] · Effective: [DATE]</p>
          </div>
        </section>

        <section className="legal-body">
          <div className="wrap">

            <div className="legal-callout">
              <p><strong>Placeholder notice:</strong> This template must be reviewed by a qualified lawyer before publication. Replace every [BRACKETED] field. The commercial terms below (fees, refunds, term length) must match your actual partner agreement.</p>
            </div>

            <h2>1. Agreement</h2>
            <p>These Terms of Service ("Terms") govern your use of the website and services provided by [LEGAL ENTITY NAME] ("FBS Intelligence", "we", "us"), a company registered in [EU COUNTRY] under number [REG. NUMBER]. By applying, purchasing, or using our services, you agree to these Terms.</p>

            <h2>2. What we provide</h2>
            <p>FBS Intelligence builds and operates lead-generation funnels for firms in the investment-migration sector. Our service includes funnel creation, paid campaign management, prospect qualification through the Global Mobility Survey and AI scoring, and delivery of qualified leads to a partner dashboard.</p>
            <p>We provide qualified leads. <strong>We do not guarantee that any lead will convert into a client, sale, or revenue.</strong> Conversion depends on your firm's follow-up, offer, and many factors outside our control.</p>

            <h2>3. Eligibility</h2>
            <p>Our services are for businesses only. By applying, you confirm you are authorised to enter into this agreement on behalf of your firm, and that your firm operates lawfully in the investment-migration or related advisory sector.</p>

            <h2>4. Fees and payment</h2>
            <ul>
              <li><strong>Setup fee</strong> — a one-time fee to build and launch your funnel, invoiced after the discovery call. [CONFIRM AMOUNT / that it matches the Pricing page.]</li>
              <li><strong>Monthly subscription</strong> — recurring fee for ongoing lead delivery and campaign management, billed [monthly/in advance].</li>
              <li><strong>Media budget</strong> — paid by you directly to the advertising platforms. It is not included in our fees.</li>
            </ul>
            <p>All fees are exclusive of VAT unless stated. Late or failed payments may result in suspension of the service. [CONFIRM specific payment terms and late-payment provisions with counsel.]</p>

            <h2>5. Term, minimum commitment, and cancellation</h2>
            <p>The monthly subscription runs for a minimum initial term of [X months], after which it continues month to month until cancelled with [X days'] written notice. [CONFIRM exact minimum term and notice period.]</p>
            <p>The setup fee is non-refundable once funnel production has begun. [CONFIRM refund policy.]</p>

            <h2>6. Exclusivity</h2>
            <p>Each partner receives leads exclusively for their jurisdiction and their offer. We do not deliver the same lead to more than one partner. Exclusivity is scoped as described in your partner agreement and does not prevent us from serving other firms in different jurisdictions or with different offers.</p>

            <h2>7. Infrastructure and data</h2>
            <p>The funnel infrastructure — landing pages, survey logic, automation, and campaign assets — remains owned and operated by FBS Intelligence. You receive the leads and may export your lead data. If the subscription ends, your access to the infrastructure ends, but you keep the lead records already delivered to you.</p>
            <p>You are responsible for handling delivered personal data in compliance with GDPR and applicable law, including obtaining any further consents you require for your own processing.</p>

            <h2>8. Your responsibilities</h2>
            <ul>
              <li>Follow up with delivered leads lawfully and professionally</li>
              <li>Maintain your own media budget with the ad platforms</li>
              <li>Provide accurate information about your firm, offer, and jurisdiction</li>
              <li>Not misuse, resell, or redistribute leads outside your firm</li>
              <li>Comply with all advertising, financial-promotion, and immigration-advisory regulations that apply to your firm</li>
            </ul>

            <h2>9. Acceptable use</h2>
            <p>You may not use our services to engage in unlawful, deceptive, or harmful activity, to misrepresent programmes or outcomes to prospects, or to breach the terms of any advertising platform. We may suspend or terminate service for breach.</p>

            <h2>10. Intellectual property</h2>
            <p>All content, software, scoring models, and materials we create remain our intellectual property. You receive a limited, non-transferable right to use the delivered leads and dashboard for your firm's own business during the subscription.</p>

            <h2>11. Disclaimers</h2>
            <p>The service is provided "as is". We make no warranty as to lead volume, conversion rates, or revenue. Lead volume and speed depend on media budget, jurisdiction demand, offer strength, and your follow-up capacity, and are not guaranteed.</p>

            <h2>12. Limitation of liability</h2>
            <p>To the maximum extent permitted by law, our total liability arising from the service is limited to the fees you paid us in the [three/six] months preceding the claim. We are not liable for indirect, incidental, or consequential losses, including lost profits or lost business. [CONFIRM liability cap with counsel.]</p>

            <h2>13. Indemnity</h2>
            <p>You agree to indemnify us against claims arising from your use of delivered leads, your follow-up practices, or your breach of these Terms or applicable law.</p>

            <h2>14. Governing law and disputes</h2>
            <p>These Terms are governed by the laws of [EU COUNTRY]. Disputes are subject to the exclusive jurisdiction of the courts of [CITY, COUNTRY]. [CONFIRM governing law and forum.]</p>

            <h2>15. Changes</h2>
            <p>We may update these Terms. Material changes will be posted here with a revised date and, where required, notified to active partners.</p>

            <h2>16. Contact</h2>
            <p>Questions about these Terms: <a href="mailto:legal@fbsintelligence.com">legal@fbsintelligence.com</a></p>

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
