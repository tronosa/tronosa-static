import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    name: "tronosa/validation-boundaries",

    files: ["src/**/*.{ts,tsx}"],

    ignores: ["src/lib/validation/zod.ts"],

    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "zod",
              allowTypeImports: true,
              message:
                "Use '@/lib/validation/zod' for runtime validation to preserve centralized configuration and CSP compatibility.",
            },
          ],

          patterns: [
            {
              group: ["zod/*"],
              allowTypeImports: true,
              message:
                "Direct Zod subpath imports are not allowed. Use '@/lib/validation/zod' instead.",
            },
          ],
        },
      ],
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
