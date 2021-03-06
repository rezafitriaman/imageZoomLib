module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "extends": ["eslint:recommended"],
  "rules": {
    "no-unused-vars": "warn",
    "no-console": ["off", { "allow": ["warn", "error", "info"] }]
  },
  "env": {
    "browser": true,
    "node": true,
    "commonjs": true, 
    "es6": true
  },
  "predef": [
    "describe",
    "it"
  ],
  "ignorePatterns": ["src/banners/mainBanner/icons/*"]
};
