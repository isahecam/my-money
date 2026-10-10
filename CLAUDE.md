# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

"My Money": a personal finance app. Next.js 16 App Router with `typedRoutes`, React 19 with the React Compiler on, Tailwind v4 via the `@tailwindcss/turbopack` loader. User-facing text is in Spanish (`<html lang="es">`).

## Commands

Use pnpm only.

- `pnpm dev` / `pnpm build`
- `pnpm typecheck`: runs `next typegen` first, which generates the global route types (`LayoutProps<"/">`, `PageProps`, ...). Don't import or redefine them.
- `pnpm lint` / `pnpm lint:fix` (oxlint), `pnpm fmt` / `pnpm fmt:check` (oxfmt). For one file: `pnpm oxlint <path>`, `pnpm oxfmt <path>`.
- `pnpm knip`: unused files, exports and deps. Mark an export that is unused on purpose with a `/** @lintignore */` JSDoc tag.
- `pnpm test`: Vitest in watch mode (`pnpm test --run` runs once). jsdom + Testing Library, set up per Next.js `docs/01-app/02-guides/testing/vitest.md`. Tests sit next to the file they cover (`*.test.ts(x)`). Async Server Components can't be unit tested yet; Next recommends E2E for them.

## Architecture

- **Auth**: Better Auth, server config in `lib/auth.ts`, client in `lib/auth-client.ts`, handler at `app/api/auth/[...all]`. Email/password only, sign-up disabled. Read `docs/BETTER_AUTH_CLIENT_VS_API.md` before writing auth code: user actions go through `authClient` (rate limiting), session reads and permission checks through `auth.api` on the server.
- **Route protection** (Next.js `docs/01-app/02-guides/authentication.md` + Better Auth Next.js integration), two layers:
  - `proxy.ts`: optimistic check only. Reads the cookie with `getSessionCookie` (no DB) and redirects to `/sign-in`. Public routes go in its `publicRoutes` set, or they redirect to themselves forever. Don't redirect signed-in users away from `/sign-in` here: a stale cookie would loop with the page check.
  - DAL (`features/auth/dal.ts`): the real check. Every protected page, Server Action and Route Handler calls `await verifySession()` first (validates against the DB and redirects). Use `getSession()` where a missing session should not redirect (e.g. `/sign-in`, shell UI). Both are wrapped in React `cache`, so repeated calls in one render hit the DB once.
  - Never protect in a layout: layouts don't re-render on navigation (Partial Rendering) and don't stop child segments from rendering. Layouts may read the session for display only.
- **DB**: Drizzle on Neon's HTTP driver (`db/index.ts`). Schema in `db/schema/`, re-exported from `db/schema/index.ts`; table names are plural (the Better Auth adapter uses `usePlural`). The app uses `DATABASE_URL` (pooled), drizzle-kit uses `DATABASE_URL_UNPOOLED` (direct).
- **Code layout**: domain code goes in `features/<domain>/`; shared components in `components/`.
- **Forms**: Formisch (`@formisch/react`) with Valibot schemas.
- The dashboard still uses hard-coded sample data.

## Comments and language

- Comments are in English, short and concise. Only add one when it explains something the code can't (the why, a non-obvious constraint), never to restate the code.
- Use a JSDoc block (`/** ... */`) only where documentation is needed: behavior, constraints or usage that the name and types don't make clear. Not every export needs one. Start with a one-line summary, then add tags only when they add information. TypeScript already carries the types, so no `{type}` in tags. Use `@param` and `@returns` only for non-obvious meaning, plus `@example`, `@see` and `@deprecated` when they apply.
- Inside function bodies, use single-line `//` comments.
- Developer-facing messages (thrown errors, script output, env validation) are in English. User-facing UI text is in Spanish.

## Git hooks (lefthook)

- pre-commit: oxlint `--fix` and oxfmt on staged files, then restages them.
- commit-msg: commitlint. Conventional Commits, header ≤ 72 chars. The scope is optional but must be one of `app, ui, api, auth, db, config, deps, tooling, release`. A breaking change needs both `!` in the header and a `BREAKING CHANGE:` footer.
- pre-push: `typecheck` and `knip`.
- Never bypass the hooks (`--no-verify` / `-n` is denied).

## UI conventions

- shadcn style `base-sera` on **Base UI** (`@base-ui/react`), not Radix. Icons come from `lucide-react`. Add components with `pnpm shadcn add <name>`; they go into `components/ui/`, which lint and format skip. Treat that folder as generated code.
- `cn` comes from the `cn` package and is re-exported by `@/lib/utils`. Import alias: `@/*` → repo root.
- Theme tokens live as CSS variables in `app/globals.css` (oklch, with a `.dark` class variant). The `@shadcn/lint` rules are errors, so:
  - use semantic token classes (`bg-primary`, `text-muted-foreground`), never raw colors;
  - no inline `style`, no arbitrary values (`w-[13px]`), and no restyling of shadcn components except for layout;
  - class strings must be static. Branch with `cn(...)` or variants, not template strings.
- oxfmt sorts imports and Tailwind classes (including inside `cn`), so don't hand-order them.

## Guardrails

- `.env*` (including `.env.example`) can't be read or edited. Required vars: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`.
- `drizzle/` (generated migrations) can't be edited, and `drizzle-kit push` is denied. Change the schema, then `pnpm db:generate` → `pnpm db:migrate`. Both commands ask for approval.
- `.agents/skills/` is vendored (skills CLI, pinned in `skills-lock.json`), and `.claude/skills/` is a committed copy of it (locally a junction, so both change together). Don't edit or format either; both are in oxfmt's `ignorePatterns`.
