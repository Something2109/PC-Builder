module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^@/models/(.*)$": "<rootDir>/models/$1",
    "^@pc-builder/shared$": "<rootDir>/../../packages/shared",
    "^@pc-builder/shared/(.*)$": "<rootDir>/../../packages/shared/$1",
  },
};
