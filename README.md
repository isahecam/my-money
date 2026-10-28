<p align="center">
  <img alt="Banner" src="https://shieldcn.dev/header/gradient.svg?title=My+Money&amp;subtitle=A+personal+finance+app.&amp;logo=lu%3AWallet&amp;mode=dark&amp;border=false" />
</p>

<p align="center">
  <a href="https://isahecam.dev"><img alt="Website" src="https://shieldcn.dev/badge/isahecam.dev-c96442.svg?size=xs&amp;variant=secondary&amp;logo=lu%3AGlobe" /></a>
  <a href="https://github.com/isahecam/my-money/commits/main"><img alt="Last commit" src="https://shieldcn.dev/github/last-commit/isahecam/my-money.svg?size=xs&amp;variant=secondary" /></a>
  <a href="https://github.com/isahecam/my-money/stargazers"><img alt="GitHub stars" src="https://shieldcn.dev/github/stars/isahecam/my-money.svg?size=xs&amp;variant=secondary" /></a>
</p>

## Overview

My Money is a personal finance app to track income and expenses. The dashboard shows income, expense and balance cards plus the latest transactions for a date range. The transactions page lists every transaction with server pagination, editing and deletion. Access is invite-only (email and password), and the UI is in Spanish.

## Built With

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev) with the [React Compiler](https://react.dev/learn/react-compiler)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com), with [Lucide](https://lucide.dev) icons
- [TanStack Table](https://tanstack.com/table)
- [Neon](https://neon.com) Postgres with [Drizzle ORM](https://orm.drizzle.team)
- [Better Auth](https://better-auth.com)
- [next-safe-action](https://next-safe-action.dev)
- [nuqs](https://nuqs.dev)
- [Formisch](https://formisch.dev) and [Valibot](https://valibot.dev)
- [date-fns](https://date-fns.org)
- [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- [Oxc](https://oxc.rs) (oxlint, oxfmt), [Knip](https://knip.dev) and [Lefthook](https://lefthook.dev)
- [pnpm](https://pnpm.io)

## Getting Started

### Prerequisites

- Node.js
- pnpm 12
- A [Neon](https://neon.com) Postgres database

### 1. Install

```bash
git clone https://github.com/isahecam/my-money.git
cd my-money
pnpm install
```

### 2. Configure the environment

Provide the variables below either with a local `.env` file or through a secrets manager ([Infisical](#using-infisical)).

Create a `.env` file in the project root:

```dotenv
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://...        # pooled connection, used by the app
DATABASE_URL_UNPOOLED=postgresql://... # direct connection, used by drizzle-kit
NEXT_PUBLIC_APP_TIMEZONE=America/Mexico_City # IANA zone that resolves "today"
RESEND_API_KEY=re_...                # sends password reset emails
EMAIL_FROM="My Money <no-reply@example.com>" # sender, on a domain verified in Resend
```

### 3. Set up the database

```bash
pnpm db:migrate
```

### 4. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Using Infisical

Instead of a `.env` file, the variables can live in [Infisical](https://infisical.com). The CLI injects them into the process at runtime, so nothing is written to disk. The project is already linked through `.infisical.yaml`, so there is no need to run `infisical init`.

1. [Install the CLI](https://infisical.com/docs/cli/overview):

   ```bash
   brew install infisical/get-cli/infisical   # macOS
   scoop install infisical                    # Windows
   npm install -g @infisical/cli              # any platform
   ```

2. Log in (opens the browser):

   ```bash
   infisical login
   ```

3. In the Infisical project, add the [variables above](#2-configure-the-environment) to the `dev` and `prod` environments.

4. Run the app with the `:secrets` scripts:

   ```bash
   pnpm dev:secrets                       # dev environment
   pnpm build:secrets && pnpm start:secrets # prod environment
   ```

   Any other command that needs the variables goes through `infisical run`:

   ```bash
   infisical run --env=dev -- pnpm db:migrate
   ```

In CI or on a server, where there's no browser, [authenticate with a machine identity](https://infisical.com/docs/documentation/platform/identities/universal-auth) and expose its token as `INFISICAL_TOKEN`:

```bash
export INFISICAL_TOKEN=$(infisical login --method=universal-auth \
  --client-id=<client-id> --client-secret=<client-secret> --silent --plain)
pnpm build:secrets
```

### Scripts

| Command              | Description                                         |
| -------------------- | --------------------------------------------------- |
| `pnpm dev`           | Start the development server                        |
| `pnpm build`         | Build for production                                |
| `pnpm test --run`    | Run the tests once                                  |
| `pnpm typecheck`     | Generate route types and type-check                 |
| `pnpm lint`          | Lint with oxlint                                    |
| `pnpm fmt`           | Format with oxfmt                                   |
| `pnpm knip`          | Find unused files, exports and dependencies         |
| `pnpm db:generate`   | Generate a migration after a schema change          |
| `pnpm dev:secrets`   | `pnpm dev` with secrets from Infisical (`dev`)      |
| `pnpm build:secrets` | `pnpm build` with secrets from Infisical (`prod`)   |
| `pnpm start:secrets` | Start the production server with Infisical (`prod`) |

## Contact

Questions, ideas or feedback? Contact me through my [website](https://isahecam.dev), on [GitHub](https://github.com/isahecam) or on [X](https://x.com/isahecam).
