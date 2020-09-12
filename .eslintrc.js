module.exports = {
    env: {
      node: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "prettier/@typescript-eslint",
      "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    rules: {
      quotes: [2, "double", { avoidEscape: false }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [1, { argsIgnorePattern: "^_" }],
    },
  };
  