# Carconomy — Current State & Vision Alignment Report

**Role:** Senior Product Strategist  
**Target Market:** Price-conscious Indian car buyers & owners (₹5–25 Lakh segment)  
**Core Promise:** *"Know what your car really costs."*  
**Date:** October 2026  

---

## Executive Summary

Carconomy possesses a mathematically sophisticated, responsive financial engine capable of calculating true ownership costs (₹/km, multi-year depreciation, driver-induced wear, and keep-or-sell break-evens). However, **the live product suffers from an acute vision identity crisis**. While our vision targets budget-conscious buyers looking at Swifts, Balenos, Punches, and Nexons (₹5–25L), the live application defaults to a ₹55 Lakh BMW 3 Series, a ₹4.2 Lakh/month household income, and a catalog dominated by luxury vehicles (Audi A4, Porsche Macan, Mercedes C-Class). Furthermore, the core user loop is artificially restricted: users cannot search for or add their own car, and all monetization touchpoints (service bookings, paid consultations) are dead-end visual mockups. Carconomy today is an **impressive high-fidelity mathematical prototype**, but it is not yet an operational MVP for the Indian mass market.

---

## Maturity Scorecard

| Dimension | Score (1–10) | Rationale |
| :--- | :---: | :--- |
| **Product Usefulness** | **5 / 10** | High-fidelity financial modeling, but locked to an un-editable 11-car catalog that excludes India's top 10 best-selling vehicles. |
| **Vision Alignment** | **3 / 10** | Severe luxury/HNI drift: 9 of 11 cars cost ₹26.5L–₹88L, with ₹40L default loans and chauffeur profiles, alienating the target ₹5–25L buyer. |
| **Personalization** | **7 / 10** | Granular multi-driver modeling (daily km, driving style, city vs. highway split, wear multipliers) is genuinely innovative and reactive. |
| **User Experience (UX)** | **6 / 10** | Clean, minimalist, modern aesthetic with fast reactive updates, marred by rigid navigation and zero vehicle onboarding for newcomers. |
| **Data Credibility** | **6 / 10** | Accurate loan amortization and city-traffic degradation formulas, but depreciation curves and maintenance costs are hardcoded static heuristics. |
| **Business Readiness** | **2 / 10** | Zero revenue infrastructure: service booking and consultation CTAs are local React state toggles with no lead capture, payments, or partner integrations. |

---

## What Is Working (Top 5 Capabilities)

1. **Holistic "True Cost Per Kilometer" (₹/km) Engine:**  
   Unlike generic EMI calculators on CarWale or CarDekho, Carconomy factors in annual depreciation, fuel/energy consumption, insurance, routine service, repairs, tyres, and financing interest into a single, intuitive metric that reveals the hidden cost of car ownership.
2. **Household Driver & Behavioral Wear Modeling:**  
   The platform uniquely accounts for multiple family drivers. It dynamically adjusts fuel consumption and mechanical wear based on driving style (Conservative, Moderate, Aggressive) and city-versus-highway splits, showing who in the family incurs what cost share.
3. **Keep vs. Sell Decision Framework:**  
   The mathematical comparison between the 12-month forward cost of keeping an existing vehicle (accounting for plateaued depreciation vs. rising maintenance) versus the upfront transaction and steep initial depreciation hit of buying a replacement is rigorous and defensible.
4. **City-Calibrated Fuel & EV Modeling:**  
   The engine accounts for city-specific congestion multipliers (e.g., Mumbai, Bengaluru, NCR) and handles internal combustion (petrol/diesel) as well as electric vehicles (kWh/100 km and regenerative braking in urban stop-and-go).
5. **Clean, Fast, Responsive Interface:**  
   The active interface is lightweight, renders instantly, supports light/dark themes, and presents dense financial figures in digestible visual breakdowns.

---

## Vision Gaps (Top 5 Strategic Mismatches)

1. **Massive Luxury Drift in Catalog & Defaults:**  
   The seed dataset contains the BMW 3 Series, Mercedes C-Class, Audi A4, Porsche Macan, BMW i4, Toyota Camry, and Toyota Fortuner. **India's mass-market staples—Maruti Swift, WagonR, Baleno, Tata Punch, Hyundai Grand i10 NIOS, and Brezza—are completely absent.**
2. **Zero Vehicle Input / Customization for Users:**  
   Users cannot type their car name, enter their purchase price, input their odometer reading, or add an unlisted vehicle. If a user owns a 2019 Swift, they cannot calculate their numbers without manually contorting an existing luxury profile.
3. **Unrelatable Default Financial Baseline:**  
   The platform defaults to a ₹4.2 Lakh monthly income (top 0.05% in India), ₹15 Lakh down payment, ₹40 Lakh loan, and a personal Chauffeur. A ₹5–15 Lakh car buyer opening the platform immediately perceives it as an app for wealthy corporate executives.
