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
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

  nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);}
  .nav-inner{display:flex;align-items:center;justify-content:space-between;height:62px;}
  .nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-0.02em;text-decoration:none;}
  .nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:pulseLime 2.5s ease-in-out infinite;}
  .nav-right{display:flex;align-items:center;gap:20px;}
  .nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);text-decoration:none;transition:color 0.15s;}
  .nav-link:hover,.nav-link.active{color:var(--black);}
  .nav-btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--black);color:var(--white);border:none;cursor:pointer;padding:9px 20px;border-radius:7px;font-family:'Inter',sans-serif;transition:all 0.15s;text-decoration:none;}
  .nav-btn:hover{background:var(--lime);color:var(--black);}

  /* HERO */
  .hero{padding:130px 0 72px;background:var(--white);border-bottom:1px solid var(--border);position:relative;overflow:hidden;text-align:center;}
  .hero::before{content:'';position:absolute;inset:0;background-image:linear-gradient(to right,rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,0.04) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);pointer-events:none;}
  .hero>.wrap{position:relative;z-index:2;}
  .eyebrow-pill{display:inline-flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--border);border-radius:100px;padding:5px 14px 5px 6px;margin-bottom:24px;font-size:12px;font-weight:500;color:var(--text);}
  .eyebrow-pill-dot{background:var(--lime);color:var(--black);font-size:10px;font-weight:800;padding:3px 10px;border-radius:100px;letter-spacing:0.08em;}
  .hero h1{font-size:clamp(38px,5vw,64px);font-weight:800;letter-spacing:-0.035em;line-height:1.02;color:var(--black);margin-bottom:16px;}
  .accent{position:relative;display:inline-block;}.accent::after{content:'';position:absolute;bottom:0;left:0;right:0;height:0.32em;background:var(--lime);z-index:-1;border-radius:2px;}
  .hero p{font-size:17px;color:var(--text2);max-width:520px;margin:0 auto 40px;line-height:1.65;}

  /* SETUP FEE HERO BANNER */
  .setup-hero{display:inline-flex;align-items:stretch;gap:0;background:var(--off);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:0;}
  .setup-main{padding:28px 36px;text-align:left;}
  .setup-tag{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:10px;}
  .setup-price-row{display:flex;align-items:flex-end;gap:8px;margin-bottom:6px;}
  .setup-price{font-size:52px;font-weight:900;letter-spacing:-0.04em;color:var(--black);line-height:1;font-variant-numeric:tabular-nums;}
  .setup-price-label{font-size:15px;color:var(--muted);padding-bottom:10px;font-weight:500;}
  .setup-desc{font-size:13px;color:var(--text2);line-height:1.5;}
  .setup-includes{padding:28px 32px;background:var(--white);border-left:1px solid var(--border);text-align:left;display:flex;flex-direction:column;justify-content:center;gap:10px;min-width:260px;}
  .setup-includes-label{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;}
  .setup-item{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--text);}
  .setup-check{width:18px;height:18px;border-radius:5px;background:var(--lime);color:var(--black);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex-shrink:0;}

  /* PLANS */
  .plans-section{padding:72px 0 100px;background:var(--off);}
  .plans-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:880px;margin:0 auto;}

  .plan-card{background:var(--white);border:1px solid var(--border);border-radius:22px;padding:44px 40px;display:flex;flex-direction:column;position:relative;overflow:hidden;transition:all 0.25s cubic-bezier(0.16,1,0.3,1);}
  .plan-card:hover{transform:translateY(-5px);box-shadow:0 24px 56px -12px rgba(0,0,0,0.12);border-color:rgba(0,0,0,0.3);}
  .plan-card.premium{background:var(--black);border-color:var(--black);}
  .plan-card.premium::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--lime);}
  .plan-card.premium:hover{box-shadow:0 24px 56px -12px rgba(170,255,69,0.25);}

  .plan-badge{display:inline-flex;align-items:center;gap:7px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:4px 12px;border-radius:100px;margin-bottom:24px;width:fit-content;}
  .pb-business{background:var(--off);color:var(--muted);border:1px solid var(--border);}
  .pb-premium{background:var(--lime);color:var(--black);}
  .ping-dot{position:relative;width:6px;height:6px;flex-shrink:0;}
  .ping-dot::before{content:'';position:absolute;inset:0;background:var(--black);border-radius:50%;}
  .ping-dot::after{content:'';position:absolute;inset:0;background:var(--black);border-radius:50%;animation:pingDot 1.6s ease-out infinite;}

  .plan-name{font-size:28px;font-weight:800;letter-spacing:-0.025em;color:var(--black);margin-bottom:10px;}
  .plan-card.premium .plan-name{color:var(--white);}

  .plan-tagline{font-size:14px;color:var(--text2);line-height:1.6;margin-bottom:32px;min-height:44px;}
  .plan-card.premium .plan-tagline{color:rgba(255,255,255,0.55);}

  .plan-price-block{margin-bottom:8px;}
  .plan-price-row{display:flex;align-items:flex-end;gap:8px;}
  .plan-price{font-size:64px;font-weight:900;letter-spacing:-0.04em;color:var(--black);line-height:1;font-variant-numeric:tabular-nums;}
  .plan-card.premium .plan-price{color:var(--lime);}
  .plan-price-mo{font-size:17px;color:var(--muted);padding-bottom:12px;font-weight:500;}
  .plan-card.premium .plan-price-mo{color:rgba(255,255,255,0.4);}
  .plan-price-note{font-size:13px;color:var(--muted);margin-bottom:32px;line-height:1.5;}
  .plan-card.premium .plan-price-note{color:rgba(255,255,255,0.35);}
  .plan-price-note .plus{color:var(--black);font-weight:700;}
  .plan-card.premium .plan-price-note .plus{color:var(--lime);font-weight:700;}

  .plan-cta{width:100%;padding:16px;border-radius:10px;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.01em;transition:all 0.2s;margin-bottom:32px;}
  .plan-cta:hover{transform:translateY(-1px);}
  .cta-business{background:var(--black);color:var(--white);}
  .cta-business:hover{background:var(--lime);color:var(--black);}
  .cta-premium{background:var(--lime);color:var(--black);}
  .cta-premium:hover{opacity:0.88;box-shadow:0 10px 28px rgba(170,255,69,0.4);}

  .plan-hr{border:none;border-top:1px solid var(--border);margin-bottom:28px;}
  .plan-card.premium .plan-hr{border-color:rgba(255,255,255,0.1);}

  .features-label{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:16px;}
  .plan-card.premium .features-label{color:rgba(255,255,255,0.35);}

  .features-list{list-style:none;display:flex;flex-direction:column;gap:12px;flex:1;}
  .fi-row{display:flex;align-items:flex-start;gap:11px;font-size:13px;line-height:1.5;color:var(--text);}
  .plan-card.premium .fi-row{color:rgba(255,255,255,0.82);}
  .fi-icon{width:18px;height:18px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex-shrink:0;margin-top:1px;}
  .fi-yes{background:var(--lime-soft);color:var(--lime-dark);}
  .plan-card.premium .fi-yes{background:rgba(170,255,69,0.15);color:var(--lime);}
  .fi-no{background:var(--off);color:var(--muted);}
  .plan-card.premium .fi-no{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.25);}

  /* COMPARISON TABLE */
  .compare-section{padding:96px 0;background:var(--white);border-bottom:1px solid var(--border);}
  .compare-table{width:100%;border-collapse:collapse;margin-top:48px;}
  .compare-table th{padding:16px 20px;text-align:left;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid var(--border);}
  .compare-table th.plan-col{text-align:center;width:180px;}
  .compare-table th.plan-col.highlight{color:var(--black);}
  .compare-table td{padding:16px 20px;border-bottom:1px solid var(--border);font-size:14px;color:var(--text);}
  .compare-table td.plan-col{text-align:center;}
  .compare-table tr:hover td{background:var(--off);}
  .compare-table tr:last-child td{border-bottom:none;}
  .compare-table .section-row td{background:var(--off);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);padding:10px 20px;}
  .c-check{display:inline-flex;width:22px;height:22px;border-radius:50%;background:var(--lime);color:var(--black);align-items:center;justify-content:center;font-size:11px;font-weight:800;}
  .c-dash{color:var(--border);font-size:20px;line-height:1;}
  .c-val{font-size:13px;font-weight:700;color:var(--black);}
  .c-val.lime{color:var(--lime-dark);}

  /* HOW IT WORKS — 2 models */
  .models-section{padding:96px 0;background:var(--off);border-bottom:1px solid var(--border);}
  .models-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:48px;}
  .model-card{background:var(--white);border:1px solid var(--border);border-radius:18px;padding:36px;transition:all 0.2s;}
  .model-card:hover{border-color:var(--black);}
  .model-card.dark{background:var(--black);border-color:var(--black);}
  .model-num{display:inline-flex;width:32px;height:32px;border-radius:8px;background:var(--lime);color:var(--black);align-items:center;justify-content:center;font-size:13px;font-weight:800;margin-bottom:20px;}
  .model-card.dark .model-num{background:rgba(170,255,69,0.15);color:var(--lime);}
  .model-plan{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:8px;}
  .model-card.dark .model-plan{color:var(--lime);}
  .model-card h3{font-size:22px;font-weight:800;color:var(--black);margin-bottom:14px;letter-spacing:-0.02em;line-height:1.2;}
  .model-card.dark h3{color:var(--white);}
  .model-card p{font-size:14px;color:var(--text2);line-height:1.7;margin-bottom:20px;}
  .model-card.dark p{color:#AAA;}
  .model-flow{display:flex;flex-direction:column;gap:10px;padding-top:20px;border-top:1px solid var(--border);}
  .model-card.dark .model-flow{border-color:rgba(255,255,255,0.1);}
  .model-flow-item{display:flex;align-items:center;gap:12px;font-size:13px;color:var(--text);}
  .model-card.dark .model-flow-item{color:rgba(255,255,255,0.75);}
  .model-flow-icon{width:28px;height:28px;border-radius:8px;background:var(--off);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
  .model-card.dark .model-flow-icon{background:rgba(255,255,255,0.08);}

  /* AD BUDGET CALLOUT */
  .budget-callout{background:linear-gradient(135deg,var(--black),#1a1a1a);border-radius:16px;padding:36px 40px;margin-top:32px;display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center;}
  .budget-callout h4{font-size:20px;font-weight:800;color:var(--white);letter-spacing:-0.02em;margin-bottom:10px;}
  .budget-callout p{font-size:14px;color:#AAA;line-height:1.65;}
  .budget-callout p strong{color:var(--lime);font-weight:700;}
  .budget-ranges{display:flex;flex-direction:column;gap:8px;flex-shrink:0;}
  .budget-range{display:flex;align-items:center;gap:12px;padding:10px 16px;background:rgba(255,255,255,0.06);border-radius:8px;}
  .budget-range-label{font-size:11px;font-weight:700;letter-spacing:0.08em;color:rgba(255,255,255,0.5);text-transform:uppercase;min-width:80px;}
  .budget-range-val{font-size:14px;font-weight:700;color:var(--lime);}

  /* FAQ */
  .faq-section{padding:96px 0;background:var(--white);border-bottom:1px solid var(--border);}
  .faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:48px;}
  .faq-card{background:var(--off);border:1px solid var(--border);border-radius:14px;padding:28px 24px;transition:all 0.2s;}
  .faq-card:hover{border-color:var(--black);background:var(--white);}
  .faq-card h4{font-size:15px;font-weight:700;color:var(--black);margin-bottom:10px;line-height:1.35;}
  .faq-card p{font-size:13px;color:var(--text2);line-height:1.7;}
  .faq-card p strong{color:var(--black);font-weight:600;}

  /* BOTTOM CTA */
  .bottom-cta{padding:96px 0;background:var(--dark);position:relative;overflow:hidden;text-align:center;}
  .bottom-cta::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:400px;background:radial-gradient(ellipse at center,rgba(170,255,69,0.18),transparent 60%);filter:blur(60px);pointer-events:none;}
  .bottom-cta>.wrap{position:relative;z-index:2;}
  .bottom-cta h2{font-size:clamp(30px,4vw,48px);font-weight:800;letter-spacing:-0.03em;color:var(--white);margin-bottom:14px;line-height:1.08;}
  .bottom-cta p{font-size:17px;color:#888;max-width:460px;margin:0 auto 32px;line-height:1.65;}
  .btn-lime{background:var(--lime);color:var(--black);border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:15px;font-weight:800;padding:18px 40px;border-radius:10px;transition:all 0.2s;display:inline-block;text-decoration:none;}
  .btn-lime:hover{transform:translateY(-2px);box-shadow:0 16px 40px -8px rgba(170,255,69,0.5);}

  /* MODAL */
  .overlay{position:fixed;inset:0;z-index:500;background:rgba(12,12,12,0.75);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px;animation:fadeIn 0.2s ease;}
  .modal{background:var(--white);border-radius:18px;padding:44px 40px;max-width:520px;width:100%;position:relative;animation:fadeUp 0.3s ease;max-height:90vh;overflow-y:auto;}
  .modal-close{position:absolute;top:16px;right:16px;background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;padding:4px 8px;border-radius:4px;}
  .modal-close:hover{background:var(--off);}
  .modal-plan-tag{display:inline-block;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:14px;}
  .modal h2{font-size:24px;font-weight:800;color:var(--black);margin-bottom:6px;letter-spacing:-0.02em;}
  .modal-sub{font-size:14px;color:var(--text2);margin-bottom:28px;line-height:1.6;}
  .fields{display:flex;flex-direction:column;gap:10px;}
  .field-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .cf label{display:block;font-size:11px;font-weight:700;color:var(--muted);margin-bottom:5px;letter-spacing:0.04em;text-transform:uppercase;}
  .cf input,.cf select,.cf textarea{width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 14px;font-family:'Inter',sans-serif;font-size:13px;color:var(--black);background:var(--white);outline:none;transition:all 0.15s;}
  .cf input::placeholder,.cf textarea::placeholder{color:#bbb;}
  .cf input:focus,.cf select:focus,.cf textarea:focus{border-color:var(--black);box-shadow:0 0 0 3px rgba(170,255,69,0.2);}
  .cf textarea{resize:vertical;min-height:72px;}
  .sub-btn{width:100%;margin-top:8px;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;padding:16px;border-radius:8px;transition:all 0.15s;}
  .sub-btn:disabled{opacity:0.6;cursor:not-allowed;}
  .sub-btn:hover:not(:disabled){transform:translateY(-1px);}
  .modal-disc{font-size:11px;color:var(--muted);text-align:center;margin-top:10px;}
  .success-box{text-align:center;padding:24px 0;}
  .success-ico{width:56px;height:56px;background:var(--lime);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:var(--black);margin-bottom:16px;}
  .success-box h3{font-size:22px;font-weight:800;color:var(--black);margin-bottom:8px;letter-spacing:-0.02em;}
  .success-box p{font-size:14px;color:var(--text2);line-height:1.6;}

  @media(max-width:900px){.plans-grid,.models-grid,.faq-grid{grid-template-columns:1fr;}.budget-callout{grid-template-columns:1fr;}.compare-table{font-size:13px;}.setup-hero{flex-direction:column;text-align:center;}.setup-includes{border-left:none;border-top:1px solid var(--border);}}
  @media(max-width:600px){.field-row{grid-template-columns:1fr;}.compare-table th.plan-col,.compare-table td.plan-col{width:100px;}}
`;

const ML = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMjkwMjI2ODdkNTJlNjk4ZjYwMzVkODk4YTI0MmFhMzgxNTlmMWQwMmRhN2ZlMDI2MGYxMTMzZGE0NWUyNDViZmQ1OTJiMjI5YjEzZjdjOTMiLCJpYXQiOjE3Nzc4MDQxNDEuMDU2ODcsIm5iZiI6MTc3NzgwNDE0MS4wNTY4NzMsImV4cCI6NDkzMzQ3Nzc0MS4wNTI3NTUsInN1YiI6IjkzMDA0MyIsInNjb3BlcyI6W119.Apd5ihW7N-KluBSDf-dovqu0O_Ia30wPUVjClBzRyOej5nne5be0poXt21OvB2PluTK4EyJO7ZBcOsitkoMG2Q6DSkjThmx0cjn-1APSFbWRAkp0VqXAljYyag-6LebecLKFjiSHNn5uAx441wje7CtSi4-qvb2UAIAYUX3El-upwv1TPges-H5dXbfvU0dOPOpStwNwg_neJOM1B7FyhZ8GOC2aVvaRkmsMJ_Q668dWd_1mhg21Bw35mXe6uzdQA90XENbpEjkn7ezw9Uv0jXDj-qHYs1EE6A08ulWRd-w2LERgr4MA_hJoz2IgjSn5cJWUfM-KtpGd9DxApaCZ_xbkx-zJRIQQXCQKC8WmDNLfDfjpsDGCMxdhcJ2j94fPX66aBNZTWq1DbEH4Z8SWGvgbwYdFEmBeUld552x8x_iGXRFLmicL6EOeng0bXmFlMwD2twukjkWsoVIQW8Vbdyza8XaNi-dtnDVLuMOqNhb2DDa0UbaHwW0DsEPPvHznrd2ut0zVtq-qr9MwiI1kAVwFcKgvJ5NXvjjXH0dgD0Z4iTn6KhHQuGoTav6vQazCsmtG0iicIvbVNcz_eXbi7G2sr_uUQZxRP_G2E-hya_NsnZmspqsTr4JRTckWgrTBYYH1QK8Zbd-cTPNx9y3vDlmsQx_N_5UG1JHIvQGBb2U";
const JURS = ["Portugal","Malta","Cyprus","Greece","UAE","Singapore","Malaysia","Australia / NZ","USA (EB-5)","Paraguay","St. Kitts & Nevis","Dominica","Grenada","Antigua","Türkiye","Mexico","Other"];

const PLANS = [
  {
    id:"business", name:"Business", badge:"Business", bc:"pb-business",
    tagline:"Shared pool access. Pre-qualified leads from the FBS network delivered to your dashboard each month.",
    price:899, ctaCls:"cta-business", ctaText:"Apply for Business",
    priceNote:"Monthly management fee. No additional ad spend required.",
    isPremium:false,
    features:[
      {t:"15–20 matched leads / month from shared pool",y:true},
      {t:"Shared access — up to 5 firms per jurisdiction",y:true},
      {t:"Global Mobility Score + breakdown per lead",y:true},
      {t:"Full Advisor Brief before first contact",y:true},
      {t:"Basic reporting: tier split, timeline, capital ranges",y:true},
      {t:"CRM integration (HubSpot, Pipedrive, Salesforce)",y:true},
      {t:"Email + documentation onboarding",y:true},
      {t:"Dedicated ad campaigns for your firm",y:false},
      {t:"Exclusive lead feed (not in shared pool)",y:false},
      {t:"Full audience intelligence + ICP persona",y:false},
      {t:"Quarterly strategy & ICP review call",y:false},
    ]
  },
  {
    id:"premium", name:"Premium", badge:"Most Popular", bc:"pb-premium",
    tagline:"Dedicated ad campaigns managed by FBS, exclusive leads routed only to your firm, and full intelligence.",
    price:1299, ctaCls:"cta-premium", ctaText:"Apply for Premium",
    priceNote:"Management fee. + Your media budget (min. $2,000/mo recommended).",
    isPremium:true,
    features:[
      {t:"30–50 leads / month (scales with ad budget)",y:true},
      {t:"Exclusive feed — your leads only, not shared",y:true},
      {t:"Global Mobility Score + breakdown per lead",y:true},
      {t:"Full Advisor Brief before first contact",y:true},
      {t:"Full audience intelligence layer",y:true},
      {t:"Auto-updated ICP persona (deepens with volume)",y:true},
      {t:"Dedicated Meta + Google campaign management",y:true},
      {t:"CRM integration + custom webhooks",y:true},
      {t:"Monthly performance report + attribution",y:true},
      {t:"Quarterly strategy & ICP review call",y:true},
    ]
  }
];

const COMPARE_ROWS = [
  {section:"Lead Access"},
  {label:"Monthly leads",b:"15–20",p:"30–50+"},
  {label:"Pool type",b:"Shared (up to 5 firms)",p:"Exclusive — your firm only"},
  {label:"Lead scoring (GMS 0–100)",b:true,p:true},
  {label:"Advisor Brief per lead",b:true,p:true},
  {section:"Campaigns & Acquisition"},
  {label:"FBS-managed ad campaigns",b:false,p:true},
  {label:"Client provides media budget",b:false,p:true},
  {label:"Dedicated campaign targeting",b:false,p:true},
  {label:"UTM attribution tracking",b:true,p:true},
  {section:"Intelligence & Analytics"},
  {label:"Basic reporting (tier, timeline, capital)",b:true,p:true},
  {label:"Full audience intelligence layer",b:false,p:true},
  {label:"Auto-updated ICP persona",b:false,p:true},
  {label:"Monthly performance report",b:false,p:true},
  {label:"Quarterly review call",b:false,p:true},
  {section:"Integrations & Support"},
  {label:"CRM integration",b:true,p:true},
  {label:"Custom webhooks",b:false,p:true},
  {label:"Onboarding support",b:"Email",p:"Priority + call"},
];

const FAQ = [
  {q:"What does the $5,000 setup fee cover?",a:"Full funnel setup: landing page, Global Mobility Survey, Meta Pixel, Google Analytics, UTM framework, first test campaign, and the first 100 leads. This is a one-time investment — everything is configured and tested before your subscription starts."},
  {q:"What's the difference between shared and exclusive leads?",a:"Business partners receive leads from the FBS shared pool — the same lead may be visible to up to 5 firms covering your jurisdiction. Premium partners receive leads from <strong>dedicated campaigns</strong> run specifically for them — those leads never enter the shared pool."},
  {q:"Why is the media budget separate for Premium?",a:"Ad spend varies significantly by jurisdiction, volume target, and audience. Keeping it separate gives you full transparency over where your money goes, and lets you scale up or down based on results. FBS manages the campaigns — you own the budget."},
  {q:"What's the minimum recommended media budget?",a:"We recommend <strong>$2,000–3,000/month</strong> to run meaningful campaigns in most jurisdictions. For Caribbean CBI or niche programmes, $1,500 can work. UAE and Singapore typically need $3,000+ due to audience costs."},
  {q:"How many leads will I get with Premium?",a:"Depends on your media budget and jurisdiction. Typical result: $2,000 budget → 25–35 qualified leads. $4,000 → 45–65 leads. These are qualified leads — completed GMS survey, intent-verified, scored."},
  {q:"Can I upgrade from Business to Premium?",a:"Yes, at any time. We'll configure your dedicated campaigns and switch your feed to exclusive. The price difference is charged pro-rata from the upgrade date."},
  {q:"How fast do I start receiving leads?",a:"Business: within 7 days of onboarding — you get access to existing shared pool leads. Premium: first leads from dedicated campaigns typically arrive within 10–14 days (campaign ramp-up period)."},
  {q:"Do I need to manage the ads myself on Premium?",a:"No. FBS handles all campaign setup, creative direction, audience targeting, optimization, and reporting. You approve the ICP and creative brief — we execute."},
];

function Modal({plan, onClose}) {
  const [done,setDone]=useState(false);
  const [busy,setBusy]=useState(false);
  const [form,setForm]=useState({name:"",email:"",company:"",phone:"",jurisdiction:"",budget:"",message:""});
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
  const isPremium=plan?.isPremium;
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        {!done?(<>
          <div className="modal-plan-tag" style={{background:isPremium?"#AAFF45":"#F4F4F2",color:isPremium?"#0A0A0A":"#6B6B6B"}}>{plan?.name}</div>
          <h2>Apply for {plan?.name}</h2>
          <p className="modal-sub">
            <strong>${plan?.price}/mo</strong> management fee + <strong>$5,000</strong> one-time setup.
            {isPremium&&<> Plus your media budget.</>} We review within 24 hours.
          </p>
          <div className="fields">
            <div className="field-row">
              <div className="cf"><label>Full name</label><input value={form.name} onChange={set("name")} placeholder="Your name"/></div>
              <div className="cf"><label>Business email</label><input type="email" value={form.email} onChange={set("email")} placeholder="you@firm.com"/></div>
            </div>
            <div className="cf"><label>Firm / company</label><input value={form.company} onChange={set("company")} placeholder="Company name"/></div>
            <div className="field-row">
              <div className="cf"><label>Phone (optional)</label><input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000"/></div>
              <div className="cf"><label>Primary jurisdiction</label><select value={form.jurisdiction} onChange={set("jurisdiction")}><option value="">Select…</option>{JURS.map(j=><option key={j}>{j}</option>)}</select></div>
            </div>
            {isPremium&&<div className="cf"><label>Monthly media budget (estimated)</label><select value={form.budget} onChange={set("budget")}><option value="">Select range…</option><option>$1,500 – $2,000</option><option>$2,000 – $3,000</option><option>$3,000 – $5,000</option><option>$5,000+</option></select></div>}
            <div className="cf"><label>Tell us about your practice (optional)</label><textarea value={form.message} onChange={set("message")} placeholder="Jurisdiction focus, programme specialisation, team size…"/></div>
            <button className="sub-btn" style={{background:isPremium?"#AAFF45":"#0A0A0A",color:isPremium?"#0A0A0A":"#AAFF45"}} onClick={submit} disabled={busy}>
              {busy?"Submitting…":"Apply for "+plan?.name+" →"}
            </button>
            <div className="modal-disc">By submitting you agree to be contacted by FBS Intelligence. We don't share your data.</div>
          </div>
        </>):(<div className="success-box"><div className="success-ico">✓</div><h3>Application received</h3><p>We'll review your profile within 24 hours and reach out to schedule a discovery call and walk you through next steps.</p></div>)}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [modal,setModal]=useState(null);
  return(<><style>{css}</style>

    <nav><div className="wrap nav-inner">
      <a href="/" className="nav-logo"><div className="nav-logo-dot"/>FBS Intelligence</a>
      <div className="nav-right">
        <a href="/" className="nav-link">Home</a>
        <a href="/overview" className="nav-link">How it works</a>
        <a href="/pricing" className="nav-link active" style={{color:"var(--black)",fontWeight:700}}>Pricing</a>
        <a href="/#apply" className="nav-btn">Apply</a>
      </div>
    </div></nav>

    {/* HERO */}
    <section className="hero">
      <div className="wrap">
        <div className="eyebrow-pill"><span className="eyebrow-pill-dot">Pricing</span> Transparent · No hidden fees</div>
        <h1>Two packages.<br/><span className="accent">One goal.</span></h1>
        <p>Pre-qualified leads delivered to your dashboard — from the FBS network or from campaigns we run exclusively for your firm.</p>

        {/* SETUP FEE BANNER */}
        <div style={{display:"flex",justifyContent:"center"}}>
          <div className="setup-hero">
            <div className="setup-main">
              <div className="setup-tag">One-time setup fee — both plans</div>
              <div className="setup-price-row">
                <div className="setup-price">$5,000</div>
                <div className="setup-price-label">one-time</div>
              </div>
              <div className="setup-desc">Paid once. Charged after discovery call, before go-live.</div>
            </div>
            <div className="setup-includes">
              <div className="setup-includes-label">What's included</div>
              {["Funnel & landing page setup","Survey + pixel + UTM framework","Test campaign run","First 100 leads acquired","ICP build + onboarding call"].map(t=>(
                <div key={t} className="setup-item"><div className="setup-check">✓</div>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* PLANS */}
    <section className="plans-section">
      <div className="wrap">
        <div className="plans-grid">
          {PLANS.map(plan=>(
            <div key={plan.id} className={"plan-card"+(plan.isPremium?" premium":"")}>
              <div className={"plan-badge "+plan.bc}>
                {plan.isPremium&&<span className="ping-dot"/>}
                {plan.badge}
              </div>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-tagline">{plan.tagline}</div>
              <div className="plan-price-block">
                <div className="plan-price-row">
                  <div className="plan-price">${plan.price}</div>
                  <div className="plan-price-mo">/mo</div>
                </div>
              </div>
              <div className="plan-price-note">
                {plan.isPremium
                  ? <span>Management fee · <span className="plus">+ your media budget</span></span>
                  : "Monthly · no ad spend required"}
              </div>
              <button className={"plan-cta "+plan.ctaCls} onClick={()=>setModal(plan)}>{plan.ctaText}</button>
              <hr className="plan-hr"/>
              <div className="features-label">What's included</div>
              <ul className="features-list">
                {plan.features.map((f,i)=>(
                  <li key={i} className="fi-row">
                    <span className={"fi-icon "+(f.y?"fi-yes":"fi-no")}>{f.y?"✓":"–"}</span>
                    <span>{f.t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* HOW THE TWO MODELS WORK */}
    <section className="models-section">
      <div className="wrap">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:24,height:1,background:"#888",opacity:0.4}}/>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#888"}}>How each model works</div>
        </div>
        <h2 style={{fontSize:"clamp(26px,3.5vw,40px)",fontWeight:800,letterSpacing:"-0.03em",color:"var(--black)",marginBottom:12}}>
          Same platform. Different acquisition model.
        </h2>
        <p style={{fontSize:16,color:"var(--text2)",maxWidth:600,lineHeight:1.7,marginBottom:0}}>
          Business taps into the existing FBS lead pool. Premium adds dedicated campaigns — funded by your media budget, managed by FBS.
        </p>

        <div className="models-grid">
          <div className="model-card">
            <div className="model-num">B</div>
            <div className="model-plan">Business · $899/mo</div>
            <h3>Access the FBS shared pool.</h3>
            <p>FBS continuously acquires leads through events, content, and general campaigns. Business partners receive a monthly allocation of matched leads from this pool — no separate ad budget needed.</p>
            <div className="model-flow">
              {["FBS general acquisition campaigns","→ Lead completes Global Mobility Survey","→ Scored + jurisdiction-matched","→ Appears in shared pool","→ You + up to 4 other firms see the lead"].map((s,i)=>(
                <div key={i} className="model-flow-item">
                  <div className="model-flow-icon">{["🌐","📋","📊","🏊","👥"][i]}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="model-card dark">
            <div className="model-num">P</div>
            <div className="model-plan">Premium · $1,299/mo + media budget</div>
            <h3>Dedicated campaigns, exclusive leads.</h3>
            <p>FBS builds and manages campaigns targeting your exact ICP in your jurisdiction. Leads from these campaigns are routed exclusively to you — they never enter the shared pool.</p>
            <div className="model-flow">
              {["Your media budget funds dedicated campaigns","FBS manages Meta + Google targeting","→ Lead completes your GMS funnel","→ Scored + intent-verified","→ Exclusive to your dashboard only"].map((s,i)=>(
                <div key={i} className="model-flow-item">
                  <div className="model-flow-icon">{["💰","🎯","📋","✅","🔒"][i]}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AD BUDGET CALLOUT */}
        <div className="budget-callout">
          <div>
            <h4>What media budget do I need for Premium?</h4>
            <p>Ad spend is separate from the management fee. We recommend a minimum of <strong>$2,000/mo</strong> to run effective campaigns. Higher budgets produce more leads — we'll give you a projection during the discovery call based on your jurisdiction and ICP.</p>
          </div>
          <div className="budget-ranges">
            <div className="budget-range">
              <div className="budget-range-label">Minimum</div>
              <div className="budget-range-val">$2,000/mo</div>
            </div>
            <div className="budget-range">
              <div className="budget-range-label">Recommended</div>
              <div className="budget-range-val">$3,000/mo</div>
            </div>
            <div className="budget-range">
              <div className="budget-range-label">Scale</div>
              <div className="budget-range-val">$5,000+/mo</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* COMPARISON TABLE */}
    <section className="compare-section">
      <div className="wrap">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:24,height:1,background:"#888",opacity:0.4}}/>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#888"}}>Full Comparison</div>
        </div>
        <h2 style={{fontSize:"clamp(26px,3.5vw,40px)",fontWeight:800,letterSpacing:"-0.03em",color:"var(--black)",marginBottom:0}}>
          Everything side by side.
        </h2>
        <table className="compare-table">
          <thead>
            <tr>
              <th style={{width:"50%"}}>Feature</th>
              <th className="plan-col">Business<br/><span style={{fontSize:13,fontWeight:500,color:"var(--muted)"}}>$899/mo</span></th>
              <th className="plan-col highlight">Premium<br/><span style={{fontSize:13,fontWeight:700,color:"var(--lime-dark)"}}>$1,299/mo</span></th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row,i)=>{
              if(row.section) return <tr key={i} className="section-row"><td colSpan={3}>{row.section}</td></tr>;
              return(
                <tr key={i}>
                  <td>{row.label}</td>
                  <td className="plan-col">
                    {row.b===true?<span className="c-check">✓</span>:row.b===false?<span className="c-dash">–</span>:<span className="c-val">{row.b}</span>}
                  </td>
                  <td className="plan-col">
                    {row.p===true?<span className="c-check">✓</span>:row.p===false?<span className="c-dash">–</span>:<span className="c-val lime">{row.p}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>

    {/* FAQ */}
    <section className="faq-section">
      <div className="wrap">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:24,height:1,background:"#888",opacity:0.4}}/>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#888"}}>Questions</div>
        </div>
        <h2 style={{fontSize:"clamp(26px,3.5vw,40px)",fontWeight:800,letterSpacing:"-0.03em",color:"var(--black)",marginBottom:40}}>
          Common questions answered.
        </h2>
        <div className="faq-grid">
          {FAQ.map((f,i)=><div key={i} className="faq-card"><h4>{f.q}</h4><p dangerouslySetInnerHTML={{__html:f.a}}/></div>)}
        </div>
      </div>
    </section>

    {/* BOTTOM CTA */}
    <section className="bottom-cta">
      <div className="wrap">
        <h2>Ready to get started?</h2>
        <p>Tell us about your firm — we'll review within 24 hours and book a discovery call.</p>
        <button className="btn-lime" onClick={()=>setModal(PLANS[1])}>Apply for Premium →</button>
        <div style={{marginTop:16,display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap"}}>
          {["$5,000 setup · one-time","Discovery call within 48h","First leads in 7–14 days"].map(t=>(
            <span key={t} style={{fontSize:12,color:"#555",display:"inline-flex",alignItems:"center",gap:6}}>
              <span style={{color:"#AAFF45",fontWeight:900}}>✓</span> {t}
            </span>
          ))}
        </div>
      </div>
    </section>

    {modal&&<Modal plan={modal} onClose={()=>setModal(null)}/>}
  </>);
}
