module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:import/recommended",
        "airbnb",
        "airbnb-typescript",
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
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script",
                "project": true
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
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
    "rules": {
        "indent": [
            "warn",
            2
        ],
        "linebreak-style": [
            "warn",
            "windows"
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
        ]
    }
}
