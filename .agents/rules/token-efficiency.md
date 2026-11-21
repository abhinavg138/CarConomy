# Token Efficiency & Exploration Rules — Carconomy

These rules enforce strict context and token optimization across all Antigravity agent interactions in this repository.

## 1. Zero-Exploration Startup
- **Consult `codebase_memory.md` first:** Never invoke `list_dir` on the repository root or search blindly to understand project structure. The module boundaries, tech stack, key files, and commands are verified and documented in `codebase_memory.md`.
- **Targeted Inspection:** Jump directly to the file(s) responsible for the requested task using the Key Files Map in `codebase_memory.md`.
- **Never scan `src/components/` by default:** The live application runs exclusively on `src/ui/` and `src/App.tsx`. `src/components/` contains legacy prototype code that is not part of the active user experience.

## 2. File Reading & Search Optimization
- **Slice Large Files:** Never load entire large files into context. For files with more than 100 lines, use `view_file` with `StartLine` and `EndLine` parameters to inspect only relevant functions or interfaces.
- **Large Data Files:**
  - `src/data/mockData.ts` exceeds 1,600 lines. Do NOT view the full file. Use `grep_search` with targeted IDs (e.g. `'tata-nexon'`, `'hyundai-creta'`) or inspect `src/data/vehicleVariants.ts`.
  - Exclude `codebase-snapshot.txt`, `bun.lock`, and `package-lock.json` from routine searches.
- **Excluded Directories:** Never scan or grep within:
  - `node_modules/`
  - `dist/`
  - `android/`
  - `.git/`

## 3. Surgical Implementation
- **Smallest Complete Diff:** Implement only the changes requested. Do not reformat adjacent functions, reorganize imports, or perform gratuitous refactoring.
- **Preserve Domain Rigor:**
  - Maintain the mass-market Indian focus (₹5–25 Lakh segment).
  - Adhere to the mathematical invariants in `src/utils/calculator.ts` (e.g. non-contradiction Keep vs Sell rule, loan amortization bounds).
  - Do not invent specs: unknown vehicle/trim data must remain `null`.

## 4. Verification Before Response
- Run targeted verification commands rather than broad exploration:
  ```bash
  npm run lint       # Typecheck (tsc --noEmit)
  npm run test       # Pure financial calculator engine tests
  ```
- If vehicle trim variants or images were altered:
  ```bash
  node scripts/verify_variants.mjs
  node scripts/audit_final.mjs
  ```
- Never report a feature or fix as complete without verified test execution.

## 5. Incremental Memory Maintenance
- Update `codebase_memory.md` only when architectural contracts, types, or persistent behaviors change.
- Never rewrite or duplicate unchanged memory sections.
