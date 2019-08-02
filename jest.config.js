module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['jest-extended'],
  verbose: true,
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest'
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\](?!@jaszhix\\/utils\\/).+\\.js$'
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.jest.json'
    }
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  automock: false,
};
