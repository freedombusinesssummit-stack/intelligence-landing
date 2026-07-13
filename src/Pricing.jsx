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
  @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}

  nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);}
  .nav-inner{display:flex;align-items:center;justify-content:space-between;height:62px;}
  .nav-logo{font-size:14px;font-weight:800;color:var(--black);display:flex;align-items:center;gap:10px;letter-spacing:-0.02em;text-decoration:none;}
  .nav-logo-dot{width:8px;height:8px;background:var(--lime);border-radius:50%;animation:pulseLime 2.5s ease-in-out infinite;}
  .nav-right{display:flex;align-items:center;gap:20px;}
  .nav-link{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text2);text-decoration:none;transition:color 0.15s;}
  .nav-link:hover{color:var(--black);}
  .nav-btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--black);color:var(--white);border:none;cursor:pointer;padding:9px 20px;border-radius:7px;font-family:'Inter',sans-serif;transition:all 0.15s;text-decoration:none;}
  .nav-btn:hover{background:var(--lime);color:var(--black);}

  /* HERO */
  .hero{padding:130px 0 72px;background:var(--white);border-bottom:1px solid var(--border);position:relative;overflow:hidden;text-align:center;}
  .hero::before{content:'';position:absolute;inset:0;background-image:linear-gradient(to right,rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,0.04) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black 40%,transparent 100%);pointer-events:none;}
  .hero>.wrap{position:relative;z-index:2;}
  .eyebrow-pill{display:inline-flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--border);border-radius:100px;padding:5px 14px 5px 6px;margin-bottom:24px;font-size:12px;font-weight:500;color:var(--text);}
  .eyebrow-dot{background:var(--lime);color:var(--black);font-size:10px;font-weight:800;padding:3px 10px;border-radius:100px;letter-spacing:0.08em;}
  .hero h1{font-size:clamp(38px,5vw,64px);font-weight:800;letter-spacing:-0.035em;line-height:1.02;color:var(--black);margin-bottom:16px;}
  .accent{position:relative;display:inline-block;}
  .accent::after{content:'';position:absolute;bottom:0;left:0;right:0;height:0.32em;background:var(--lime);z-index:-1;border-radius:2px;}
  .hero-sub{font-size:17px;color:var(--text2);max-width:560px;margin:0 auto 40px;line-height:1.65;}

  /* SETUP FEE BANNER */
  .setup-banner{display:inline-flex;align-items:stretch;background:var(--off);border:1px solid var(--border);border-radius:18px;overflow:hidden;margin-bottom:0;}
  .setup-left{padding:28px 36px;text-align:left;}
  .setup-tag{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:10px;}
  .setup-price-row{display:flex;align-items:flex-end;gap:8px;margin-bottom:6px;}
  .setup-price{font-size:52px;font-weight:900;letter-spacing:-0.04em;color:var(--black);line-height:1;}
  .setup-price-lbl{font-size:15px;color:var(--muted);padding-bottom:10px;font-weight:500;}
  .setup-desc{font-size:13px;color:var(--text2);}
  .setup-right{padding:28px 32px;background:var(--white);border-left:1px solid var(--border);display:flex;flex-direction:column;justify-content:center;gap:10px;min-width:260px;text-align:left;}
  .setup-right-label{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;}
  .setup-item{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--text);}
  .setup-check{width:18px;height:18px;border-radius:5px;background:var(--lime);color:var(--black);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex-shrink:0;}

  /* PLANS GRID */
  .plans-section{padding:72px 0 0;background:var(--off);}
  .plans-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:900px;margin:0 auto;}

  .plan-card{background:var(--white);border:1px solid var(--border);border-radius:22px;padding:44px 40px;display:flex;flex-direction:column;position:relative;overflow:hidden;transition:all 0.25s cubic-bezier(0.16,1,0.3,1);}
  .plan-card:hover{transform:translateY(-5px);box-shadow:0 24px 56px -12px rgba(0,0,0,0.1);border-color:rgba(0,0,0,0.25);}
  .plan-card.premium{background:var(--black);border-color:var(--black);}
  .plan-card.premium::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--lime);}
  .plan-card.premium:hover{box-shadow:0 24px 56px -12px rgba(170,255,69,0.2);}

  .plan-badge{display:inline-flex;align-items:center;gap:7px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:4px 12px;border-radius:100px;margin-bottom:24px;width:fit-content;}
  .pb-b{background:var(--off);color:var(--muted);border:1px solid var(--border);}
  .pb-p{background:var(--lime);color:var(--black);}
  .ping-dot{position:relative;width:6px;height:6px;flex-shrink:0;}
  .ping-dot::before{content:'';position:absolute;inset:0;background:var(--black);border-radius:50%;}
  .ping-dot::after{content:'';position:absolute;inset:0;background:var(--black);border-radius:50%;animation:pingDot 1.6s ease-out infinite;}

  .plan-name{font-size:28px;font-weight:800;letter-spacing:-0.025em;color:var(--black);margin-bottom:10px;}
  .plan-card.premium .plan-name{color:var(--white);}
  .plan-tagline{font-size:14px;color:var(--text2);line-height:1.6;margin-bottom:32px;min-height:48px;}
  .plan-card.premium .plan-tagline{color:rgba(255,255,255,0.55);}

  .plan-price-row{display:flex;align-items:flex-end;gap:8px;margin-bottom:6px;}
  .plan-price{font-size:64px;font-weight:900;letter-spacing:-0.04em;color:var(--black);line-height:1;font-variant-numeric:tabular-nums;}
  .plan-card.premium .plan-price{color:var(--lime);}
  .plan-price-mo{font-size:17px;color:var(--muted);padding-bottom:12px;font-weight:500;}
  .plan-card.premium .plan-price-mo{color:rgba(255,255,255,0.4);}
  .plan-price-note{font-size:13px;color:var(--muted);margin-bottom:32px;line-height:1.5;}
  .plan-card.premium .plan-price-note{color:rgba(255,255,255,0.35);}
  .plan-price-note .extra{font-weight:700;color:var(--lime-dark);}
  .plan-card.premium .plan-price-note .extra{color:var(--lime);}

  .plan-cta{width:100%;padding:16px;border-radius:10px;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;transition:all 0.2s;margin-bottom:32px;}
  .plan-cta:hover{transform:translateY(-1px);}
  .cta-b{background:var(--black);color:var(--white);}
  .cta-b:hover{background:var(--lime);color:var(--black);}
  .cta-p{background:var(--lime);color:var(--black);}
  .cta-p:hover{opacity:0.9;box-shadow:0 10px 28px rgba(170,255,69,0.4);}

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

  /* NURTURE FLOW VISUALIZER */
  .nurture-section{padding:80px 0 96px;background:var(--off);}
  .nurture-compare{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:48px;}

  .flow-card{background:var(--white);border:1px solid var(--border);border-radius:18px;overflow:hidden;}
  .flow-card.dark{background:var(--black);border-color:var(--black);}
  .flow-header{padding:24px 28px;border-bottom:1px solid var(--border);}
  .flow-card.dark .flow-header{border-color:rgba(255,255,255,0.1);}
  .flow-plan-tag{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:6px;}
  .flow-card.dark .flow-plan-tag{color:var(--lime);}
  .flow-header h3{font-size:18px;font-weight:700;color:var(--black);margin-bottom:4px;letter-spacing:-0.01em;}
  .flow-card.dark .flow-header h3{color:var(--white);}
  .flow-header p{font-size:13px;color:var(--text2);line-height:1.5;}
  .flow-card.dark .flow-header p{color:#888;}

  .flow-steps{padding:20px 28px;display:flex;flex-direction:column;gap:0;}
  .flow-step{display:flex;align-items:flex-start;gap:14px;padding:14px 0;position:relative;}
  .flow-step:not(:last-child)::after{content:'';position:absolute;left:15px;top:48px;bottom:0;width:2px;background:var(--border);}
  .flow-card.dark .flow-step:not(:last-child)::after{background:rgba(255,255,255,0.1);}
  .flow-step-icon{width:32px;height:32px;border-radius:10px;background:var(--off);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;position:relative;z-index:1;}
  .flow-card.dark .flow-step-icon{background:rgba(255,255,255,0.08);}
  .flow-step-icon.lime{background:var(--lime);}
  .flow-step-icon.dark-icon{background:var(--lime);color:var(--black);}
  .flow-step-body{}
  .flow-step-h{font-size:13px;font-weight:700;color:var(--black);margin-bottom:2px;}
  .flow-card.dark .flow-step-h{color:var(--white);}
  .flow-step-p{font-size:12px;color:var(--text2);line-height:1.5;}
  .flow-card.dark .flow-step-p{color:#888;}
  .flow-step-badge{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px;margin-top:4px;}
  .badge-manual{background:#FFF3E0;color:#C07D10;}
  .badge-auto{background:var(--lime-soft);color:var(--lime-dark);}

  /* EMAIL SEQUENCE PREVIEW */
  .email-preview{margin:0 28px 20px;background:var(--dark2,#181818);border-radius:12px;overflow:hidden;}
  .email-preview-header{padding:10px 16px;background:#111;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,0.06);}
  .email-preview-dots{display:flex;gap:4px;}
  .email-preview-dots span{width:8px;height:8px;border-radius:50%;}
  .email-preview-title{font-size:11px;color:#555;margin-left:8px;}
  .email-seq{padding:12px 16px;display:flex;flex-direction:column;gap:8px;}
  .email-seq-item{display:flex;align-items:center;gap:10px;}
  .email-num{width:20px;height:20px;border-radius:50%;background:rgba(170,255,69,0.15);color:var(--lime);font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .email-subj{font-size:12px;color:rgba(255,255,255,0.6);}
  .email-day{font-size:10px;color:#555;margin-left:auto;white-space:nowrap;}

  /* COMPARISON TABLE */
  .compare-section{padding:96px 0;background:var(--white);border-bottom:1px solid var(--border);}
  .compare-table{width:100%;border-collapse:collapse;margin-top:48px;}
  .compare-table th{padding:14px 20px;text-align:left;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid var(--border);}
  .compare-table th.col{text-align:center;width:160px;}
  .compare-table th.col.hi{color:var(--black);}
  .compare-table td{padding:14px 20px;border-bottom:1px solid var(--border);font-size:14px;color:var(--text);}
  .compare-table td.col{text-align:center;}
  .compare-table tr:hover td{background:#FAFAF6;}
  .compare-table tr:last-child td{border-bottom:none;}
  .section-row td{background:var(--off) !important;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);padding:10px 20px !important;}
  .c-yes{display:inline-flex;width:22px;height:22px;border-radius:50%;background:var(--lime);color:var(--black);align-items:center;justify-content:center;font-size:11px;font-weight:800;}
  .c-no{color:var(--border);font-size:22px;line-height:1;}
  .c-txt{font-size:13px;font-weight:600;color:var(--black);}
  .c-txt.g{color:var(--lime-dark);}

  /* FAQ */
  .faq-section{padding:96px 0;background:var(--off);border-bottom:1px solid var(--border);}
  .faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:48px;}
  .faq-card{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:28px 24px;transition:all 0.2s;}
  .faq-card:hover{border-color:var(--black);transform:translateY(-2px);}
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

  @media(max-width:900px){
    .plans-grid,.nurture-compare,.faq-grid{grid-template-columns:1fr;}
    .compare-table{font-size:13px;}
    .compare-table th.col,.compare-table td.col{width:110px;}
    .setup-banner{flex-direction:column;}
    .setup-right{border-left:none;border-top:1px solid var(--border);}
  }
  @media(max-width:600px){.field-row{grid-template-columns:1fr;}}
`;

const ML = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMjkwMjI2ODdkNTJlNjk4ZjYwMzVkODk4YTI0MmFhMzgxNTlmMWQwMmRhN2ZlMDI2MGYxMTMzZGE0NWUyNDViZmQ1OTJiMjI5YjEzZjdjOTMiLCJpYXQiOjE3Nzc4MDQxNDEuMDU2ODcsIm5iZiI6MTc3NzgwNDE0MS4wNTY4NzMsImV4cCI6NDkzMzQ3Nzc0MS4wNTI3NTUsInN1YiI6IjkzMDA0MyIsInNjb3BlcyI6W119.Apd5ihW7N-KluBSDf-dovqu0O_Ia30wPUVjClBzRyOej5nne5be0poXt21OvB2PluTK4EyJO7ZBcOsitkoMG2Q6DSkjThmx0cjn-1APSFbWRAkp0VqXAljYyag-6LebecLKFjiSHNn5uAx441wje7CtSi4-qvb2UAIAYUX3El-upwv1TPges-H5dXbfvU0dOPOpStwNwg_neJOM1B7FyhZ8GOC2aVvaRkmsMJ_Q668dWd_1mhg21Bw35mXe6uzdQA90XENbpEjkn7ezw9Uv0jXDj-qHYs1EE6A08ulWRd-w2LERgr4MA_hJoz2IgjSn5cJWUfM-KtpGd9DxApaCZ_xbkx-zJRIQQXCQKC8WmDNLfDfjpsDGCMxdhcJ2j94fPX66aBNZTWq1DbEH4Z8SWGvgbwYdFEmBeUld552x8x_iGXRFLmicL6EOeng0bXmFlMwD2twukjkWsoVIQW8Vbdyza8XaNi-dtnDVLuMOqNhb2DDa0UbaHwW0DsEPPvHznrd2ut0zVtq-qr9MwiI1kAVwFcKgvJ5NXvjjXH0dgD0Z4iTn6KhHQuGoTav6vQazCsmtG0iicIvbVNcz_eXbi7G2sr_uUQZxRP_G2E-hya_NsnZmspqsTr4JRTckWgrTBYYH1QK8Zbd-cTPNx9y3vDlmsQx_N_5UG1JHIvQGBb2U";
const JURS = ["Portugal","Malta","Cyprus","Greece","UAE","Singapore","Malaysia","Australia / NZ","USA (EB-5)","Paraguay","St. Kitts & Nevis","Dominica","Grenada","Antigua","Türkiye","Mexico","Other"];

const PLANS = [
  {
    id:"business", isPremium:false,
    badge:"Business", bc:"pb-b",
    name:"Business",
    tagline:"Qualified leads delivered to your dashboard. Your team handles outreach, nurture, and conversion.",
    price:899,
    priceNote:"Monthly · your team works the leads",
    ctaCls:"cta-b", ctaText:"Apply for Business",
    features:[
      {t:"Exclusive leads matched to your jurisdiction",y:true},
      {t:"Global Mobility Score + full breakdown per lead",y:true},
      {t:"Advisor Brief before first contact",y:true},
      {t:"Basic reporting: tier split, timeline, capital",y:true},
      {t:"CRM integration (HubSpot, Pipedrive, Salesforce)",y:true},
      {t:"Dashboard access + onboarding docs",y:true},
      {t:"FBS-managed email nurture sequence",y:false},
      {t:"Lead warming before partner contact",y:false},
      {t:"Full audience intelligence + ICP persona",y:false},
      {t:"Monthly performance report",y:false},
      {t:"Quarterly ICP review call",y:false},
    ]
  },
  {
    id:"premium", isPremium:true,
    badge:"Most Popular", bc:"pb-p",
    name:"Premium",
    tagline:"Everything in Business, plus FBS warms your leads with email sequences before you ever make contact.",
    price:1299,
    priceNote:"Monthly · FBS actively works the audience for you",
    ctaCls:"cta-p", ctaText:"Apply for Premium",
    features:[
      {t:"Exclusive leads matched to your jurisdiction",y:true},
      {t:"Global Mobility Score + full breakdown per lead",y:true},
      {t:"Advisor Brief before first contact",y:true},
      {t:"FBS-managed 5-email nurture sequence per lead",y:true},
      {t:"Lead warming — arrives ready to talk",y:true},
      {t:"Full audience intelligence layer",y:true},
      {t:"Auto-updated ICP persona (deepens with volume)",y:true},
      {t:"CRM integration + custom webhooks",y:true},
      {t:"Monthly performance + attribution report",y:true},
      {t:"Quarterly ICP review call",y:true},
      {t:"Priority onboarding",y:true},
    ]
  }
];

const COMPARE_ROWS = [
  {section:"Lead Delivery"},
  {label:"Exclusive leads — your firm only",b:true,p:true},
  {label:"Global Mobility Score (0–100)",b:true,p:true},
  {label:"Advisor Brief per lead",b:true,p:true},
  {label:"Leads/month (approximate)",b:"15–20",p:"25–40"},
  {section:"Audience Nurture"},
  {label:"FBS email nurture sequence (5 emails)",b:false,p:true},
  {label:"Lead warming before partner contact",b:false,p:true},
  {label:"Automated re-engagement follow-ups",b:false,p:true},
  {label:"Outreach handled by your team",b:true,p:true},
  {section:"Intelligence & Analytics"},
  {label:"Basic reporting (tier, timeline, capital)",b:true,p:true},
  {label:"Full audience intelligence layer",b:false,p:true},
  {label:"Auto-updated ICP persona",b:false,p:true},
  {label:"Monthly performance report",b:false,p:true},
  {label:"Quarterly ICP review call",b:false,p:true},
  {section:"Integration & Support"},
  {label:"CRM integration",b:true,p:true},
  {label:"Custom webhooks",b:false,p:true},
  {label:"Onboarding",b:"Docs + email",p:"Priority + call"},
];

const EMAIL_SEQUENCE = [
  {n:1,subj:"What your Global Mobility Score means",day:"Day 0"},
  {n:2,subj:"The 3 most common mistakes at this stage",day:"Day 2"},
  {n:3,subj:"Portugal vs. Malta vs. UAE — a quick breakdown",day:"Day 5"},
  {n:4,subj:"Questions to ask your advisor (checklist)",day:"Day 8"},
  {n:5,subj:"Ready to speak with a specialist?",day:"Day 11"},
];

const FAQ = [
  {q:"What does the $5,000 setup fee cover?",a:"Full funnel setup: landing page, Global Mobility Survey, Meta Pixel, Google Analytics, UTM attribution, first test campaign, and the first 100 leads acquired. One-time. Charged after discovery call."},
  {q:"What's the difference between Business and Premium?",a:"Business delivers leads to your dashboard — your team handles all outreach and nurture. Premium adds a <strong>5-email warming sequence</strong> that FBS runs on every lead before it reaches you. By the time you call, the prospect has read four educational emails and clicked 'ready to speak with a specialist.'"},
  {q:"How does the email nurture work in Premium?",a:"When a lead completes the Global Mobility Survey, FBS automatically enrolls them in a 5-email sequence over 11 days. The sequence educates, builds trust, and filters intent. Only leads who engage meaningfully get flagged as HOT in your dashboard."},
  {q:"Are leads exclusive to my firm?",a:"Yes — both plans deliver exclusive leads. No other firm in your jurisdiction sees the same leads from your allocation. This is not a shared pool."},
  {q:"How many leads do I receive per month?",a:"Business: 15–20 leads/month. Premium: 25–40 leads/month (higher because the nurture sequence surfaces more engaged prospects). Both are minimums — if we fall short, we credit the following month."},
  {q:"Can I upgrade from Business to Premium?",a:"Yes, at any time. We configure the nurture sequences and switch your feed. Price difference is charged pro-rata."},
  {q:"Do I need to provide ad budget?",a:"No. Both plans include lead acquisition as part of the management fee. Your only cost is the setup fee + monthly fee. No separate media budget required."},
  {q:"How fast do I receive first leads?",a:"Within 7–10 days of onboarding on both plans. Premium leads go through the nurture sequence first, so the first HOT-flagged leads typically arrive 10–14 days after onboarding."},
];

function Modal({plan, onClose}) {
  const [done,setDone]=useState(false);
  const [busy,setBusy]=useState(false);
  const [form,setForm]=useState({name:"",email:"",company:"",phone:"",jurisdiction:"",message:""});
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const submit=async()=>{
    if(!form.name||!form.email||!form.company)return;
    setBusy(true);
    try{
      const parts=form.name.trim().split(" ");
      const r=await fetch("https://connect.mailerlite.com/api/subscribers",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+ML},body:JSON.stringify({email:form.email,fields:{name:parts[0]||"",last_name:parts.slice(1).join(" ")||"",company:form.company,phone:form.phone||"",jurisdiction:form.jurisdiction||"",firm_type:plan?.name||"",monthly_capacity:form.budget||"",message:form.message||""}}})});
      const d=await r.json();const sid=d?.data?.id;
      if(sid){const gr=await fetch("https://connect.mailerlite.com/api/groups?limit=50",{headers:{"Authorization":"Bearer "+ML}});const gd=await gr.json();const g=gd?.data?.find(x=>x.name==="FBS Intelligence Landing");if(g)await fetch("https://connect.mailerlite.com/api/subscribers/"+sid+"/groups/"+g.id,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+ML}});}
    }catch(e){console.error(e);}
    setBusy(false);
    window.location.href = "/thank-you";
  };
  const isPrem=plan?.isPremium;
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        {!done?(<>
          <div className="modal-plan-tag" style={{background:isPrem?"#AAFF45":"#F4F4F2",color:isPrem?"#0A0A0A":"#6B6B6B"}}>{plan?.name}</div>
          <h2>Apply for {plan?.name}</h2>
          <p className="modal-sub"><strong>${plan?.price}/mo</strong> + <strong>$5,000</strong> one-time setup fee. We review your application within 24 hours and book a discovery call.</p>
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
            <div className="cf"><label>Tell us about your practice (optional)</label><textarea value={form.message} onChange={set("message")} placeholder="Jurisdiction focus, programme specialisation, current lead sources…"/></div>
            <button className="sub-btn" style={{background:isPrem?"#AAFF45":"#0A0A0A",color:isPrem?"#0A0A0A":"#AAFF45"}} onClick={submit} disabled={busy}>
              {busy?"Submitting…":"Apply for "+plan?.name+" →"}
            </button>
            <div className="modal-disc">By submitting you agree to be contacted by FBS Intelligence. We don't share your data.</div>
          </div>
        </>):(<div className="success-box"><div className="success-ico">✓</div><h3>Application received</h3><p>We'll review your profile within 24 hours and reach out to schedule a discovery call.</p></div>)}
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
        <a href="/pricing" className="nav-link" style={{color:"var(--black)",fontWeight:700}}>Pricing</a>
        <a href="/#apply" className="nav-btn">Apply</a>
      </div>
    </div></nav>

    {/* HERO */}
    <section className="hero">
      <div className="wrap">
        <div className="eyebrow-pill"><span className="eyebrow-dot">Pricing</span> Two packages · No shared pool</div>
        <h1>Leads delivered.<br/><span className="accent">Or leads warmed.</span></h1>
        <p className="hero-sub">Both packages deliver exclusive qualified leads matched to your jurisdiction. The difference is how much of the work FBS does before you make the first call.</p>

        <div style={{display:"flex",justifyContent:"center"}}>
          <div className="setup-banner">
            <div className="setup-left">
              <div className="setup-tag">One-time setup fee — both plans</div>
              <div className="setup-price-row">
                <div className="setup-price">$5,000</div>
                <div className="setup-price-lbl">once</div>
              </div>
              <div className="setup-desc">Charged after discovery call · before go-live</div>
            </div>
            <div className="setup-right">
              <div className="setup-right-label">What's included</div>
              {["Funnel + landing page setup","Survey, pixel, UTM framework","Test campaign run","First 100 leads acquired","ICP build + onboarding call"].map(t=>(
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
              <div className="plan-price-row">
                <div className="plan-price">${plan.price}</div>
                <div className="plan-price-mo">/mo</div>
              </div>
              <div className="plan-price-note">{plan.priceNote}</div>
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

    {/* NURTURE COMPARISON */}
    <section className="nurture-section">
      <div className="wrap">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:24,height:1,background:"#888",opacity:0.4}}/>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#888"}}>The key difference</div>
        </div>
        <h2 style={{fontSize:"clamp(26px,3.4vw,40px)",fontWeight:800,letterSpacing:"-0.03em",color:"var(--black)",marginBottom:12}}>
          Who works the audience?
        </h2>
        <p style={{fontSize:16,color:"var(--text2)",maxWidth:580,lineHeight:1.7,marginBottom:0}}>
          Both plans deliver exclusive qualified leads. In Premium, FBS runs a warming sequence on every lead before you ever make contact — so you call someone who already knows who you are.
        </p>

        <div className="nurture-compare">
          {/* Business flow */}
          <div className="flow-card">
            <div className="flow-header">
              <div className="flow-plan-tag">Business · $899/mo</div>
              <h3>Lead delivered. You take it from here.</h3>
              <p>Lead completes GMS survey → scored → arrives in your dashboard. Your team does the outreach.</p>
            </div>
            <div className="flow-steps">
              {[
                {icon:"📋",h:"Lead completes GMS Survey",p:"14 questions, scored 0–100 across 6 dimensions"},
                {icon:"📊",h:"Scored & matched",p:"Tier assigned (HOT/WARM/COLD), jurisdiction matched"},
                {icon:"📥",h:"Appears in your dashboard",p:"Full Advisor Brief visible immediately"},
                {icon:"📞",h:"You contact the lead",p:"Cold or warm depending on your outreach process",badge:"manual",badgeTxt:"Your team"},
              ].map((s,i)=>(
                <div key={i} className="flow-step">
                  <div className="flow-step-icon">{s.icon}</div>
                  <div className="flow-step-body">
                    <div className="flow-step-h">{s.h}</div>
                    <div className="flow-step-p">{s.p}</div>
                    {s.badge&&<span className={"flow-step-badge badge-"+s.badge}>{s.badgeTxt}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium flow */}
          <div className="flow-card dark">
            <div className="flow-header">
              <div className="flow-plan-tag">Premium · $1,299/mo</div>
              <h3>FBS warms the lead. You close it.</h3>
              <p>FBS runs a 5-email sequence on every lead before it reaches your dashboard. You call someone who's ready.</p>
            </div>
            <div className="flow-steps">
              {[
                {icon:"📋",h:"Lead completes GMS Survey",p:"14 questions, scored 0–100 across 6 dimensions"},
                {icon:"📧",h:"FBS email nurture begins",p:"Automated 5-email sequence over 11 days",badge:"auto",badgeTxt:"FBS managed"},
                {icon:"✅",h:"Lead signals readiness",p:"Clicks 'I'm ready to speak with a specialist'"},
                {icon:"📥",h:"Flagged HOT in your dashboard",p:"Lead arrives pre-warmed, expecting your call"},
                {icon:"📞",h:"You contact a warm prospect",p:"They know who you are and why you're calling",badge:"auto",badgeTxt:"Higher conversion"},
              ].map((s,i)=>(
                <div key={i} className="flow-step">
                  <div className={"flow-step-icon"+(i===1||i===2?" dark-icon":"")}>{s.icon}</div>
                  <div className="flow-step-body">
                    <div className="flow-step-h">{s.h}</div>
                    <div className="flow-step-p">{s.p}</div>
                    {s.badge&&<span className={"flow-step-badge badge-"+s.badge}>{s.badgeTxt}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Email sequence preview */}
            <div className="email-preview">
              <div className="email-preview-header">
                <div className="email-preview-dots">
                  <span style={{background:"#FF5F57"}}/><span style={{background:"#FEBC2E"}}/><span style={{background:"#28C840"}}/>
                </div>
                <div className="email-preview-title">FBS Nurture Sequence — 5 emails over 11 days</div>
              </div>
              <div className="email-seq">
                {EMAIL_SEQUENCE.map(e=>(
                  <div key={e.n} className="email-seq-item">
                    <div className="email-num">{e.n}</div>
                    <div className="email-subj">{e.subj}</div>
                    <div className="email-day">{e.day}</div>
                  </div>
                ))}
              </div>
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
        <h2 style={{fontSize:"clamp(26px,3.4vw,40px)",fontWeight:800,letterSpacing:"-0.03em",color:"var(--black)",marginBottom:0}}>Everything side by side.</h2>
        <table className="compare-table">
          <thead>
            <tr>
              <th style={{width:"55%"}}>Feature</th>
              <th className="col">Business<br/><span style={{fontSize:12,fontWeight:500,color:"var(--muted)"}}>$899/mo</span></th>
              <th className="col hi">Premium<br/><span style={{fontSize:12,fontWeight:700,color:"var(--lime-dark)"}}>$1,299/mo</span></th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row,i)=>{
              if(row.section) return <tr key={i} className="section-row"><td colSpan={3}>{row.section}</td></tr>;
              return(
                <tr key={i}>
                  <td>{row.label}</td>
                  <td className="col">{row.b===true?<span className="c-yes">✓</span>:row.b===false?<span className="c-no">–</span>:<span className="c-txt">{row.b}</span>}</td>
                  <td className="col">{row.p===true?<span className="c-yes">✓</span>:row.p===false?<span className="c-no">–</span>:<span className="c-txt g">{row.p}</span>}</td>
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
        <h2 style={{fontSize:"clamp(26px,3.4vw,40px)",fontWeight:800,letterSpacing:"-0.03em",color:"var(--black)",marginBottom:40}}>Common questions answered.</h2>
        <div className="faq-grid">
          {FAQ.map((f,i)=><div key={i} className="faq-card"><h4>{f.q}</h4><p dangerouslySetInnerHTML={{__html:f.a}}/></div>)}
        </div>
      </div>
    </section>

    {/* BOTTOM CTA */}
    <section className="bottom-cta">
      <div className="wrap">
        <h2>Ready to get started?</h2>
        <p>Tell us about your firm — we review within 24 hours and book a discovery call.</p>
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
