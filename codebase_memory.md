# Carconomy — Project Memory & Architecture Reference

## A. Project Identity
- **Purpose:** Automotive financial intelligence platform tailored specifically to the Indian mass market (₹5–25 Lakh segment). Answers the core consumer question: *"Know what your car really costs."*
- **Intended Users:** Indian middle-class and salaried households evaluating new car purchases, multi-driver vehicle utilization, ownership operating expenses, or keep-vs-replace decisions.
- **Current Development Status:** Active development; functional single-page web app and Android Capacitor shell. Primary UI migrated to responsive `src/ui/` shell with 6 active tabs.
- **Main User-Facing Features:**
  - *Headline True Cost:* Computes real total ownership cost per kilometer (₹/km) factoring fuel/electricity, loan amortization, insurance, scheduled maintenance, and behavioral driver wear.
  - *Vehicle Catalogue & Variant Explorer (`Browse`):* 37 seeded models with 46 verified trim variants across top models with filter chips and direct affordability checks.
  - *Keep vs. Sell Decision Engine (`Decide`):* 12-month forward cost comparison calculating break-even horizons with strict non-contradiction invariants.
  - *Side-by-Side Comparison (`Decide`):* 5-year cumulative TCO differential between two vehicles or trims.
  - *Multi-Driver Wear Modeling (`MyCar`):* Split usage by driver roles, driving styles (Conservative, Moderate, Aggressive), and city congestion factors.
  - *Financial Profile & Affordability Tiering (`Profile`):* Categorizes vehicle fit (`COMFORTABLE`, `STRETCHED`, `AGGRESSIVE`) based on household income and EMIs.
- **Known Incomplete / Broken Functionality:**
  - Service booking & monetization CTA triggers (`LeadRequestModal.tsx`) store requests locally rather than dispatching to an external CRM or backend service.
  - Variant tree coverage is deep for 5 high-volume models (46 variants); the remaining 32 models currently evaluate on base configurations.
  - Legacy prototype views in `src/components/` are disconnected from the live shell.

---

## B. Technology Stack
- **Languages & Runtimes:** TypeScript 7.0.2, JavaScript (ESM for build & audit scripts), Node.js (>=18).
- **Core Framework:** React 19.0.1 (`react`, `react-dom`), Vite 8.3.0.
- **Styling & Design Tokens:** Tailwind CSS v4.3.3 (`@tailwindcss/vite`, `@tailwindcss/postcss`), custom design kit in `src/ui/kit.tsx` & `src/ui/theme.tsx`.
- **Motion & Icons:** `framer-motion` 14.0.0, `motion` 12.23.24, `lucide-react` 0.546.0.
- **Mobile Container:** Capacitor 8 (`@capacitor/cli`, `@capacitor/core`), configured in `capacitor.config.ts`, native project in `android/` (`com.abhinav.carconomy`).
- **AI Integration (Optional):** `@google/genai` 2.4.0 (for experimental AI Studio runtime interactions).
- **Test Runner:** `tsx` 4.21.0 executing `src/utils/calculator.test.ts`.
- **Entry Points:**
  - Web: `index.html` $\rightarrow$ `src/main.tsx` $\rightarrow$ `src/App.tsx`.
  - Development Server: `npm run dev` (Vite on `http://localhost:3000` / `0.0.0.0:3000`).

---

## C. Architecture Map

