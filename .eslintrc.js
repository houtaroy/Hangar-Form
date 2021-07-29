module.exports = {
  "root": true,
  "env": {
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/essential",
    "@vue/prettier"
  ],
  "parserOptions": {
    "parser": "babel-eslint"
  },
  "plugins": [
    "vue"
  ],
  "rules": {
    "prefer-const": "error",
    "no-console": 0,
    "no-unused-vars": ["error", { "argsIgnorePattern": "^h$" }]
  }
}
