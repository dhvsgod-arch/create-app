#!/usr/bin/env node
/**
 * CreateAppCLI - 前端脚手架
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";
import symbols from "log-symbols";
import fse from "fs-extra";

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取命令行参数
const args = process.argv.slice(2);
let projectNameArg = args[0]; // 命令行传入项目名

// 检测 pnpm 是否存在
function hasPnpm() {
  try {
    execSync("pnpm --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
const installCmd = hasPnpm() ? "pnpm install" : "npm install";

// 获取模板路径（全局安装后可用）
function getTemplatePath(templateName) {
  const templatePath = path.resolve(__dirname, "../templates", templateName);
  if (!fs.existsSync(templatePath)) {
    console.error(symbols.error, chalk.red(`模板不存在: ${templatePath}`));
    process.exit(1);
  }
  return templatePath;
}

// 异步复制模板
async function copyTemplate(src, dest) {
  try {
    await fse.copy(src, dest, {
      overwrite: true,
      filter: (srcPath) => !srcPath.includes("node_modules"),
    });
    console.log(symbols.success, chalk.green("✅ 模板文件复制完成"));
  } catch (err) {
    console.error(symbols.error, chalk.red("模板复制失败"), err);
    process.exit(1);
  }
}

// Husky + lint-staged 配置
function setupHusky(projectPath) {
  console.log(chalk.blue("⚙️  配置 Husky + lint-staged ..."));

  try {
    // 执行 husky install
    execSync("npx husky install", { cwd: projectPath, stdio: "inherit" });

    // 创建 pre-commit 钩子
    const huskyDir = path.join(projectPath, ".husky");
    if (!fs.existsSync(huskyDir)) fs.mkdirSync(huskyDir, { recursive: true });

    const preCommitFile = path.join(huskyDir, "pre-commit");
    if (!fs.existsSync(preCommitFile)) {
      fs.writeFileSync(
        preCommitFile,
        '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\nnpx lint-staged\n',
        { mode: 0o755 }
      );
    }

    console.log(symbols.success, chalk.green("✅ Husky + lint-staged 已配置"));
  } catch (err) {
    console.error(symbols.error, chalk.red("Husky 配置失败"), err);
  }
}

// Jest 配置
function setupJest(projectPath) {
  console.log(chalk.blue("⚙️  配置 Jest 测试环境..."));

  try {
    // 安装依赖
    execSync(
      `${installCmd} jest ts-jest @types/jest babel-jest identity-obj-proxy --save-dev`,
      { cwd: projectPath, stdio: "inherit" }
    );

    // jest.config.js
    const jestConfig = `
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '**/__tests__/**/*.(test|spec).{ts,tsx,js,jsx}',
    '**/?(*.)+(test|spec).{ts,tsx,js,jsx}'
  ],
  transform: {
    '^.+\\\\.(ts|tsx)$': 'ts-jest',
    '^.+\\\\.(js|jsx)$': 'babel-jest'
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
    '/__tests__/',
    '/mock/',
    'index.ts',
  ],
  verbose: true,
};
`;
    fs.writeFileSync(
      path.join(projectPath, "jest.config.js"),
      jestConfig,
      "utf-8"
    );

    // jest.setup.js
    const jestSetup = `import '@testing-library/jest-dom';\n`;
    fs.writeFileSync(
      path.join(projectPath, "jest.setup.js"),
      jestSetup,
      "utf-8"
    );

    // __mocks__/fileMock.js
    const mocksDir = path.join(projectPath, "__mocks__");
    if (!fs.existsSync(mocksDir)) fs.mkdirSync(mocksDir, { recursive: true });
    const fileMock = `module.exports = 'test-file-stub';\n`;
    fs.writeFileSync(path.join(mocksDir, "fileMock.js"), fileMock, "utf-8");

    console.log(symbols.success, chalk.green("✅ Jest 配置完成"));
  } catch (err) {
    console.error(symbols.error, chalk.red("Jest 配置失败"), err);
  }
}

// 主流程
async function run() {
  try {
    // 用户输入
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "请输入项目名称：",
        default: "my-app",
        when: () => !projectNameArg,
      },
      {
        type: "input",
        name: "version",
        message: "请输入项目版本号：",
        default: "1.0.0",
      },
      {
        type: "input",
        name: "description",
        message: "请输入项目描述：",
        default: "A project created by create-app-cli",
      },
      {
        type: "list",
        name: "template",
        message: "请选择项目模板：",
        choices: ["react-app", "vue-app"],
      },
      {
        type: "confirm",
        name: "useJest",
        message: "是否生成基于 Jest 的单元测试配置？",
        default: true,
      },
    ]);

    const projectName = projectNameArg || answers.projectName;
    const { version, description, template, useJest } = answers;

    const projectPath = path.join(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
      console.log(symbols.error, chalk.red(`目录 ${projectName} 已存在！`));
      process.exit(1);
    }

    fs.mkdirSync(projectPath);
    console.log(symbols.info, chalk.blue("📁 创建项目目录中..."));

    // 复制模板
    const templatePath = getTemplatePath(template);
    await copyTemplate(templatePath, projectPath);

    // 处理 package.base.json → package.json
    const basePkgPath = path.join(projectPath, "package.base.json");
    const pkgPath = path.join(projectPath, "package.json");
    if (fs.existsSync(basePkgPath)) {
      const pkgData = JSON.parse(fs.readFileSync(basePkgPath, "utf-8"));
      pkgData.name = projectName;
      pkgData.version = version;
      pkgData.description = description;
      fs.writeFileSync(pkgPath, JSON.stringify(pkgData, null, 2), "utf-8");
      fs.unlinkSync(basePkgPath);
      console.log(symbols.success, chalk.green("✅ 已生成 package.json"));
    }

    // 安装依赖
    console.log(
      chalk.yellow(`📦 正在使用 ${installCmd.split(" ")[0]} 安装依赖...`)
    );
    execSync(installCmd, { cwd: projectPath, stdio: "inherit" });

    // Husky + lint-staged
    setupHusky(projectPath);

    // 可选 Jest
    if (useJest) setupJest(projectPath);

    console.log(
      symbols.success,
      chalk.green(`🎉 项目 ${projectName} 创建成功！`)
    );
    console.log(chalk.cyan(`👉 运行项目:`));
    console.log(chalk.white(`   cd ${projectName}`));
    console.log(chalk.white(`   npm start`));
  } catch (err) {
    console.error(symbols.error, chalk.red("创建项目失败！"), err);
  }
}

run();