### Module Directory Structure
```
carconomy/
├── AGENTS.md                  # Canonical agent operational guidelines & rules
├── codebase_memory.md         # Persistent architecture reference & project memory
├── .agents/rules/             # Modular Antigravity rules (e.g. token-efficiency.md)
├── scripts/                   # Integrity audit & variant verification scripts
│   ├── verify_variants.mjs    # Validates trim prices, ARAI mileage, uniqueness
│   └── audit_final.mjs        # Audits vehicle ID mapping to public WebP assets
├── public/vehicles/           # Local vehicle WebP image assets (36 optimized images)
├── src/
│   ├── App.tsx                # App root, tab navigation state, localStorage sync
│   ├── types/index.ts         # Central TypeScript interfaces & domain types
│   ├── ui/                    # Active Production UI Surface
│   │   ├── Shell.tsx          # Desktop sidebar & mobile bottom bar navigation
│   │   ├── Overview.tsx       # Cost summary cards, ₹/km meter, spend breakdown
│   │   ├── Browse.tsx         # Catalogue cards, variant selector, affordability CTA
│   │   ├── Decide.tsx         # Keep vs. Sell calculator & side-by-side comparison
│   │   ├── MyCar.tsx          # Active car specs, custom car CRUD, driver wear
│   │   ├── Services.tsx       # Maintenance packages, service lead capture modal
│   │   ├── Profile.tsx        # Household financial profile, driver manager, reset
│   │   ├── kit.tsx            # Micro-design system primitives (Eyebrow, Big, Chip, Meter)
│   │   ├── theme.tsx          # Dark/light theme provider & toggle
│   │   ├── fields.tsx         # Form input wrappers
│   │   ├── CustomCarModal.tsx # Custom user vehicle creator modal
│   │   └── LeadRequestModal.tsx # Service inquiry capture modal
│   ├── utils/
│   │   ├── calculator.ts      # Pure mathematical engine (loan, fuel, wear, keep/sell)
│   │   ├── calculator.test.ts # 23 deterministic unit tests
│   │   └── vehicleImages.ts   # Image path resolver mapping IDs to public assets
│   ├── data/
│   │   ├── mockData.ts        # 37 seeded models, initial drivers, baseline middle-class profile
│   │   └── vehicleVariants.ts # 46 verified variants for Nexon, Brezza, Punch, Swift, Baleno
│   └── components/            # Legacy prototype components (DO NOT wire into live app)
└── capacitor.config.ts        # Android wrapper configuration
```

### Data & State Flow
1. **Hydration & State Root (`src/App.tsx`):**
   - Loads initial state from `localStorage` under `carconomy_v5_*` keys (`active`, `custom_vehicles`, `drivers`, `finance`, `ownership`).
   - Merges custom vehicles with catalogue `INITIAL_VEHICLES`.
   - Passes active vehicle, drivers, finance, and ownership profiles to child tabs.
2. **Deterministic Calculation Pipeline:**
   - Whenever active vehicle or profile properties change, `calculateTrueCost` executes in `useMemo`.
   - No asynchronous external API calls are required; all math executes client-side synchronously.
3. **Cross-Tab Interaction:**
   - Selecting "Check Affordability" in `Browse.tsx` triggers `handleCheckAffordability` in `App.tsx`, which presets `decideTarget` and switches the tab to `decide`.

---

## D. Implementation Contracts

### Core Data Models (`src/types/index.ts`)
- **`Vehicle`:** Baseline model specification:
  - Required: `id`, `make`, `model`, `variant`, `year`, `fuelType`, `purchasePrice`, `currentValue`, `expectedMileage`, `maintenanceEstimate`, `insuranceEstimate`, `depreciationRate`, `image`, `odometerKm`, `purchaseDate`, `specs`.
  - Powertrain Extensions: `energyConsumptionKwhPer100Km`, `batteryCapacityKwh` for EVs.
  - Sourcing Integrity: `efficiencyStandard` (`'ARAI' | 'ICAT' | null`), `efficiencyUnit` (`'km/L' | 'km/kg' | 'kWh/100 km' | 'km/kWh' | null`), `source`, `verifiedOn`, `cityBasis`.
- **`VehicleVariant`:** Differentiating trim specification:
  - Must have globally unique `variantId` (e.g. `'tata-nexon-smart-plus-mt'`) and valid `baseModelId`.
  - Values must be verified or remain `null` — never `0` or empty strings.
- **`FinancialProfile`:**
  - `monthlyIncome`, `householdIncome`, `existingEmis`, `otherCommitments`, `downPayment`, `interestRate`, `loanTenureYears`.
