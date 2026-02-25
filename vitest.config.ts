import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/__tests__/**/*.test.ts", "**/*.spec.ts"],
    exclude: ["node_modules", "build", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/__tests__/**",
        "src/**/*.test.ts",
        "src/**/*.spec.ts",
        "src/types/**",
        "build/**",
      ],
    },
  },
  resolve: {
    alias: {
      "#root": resolve(__dirname, "./src"),
    },
  },
});
