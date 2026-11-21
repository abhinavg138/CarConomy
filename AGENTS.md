# Agent Guidelines — Carconomy

Welcome! This repository contains **Carconomy**, an automotive financial intelligence platform for the Indian car market (₹5–25 Lakh focus). Follow these instructions to work efficiently, preserve stability, and minimize token usage.

---

## 1. Operating Protocol

### Before Implementation
1. **Read Project Memory First:** Start by consulting [`codebase_memory.md`](file:///c:/Users/ag921/OneDrive/Desktop/Projects/carconomy---automotive-financial-intelligence/codebase_memory.md). Do not spend tokens exploring directory trees, guessing the stack, or running broad exploratory searches; `codebase_memory.md` contains the verified architecture, file map, commands, mathematical invariants, and known debt.
2. **Extract Key Context:** Identify the relevant architecture, file paths, data contracts, constraints, and verification commands before formulating your plan.
3. **Inspect Only Necessary Files:** Target specific files and line ranges identified in `codebase_memory.md` using `view_file` with `StartLine`/`EndLine` or narrow grep searches. Never scan `src/components/` unless explicitly migrating legacy code. The live application runs exclusively on `src/ui/` and `src/App.tsx`.
4. **Verify Critical Assumptions:** If an unverified assumption materially affects correctness, verify it against the source file before modifying code.
5. **Repair Stale Memory:** If memory is missing or stale, inspect the affected source file and update the relevant section of `codebase_memory.md`.
6. **No Default Repository Scans:** Never run full-repository recursive directory listings (`list_dir` on root) or broad greps.

### During Implementation
7. **Make Minimal, Surgical Changes:** Implement the smallest complete change that fulfills the user's objective.
8. **Preserve Existing Architecture:** Retain existing naming conventions, directory structure, component patterns (`src/ui/kit.tsx`), and working features.
9. **Avoid Unnecessary Scope Expansion:** Do not refactor unrelated modules, reformat whitespace, introduce new architectural abstractions, or duplicate existing utilities.
10. **Protect Unrelated Behavior:** Do not modify unrelated application state, flows, or UI behavior.
11. **Do Not Invent Contracts or Data:** Never fabricate API contracts, configuration keys, or trim specs. In variant data, unverified values MUST remain `null` (never `0` or placeholder text).
12. **Zero Secret Exposure:** Never output secrets, private credentials, or environment variable values in logs, code, or memory.
13. **Respect Git Status:** Never revert, discard, or overwrite uncommitted user changes or in-progress features.
14. **Domain Constraints:**
    - Preserve the mass-market Indian focus (₹5–25 Lakh segment). Do not set luxury vehicles as default.
    - Maintain mathematical rigor in `src/utils/calculator.ts` (e.g. loan principal bounds, non-contradictory keep-vs-sell rule, ARAI efficiency standards).
    - If working with notebooks or data tasks, preserve guidelines in `.kilo/agents/data.md`.

### After Implementation
15. **Run Targeted Verification:** Always execute the smallest meaningful verification suite before reporting completion:
    ```bash
    # 1. Typecheck verification (must exit 0 with 0 errors)
    npm run lint

    # 2. Financial calculation engine tests (must pass with success: true)
    npm run test

    # 3. If modifying vehicle variants or image assets:
    node scripts/verify_variants.mjs
    node scripts/audit_final.mjs
    ```
16. **Never Claim Unverified Success:** Never state that a build, test, or operation succeeded without executing the command and inspecting the output.
17. **Report Impact Accurately:** Provide a concise summary of modified files, test results, and any residual risks.
18. **Incremental Memory Maintenance:** Update `codebase_memory.md` only when architectural decisions, data models, or core commands change. Do not regenerate or rewrite the full memory file for routine UI tweaks or small bug fixes.

---

## 2. Token Optimization Guidelines

19. **Avoid Context Echoing:** Do not repeat the entire user prompt, file dumps, or extensive project overviews in your responses.
20. **Avoid Redundant Reads:** Do not re-open or re-read files already examined in the conversation history.
21. **Prefer Targeted Search & Slicing:** Use line-bounded viewing (`view_file` with line slices) and narrow regex searches instead of dumping whole files.
22. **Exclude Large / Generated Assets:** Never scan `node_modules/`, `dist/`, `android/`, `.git/`, or large mock datasets (`src/data/mockData.ts` is >1,600 lines; grep for specific IDs instead).
23. **Concise Explanations:** Keep commentary dense, factual, and direct. Focus on rationale, non-obvious trade-offs, and verification results.
24. **Optimize for Correctness:** Prioritize clean, reliable code that passes verification on the first attempt over artificial brevity that introduces regressions.

---

## 3. Quick Architecture Reference

- **Live UI Surface:** `src/App.tsx` $\rightarrow$ `src/ui/Shell.tsx` $\rightarrow$ `src/ui/{Overview, MyCar, Browse, Decide, Services, Profile}.tsx`.
- **Design System Tokens:** `src/ui/kit.tsx` and `src/ui/theme.tsx`.
- **Financial Math Engine:** `src/utils/calculator.ts` (tested by `src/utils/calculator.test.ts`).
- **Vehicle Data:** `src/data/mockData.ts` (base models & profiles) + `src/data/vehicleVariants.ts` (trim variants).
- **Local Storage Key:** `carconomy_v5_*`.
