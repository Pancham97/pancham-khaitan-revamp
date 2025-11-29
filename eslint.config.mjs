import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import betterTailwind from "eslint-plugin-better-tailwindcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        plugins: {
            "better-tailwindcss": betterTailwind,
        },
        rules: {
            // Tailwind className formatting
            "better-tailwindcss/multiline": ["error", {
                "printWidth": 80,
            }],

            // Code style
            // Code style
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "max-len": [
                "error",
                {
                    "code": 80,
                    "ignoreUrls": true,
                    "ignoreStrings": true,
                    "ignoreTemplateLiterals": true,
                    "ignoreRegExpLiterals": true,
                    "ignoreComments": true,
                }
            ],
            "quotes": ["error", "double", { "avoidEscape": true }],
            "semi": ["error", "always"],
            "comma-dangle": ["error", "always-multiline"],

            // TypeScript
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                }
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-non-null-assertion": "warn",

            // React
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "react/self-closing-comp": "error",
            "react/jsx-curly-brace-presence": [
                "error",
                { "props": "never", "children": "never" }
            ],

            // General best practices
            "no-console": ["warn", { "allow": ["warn", "error"] }],
            "no-debugger": "error",
            "no-var": "error",
            "prefer-const": "error",
            "eqeqeq": ["error", "always"],
            "curly": ["error", "all"],
            "brace-style": ["error", "1tbs"],
            "no-trailing-spaces": "error",
            "no-multiple-empty-lines": ["error", { "max": 1 }],
            "eol-last": ["error", "always"],
        },
    },
];

export default eslintConfig;
