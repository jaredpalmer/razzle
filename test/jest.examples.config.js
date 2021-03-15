const testType = process.env.COMPLEX !== "true" ? "simple" : "complex";

module.exports = {
  roots: ["<rootDir>/examples"],
  collectCoverageFrom: ["**/*.js"],
  testMatch: [
    "<rootDir>/examples/**/*(*.)@(spec|test).(ts|js)?(x)"
  ],
  reporters: [
    "default",
    ["jest-html-reporters", {
      pageTitle: `${testType} examples tests report.html`,
      filename: `test-artifacts/${testType}-examples-report.html`,
    }]
  ]
};
