import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  pluginReact.configs.flat.recommended, // ✅ 기본 react 룰

  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      js,
      react: pluginReact,
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect", // ✅ React 버전 자동 감지
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",      // ✅ React 17+에서는 꺼도 됨
      "react/prop-types": "off",              // ✅ propTypes 관련 경고 제거
    },
  },
]);
