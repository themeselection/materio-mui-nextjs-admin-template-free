module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  settings: {
    "react": {
      version: "detect"
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["./tsconfig.json"]
      }
    }
  },
  extends: [
    "plugin:@next/next/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:tailwind/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: [
    "react",
    "react-hooks",
    "import",
    "tailwindcss",
    "@typescript-eslint"
  ],
  rules: {
    "react/display-name": "off",
    "prettier/prettier": ["off", { singleQuote: true }],
    "react/no-unescaped-entities": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@next/next/no-img-element": "off",
    "import/no-anonymous-default-export": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "lines-around-comment": [
      "error",
      {
        beforeLineComment: true,
        beforeBlockComment: true,
        allowBlockStart: true,
        allowClassStart: true,
        allowObjectStart: true,
        allowArrayStart: true
      }
    ],
    "newline-before-return": "error",
    "import/newline-after-import": [
      "error",
      {
        count: 1
      }
    ],
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false
        }
      }
    ],
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/enforces-negative-arbitrary-values": "warn",
    "tailwindcss/enforces-shorthand": "warn",
    "tailwindcss/migration-from-tailwind-2": "warn",
    "tailwindcss/no-arbitrary-value": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/no-contradicting-classname": "error",
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        prev: "*",
        next: [
          "return",
          "block-like",
          "multiline-block-like",
          "expression",
          "multiline-expression"
        ]
      }
    ],
    "react/jsx-newline": [
      "warn",
      {
        prevent: false
      }
    ]
  }
}
