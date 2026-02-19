module.exports = {
  root: true,
  extends: ["@home/config/eslint", "next/core-web-vitals"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
};
