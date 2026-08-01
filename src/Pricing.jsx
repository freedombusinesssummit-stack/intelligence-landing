import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --black:#0A0A0A; --off:#F4F4F2; --white:#FFFFFF;
    --lime:#AAFF45; --lime2:#8EE032; --lime-soft:#E8F5DF; --lime-dark:#5A8A20;
    --muted:#6B6B6B; --border:#E5E5E5; --dark:#0F0F0F; --text:#0A0A0A; --text2:#5A5A56;
    --hot-color:#E05A3A;
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
  .setup-left{padding:28px 36px;text-align:left;display:flex;flex-direction:column;justify-content:center;min-width:420px;}
  .setup-tag{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--lime-dark);margin-bottom:10px;}
  .setup-price-row{display:flex;align-items:flex-end;gap:8px;margin-bottom:6px;}
  .setup-price{font-size:52px;font-weight:900;letter-spacing:-0.04em;color:var(--black);line-height:1;}
  .setup-price-lbl{font-size:15px;color:var(--muted);padding-bottom:10px;font-weight:500;}
  .setup-desc{font-size:13px;color:var(--text2);}
  .setup-right{padding:28px 32px;background:var(--white);border-left:1px solid var(--border);display:flex;flex-direction:column;justify-content:center;gap:10px;min-width:260px;text-align:left;}
  .setup-right-label{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;}
  .setup-item{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--text);}
  .setup-check{width:18px;height:18px;border-radius:5px;background:var(--lime);color:var(--black);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex-shrink:0;}

  /* FOUNDING MEMBERS BANNER */
  .founding-banner{background:linear-gradient(135deg,#0A0A0A,#1a1a0a);border:1.5px solid rgba(170,255,69,0.35);border-radius:16px;padding:20px 28px;margin-bottom:40px;display:flex;align-items:center;justify-content:space-between;gap:24px;position:relative;overflow:hidden;}
  .founding-banner::before{content:'';position:absolute;top:-50%;right:-5%;width:40%;height:200%;background:radial-gradient(ellipse,rgba(170,255,69,0.1),transparent 60%);pointer-events:none;}
  .founding-banner-left{display:flex;align-items:center;gap:16px;}
  .founding-badge{background:var(--lime);color:var(--black);font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;padding:5px 12px;border-radius:100px;white-space:nowrap;flex-shrink:0;}
  .founding-text{font-size:14px;color:rgba(255,255,255,0.8);line-height:1.5;}
  .founding-text strong{color:var(--lime);font-weight:700;}
  .founding-spots{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:rgba(255,255,255,0.5);white-space:nowrap;flex-shrink:0;}
  .founding-spots-num{font-size:22px;font-weight:900;color:var(--lime);letter-spacing:-0.03em;}

  /* PRICE STRIKE */
  .price-old{font-size:22px;font-weight:700;color:var(--muted);text-decoration:line-through;letter-spacing:-0.02em;opacity:0.6;}
  .plan-card.premium .price-old{color:rgba(255,255,255,0.3);}
  .price-new-row{display:flex;align-items:flex-end;gap:8px;margin-bottom:4px;}
  .setup-price-old{font-size:28px;font-weight:700;text-decoration:line-through;color:var(--muted);opacity:0.6;letter-spacing:-0.02em;}
  .setup-price-new{font-size:52px;font-weight:900;letter-spacing:-0.04em;color:var(--black);line-height:1;}

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
  .features-plus{font-size:13px;font-weight:800;color:var(--lime-dark);margin-bottom:14px;margin-top:-4px;letter-spacing:-0.01em;}
  .plan-card.premium .features-plus{color:var(--lime);}
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

  /* WHAT WE NEED FROM YOU */
  .need-section{padding:96px 0;background:var(--white);border-bottom:1px solid var(--border);}
  .need-grid{display:grid;grid-template-columns:0.9fr 1.1fr;gap:56px;margin-top:48px;align-items:start;}
  .need-callout{background:var(--black);border-radius:18px;padding:30px 32px;position:sticky;top:100px;}
  .need-callout-tag{font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:var(--lime);margin-bottom:14px;}
  .need-callout h3{font-size:24px;font-weight:800;color:var(--white);letter-spacing:-0.02em;line-height:1.15;margin-bottom:12px;}
  .need-callout p{font-size:14px;color:rgba(255,255,255,0.6);line-height:1.65;}
  .need-steps{display:flex;flex-direction:column;}
  .need-item{display:grid;grid-template-columns:44px 1fr;gap:18px;padding-bottom:26px;position:relative;}
  .need-item:last-child{padding-bottom:0;}
  .need-item::before{content:'';position:absolute;left:21px;top:48px;bottom:0;width:2px;background:var(--border);}
  .need-item:last-child::before{display:none;}
  .need-num{width:44px;height:44px;border-radius:12px;background:var(--off);border:1px solid var(--border);color:var(--black);font-size:16px;font-weight:800;display:flex;align-items:center;justify-content:center;position:relative;z-index:1;}
  .need-item.you .need-num{background:var(--lime);border-color:var(--lime);}
  .need-owner{display:inline-block;font-size:9px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:3px 9px;border-radius:100px;background:var(--off);color:var(--muted);margin-bottom:8px;}
  .need-item.you .need-owner{background:var(--lime-soft);color:var(--lime-dark);}
  .need-h{font-size:16px;font-weight:800;color:var(--black);letter-spacing:-0.01em;margin-bottom:4px;}
  .need-p{font-size:13.5px;color:var(--text2);line-height:1.6;}

  /* DATA OWNERSHIP */
  .own-section{padding:96px 0;background:var(--off);border-bottom:1px solid var(--border);}
  .own-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:48px;}
  .own-card{border-radius:20px;padding:36px 34px;}
  .own-card.you{background:var(--lime-soft);border:1px solid rgba(170,255,69,0.4);}
  .own-card.fbs{background:var(--black);border:1px solid var(--black);}
  .own-badge{display:inline-flex;align-items:center;font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;padding:5px 12px;border-radius:100px;margin-bottom:18px;}
  .own-card.you .own-badge{background:var(--lime);color:var(--black);}
  .own-card.fbs .own-badge{background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);}
  .own-title{font-size:22px;font-weight:800;letter-spacing:-0.02em;margin-bottom:22px;line-height:1.15;}
  .own-card.you .own-title{color:var(--black);}
  .own-card.fbs .own-title{color:var(--white);}
  .own-list{list-style:none;display:flex;flex-direction:column;gap:13px;}
  .own-item{display:flex;align-items:flex-start;gap:11px;font-size:14px;line-height:1.5;}
  .own-card.you .own-item{color:var(--text);}
  .own-card.fbs .own-item{color:rgba(255,255,255,0.82);}
  .own-check{width:19px;height:19px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;margin-top:1px;}
  .own-card.you .own-check{background:var(--lime);color:var(--black);}
  .own-card.fbs .own-check{background:rgba(170,255,69,0.15);color:var(--lime);}
  .own-strip{margin-top:20px;background:var(--white);border:1px solid var(--border);border-radius:14px;padding:22px 26px;display:flex;align-items:center;gap:15px;font-size:14px;color:var(--text2);line-height:1.6;}
  .own-strip strong{color:var(--black);font-weight:700;}
  .own-strip-icon{font-size:22px;flex-shrink:0;}

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

  /* TIMELINE TO FIRST LEAD */
  .tl-wrapper{margin-top:48px;}
  .tl-phases{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px;}
  .tl-phase{background:var(--white);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all 0.2s;}
  .tl-phase:hover{transform:translateY(-3px);box-shadow:0 12px 32px -8px rgba(0,0,0,0.1);}
  .tl-phase-head{padding:20px 20px 16px;border-left:3px solid;}
  .tl-phase-tag{font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px;}
  .tl-phase-label{font-size:16px;font-weight:800;color:var(--black);margin-bottom:4px;letter-spacing:-0.01em;}
  .tl-phase-weeks{font-size:12px;color:var(--muted);font-weight:600;}
  .tl-phase-body{padding:0 20px 20px;}
  .tl-items{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}
  .tl-item{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--text2);line-height:1.45;}
  .tl-item-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:4px;}
  .tl-outcome{border-left:2px solid;padding:8px 12px;font-size:12px;font-weight:700;color:var(--black);background:var(--off);border-radius:0 6px 6px 0;}
  .tl-summary{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:28px 32px;display:flex;flex-direction:column;gap:24px;}
  .tl-track-label{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:12px;}
  .tl-track-bar{display:flex;height:36px;border-radius:8px;overflow:hidden;margin-bottom:8px;}
  .tl-bar-seg{display:flex;align-items:center;justify-content:center;}
  .tl-bar-lbl{font-size:11px;font-weight:800;letter-spacing:0.06em;}
  .tl-track-marks{display:flex;justify-content:space-between;padding:0 2px;}
  .tl-mark{font-size:10px;color:var(--muted);font-weight:500;}
  .tl-summary-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-top:24px;border-top:1px solid var(--border);}
  .tl-stat{text-align:center;}
  .tl-stat-val{font-size:26px;font-weight:900;color:var(--black);letter-spacing:-0.03em;line-height:1;}
  .tl-stat-unit{font-size:14px;font-weight:500;color:var(--muted);}
  .tl-stat-label{font-size:11px;color:var(--muted);margin-top:2px;}

  @media(max-width:900px){
    .plans-grid,.nurture-compare,.faq-grid,.need-grid,.own-grid{grid-template-columns:1fr;}
    .need-callout{position:static;}
    .tl-phases{grid-template-columns:1fr 1fr;}
    .compare-table{font-size:13px;}
    .compare-table th.col,.compare-table td.col{width:110px;}
    .setup-banner{flex-direction:column;}
    .setup-left{min-width:0;}
    .setup-right{border-left:none;border-top:1px solid var(--border);}
    .breakdown-grid{grid-template-columns:1fr 1fr !important;}
    .timeline-grid{grid-template-columns:1fr !important;}
    .split-head{grid-template-columns:1fr !important;}
  }
  @media(max-width:600px){
    .field-row{grid-template-columns:1fr;}
    .breakdown-grid{grid-template-columns:1fr !important;}
  }
