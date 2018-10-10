module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: "module"
    },
    rules: {
        "linebreak-style": [
            "error",
            "windows"
        ],
        "no-case-declarations": "error",
        "no-useless-escape": "error",
        "constructor-super": "error",
        "no-fallthrough": "off",
        "no-empty": "warn",
        "no-unused-vars": "warn",
        "no-console": "off",
    }
};
