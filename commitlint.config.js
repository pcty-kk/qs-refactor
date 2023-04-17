module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "update",
        "fix",
        "refactor",
        "optimize",
        "style",
        "docs",
        "chore",
        "build",
        "test",
      ],
    ],
    "type-case": [0],
    "type-empty": [2, "never"], //type必填
    // 'scope-empty': [2, 'never'], //scope必填
    // 'scope-case': [0],
    "subject-full-stop": [0, "never"],
    "subject-case": [0, "never"],
    "header-max-length": [0, "always", 72],
  },
};
