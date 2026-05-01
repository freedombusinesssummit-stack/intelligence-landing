# FBS Intelligence — Landing Page

Pre-qualified investment migration leads platform for citizenship, residency and global mobility firms.

**Live:** https://intelligence.fsummit.net

## Stack

- React 18 + Vite 5
- Zero dependencies beyond React (all CSS in JS, no Tailwind/etc.)

## Local dev

```bash
npm install
npm run dev
```

## Deploy to Vercel

The project is auto-deployed via GitHub → Vercel integration on every push to `main`.

## Custom domain setup

In Vercel project settings → Domains:
- Add `intelligence.fsummit.net`
- In Cloudflare DNS add a CNAME record:
  - Name: `intelligence`
  - Target: `cname.vercel-dns.com`
  - Proxy: **DNS only** (grey cloud)
