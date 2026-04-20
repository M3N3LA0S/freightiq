import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      SKIP_ENV_VALIDATION: "1",
      DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: { lines: 70 },
    },
  },
});
