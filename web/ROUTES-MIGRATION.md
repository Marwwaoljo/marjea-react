# MARJEA Vanilla route migration map

The original React route map is preserved as the source of truth in `artifacts/marjea/src/App.tsx`.

## Vanilla routes currently represented

- `/` — public landing page with hero, workflow, capabilities, risk context, governance, platform status, FAQ, and CTA.
- `/plans`, `/technical`, `/competition-showcase`, `/presentation`, `/ofuq-demo`, `/afaq`, `/afaq/presentation` — informational route shells.
- `/sign-in`, `/sign-up`, `/member-invitation`, `/member-invitation/sign-up` — safe migration placeholders; Clerk UI and existing account workflows are not yet connected.
- `/workspace`, `/workspace/:institutionId`, `/dashboard`, `/marjea/home`, `/platform/institution-reviews`, `/individual`, `/individual/profile`, `/account`, `/account/setup`, `/onboarding`, `/analyze`, `/login`, `/afaq/workspace` — protected route shells only; no private data is rendered by the frontend until Clerk session and server authorization are connected.

## Required next conversion slices

1. Clerk browser integration and auth continuation, preserving existing account-registration policy.
2. Account onboarding, institution setup, invitation acceptance, Firebase phone proof.
3. Institution workspace and membership management with existing server endpoints.
4. References, sources, submitted content, cases, review workflow, audit history.
5. Individual portal and protection profile.
6. Afaq / Ofuq / competition presentation pages and remaining interactions.
7. Remove the legacy React workspace only after parity review and explicit confirmation.

## Security invariants

- Never trust account type, institution ID, role, or permissions supplied by browser state.
- Every private API request must carry a valid Clerk session and be authorized server-side.
- Keep Firebase phone proof and Clerk email verification in the existing server-enforced flows.
- Never expose OpenAI, Resend, Firebase Admin, database, or Google Cloud credentials to browser code.
- No database schema or migration is part of this frontend migration.
