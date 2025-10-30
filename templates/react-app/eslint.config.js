export default {
  root: true, // 表示 ESLint 配置在此目录为根，不向上查找
  env: {
    browser: true,
    es2022: true,
  },
  parser: "@typescript-eslint/parser", // 使用 TypeScript 解析器
  parserOptions: {
    ecmaVersion: 2022, // 支持最新 ECMAScript 语法
    sourceType: "module", // 支持 ES Modules
    ecmaFeatures: {
      jsx: true, // 支持 JSX
    },
    project: "./tsconfig.json", // 类型检查，启用 rules 依赖类型信息
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "import",
    "cspell", // 拼写检查
  ],
  extends: [
    "eslint:recommended", // ESLint 内置推荐规则
    "plugin:@typescript-eslint/recommended", // TypeScript 推荐规则
    "plugin:@typescript-eslint/recommended-requiring-type-checking", // 依赖类型信息的规则
    "plugin:react/recommended", // React 推荐规则
    "plugin:react-hooks/recommended", // React hooks 推荐规则
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:cspell/recommended", // 拼写检查规则
    "prettier", // 关闭与 Prettier 冲突的规则
  ],
  settings: {
    react: {
      version: "detect", // 自动检测 React 版本
    },
    "import/resolver": {
      typescript: {}, // 支持路径别名解析
    },
    cspell: {
      language: "en",
      skipWords: ["React", "TypeScript", "Webpack", "eslint", "pnpm"],
      ignorePaths: ["node_modules", "dist"],
    },
  },
  rules: {
    // ✅ TypeScript 相关
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // 未使用变量允许 _ 前缀
    "@typescript-eslint/explicit-function-return-type": "off", // 不强制函数返回类型
    "@typescript-eslint/no-explicit-any": "warn", // 尽量避免 any
    "@typescript-eslint/strict-boolean-expressions": "warn", // 布尔表达式严格检查

    // ✅ React 相关
    "react/prop-types": "off", // TS 已经类型检查，不需要 prop-types
    "react/react-in-jsx-scope": "off", // React 17+ 不需要显式 import React

    // ✅ Hooks 相关
    "react-hooks/rules-of-hooks": "error", // Hooks 调用规则
    "react-hooks/exhaustive-deps": "warn", // effect 依赖检查

    // ✅ Import 相关
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
      },
    ],
    "import/no-unresolved": "error",
    "import/no-cycle": ["error", { maxDepth: 1 }],

    // ✅ 拼写检查
    "cspell/spellchecker": [
      "warn",
      {
        words: [
          "frontend",
          "backend",
          "utils",
          "eslint",
          "webpack",
          "typescript",
        ],
        skipWords: ["React", "TSX", "JSX", "npm", "pnpm"],
        ignorePaths: ["node_modules", "dist", "build"],
        ignoreRegExpList: ["/^_/"], // 忽略下划线开头的标识符
      },
    ],

    // ✅ 其他风格
    "no-console": ["warn", { allow: ["warn", "error"] }], // 允许 warn/error
    "no-debugger": "warn",
    "prefer-const": "warn",
    "arrow-body-style": ["warn", "as-needed"],
    "no-param-reassign": "warn",
    "no-duplicate-imports": "warn",
  },
  ignorePatterns: ["node_modules/", "dist/", "build/", "*.config.js"],
};
