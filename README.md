# LamboSpec AI 🏎️ — The $79 Supercar Defect & Negotiation Engine

> **"Sell painkillers, not vitamins."**  
> A pre-purchase inspection and negotiation intelligence engine for exotic car buyers. Detects missing dealbreaker factory options (front axle lift, forged carbon), calculates upcoming catastrophic maintenance costs (carbon ceramic rotor oxidation, ISR single-clutch snap readings), and computes the exact dollar amount to negotiate off the dealer's price.

---

## ⚡ 24/7 Cloud Architecture (Runs Even When Your PC Is OFF)

This system is designed to run autonomously **without requiring your local computer to stay powered on**:

1. **GitHub Actions Scheduled Worker (`.github/workflows/market_crawler.yml`)**:
   - Triggers every 6 hours via GitHub's free cloud runners (`cron: '0 */6 * * *'`).
   - Runs `engine/market_crawler.py` to crawl newly closed auctions from Bring a Trailer, Cars & Bids, and European dealer networks.
   - Updates `data/live_market_comps.json` and automatically commits updates back to GitHub.
   - Cost: **$0.00 / month** (within GitHub's 2,000 free minutes).

2. **Web Application (`public/index.html`)**:
   - Single-page, responsive, dark-mode supercar cockpit design.
   - Can be hosted for $0 on **Vercel**, **GitHub Pages**, or **Cloudflare Pages**.
   - Live interactive listing diagnostic tool + $79 full dossier checkout.

3. **Zero-Upfront Payment Infrastructure**:
   - Integrated with **Polar.sh** / **Lemon Squeezy** (Merchant of Record).
   - Zero monthly subscription fees, zero setup fees.
   - Takes standard ~4-5% only when a real $79 customer payment occurs.

---

## 📊 Knowledge Base & Models Covered (`data/lamborghini_specs.json`)

- **Huracán Series (LP610-4, LP580-2, EVO, STO, Tecnica)**:
  - Front differential output seal seepage ($3,800)
  - Coolant reservoir seam micro-fractures ($1,200)
  - Front axle hydraulic lift necessity ($10,000 resale impact)
  - Carbon ceramic brake (CCB) rotor weight verification ($24,000 replacement)
- **Aventador Series (LP700-4, SV, S, SVJ)**:
  - 7-speed ISR single-clutch release bearing & snap reading wear ($22,000 engine-out service)
  - Horizontal pushrod rear suspension bushings ($5,500)
  - Safety Recall L616 EVAP purge canister fuel vapor check
- **Urus Super SUV (4.0L Twin-Turbo V8)**:
  - Turbo coolant valley O-rings and plastic Y-connectors ($3,200)
  - 23-inch wheel options & Bang & Olufsen 3D Advanced Audio valuation
  - Air suspension compressor valve block sag

---

## 🚀 Quick Start & Local Test

```bash
# Test the market crawler locally
python engine/market_crawler.py

# Preview the web interface
# Simply open public/index.html in any browser
```

---

## 🔒 License & Confidentiality
Private Proprietary Engine for **federal216**. All rights reserved.
