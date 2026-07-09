import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --black:#0A0A0A; --off:#F4F4F2; --white:#FFFFFF;
    --lime:#AAFF45; --lime2:#8EE032; --lime-soft:#E8F5DF; --lime-dark:#5A8A20;
    --muted:#6B6B6B; --border:#E5E5E5; --dark:#0F0F0F; --text:#0A0A0A; --text2:#5A5A56;
  }
  html{scroll-behavior:smooth;}
  body{background:var(--white);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
  .wrap{max-width:1100px;margin:0 auto;padding:0 32px;}
  @keyframes pulseLime{0%,100%{box-shadow:0 0 0 0 rgba(170,255,69,0.5)}50%{box-shadow:0 0 0 10px rgba(170,255,69,0)}}
  @keyframes pingDot{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.4);opacity:0}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);}
  .nav-inner{display:flex;align-items:center;justify-content:space-between;height:62px;}
  .nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-0.02em;text-decoration:none;}
  .nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:pulseLime 2.5s ease-in-out infinite;}
  .nav-right{display:flex;align-items:center;gap:20px;}
  .nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);text-decoration:none;transition:color 0.15s;}
  .nav-link:hover{color:var(--black);}
  .nav-btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--black);color:var(--white);border:none;cursor:pointer;padding:9px 20px;border-radius:7px;font-family:'Inter',sans-serif;transition:all 0.15s;text-decoration:none;}
  .nav-btn:hover{background:var(--lime);color:var(--black);}
  .pricing-hero{padding:140px 0 80px;background:var(--white);border-bottom:1px solid var(--border);position:relative;overflow:hidden;text-align:center;}
  .pricing-hero::before{content:'';position:absolute;inset:0;background-image:linear-gradient(to right,rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,0.04) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);pointer-events:none;}
  .pricing-hero>.wrap{position:relative;z-index:2;}
  .pricing-eyebrow{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:24px;display:block;}
  .pricing-hero h1{font-size:clamp(40px,5.5vw,68px);font-weight:800;letter-spacing:-0.035em;line-height:1.02;color:var(--black);margin-bottom:20px;}
  .accent{position:relative;display:inline-block;}.accent::after{content:'';position:absolute;bottom:0;left:0;right:0;height:0.32em;background:var(--lime);z-index:-1;border-radius:2px;}
  .pricing-hero p{font-size:17px;color:var(--text2);max-width:520px;margin:0 auto 36px;line-height:1.65;}
  .setup-wrap{display:flex;justify-content:center;}
  .setup-banner{display:inline-flex;align-items:center;gap:20px;background:var(--off);border:1px solid var(--border);border-radius:14px;padding:20px 32px;}
  .setup-label{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:4px;}
  .setup-price{font-size:32px;font-weight:900;letter-spacing:-0.03em;color:var(--black);}
  .setup-note{font-size:13px;color:var(--muted);line-height:1.55;text-align:left;}
  .setup-div{width:1px;height:44px;background:var(--border);flex-shrink:0;}
  .billing-toggle{display:flex;align-items:center;justify-content:center;gap:12px;margin:40px 0 0;}
  .tgl-label{font-size:13px;font-weight:500;color:var(--muted);}
  .tgl-label.on{color:var(--black);font-weight:700;}
  .tgl-track{width:48px;height:26px;border-radius:13px;background:var(--border);position:relative;cursor:pointer;transition:background 0.2s;}
  .tgl-track.on{background:var(--black);}
  .tgl-thumb{width:20px;height:20px;border-radius:50%;background:var(--white);position:absolute;top:3px;left:3px;transition:transform 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.2);}
  .tgl-track.on .tgl-thumb{transform:translateX(22px);}
  .save-pill{background:var(--lime);color:var(--black);font-size:10px;font-weight:800;padding:3px 10px;border-radius:100px;letter-spacing:0.08em;}
  .plans-section{padding:72px 0 100px;background:var(--off);}
  .plans-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
  .plan-card{background:var(--white);border:1px solid var(--border);border-radius:20px;padding:40px 36px;display:flex;flex-direction:column;position:relative;overflow:hidden;transition:all 0.25s cubic-bezier(0.16,1,0.3,1);}
  .plan-card:hover{transform:translateY(-4px);box-shadow:0 20px 48px -12px rgba(0,0,0,0.1);border-color:var(--black);}
  .plan-card.popular{background:var(--black);border-color:var(--black);}
  .plan-card.popular::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--lime);}
  .plan-card.founding{background:var(--lime);border-color:var(--lime);box-shadow:0 16px 48px -8px rgba(170,255,69,0.35);}
  .plan-badge{display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border-radius:100px;margin-bottom:20px;width:fit-content;}
  .pb-b{background:var(--off);color:var(--muted);}
  .pb-p{background:var(--lime);color:var(--black);}
  .pb-f{background:rgba(0,0,0,0.12);color:var(--black);}
  .ping-dot{position:relative;width:6px;height:6px;flex-shrink:0;}
  .ping-dot::before{content:'';position:absolute;inset:0;background:var(--black);border-radius:50%;}
  .ping-dot::after{content:'';position:absolute;inset:0;background:var(--black);border-radius:50%;animation:pingDot 1.6s ease-out infinite;}
  .plan-name{font-size:24px;font-weight:800;letter-spacing:-0.02em;color:var(--black);margin-bottom:8px;}
  .plan-card.popular .plan-name{color:var(--white);}
  .plan-desc{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:28px;}
  .plan-card.popular .plan-desc{color:rgba(255,255,255,0.55);}
  .plan-card.founding .plan-desc{color:rgba(0,0,0,0.6);}
  .plan-price-row{display:flex;align-items:flex-end;gap:6px;margin-bottom:4px;}
  .plan-price{font-size:56px;font-weight:900;letter-spacing:-0.04em;color:var(--black);line-height:1;font-variant-numeric:tabular-nums;}
  .plan-card.popular .plan-price{color:var(--lime);}
  .plan-price-mo{font-size:16px;color:var(--muted);padding-bottom:10px;font-weight:500;}
  .plan-card.popular .plan-price-mo{color:rgba(255,255,255,0.4);}
  .plan-card.founding .plan-price-mo{color:rgba(0,0,0,0.5);}
  .plan-note{font-size:12px;color:var(--muted);margin-bottom:28px;}
  .plan-card.popular .plan-note{color:rgba(255,255,255,0.35);}
  .plan-card.founding .plan-note{color:rgba(0,0,0,0.5);}
  .save-txt{color:var(--lime-dark);font-weight:700;}
  .plan-card.popular .save-txt{color:var(--lime);}
  .plan-cta{width:100%;padding:15px;border-radius:10px;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.01em;transition:all 0.2s;margin-bottom:28px;}
  .plan-cta:hover{transform:translateY(-1px);}
  .cta-b{background:var(--black);color:var(--white);}.cta-b:hover{background:var(--lime);color:var(--black);}
  .cta-p{background:var(--lime);color:var(--black);}.cta-p:hover{opacity:0.88;box-shadow:0 8px 24px rgba(170,255,69,0.4);}
  .cta-f{background:var(--black);color:var(--lime);}.cta-f:hover{background:rgba(0,0,0,0.85);}
  .plan-hr{border:none;border-top:1px solid var(--border);margin-bottom:24px;}
  .plan-card.popular .plan-hr{border-color:rgba(255,255,255,0.1);}
  .plan-card.founding .plan-hr{border-color:rgba(0,0,0,0.15);}
  .features-label{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;}
  .plan-card.popular .features-label{color:rgba(255,255,255,0.35);}
  .plan-card.founding .features-label{color:rgba(0,0,0,0.45);}
  .features-list{list-style:none;display:flex;flex-direction:column;gap:11px;flex:1;}
  .feature-item{display:flex;align-items:flex-start;gap:10px;font-size:13px;line-height:1.5;color:var(--text);}
  .plan-card.popular .feature-item{color:rgba(255,255,255,0.82);}
  .plan-card.founding .feature-item{color:var(--black);}
  .fi{width:18px;height:18px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex-shrink:0;margin-top:1px;}
  .fi.yes{background:var(--lime-soft);color:var(--lime-dark);}
  .plan-card.popular .fi.yes{background:rgba(170,255,69,0.15);color:var(--lime);}
  .plan-card.founding .fi.yes{background:rgba(0,0,0,0.12);color:var(--black);}
  .fi.no{background:var(--off);color:var(--muted);}
  .plan-card.popular .fi.no{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.25);}
  .spots-row{display:flex;align-items:center;gap:10px;margin-top:20px;padding-top:18px;border-top:1px solid rgba(0,0,0,0.12);}
  .spots-dots{display:flex;gap:4px;}
  .spot{width:9px;height:9px;border-radius:50%;background:var(--black);}
  .spot.taken{background:rgba(0,0,0,0.2);}
  .spots-lbl{font-size:12px;font-weight:700;color:var(--black);}
  .leads-section{padding:96px 0;background:var(--white);border-bottom:1px solid var(--border);}
  .leads-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;margin-top:48px;}
  .lbar-row{display:flex;align-items:center;gap:16px;margin-bottom:14px;}
  .lbar-lbl{font-size:13px;font-weight:600;color:var(--black);min-width:90px;}
  .lbar-track{flex:1;height:36px;background:var(--off);border-radius:10px;overflow:hidden;}
  .lbar-fill{height:100%;border-radius:10px;display:flex;align-items:center;padding:0 16px;}
  .lbar-num{font-size:13px;font-weight:800;}
  .leads-text h3{font-size:clamp(22px,2.8vw,32px);font-weight:800;letter-spacing:-0.025em;color:var(--black);margin-bottom:16px;line-height:1.2;}
  .hl-u{position:relative;display:inline-block;}.hl-u::after{content:'';position:absolute;bottom:0;left:0;right:0;height:0.3em;background:var(--lime);z-index:-1;border-radius:2px;}
  .leads-text p{font-size:15px;color:var(--text2);line-height:1.7;margin-bottom:12px;}
  .leads-note{background:var(--off);border-left:3px solid var(--lime);padding:14px 18px;border-radius:0 8px 8px 0;font-size:13px;color:var(--text);line-height:1.6;margin-top:8px;}
  .leads-note strong{color:var(--black);font-weight:700;}
  .faq-section{padding:96px 0;background:var(--off);border-bottom:1px solid var(--border);}
  .faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:48px;}
  .faq-card{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:28px 24px;transition:all 0.2s;}
  .faq-card:hover{border-color:var(--black);transform:translateY(-2px);}
  .faq-card h4{font-size:15px;font-weight:700;color:var(--black);margin-bottom:10px;line-height:1.35;}
  .faq-card p{font-size:13px;color:var(--text2);line-height:1.7;}
  .faq-card p strong{color:var(--black);font-weight:600;}
  .bottom-cta{padding:100px 0;background:var(--dark);position:relative;overflow:hidden;text-align:center;}
  .bottom-cta::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:400px;background:radial-gradient(ellipse at center,rgba(170,255,69,0.2),transparent 60%);filter:blur(60px);pointer-events:none;}
  .bottom-cta>.wrap{position:relative;z-index:2;}
  .bottom-cta h2{font-size:clamp(32px,4.5vw,52px);font-weight:800;letter-spacing:-0.035em;color:var(--white);margin-bottom:14px;line-height:1.05;}
  .bottom-cta p{font-size:17px;color:#888;max-width:460px;margin:0 auto 32px;line-height:1.65;}
  .bottom-btn{background:var(--lime);color:var(--black);border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:15px;font-weight:800;padding:18px 40px;border-radius:10px;transition:all 0.2s;}
  .bottom-btn:hover{transform:translateY(-2px);box-shadow:0 16px 40px -8px rgba(170,255,69,0.5);}
  .overlay{position:fixed;inset:0;z-index:500;background:rgba(12,12,12,0.7);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px;animation:fadeIn 0.2s ease;}
  .modal{background:var(--white);border-radius:16px;padding:44px 40px;max-width:500px;width:100%;position:relative;animation:fadeUp 0.3s ease;max-height:90vh;overflow-y:auto;}
  .modal-close{position:absolute;top:16px;right:16px;background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;padding:4px 8px;border-radius:4px;}
  .modal-close:hover{background:var(--off);}
  .modal-badge{display:inline-block;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:14px;}
  .modal h2{font-size:24px;font-weight:800;color:var(--black);margin-bottom:6px;letter-spacing:-0.02em;}
  .modal-sub{font-size:14px;color:var(--text2);margin-bottom:28px;line-height:1.6;}
  .fields{display:flex;flex-direction:column;gap:10px;}
  .field-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .cf label{display:block;font-size:11px;font-weight:700;color:var(--muted);margin-bottom:5px;letter-spacing:0.04em;text-transform:uppercase;}
  .cf input,.cf select,.cf textarea{width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 14px;font-family:'Inter',sans-serif;font-size:13px;color:var(--black);background:var(--white);outline:none;transition:all 0.15s;}
  .cf input::placeholder,.cf textarea::placeholder{color:#aaa;}
  .cf input:focus,.cf select:focus,.cf textarea:focus{border-color:var(--black);box-shadow:0 0 0 3px rgba(170,255,69,0.2);}
  .cf textarea{resize:vertical;min-height:70px;}
  .sub-btn{width:100%;margin-top:8px;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;padding:15px;border-radius:8px;transition:all 0.15s;}
  .sub-btn:disabled{opacity:0.6;cursor:not-allowed;}
  .sub-btn:hover:not(:disabled){transform:translateY(-1px);}
  .modal-disc{font-size:11px;color:var(--muted);text-align:center;margin-top:10px;}
  .success-box{text-align:center;padding:20px 0;}
  .success-icon{width:56px;height:56px;background:var(--lime);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:var(--black);margin-bottom:16px;}
  .success-box h3{font-size:22px;font-weight:800;color:var(--black);margin-bottom:8px;letter-spacing:-0.02em;}
  .success-box p{font-size:14px;color:var(--text2);line-height:1.6;}
  @media(max-width:900px){.plans-grid,.leads-grid,.faq-grid{grid-template-columns:1fr;}}
  @media(max-width:600px){.setup-banner{flex-direction:column;gap:12px;text-align:center;}.setup-div{display:none;}.field-row{grid-template-columns:1fr;}}
`;

const ML = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMjkwMjI2ODdkNTJlNjk4ZjYwMzVkODk4YTI0MmFhMzgxNTlmMWQwMmRhN2ZlMDI2MGYxMTMzZGE0NWUyNDViZmQ1OTJiMjI5YjEzZjdjOTMiLCJpYXQiOjE3Nzc4MDQxNDEuMDU2ODcsIm5iZiI6MTc3NzgwNDE0MS4wNTY4NzMsImV4cCI6NDkzMzQ3Nzc0MS4wNTI3NTUsInN1YiI6IjkzMDA0MyIsInNjb3BlcyI6W119.Apd5ihW7N-KluBSDf-dovqu0O_Ia30wPUVjClBzRyOej5nne5be0poXt21OvB2PluTK4EyJO7ZBcOsitkoMG2Q6DSkjThmx0cjn-1APSFbWRAkp0VqXAljYyag-6LebecLKFjiSHNn5uAx441wje7CtSi4-qvb2UAIAYUX3El-upwv1TPges-H5dXbfvU0dOPOpStwNwg_neJOM1B7FyhZ8GOC2aVvaRkmsMJ_Q668dWd_1mhg21Bw35mXe6uzdQA90XENbpEjkn7ezw9Uv0jXDj-qHYs1EE6A08ulWRd-w2LERgr4MA_hJoz2IgjSn5cJWUfM-KtpGd9DxApaCZ_xbkx-zJRIQQXCQKC8WmDNLfDfjpsDGCMxdhcJ2j94fPX66aBNZTWq1DbEH4Z8SWGvgbwYdFEmBeUld552x8x_iGXRFLmicL6EOeng0bXmFlMwD2twukjkWsoVIQW8Vbdyza8XaNi-dtnDVLuMOqNhb2DDa0UbaHwW0DsEPPvHznrd2ut0zVtq-qr9MwiI1kAVwFcKgvJ5NXvjjXH0dgD0Z4iTn6KhHQuGoTav6vQazCsmtG0iicIvbVNcz_eXbi7G2sr_uUQZxRP_G2E-hya_NsnZmspqsTr4JRTckWgrTBYYH1QK8Zbd-cTPNx9y3vDlmsQx_N_5UG1JHIvQGBb2U";
const JURS = ["Portugal","Malta","Cyprus","Greece","UAE","Singapore","Malaysia","Australia / NZ","USA (EB-5)","Paraguay","St. Kitts & Nevis","Dominica","Grenada","Antigua","Türkiye","Mexico","Other"];

const PLANS = [
  {id:"business",badge:"Business",bc:"pb-b",name:"Business",desc:"Shared pool access. Pre-qualified leads matched to your jurisdiction from day one.",monthly:499,annual:429,ctaCls:"cta-b",ctaText:"Apply for Business",popular:false,founding:false,features:[{t:"15–20 matched leads / month",y:true},{t:"Shared pool (up to 5 firms per jurisdiction)",y:true},{t:"Global Mobility Score + full breakdown",y:true},{t:"Advisor Brief per lead",y:true},{t:"Basic audience intelligence",y:true},{t:"CRM integration (HubSpot, Salesforce, Pipedrive)",y:true},{t:"Email onboarding support",y:true},{t:"Exclusive lead feed",y:false},{t:"Full intelligence + ICP persona",y:false},{t:"Quarterly ICP review call",y:false}]},
  {id:"premium",badge:"Most Popular",bc:"pb-p",name:"Premium",desc:"Exclusive feed + full intelligence. For firms that want a genuine edge in their market.",monthly:899,annual:769,ctaCls:"cta-p",ctaText:"Apply for Premium",popular:true,founding:false,features:[{t:"30–40 leads/month (shared + exclusive feed)",y:true},{t:"Exclusive feed — not visible to other firms",y:true},{t:"Global Mobility Score + full breakdown",y:true},{t:"Advisor Brief per lead",y:true},{t:"Full audience intelligence layer",y:true},{t:"Auto-updated ICP persona",y:true},{t:"CRM integration (HubSpot, Salesforce, Pipedrive)",y:true},{t:"Quarterly ICP review call",y:true},{t:"Priority onboarding",y:true}]},
  {id:"founding",badge:"Founding Partner · 10 spots",bc:"pb-f",name:"Founding Partner",desc:"Lock Premium pricing for 12 months. Plus referral commission and direct founder access.",monthly:699,annual:null,ctaCls:"cta-f",ctaText:"Claim Founding Spot",popular:false,founding:true,spots:10,taken:4,features:[{t:"Everything in Premium",y:true},{t:"Price locked at $699/mo for 12 months",y:true},{t:"15% referral commission on partners you bring",y:true},{t:"Co-branded in FBS Intelligence marketing",y:true},{t:"Direct access to founders",y:true},{t:"Input on product roadmap",y:true},{t:"Setup fee $990 (20% discount)",y:true}]}
];

const FAQ = [
  {q:"What is the setup fee?",a:"A one-time fee of <strong>$1,250</strong> ($990 for Founding Partners). Covers ICP build, dashboard configuration, jurisdiction filters, and your onboarding call."},
  {q:"How do leads work without an event?",a:"FBS runs continuous paid acquisition campaigns targeting global mobility intent. Prospects complete the Global Mobility Survey, pass intent verification, get scored, and route to your dashboard."},
  {q:"What does 'exclusive feed' mean?",a:"Premium and Founding Partners receive leads that bypass the shared pool entirely. Only your firm sees them — other partners never do."},
  {q:"What counts as a 'lead'?",a:"Every lead has completed a 14-question Global Mobility Survey, passed intent verification, and received a Global Mobility Score (0–100). You get a full Advisor Brief."},
  {q:"Can I switch plans?",a:"Yes. Upgrade from Business to Premium any time — price difference charged pro-rata. Downgrade at end of billing period."},
  {q:"Minimum commitment?",a:"Month-to-month on both plans. Annual billing saves 15%. Founding Partner price locked for 12 months."},
  {q:"Lead volume guarantee?",a:"<strong>15 leads/month minimum</strong> on Business, <strong>30 on Premium</strong>. If we fall short, we credit the difference to the following month."},
  {q:"CRM integrations?",a:"HubSpot, Salesforce, Pipedrive, Zoho, Airtable. Custom webhooks on Premium and Founding Partner tiers."}
];

function Modal({plan,annual,onClose}) {
  const [done,setDone]=useState(false);
  const [busy,setBusy]=useState(false);
  const [form,setForm]=useState({name:"",email:"",company:"",phone:"",jurisdiction:"",message:""});
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const submit=async()=>{
    if(!form.name||!form.email||!form.company)return;
    setBusy(true);
    try{
      const parts=form.name.trim().split(" ");
      const r=await fetch("https://connect.mailerlite.com/api/subscribers",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+ML},body:JSON.stringify({email:form.email,fields:{name:parts[0]||"",last_name:parts.slice(1).join(" ")||"",company:form.company,phone:form.phone||"",city:form.jurisdiction||"",country:plan?.name||""}})});
      const d=await r.json();const sid=d?.data?.id;
      if(sid){const gr=await fetch("https://connect.mailerlite.com/api/groups?limit=50",{headers:{"Authorization":"Bearer "+ML}});const gd=await gr.json();const g=gd?.data?.find(x=>x.name==="FBS Intelligence Landing");if(g)await fetch("https://connect.mailerlite.com/api/subscribers/"+sid+"/groups/"+g.id,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+ML}});}
    }catch(e){console.error(e);}
    setBusy(false);setDone(true);
  };
  const price=annual&&plan?.annual?plan.annual:plan?.monthly;
  const bb=plan?.founding?"#AAFF45":plan?.popular?"#0A0A0A":"#F4F4F2";
  const bc=plan?.founding?"#0A0A0A":plan?.popular?"#AAFF45":"#6B6B6B";
  return(<div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}><div className="modal"><button className="modal-close" onClick={onClose}>✕</button>{!done?(<><div className="modal-badge" style={{background:bb,color:bc}}>{plan?.name}</div><h2>Apply for {plan?.name}</h2><p className="modal-sub"><strong>${price}/mo</strong> + one-time setup <strong>${plan?.founding?"990":"1,250"}</strong>. We review within 24 hours.</p><div className="fields"><div className="field-row"><div className="cf"><label>Full name</label><input value={form.name} onChange={set("name")} placeholder="Your name"/></div><div className="cf"><label>Business email</label><input type="email" value={form.email} onChange={set("email")} placeholder="you@firm.com"/></div></div><div className="cf"><label>Firm / company</label><input value={form.company} onChange={set("company")} placeholder="Company name"/></div><div className="field-row"><div className="cf"><label>Phone (optional)</label><input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000"/></div><div className="cf"><label>Primary jurisdiction</label><select value={form.jurisdiction} onChange={set("jurisdiction")}><option value="">Select…</option>{JURS.map(j=><option key={j}>{j}</option>)}</select></div></div><div className="cf"><label>Anything to add?</label><textarea value={form.message} onChange={set("message")} placeholder="Tell us about your practice…"/></div><button className="sub-btn" style={{background:plan?.founding?"#AAFF45":"#0A0A0A",color:plan?.founding?"#0A0A0A":"#AAFF45"}} onClick={submit} disabled={busy}>{busy?"Submitting…":"Apply for "+plan?.name+" →"}</button><div className="modal-disc">By submitting you agree to be contacted. We don't share your data.</div></div></>):(<div className="success-box"><div className="success-icon">✓</div><h3>Application received</h3><p>We'll review your profile within 24 hours and reach out with next steps.</p></div>)}</div></div>);
}

export default function PricingPage() {
  const [annual,setAnnual]=useState(false);
  const [modal,setModal]=useState(null);
  return(<><style>{css}</style>
    <nav><div className="wrap nav-inner"><a href="/" className="nav-logo"><div className="nav-logo-dot"/>FBS Intelligence</a><div className="nav-right"><a href="/" className="nav-link">Home</a><a href="/overview" className="nav-link">Overview</a><a href="/pricing" className="nav-link" style={{color:"var(--black)",fontWeight:700}}>Pricing</a><a href="/#apply" className="nav-btn">Apply</a></div></div></nav>
    <section className="pricing-hero"><div className="wrap"><span className="pricing-eyebrow">Transparent Pricing</span><h1>Simple plans.<br/><span className="accent">Real leads.</span></h1><p>No hidden fees. No long-term lock-in. Start receiving pre-qualified investment migration leads within 7 days of onboarding.</p><div className="setup-wrap"><div className="setup-banner"><div><div className="setup-label">One-time setup fee</div><div className="setup-price">$1,250</div></div><div className="setup-div"/><div className="setup-note">ICP build, dashboard setup,<br/>jurisdiction filters + onboarding call.<br/><strong style={{color:"#5A8A20"}}>Founding Partners pay $990.</strong></div></div></div><div className="billing-toggle"><span className={"tgl-label"+(annual?"":" on")}>Monthly</span><div className={"tgl-track"+(annual?" on":"")} onClick={()=>setAnnual(a=>!a)}><div className="tgl-thumb"/></div><span className={"tgl-label"+(annual?" on":"")}>Annual</span><span className="save-pill">SAVE 15%</span></div></div></section>
    <section className="plans-section"><div className="wrap"><div className="plans-grid">{PLANS.map(plan=>{const price=annual&&plan.annual?plan.annual:plan.monthly;return(<div key={plan.id} className={"plan-card"+(plan.popular?" popular":"")+(plan.founding?" founding":"")}><div className={"plan-badge "+plan.bc}>{(plan.popular||plan.founding)&&<span className="ping-dot"/>}{plan.badge}</div><div className="plan-name">{plan.name}</div><div className="plan-desc">{plan.desc}</div><div className="plan-price-row"><div className="plan-price">${price}</div><div className="plan-price-mo">/mo</div></div><div className="plan-note">{plan.founding?"Price locked for 12 months":annual?<span>Billed annually · <span className="save-txt">save ${(plan.monthly-price)*12}/yr</span></span>:"Billed monthly · switch anytime"}</div><button className={"plan-cta "+plan.ctaCls} onClick={()=>setModal(plan)}>{plan.ctaText}</button><hr className="plan-hr"/><div className="features-label">What's included</div><ul className="features-list">{plan.features.map((f,i)=><li key={i} className="feature-item"><span className={"fi "+(f.y?"yes":"no")}>{f.y?"✓":"–"}</span><span>{f.t}</span></li>)}</ul>{plan.founding&&<div className="spots-row"><div className="spots-dots">{Array.from({length:plan.spots}).map((_,i)=><div key={i} className={"spot"+(i<plan.taken?" taken":"")}/>)}</div><div className="spots-lbl">{plan.spots-plan.taken} of {plan.spots} spots remaining</div></div>}</div>);})}</div></div></section>
    <section className="leads-section"><div className="wrap"><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{width:24,height:1,background:"#888",opacity:0.4}}/><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#888"}}>Lead Volume</div></div><div className="leads-grid"><div><h3 style={{fontSize:"clamp(22px,2.6vw,30px)",fontWeight:800,letterSpacing:"-0.025em",marginBottom:28,color:"#0A0A0A",lineHeight:1.2}}>How many leads<br/>do you receive?</h3>{[{lbl:"Business",pct:50,bg:"#E5E5E5",tc:"#0A0A0A",n:"15–20 leads"},{lbl:"Premium",pct:90,bg:"#0A0A0A",tc:"#AAFF45",n:"30–40 leads"},{lbl:"Founding",pct:90,bg:"#AAFF45",tc:"#0A0A0A",n:"30–40 leads"}].map(d=><div key={d.lbl} className="lbar-row"><div className="lbar-lbl">{d.lbl}</div><div className="lbar-track"><div className="lbar-fill" style={{width:d.pct+"%",background:d.bg}}><span className="lbar-num" style={{color:d.tc}}>{d.n}</span></div></div></div>)}</div><div className="leads-text"><h3>Every lead is <span className="hl-u">verified and scored</span> before it reaches you.</h3><p>These aren't form fills. Every lead has completed a 14-question intake, passed intent verification, and received a Global Mobility Score across 6 dimensions.</p><p>You receive a full Advisor Brief: profile, capital range, timeline, family situation, programme preference, and the prospect's own words on why now.</p><div className="leads-note"><strong>Minimum guarantee:</strong> 15 leads/month on Business, 30 on Premium. If we fall short, we credit the difference.</div></div></div></div></section>
    <section className="faq-section"><div className="wrap"><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{width:24,height:1,background:"#888",opacity:0.4}}/><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#888"}}>Common Questions</div></div><h2 style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:800,letterSpacing:"-0.03em",marginBottom:40,color:"#0A0A0A"}}>Everything you need to know</h2><div className="faq-grid">{FAQ.map((f,i)=><div key={i} className="faq-card"><h4>{f.q}</h4><p dangerouslySetInnerHTML={{__html:f.a}}/></div>)}</div></div></section>
    <section className="bottom-cta"><div className="wrap"><h2>Ready to start?</h2><p>Submit your application — reviewed in 24 hours, live in 7 days.</p><button className="bottom-btn" onClick={()=>setModal(PLANS[1])}>Apply for Premium →</button><div style={{marginTop:16,display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap"}}>{["No credit card now","24h review","First leads in 7 days"].map(t=><span key={t} style={{fontSize:12,color:"#555",display:"inline-flex",alignItems:"center",gap:6}}><span style={{color:"#AAFF45",fontWeight:900}}>✓</span> {t}</span>)}</div></div></section>
    {modal&&<Modal plan={modal} annual={annual} onClose={()=>setModal(null)}/>}
  </>);
}
