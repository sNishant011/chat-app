module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  settings: {
    react: {
      version: "18.2.0",
    },
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react-refresh", "simple-import-sort", "prettier"],
  rules: {
    "react-refresh/only-export-components": "warn",
    "prettier/prettier": ["error", {}, { usePrettierrc: true }],
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "react/react-in-jsx-scope": "off",
  },
};
