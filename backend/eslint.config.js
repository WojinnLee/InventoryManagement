const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Lỗi nghiêm trọng — pipeline sẽ fail nếu vi phạm
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-console": "off",

      // Cảnh báo — không fail pipeline nhưng nên sửa
      "eqeqeq": ["warn", "always"],
      "no-var": "warn",
      "prefer-const": "warn",
    },
  },
  {
    // Bỏ qua thư mục không cần lint
    ignores: ["node_modules/**", "prisma/**", "scripts/**"],
  },
];
