import reactRefresh from "eslint-plugin-react-refresh"
import prettierConfig from "eslint-config-prettier"
import reactHooks from "eslint-plugin-react-hooks"
import tseslint from "typescript-eslint"
import globals from "globals"
import js from "@eslint/js"

export default tseslint.config(
    { ignores: ["dist", "src-tauri"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
        },
    },
    prettierConfig,
)
