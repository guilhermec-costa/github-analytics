import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier, {
  ignores,
} from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["./dist"] },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  eslintPluginPrettier,
  ...tseslint.configs.recommended,
  {
    rules: {
      "capitalized-comments": ["error", "always"],
      quotes: ["error", "double"],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
