# Security, Integrity & Safety Review

This document assesses the security posture and data integrity safeguards of the MilCalc application.

## 1. Data Privacy & PII Handling

MilCalc is designed with a "Zero-Trust" approach to user data.

-   **Client-Side Processing**: All sensitive calculations (Pay, Retirement, PT Scores) are performed entirely on the user's device. No user-inputted values (e.g., specific pay grade, years of service, or PT performance) are transmitted to Supabase or any external server.
-   **No PII Collection**: The application does not collect Names, Social Security Numbers, or Unit information. Users remain 100% anonymous in the current implementation.
-   **Local Persistence**: User settings and profile data are stored exclusively in `expo-sqlite` on the local device. These are protected by the operating system's standard application sandboxing. No AsyncStorage is used.

## 2. Anti-Abuse & Anti-Cheat Mitigations

While MilCalc is a calculator and not a game, maintaining the integrity of the "Best Score" logic is important for user trust.

-   **Schema Constraints**: The local SQLite database enforces data types (e.g., preventing negative pushup counts or impossible run times) at the storage level.
-   **Pure Logic Validation**: The `@repo/utils` calculation engines include range-checking to ensure results remain within realistic bounds based on official Air Force standards.

## 3. AI Safety & Integration Boundaries

If LLM-based features (e.g., a "Banter" or "Advice" bot) are integrated in the future, the following boundaries must be enforced:

-   **Deterministic Fallback**: AI must never be used to calculate PT scores or financial numbers. These MUST always use the deterministic pure-logic engines in `@repo/utils`.
-   **Prompt Injection Mitigation**: All user input passed to an LLM must be sanitized and wrapped in strict system instructions that prevent the bot from acting as a financial or medical advisor.
-   **Disclaimer Mandate**: Any AI-generated content must be clearly flagged with a "Non-Official / AI-Generated" disclaimer.

## 4. Supply Chain & Dependency Safety

-   **Lockfile Integrity**: `pnpm-lock.yaml` is the source of truth. Any PR that modifies the lockfile must be manually audited for suspicious dependency shifts.
-   **Automated Scanning**: (Planned) Integrate `pnpm audit` and `snyk` into the CI/CD pipeline to detect vulnerabilities in the module graph.
-   **Minimal Permissions**: The `app.json` manifest is configured with the absolute minimum set of required native permissions (e.g., no contacts, no location, no microphone access).

## 5. Security Checklist (Final Review)

- [x] Environment variables (Supabase Keys) are injected at build time and not committed to git.
- [x] All Supabase RLS policies are "Read-Only" for public data.
- [x] Codebase is free of hardcoded credentials.
- [x] `app.config.ts` uses `process.env` for all sensitive configuration.