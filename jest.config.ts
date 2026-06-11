import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
    "^.+\\.m?js$": [
      "ts-jest",
      {
        tsconfig: {
          allowJs: true,
          jsx: "react-jsx",
        },
      },
    ],
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  transformIgnorePatterns: [
    "/node_modules/(?!(react-markdown|remark-.*|rehype-.*|unified|bail|is-plain-obj|trough|vfile|vfile-message|unist-.*|mdast-.*|micromark.*|hast-.*|estree-.*|devlop|property-information|space-separated-tokens|comma-separated-tokens|decode-named-character-reference|character-entities|ccount|escape-string-regexp|markdown-table|html-url-attributes|longest-streak|trim-lines|zwitch|style-to-object|inline-style-parser)/)",
  ],
  clearMocks: true,
};

export default config;
