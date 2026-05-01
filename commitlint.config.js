// File: fitos/commitlint.config.js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-empty": [1, "never"],
    "subject-case": [2, "always", "lower-case"],
    "header-max-length": [2, "always", 100],
    "scope-enum": [
      2,
      "always",
      [
        "infra/monorepo",
        "infra/ci",
        "app",
        "pages/dashboard",
        "pages/auth",
        "pages/onboarding",
        "widgets/sidebar",
        "widgets/header",
        "widgets/layout",
        "features/auth/login",
        "features/auth/register",
        "features/crm/clients",
        "features/memberships",
        "features/schedule",
        "features/billing",
        "entities/client",
        "entities/membership",
        "entities/class",
        "entities/payment",
        "shared/ui",
        "shared/api",
        "shared/config",
        "shared/lib",
        "modules/crm",
        "modules/memberships",
        "modules/schedule",
        "modules/billing"
      ]
    ]
  }
};