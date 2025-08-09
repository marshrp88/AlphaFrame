Environment Variables

Create `.env.dev`, `.env.staging`, `.env.prod` based on the following:

VITE_ENVIRONMENT=<development|staging|production>
VITE_SENTRY_DSN=<optional DSN for Sentry>
VITE_RELEASE=<git sha or semver>
VITE_PLAUSIBLE_DOMAIN=<yourdomain.com for analytics, optional>

Notes
- Do not commit secrets.
- Analytics loads only when consent is granted and domain is set.

