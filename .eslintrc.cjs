module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ["eslint:recommended", "prettier", "plugin:prettier/recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  plugins: ["prettier"],
  rules: {
    "comma-dangle": ["error", "only-multiline"],
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    // indent: ["error", 4],
    "no-unused-vars": ["warn"],
    // "no-console": ["warn"],
  },
  settings: {},
};