- **`KeepSellAnalysis`:**
  - `costToKeep12M`, `depreciation12M`, `maintenance12M`, `insurance12M`, `fuel12M`, `loanInterest12M`, `costToSellReplace12M`, `breakEvenMonths`, `decision` (`'KEEP' | 'SELL'`), `headlineReason`.

### State Storage & Keys
- Local storage prefix: `carconomy_v5_`
  - `carconomy_v5_active`: String ID of active selected car.
  - `carconomy_v5_custom_vehicles`: Array of user-created `Vehicle` objects.
  - `carconomy_v5_drivers`: Array of `Driver` objects.
  - `carconomy_v5_finance`: `FinancialProfile` object.
  - `carconomy_v5_ownership`: `OwnershipProfile` object.
- Session storage: `cc_booted` (tracks initial splash screen display).

### Configuration Variables
- `DISABLE_HMR`: When set to `'true'`, disables Vite HMR and file watching to eliminate CPU thrashing during agent edits in sandboxed web environments.
- `GEMINI_API_KEY`: Optional; used only if running experimental AI assistance endpoints.

---

## E. Development & Verification

### Standard Commands
| Command | Action | Verification Standard |
| :--- | :--- | :--- |
| `npm run dev` | Launch Vite development server on port 3000 | Server starts without compilation errors |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) | Must exit code 0 with 0 diagnostics |
| `npm run test` | Run calculation engine test suite (`tsx`) | All 23 tests pass with `success: true` |
| `npm run build` | Compile production bundle to `dist/` | Vite build succeeds |
| `node scripts/verify_variants.mjs` | Audit variant trim integrity | All 8 integrity checks pass |
| `node scripts/audit_final.mjs` | Audit catalogue image asset mapping | 37/37 catalogue entries match disk assets |

### Verification Protocol
Run `npm run lint` and `npm run test` after any modifications to types, calculator math, or state models.

---

## F. Engineering Constraints & Principles

1. **Target Audience Realism:**
   - Defaults must reflect realistic Indian salaried car buyers: ₹1.2L–₹1.5L/mo household income, ₹3L down payment, Tata Nexon or Maruti Brezza as active car.
   - Luxury cars (BMW, Mercedes, Porsche) serve strictly as aspirational comparison benchmarks.
2. **Mathematical Invariants:**
   - *Keep vs. Sell Non-Contradiction:* The Keep decision must strictly align with the lower 12-month forward financial outlay.
   - *Loan Principal Bounds:* Loan principal is strictly `Math.max(0, purchasePrice - downPayment)`. Fully amortized loans must yield ₹0 interest and ₹0 remaining balance.
   - *Honest Unknowns:* If a specification or ARAI figure for a trim variant is not verified from an authoritative source, it MUST remain `null`. Never insert `0` or place-holder strings.
3. **UI Architecture Discipline:**
   - Live surface is strictly `src/ui/`.
   - Never import from or edit `src/components/` unless explicitly migrating a legacy feature.
4. **Design System Tokens:**
   - Use reusable primitives from `src/ui/kit.tsx` (`Eyebrow`, `H1`, `Big`, `Row`, `Segmented`, `Chip`, `Meter`, `VehicleImage`) to preserve visual consistency across dark and light themes.

---

## G. Current Project State & Roadmap

- **Recent Verified Changes:**
  - Full migration of application shell and views to `src/ui/`.
  - Expansion of vehicle trim variant engine (46 trims with ARAI specs) and audit scripts.
  - Addition of EV kWh/100 km and CNG km/kg energy cost modeling to `src/utils/calculator.ts`.
  - Comprehensive 23-test financial engine validation suite.
- **In-Progress Work:**
  - Expanding variant trees for remaining 32 catalogue models.
  - Adding persistent export/import for household garage and financial profiles.
- **Next Logical Improvements:**
  - Wire `LeadRequestModal.tsx` to an actual CRM webhook or serverless endpoint.
  - Decommission unused orphaned files in `src/components/` once all desired logic is confirmed migrated.
