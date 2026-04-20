import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Infrastructure
    DATABASE_URL: z.string().url(),

    // Auth
    CLERK_SECRET_KEY: z.string().optional(),
    CLERK_WEBHOOK_SECRET: z.string().optional(),

    // Billing
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    STRIPE_PRICE_STARTER: z.string().optional(),
    STRIPE_PRICE_PRO: z.string().optional(),

    // AI
    ANTHROPIC_API_KEY: z.string().optional(),

    // Freight rate APIs
    FREIGHTOS_API_KEY: z.string().optional(),
    SEARATES_API_KEY: z.string().optional(),
    FLIGHTAWARE_API_KEY: z.string().optional(),
    RAILGATE_API_KEY: z.string().optional(),
    TIMOCOM_API_KEY: z.string().optional(),

    // Tracking APIs
    DATALASTIC_API_KEY: z.string().optional(),
    MARINETRAFFIC_API_KEY: z.string().optional(),
    ECT_ROTTERDAM_API_KEY: z.string().optional(),

    // Background jobs
    INNGEST_EVENT_KEY: z.string().optional(),
    INNGEST_SIGNING_KEY: z.string().optional(),

    // Email
    RESEND_API_KEY: z.string().optional(),

    // Error tracking
    SENTRY_DSN: z.string().url().optional(),

    // Storage
    R2_ACCOUNT_ID: z.string().optional(),
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    R2_BUCKET: z.string().optional().default("freightiq-pdfs"),
    R2_PUBLIC_URL: z.string().url().optional(),

    // Upstash Redis
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_MAPBOX_TOKEN: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_STARTER: process.env.STRIPE_PRICE_STARTER,
    STRIPE_PRICE_PRO: process.env.STRIPE_PRICE_PRO,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    FREIGHTOS_API_KEY: process.env.FREIGHTOS_API_KEY,
    SEARATES_API_KEY: process.env.SEARATES_API_KEY,
    FLIGHTAWARE_API_KEY: process.env.FLIGHTAWARE_API_KEY,
    RAILGATE_API_KEY: process.env.RAILGATE_API_KEY,
    TIMOCOM_API_KEY: process.env.TIMOCOM_API_KEY,
    DATALASTIC_API_KEY: process.env.DATALASTIC_API_KEY,
    MARINETRAFFIC_API_KEY: process.env.MARINETRAFFIC_API_KEY,
    ECT_ROTTERDAM_API_KEY: process.env.ECT_ROTTERDAM_API_KEY,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: process.env.R2_BUCKET,
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