`;

const ML = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMjkwMjI2ODdkNTJlNjk4ZjYwMzVkODk4YTI0MmFhMzgxNTlmMWQwMmRhN2ZlMDI2MGYxMTMzZGE0NWUyNDViZmQ1OTJiMjI5YjEzZjdjOTMiLCJpYXQiOjE3Nzc4MDQxNDEuMDU2ODcsIm5iZiI6MTc3NzgwNDE0MS4wNTY4NzMsImV4cCI6NDkzMzQ3Nzc0MS4wNTI3NTUsInN1YiI6IjkzMDA0MyIsInNjb3BlcyI6W119.Apd5ihW7N-KluBSDf-dovqu0O_Ia30wPUVjClBzRyOej5nne5be0poXt21OvB2PluTK4EyJO7ZBcOsitkoMG2Q6DSkjThmx0cjn-1APSFbWRAkp0VqXAljYyag-6LebecLKFjiSHNn5uAx441wje7CtSi4-qvb2UAIAYUX3El-upwv1TPges-H5dXbfvU0dOPOpStwNwg_neJOM1B7FyhZ8GOC2aVvaRkmsMJ_Q668dWd_1mhg21Bw35mXe6uzdQA90XENbpEjkn7ezw9Uv0jXDj-qHYs1EE6A08ulWRd-w2LERgr4MA_hJoz2IgjSn5cJWUfM-KtpGd9DxApaCZ_xbkx-zJRIQQXCQKC8WmDNLfDfjpsDGCMxdhcJ2j94fPX66aBNZTWq1DbEH4Z8SWGvgbwYdFEmBeUld552x8x_iGXRFLmicL6EOeng0bXmFlMwD2twukjkWsoVIQW8Vbdyza8XaNi-dtnDVLuMOqNhb2DDa0UbaHwW0DsEPPvHznrd2ut0zVtq-qr9MwiI1kAVwFcKgvJ5NXvjjXH0dgD0Z4iTn6KhHQuGoTav6vQazCsmtG0iicIvbVNcz_eXbi7G2sr_uUQZxRP_G2E-hya_NsnZmspqsTr4JRTckWgrTBYYH1QK8Zbd-cTPNx9y3vDlmsQx_N_5UG1JHIvQGBb2U";
const JURS = ["Portugal","Malta","Cyprus","Greece","UAE","Singapore","Malaysia","Australia / NZ","USA (EB-5)","Paraguay","St. Kitts & Nevis","Dominica","Grenada","Antigua","Türkiye","Mexico","Other"];

const PLANS = [
  {
    id:"business", isPremium:false,
    badge:"Business", bc:"pb-b",
    name:"Business",
    tagline:"Monthly lead campaign management and leads delivery to your dashboard. FBS runs the funnel — your team handles outreach, nurture, and conversion.",
    price:899, foundingPrice:499,
    priceNote:"/ month · monthly management fee",
    ctaCls:"cta-b", ctaText:"Get Started",
    features:[
      {t:"Exclusive leads matched to your jurisdiction",y:true},
      {t:"Global Mobility Score + full breakdown per lead",y:true},
      {t:"Basic AI scoring + verification",y:true},
      {t:"Advisor Brief before first contact",y:true},
      {t:"Ad campaign management",y:true},
      {t:"1 traffic source (Meta, Reddit, etc.)",y:true},
      {t:"CRM integration + lead export",y:true},
      {t:"Dashboard access + onboarding docs",y:true},
      {t:"Basic reporting: tier split, timeline, capital",y:true},
    ]
  },
  {
    id:"premium", isPremium:true,
    badge:"Most Popular", bc:"pb-p",
    name:"Professional",
    tagline:"Everything in Business, plus an AI engine that scores, warms, and calls your leads — they arrive conversation-ready.",
    price:1299, foundingPrice:899,
    priceNote:"/ month · monthly management fee",
    ctaCls:"cta-p", ctaText:"Get Started",
    plusIntro:"Everything in Business, plus:",
    features:[
      {t:"AI Voice Caller — records, transcribes + auto-summarizes to CRM",y:true},
      {t:"AI Intelligence — live audience + intent layer",y:true},
      {t:"Auto-updated ICP persona (deepens with volume)",y:true},
      {t:"Up to 3 traffic sources + retargeting",y:true},
      {t:"FBS-managed nurture (email / SMS / WhatsApp)",y:true},
      {t:"Lead warming — leads arrive ready to talk",y:true},
      {t:"Real-time exclusive leads",y:true},
      {t:"Lead replacement guarantee (quality SLA)",y:true},
      {t:"Two-way CRM sync + custom webhooks",y:true},
      {t:"Monthly performance + attribution report",y:true},
      {t:"Quarterly ICP review call + dedicated strategist",y:true},
      {t:"Priority onboarding + support",y:true},
    ]
  }
];

const FAQ = [
  {q:"What is the main purpose of the platform?",a:"We get you qualified leads. Real investors who want a second passport or residency — not tire-kickers. We run the ads, host the webinars, score every prospect, and drop them into your dashboard ready to talk."},
  {q:"Is this lead generation, marketing, or a business partnership?",a:"It's all three. We generate the leads and run the marketing for you — and you receive leads <strong>exclusively for your jurisdiction and your offer</strong>. So it's a partnership, not a list you buy — no other firm gets the same leads."},
  {q:"Is there a cost — during pilot and after launch?",a:"Yes. There's a one-time setup fee to build your funnel, and you cover your own media budget for the ads. After that, we deliver qualified leads to you on a monthly subscription. Simple."},
  {q:"What is the commercial model?",a:"Three parts: a <strong>one-time setup fee</strong> to build and launch your funnel, your own <strong>media budget</strong> paid straight to the ad platforms, and a <strong>monthly subscription</strong> where we deliver qualified leads to your dashboard. That's it."},
  {q:"Do you have a brochure or written material?",a:"Yes. The <a href='/overview' style='color:var(--lime-dark);text-decoration:none;font-weight:600;'>Overview page</a> shows you exactly how the funnel works, step by step. This page breaks down what's in the setup and how the rollout goes. And on the call, we'll show you a plan built for your specific market."},
  {q:"What's the difference between Business and Professional?",a:"Business puts leads in your dashboard — your team does the follow-up. Professional does the follow-up for you: an AI engine scores, warms, and calls every lead first. So by the time you speak with them, they already know who you are and they're ready to talk."},
  {q:"Are leads exclusive to my firm?",a:"100% yes. Nobody else in your jurisdiction gets your leads. This isn't a shared pool. Leads matched to your jurisdiction and offer come only to you."},
  {q:"What about ad spend?",a:"You pay for the ads directly — straight to the platforms. We build and manage the campaigns, but the media budget is yours to control. We'll help you figure out the right number during onboarding."},
  {q:"How fast do I receive first leads?",a:"Give it 4–8 weeks. We build the funnel, test the traffic, then go live. Your first webinar and first real leads usually land 6–8 weeks after you sign — and that first webinar is covered by the setup fee."},
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
      const r=await fetch("https://connect.mailerlite.com/api/subscribers",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+ML},body:JSON.stringify({email:form.email,fields:{name:parts[0]||"",last_name:parts.slice(1).join(" ")||"",company:form.company,phone:form.phone||"",jurisdiction:form.jurisdiction||"",firm_type:plan?.name||"",monthly_capacity:form.budget||"",message:form.message||""}})});
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
          <h2>Get started with {plan?.name}</h2>
          <p className="modal-sub"><span style={{textDecoration:"line-through",opacity:0.5,fontWeight:500}}>${plan?.price}/mo</span> <strong style={{color:"var(--lime-dark)"}}>${plan?.foundingPrice}/mo</strong> + <span style={{textDecoration:"line-through",opacity:0.5,fontWeight:500}}>$5,000</span> <strong>$1,950</strong> setup (founding rate). We review your application within 24 hours and book a discovery call.</p>
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
              {busy?"Submitting…":"Get Started →"}
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
        <div className="eyebrow-pill"><span className="eyebrow-dot">Pricing</span> Two packages · Fully exclusive</div>
        <h1>Leads delivered.<br/><span className="accent">Or leads warmed.</span></h1>
        <p className="hero-sub">Both packages deliver exclusive qualified leads matched to your jurisdiction. The difference is how much of the work FBS does before you make the first call.</p>

        <div style={{display:"flex",justifyContent:"center"}}>
          <div className="setup-banner">
            <div className="setup-left">
              <div className="setup-tag">One-time setup fee — both plans</div>
              <div className="setup-price-row">
                <div className="setup-price-old">$5,000</div>
                <div className="setup-price-new">$1,950</div>
                <div className="setup-price-lbl">once</div>
              </div>
              <div className="setup-desc">Charged after discovery call · before go-live</div>
            </div>
            <div className="setup-right">
              <div className="setup-right-label">What's included</div>
              {["Webinar landing page (copy + design + build)","GMS survey + jurisdiction module","Email series: confirmation, warm-up, reminders","Ad creatives (2–3 variants) + campaign launch","UTM tracking + CRM/webhook integration","Kick-off call + end-to-end QA before launch"].map(t=>(
                <div key={t} className="setup-item"><div className="setup-check">✓</div>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* SETUP FEE BREAKDOWN — right after hero */}
    <section style={{padding:"72px 0",background:"var(--off)",borderBottom:"1px solid var(--border)"}}>
      <div className="wrap">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:24,height:1,background:"var(--lime-dark)",opacity:0.5}}/>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--lime-dark)"}}>Setup Fee</div>
        </div>
        <div className="split-head" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start",marginBottom:32}}>
          <h2 style={{fontSize:"clamp(24px,3vw,38px)",fontWeight:800,letterSpacing:"-0.03em",color:"var(--black)",margin:0,lineHeight:1.15}}>What your <span style={{background:"var(--lime)",padding:"0 6px",borderRadius:4}}>$1,950</span> setup fee covers.</h2>
          <p style={{fontSize:14,color:"var(--text2)",lineHeight:1.75,margin:0,paddingTop:6}}>Everything needed to launch your funnel — built once, runs continuously. Funnel pages, survey, email sequences, ad creatives, tracking, CRM integration, and onboarding. Charged once after your discovery call, before go-live. Monthly management starts after launch.</p>
        </div>

        <div className="breakdown-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[
            {icon:"🖥",title:"Funnel & Pages",items:[
              "Webinar landing page for your jurisdiction (copy + design + build)",
              "Thank-you page with lead warm-up logic",
              "GMS survey: core module + jurisdiction-specific questions",
              "Lead magnet (jurisdiction playbook) delivered on survey completion",
            ]},
            {icon:"📧",title:"Email & Communications",items:[
              "Email series: confirmation + pre-webinar warm-up + reminders (7–9 emails)",
              "MailerLite setup: group, automations, sender domain",
              "Add-to-calendar integration + day-of reminder sequence",
              "Deliverability test (inbox placement, not spam)",
            ]},
            {icon:"🎬",title:"Webinar Content",items:[
              "Partner video invite — edit and production",
              "Webinar presentation structure and design",
              "Script + speaker prep session with your team",
              "Webinar platform configuration and test run",
            ]},
            {icon:"📊",title:"Traffic & Data",items:[
              "Ad creatives (2–3 variants) + campaign setup and launch",
              "UTM tracking and end-to-end attribution to lead",
              "CRM/webhook integration for lead delivery",
              "GMS scoring setup: HOT / WARM / COLD tiers for your ICP",
            ]},
            {icon:"🚀",title:"Onboarding",items:[
              "Kick-off call + full ICP brief",
              "End-to-end QA of entire funnel before launch",
            ]},
            {icon:"📌",title:"Not included in setup",items:[
              "Ongoing ad spend (managed within monthly fee)",
              "CRM licence or third-party platform subscriptions",
              "Paid webinar platform fees (if applicable)",
            ],muted:true},
          ].map((s,i)=>(
            <div key={i} style={{background:s.muted?"#F8F8F6":"var(--white)",border:"1px solid var(--border)",borderRadius:12,padding:"20px 22px"}}>
              <div style={{fontSize:20,marginBottom:8}}>{s.icon}</div>
              <div style={{fontSize:12,fontWeight:800,color:s.muted?"var(--muted)":"var(--black)",marginBottom:12,letterSpacing:"-0.01em"}}>{s.title}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {s.items.map((item,j)=>(
                  <div key={j} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                    <span style={{width:15,height:15,borderRadius:4,background:s.muted?"#E5E5E5":"var(--lime)",color:s.muted?"#999":"var(--black)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,flexShrink:0,marginTop:1}}>{s.muted?"–":"✓"}</span>
                    <span style={{fontSize:12,color:s.muted?"var(--muted)":"var(--text2)",lineHeight:1.55}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ROLLOUT TIMELINE */}
    <section style={{padding:"80px 0",background:"var(--white)",borderBottom:"1px solid var(--border)"}}>
      <div className="wrap">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:24,height:1,background:"var(--lime-dark)",opacity:0.5}}/>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--lime-dark)"}}>Rollout Timeline</div>
        </div>
        <h2 style={{fontSize:"clamp(22px,2.8vw,34px)",fontWeight:800,letterSpacing:"-0.03em",color:"var(--black)",margin:"0 0 40px",lineHeight:1.2}}>From kick-off to scaling — the first 8 weeks.</h2>

        <div className="timeline-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
          {[
            {weeks:"Weeks 1–3",title:"Setup & preparation",desc:"Partner onboarding, ICP definition, funnel setup, tracking configuration, and campaign preparation.",color:"var(--lime)"},
            {weeks:"Weeks 3–6",title:"Launch",desc:"Campaigns go live, qualified prospects begin entering the platform, and your first live webinar takes place — all covered under the setup fee.",color:"#0A0A0A"},
            {weeks:"Weeks 6–8",title:"Optimize & scale",desc:"Optimization, scaling, and continuous reporting based on real campaign data. Additional webinars run under your monthly plan.",color:"#4A7FC1"},
          ].map((p,i)=>(
            <div key={i} style={{background:"var(--off)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden"}}>
              <div style={{borderLeft:`3px solid ${p.color}`,padding:"18px 20px 16px"}}>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:6}}>{p.weeks}</div>
                <div style={{fontSize:16,fontWeight:800,color:"var(--black)",letterSpacing:"-0.02em",marginBottom:8}}>{p.title}</div>
                <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.6}}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{background:"var(--black)",borderRadius:14,padding:"24px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(170,255,69,0.7)",marginBottom:8}}>Initial validation phase</div>
            <div style={{fontSize:15,color:"rgba(255,255,255,0.8)",lineHeight:1.65,maxWidth:560}}>The setup fee covers your <strong style={{color:"var(--lime)"}}>first educational webinar</strong>, generating approximately <strong style={{color:"var(--lime)"}}>100 registrations</strong>. Subsequent webinars are run continuously under your monthly plan.</div>
          </div>
          <div style={{display:"flex",gap:0,flexShrink:0}}>
            {[{n:"1",l:"webinar included"},{n:"~100",l:"registrations"},{n:"8",l:"weeks to scale"}].map((s,i)=>(
              <div key={i} style={{paddingRight:24,marginRight:24,borderRight:i<2?"1px solid rgba(255,255,255,0.12)":"none"}}>
                <div style={{fontSize:26,fontWeight:900,color:"var(--lime)",letterSpacing:"-0.03em",lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* PLANS */}
    <section className="plans-section">
      <div className="wrap">
        <div style={{textAlign:"center",marginBottom:40,paddingTop:16}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>After setup — choose your monthly plan</div>
          <h2 style={{fontSize:"clamp(24px,3vw,38px)",fontWeight:800,letterSpacing:"-0.03em",color:"var(--black)",margin:"0 0 12px"}}>Monthly lead management.</h2>
          <p style={{fontSize:15,color:"var(--text2)",maxWidth:540,margin:"0 auto",lineHeight:1.7}}>Both plans deliver exclusive qualified leads matched to your jurisdiction. The difference is how much of the work FBS does before you make the first call.</p>
        </div>

        {/* FOUNDING MEMBERS BANNER */}
        <div className="founding-banner">
          <div className="founding-banner-left">
            <div className="founding-badge">Founding Members</div>
            <div className="founding-text">
              Special pricing locked for <strong>1 year</strong> — available for the first 10 partners only.
              Setup fee and monthly rate reduced at founding rates.
            </div>
          </div>
          <div className="founding-spots">
            <span className="founding-spots-num">7</span>
            <span>spots<br/>left</span>
          </div>
        </div>

        <div className="plans-grid">
          {PLANS.map(plan=>(
            <div key={plan.id} className={"plan-card"+(plan.isPremium?" premium":"")}>
              <div className={"plan-badge "+plan.bc}>
                {plan.isPremium&&<span className="ping-dot"/>}
                {plan.badge}
              </div>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-tagline">{plan.tagline}</div>
              <div className="price-old">${plan.price}/mo</div>
              <div className="price-new-row">
                <div className="plan-price">${plan.foundingPrice}</div>
                <div className="plan-price-mo">/mo</div>
              </div>
              <div className="plan-price-note">{plan.priceNote}</div>
              <button className={"plan-cta "+plan.ctaCls} onClick={()=>setModal(plan)}>{plan.ctaText}</button>
              <hr className="plan-hr"/>
              <div className="features-label">What's included</div>
              {plan.plusIntro&&<div className="features-plus">{plan.plusIntro}</div>}
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

    {/* TIMELINE TO FIRST LEAD */}
    <section className="nurture-section">
      <div className="wrap">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:24,height:1,background:"var(--lime-dark)",opacity:0.5}}/>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--lime-dark)"}}>Timeline to First Lead</div>
        </div>
        <h2 style={{fontSize:"clamp(26px,3.4vw,40px)",fontWeight:800,letterSpacing:"-0.03em",color:"var(--black)",marginBottom:12,lineHeight:1.1}}>
          From signed agreement to leads in your dashboard.
        </h2>
        <p style={{fontSize:16,color:"var(--text2)",maxWidth:580,lineHeight:1.7,marginBottom:0}}>
          Setup takes 4–8 weeks in total. The first weeks are foundation — funnel, copy, pixels, ICP. Then we test traffic, optimise, and scale. Most partners receive their first verified leads within 6–8 weeks of signing.
        </p>

        {/* Timeline visual */}
        <div className="tl-wrapper">
          <div className="tl-phases">
            {[
              {
                phase:"Phase 1",label:"Discovery & Setup",weeks:"Weeks 1–2",color:"var(--lime)",
                items:["Discovery call — offer, ICP, jurisdiction","Global Mobility Score framework built","Landing page + survey configured","Pixel, UTM, analytics stack connected","Onboarding documentation delivered"],
                outcome:"Funnel ready to receive traffic"
              },
              {
                phase:"Phase 2",label:"Funnel Creation",weeks:"Weeks 2–4",color:"#0A0A0A",
                items:["Video ad scripts and creatives produced","Webinar script + slides prepared","MailerLite sequences configured","CRM integration set up","ICP targeting brief finalised"],
                outcome:"All assets live and tested"
              },
              {
                phase:"Phase 3",label:"Traffic Testing",weeks:"Weeks 4–8",color:"#4A7FC1",
                items:["First ad campaigns launched (test budget)","A/B testing: creatives, audiences, copy","Conversion rate optimisation on survey","First webinar run — registrations collected","Initial leads scored and verified"],
                outcome:"First qualified leads delivered"
              },
              {
                phase:"Phase 4",label:"Scale",weeks:"Week 8+",color:"var(--hot-color)",
                items:["Winning campaigns scaled","ICP persona updated from real data","Lead volume increases with budget","Monthly reporting begins","Quarterly ICP review scheduled (Professional)"],
                outcome:"Consistent lead flow at scale"
              },
            ].map((ph,i)=>(
              <div key={i} className="tl-phase">
                <div className="tl-phase-head" style={{borderLeftColor:ph.color}}>
                  <div className="tl-phase-tag" style={{color:ph.color}}>{ph.phase}</div>
                  <div className="tl-phase-label">{ph.label}</div>
                  <div className="tl-phase-weeks">{ph.weeks}</div>
                </div>
                <div className="tl-phase-body">
                  <ul className="tl-items">
                    {ph.items.map((item,j)=>(
                      <li key={j} className="tl-item">
                        <span className="tl-item-dot" style={{background:ph.color}}/>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="tl-outcome" style={{borderLeftColor:ph.color}}>
                    <span className="tl-outcome-label">→</span> {ph.outcome}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary bar */}
          <div className="tl-summary">
            <div className="tl-summary-track">
              <div className="tl-track-label">Timeline to first leads</div>
              <div className="tl-track-bar">
                {[
                  {label:"Setup",w:"25%",color:"var(--lime)"},
                  {label:"Build",w:"25%",color:"#0A0A0A"},
                  {label:"Test",w:"25%",color:"#4A7FC1"},
                  {label:"Scale",w:"25%",color:"var(--hot-color)"},
                ].map((s,i)=>(
                  <div key={i} className="tl-bar-seg" style={{width:s.w,background:s.color}}>
                    <span className="tl-bar-lbl" style={{color:s.color==="var(--lime)"||s.color==="var(--hot-color)"?"var(--black)":"var(--white)"}}>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="tl-track-marks">
                {["Week 0","Week 2","Week 4","Week 6–8","Week 8+"].map((m,i)=>(
                  <span key={i} className="tl-mark">{m}</span>
                ))}
              </div>
            </div>
            <div className="tl-summary-stats">
              {[
                {val:"2–3",unit:"weeks",label:"Funnel creation"},
                {val:"4",unit:"weeks",label:"Traffic testing"},
                {val:"4–8",unit:"weeks",label:"Total to first lead"},
              ].map((s,i)=>(
                <div key={i} className="tl-stat">
                  <div className="tl-stat-val">{s.val}<span className="tl-stat-unit"> {s.unit}</span></div>
                  <div className="tl-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* WHAT WE NEED FROM YOU */}
    <section className="need-section">
      <div className="wrap">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:24,height:1,background:"var(--lime-dark)",opacity:0.5}}/>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--lime-dark)"}}>Your Involvement</div>
        </div>
        <h2 style={{fontSize:"clamp(26px,3.4vw,40px)",fontWeight:800,letterSpacing:"-0.03em",color:"var(--black)",marginBottom:12}}>What we need from you.</h2>
        <p style={{fontSize:16,color:"var(--text2)",maxWidth:580,lineHeight:1.7,marginBottom:0}}>
          We keep partner effort to a minimum. You provide one short video and a few approvals — our team handles the brief, scripting, production, setup, and go-live.
        </p>

        <div className="need-grid">
          <div className="need-callout">
            <div className="need-callout-tag">The only thing we need from you</div>
            <h3>One video. That's it.</h3>
            <p>From kick-off to launch, your only task is recording a short video from our script and signing off on the final assets. FBS builds and produces everything else.</p>
          </div>

          <div className="need-steps">
            {[
              {owner:"FBS",h:"We send you a brief",p:"A short onboarding brief covering your offer, ICP, and jurisdiction — so we build the funnel around your firm."},
              {owner:"FBS",h:"We send the video script",p:"Our team writes a ready-to-read script for your intro / educational video. No copywriting or planning on your side."},
              {owner:"You",you:true,h:"You record the video",p:"The one thing we need from you: record the video from our script. A phone or webcam is fine — we handle editing and polish."},
              {owner:"FBS",h:"We send everything for approval",p:"Funnel, landing pages, creatives, and email sequences go to you for a final sign-off before anything goes live."},
              {owner:"FBS",h:"Our team does the full setup & production",p:"We build and produce the entire funnel — setup, editing, tracking, and launch. You stay hands-off from here."},
            ].map((s,i)=>(
              <div key={i} className={"need-item"+(s.you?" you":"")}>
                <div className="need-num">{i+1}</div>
                <div className="need-body">
                  <span className="need-owner">{s.owner}</span>
                  <div className="need-h">{s.h}</div>
                  <div className="need-p">{s.p}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* DATA OWNERSHIP */}
    <section className="own-section">
      <div className="wrap">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:24,height:1,background:"#888",opacity:0.4}}/>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#888"}}>Data Ownership</div>
        </div>
        <h2 style={{fontSize:"clamp(26px,3.4vw,40px)",fontWeight:800,letterSpacing:"-0.03em",color:"var(--black)",marginBottom:12,lineHeight:1.1}}>
          The partner owns the data. We just build the infrastructure.
        </h2>
        <p style={{fontSize:16,color:"var(--text2)",maxWidth:620,lineHeight:1.7,marginBottom:0}}>
          Every lead, every contact detail, every account is yours. FBS builds and runs the machine that generates them — but the data, the assets, and the client relationships belong to your firm. No shared pools, no lock-in.
        </p>

        <div className="own-grid">
          <div className="own-card you">
            <div className="own-badge">You own</div>
            <div className="own-title">Your data. Your assets. Your clients.</div>
            <ul className="own-list">
              {[
                "All leads — exclusive to your firm, never resold or shared",
                "Full contact data, survey responses & Global Mobility Scores",
                "Your CRM, ad accounts, domain, and tracking pixels",
                "Landing pages, creatives, and funnel assets",
                "Direct client relationships — you close, you retain",
                "Full export anytime (CSV / XLSX) — zero lock-in",
              ].map((t,i)=>(
                <li key={i} className="own-item"><span className="own-check">✓</span>{t}</li>
              ))}
            </ul>
          </div>

          <div className="own-card fbs">
            <div className="own-badge">We build &amp; run</div>
            <div className="own-title">The infrastructure behind the leads.</div>
            <ul className="own-list">
              {[
                "Lead-generation funnel + landing pages",
                "Ad campaign setup, management & optimisation",
                "Global Mobility Score engine + lead verification",
                "Dashboard, CRM integration & custom webhooks",
                "Nurture + AI scoring / warming layer (Professional)",
                "Monthly reporting & performance attribution",
              ].map((t,i)=>(
                <li key={i} className="own-item"><span className="own-check">✓</span>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="own-strip">
          <span className="own-strip-icon">🔒</span>
          <div><strong>Portable by design.</strong> Cancel anytime and you walk away with your data, your accounts, and your assets intact — nothing stays locked inside FBS.</div>
        </div>
      </div>
    </section>

    {/* FAQ */}

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
        <button className="btn-lime" onClick={()=>setModal(PLANS[1])}>Get Started →</button>
        <div style={{marginTop:16,display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap"}}>
          {["$1,950 setup · one-time (founding rate)","Discovery call within 48h","First leads in 4–8 weeks"].map(t=>(
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
