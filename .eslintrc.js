module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "extends": ["eslint:recommended"],
  "rules": {
    "no-unused-vars": "off",
    "no-console": ["off", { "allow": ["warn", "error", "info"] }]
  },
  "env": {
    "browser": true,
    "node": true,
    "commonjs": true, 
    "es6": true
  },
  "ignorePatterns": ["src/banners/mainBanner/icons/*"]
};
