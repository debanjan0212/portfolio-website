# Security

## Reporting a problem

Email **itsme.deb1995@gmail.com** with what you found and how to reproduce it.
Please do not open a public issue for anything exploitable. You will get a
reply within a few days.

## What is checked, and where to see it

Every push to `main`, every pull request and every Monday,
[`.github/workflows/security.yml`](.github/workflows/security.yml) runs:

| Check | Tool | Fails the run when |
|---|---|---|
| Dependencies that ship to visitors | `npm audit --omit=dev` | any moderate or higher advisory |
| Build tooling | `npm audit` | any high or critical advisory |
| Vulnerabilities, committed secrets, misconfiguration | Trivy | anything high or critical with a fix available |
| Static analysis | CodeQL, `security-extended` queries | results appear in the Security tab |
| Build | `tsc`, tests, build, prerender | the page is not readable without JavaScript |

The website's Security section reads the latest result of that workflow from
the GitHub API and shows it. Nothing on the site is typed in by hand: if the
workflow is red, the site says so.

## How the site itself is locked down

- **No third-party code at runtime.** No analytics, no trackers, no CDN
  scripts. Fonts are served from the same origin.
- **Content-Security-Policy** in [`netlify.toml`](netlify.toml): scripts,
  fonts, media and network calls from this origin only; no inline scripts;
  no framing; no plugins.
- **HSTS, `nosniff`, a strict referrer policy and a locked-down permissions
  policy** on every response.
- **Actions pinned to commit SHAs**, with Dependabot proposing updates, and
  `npm ci --ignore-scripts` in CI so an install cannot run package scripts.
- **No secrets in the repository.** API keys for the chat assistant live in
  Netlify environment variables. `.env` is git-ignored and Trivy scans every
  change for committed secrets.
- **The chat endpoint** is rate-limited per IP, caps message count and length,
  and only answers from a curated collection.

## What this does not claim

This repository is a personal website. It is not SOC 2 or HIPAA certified, and
neither are the open-source tools it links to: those are audits of an
organisation, not of code. The site's Security section maps the tools'
guardrails to the controls they support, and says so in the same words.