4. **Simulated Commercial Funnels (Phantom Monetization):**  
   The "Services" and "Consultancy" tabs have interactive buttons that toggle to "Booked" or "Requested" in local state. There is no lead capture (name, phone, WhatsApp, email), no scheduling calendar, no Razorpay/Stripe checkout, and no dealer referral mechanism.
5. **Architectural & Codebase Ghosting:**  
   Multiple earlier components (e.g., `AddCarModal.tsx`, `BuyCarWizard.tsx`, `CarComparisonView.tsx`, `LandingPage.tsx`) sit orphaned in `src/components/`, while `src/ui/` runs an alternate lightweight flow. Key functionality (like adding custom cars) exists in disconnected legacy code but was omitted from the live app shell.

---

## Priority Roadmap (Next 5 Strategic Actions)

| Rank | Action | Impact | Urgency | Strategic Focus |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **Mass-Market Vehicle Realignment** | **High** | **Immediate** | Replace luxury defaults with ₹5–25L segment leaders (Punch, Swift, Baleno, Brezza, Nexon, Creta, Elevate, Sonet, Tiago EV). Set default car to a Swift or Nexon with realistic middle-class finances (₹75k–₹1.5L/mo). |
| **2** | **"My Car" Custom Onboarding & Free Input** | **High** | **Immediate** | Allow users to select make/model/year from a standardized 50-car Indian database OR manually type their car, purchase price, year, and fuel type. |
| **3** | **High-Intent Lead Capture (MVP Monetization)** | **High** | **High** | Replace mock "Book" buttons with a functional lead intake modal (Name, Phone/WhatsApp, Pincode) capturing demand for insurance renewal, used-car inspection, and buying consultation. |
| **4** | **Side-by-Side Mass-Market Comparison Tool** | **Medium** | **High** | Re-orient the "Decide" tab to compare common Indian car dilemmas (e.g., *Punch Petrol vs. Punch EV*, *Brezza Petrol vs. Grand Vitara Hybrid*, *Swift AMT vs. Baleno MT*). |
| **5** | **Codebase Rationalization** | **Medium** | **Medium** | Clean out dead orphaned components in `src/components/` and consolidate working features into the primary `src/ui/` architecture to ensure maintainability. |

---

## What Not to Build Yet

- **Do NOT build a full multi-vendor garage marketplace:** Onboarding local garages and handling real-time slot booking requires heavy ground operations. Use affiliate links or concierge WhatsApp intake first.
- **Do NOT build complex AI Chatbots:** Carconomy’s value lies in deterministic, trustworthy mathematical charts and cost-per-km clarity, not generic generative text.
- **Do NOT integrate automated live bank API underwriting:** Indian auto loan APIs are closed and bureaucratic. Use simple affiliate lead-generation forms targeting DSA/fintech partners (e.g., BankBazaar, Kuwy).
- **Do NOT expand into luxury cars, supercars, or commercial fleets:** Remain aggressively focused on the ₹5–25 Lakh Indian private car buyer.

---

## Founder Verdict

> **Verdict: High-Potential Prototype, Not Yet a Credible MVP**

Carconomy has successfully solved the hardest conceptual problem: creating a coherent, multi-variable automotive financial algorithm tailored to the Indian driving environment. However, because a real user cannot enter their own car, cannot browse the cars they actually buy, and cannot complete any commercial transaction, it cannot yet be deployed to real users as a functional MVP. It is one focused product iteration away from becoming a compelling, viral tool for Indian car buyers.

---

## Next 30 Days: Practical Execution Plan

### Week 1: Catalog & Seed Data Realignment
- Purge BMW, Porsche, Mercedes, and Audi from the primary catalog.
- Seed the top 15 Indian passenger vehicles (Maruti Swift, Baleno, Brezza, Ertiga, Dzire; Tata Punch, Nexon, Tiago EV; Hyundai Creta, Venue, i20; Mahindra Thar, Scorpio-N, XUV700; Kia Seltos).
- Reset initial defaults: ₹90,000 monthly income, ₹2 Lakh down payment, ₹8 Lakh loan, Tata Nexon / Maruti Brezza as active vehicle.

### Week 2: User Vehicle Input & Customization
- Wire up a clean "Add / Change My Car" workflow allowing users to set year, odometer, variant, and purchase price.
- Store user-created vehicles in `localStorage` so returning users immediately see their own car’s true cost.

### Week 3: Real Consultation & Advisory Monetization
- Replace the dummy "Request session" button on the ₹999 and ₹2,499 packages with a functional booking flow (Calendly / WhatsApp Business link + payment integration or phone number capture).
- Manually service the first 10 consultations to validate user pain points and willingness to pay before writing any backend booking software.

### Week 4: User Testing & Distribution
- Share the aligned platform with 20 real car owners in the ₹8–20 Lakh bracket (office commuters, multi-driver households).
- Measure: Do they understand their ₹/km number? Does the Keep vs. Sell verdict resonate? Will they submit their phone number for insurance or consultation?
