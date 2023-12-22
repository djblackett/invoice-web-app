module.exports = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"], // could be tsconfig.json too
    },
    "plugins": [
        "@typescript-eslint",
        "react",
        "prettier",
        "cypress",
        "jest"
    ],
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        // "eslint:recommended",
        // "plugin:import/recommended",
        // "airbnb",
        // "airbnb-typescript",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:jest/recommended",
        "plugin:typescript-sort-keys/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        // "plugin:unicorn/recommended",
        "plugin:cypress/recommended",
        "prettier"
    ],
    "overrides": [
        {
            extends: [
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
            ],
            files: ['./**/*.{ts,tsx}'],
        },
    ],
    "rules": {
        "indent": [
            "warn",
            2
        ],
        "linebreak-style": [
            "warn",
            "unix"
        ],
        "quotes": [
            "warn",
            "double"
        ],
        "semi": [
            "warn",
            "always"
        ],
        "array-callback-return": [
            0
        ],
        "consistent-return": [
            0
        ],
        "react/react-in-jsx-scope": [
            0
        ],
        "react/prop-types": [
            0
        ],
        "react/jsx-props-no-spreading": [
            0
        ],
        "no-plusplus": [
            0
        ],
        "no-param-reassign": [
            0
        ],
        "react/require-default-props": [
            0
        ],
        "react-hooks/exhaustive-deps": [
            0
        ],
        "@typescript-eslint/no-unused-vars": [
            0
        ]
    }
}
