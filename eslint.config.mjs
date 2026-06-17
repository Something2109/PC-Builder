import nextPlugin from "@next/eslint-plugin-next";
import perfectionist from "eslint-plugin-perfectionist";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/build/**", "**/out/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    languageOptions: {
      parser: typescriptEslint.parser,
    },
  },
  {
    plugins: {
      perfectionist,
      "@typescript-eslint": typescriptEslint.plugin,
      "@next/next": nextPlugin,
    },
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: [
            "type",
            ["builtin", "external"],
            "internal",
            ["parent", "sibling", "index"],
            "side-effect",
            "unknown",
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
    },
  }
);
