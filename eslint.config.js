// eslint.config.js
import jsdoc from "eslint-plugin-jsdoc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },

        plugins: {
            "simple-import-sort": simpleImportSort,
            jsdoc,
        },

        rules: {
            "brace-style": ["warn", "1tbs", {allowSingleLine: true}],
            "comma-dangle": [
                "warn",
                {
                    arrays: "always-multiline",
                    objects: "always-multiline",
                    imports: "never",
                    exports: "never",
                    functions: "never",
                },
            ],
            "comma-spacing": "warn",
            "eol-last": "warn",
            indent: ["warn", 4, {SwitchCase: 1}],
            "key-spacing": "warn",
            "keyword-spacing": "warn",
            "max-len": [
                "warn",
                {
                    code: 100,
                    comments: 80,
                    ignoreComments: false,
                    ignoreTrailingComments: false,
                },
            ],
            "no-multi-spaces": "warn",
            "no-multiple-empty-lines": "warn",
            "no-trailing-spaces": "warn",
            "no-unused-vars": "warn",
            "object-curly-spacing": "warn",
            "operator-linebreak": "off",
            "padded-blocks": "off",
            quotes: ["warn", "double", {avoidEscape: true}],
            "semi-spacing": "warn",

            // simple-import-sort
            "simple-import-sort/exports": "warn",
            "simple-import-sort/imports": [
                "warn",
                {
                    groups: [
                        [
                            "^@?\\w",
                            "^(@|@company|@ui|components|utils|config|vendored-lib)(/.*|$)",
                        ],
                        ["^\\.\\.(?!/?$)", "^\\.(?!/?$)"],
                        ["^\\u0000"],
                    ],
                },
            ],

            "space-before-blocks": "warn",
            "space-before-function-paren": ["warn", "always"],
            "spaced-comment": "warn",
            "jsdoc/require-jsdoc": "warn",
            "jsdoc/require-param": "warn",
            "jsdoc/require-returns": "warn",
        },
    },
];
