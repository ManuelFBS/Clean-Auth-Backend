module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/index.ts',
        '!src/infrastructure/web/server.ts',
    ],
    testTimeout: 30000, // 30 seconds timeout
    forceExit: true, // Force Jest to exit after all tests complete
    detectOpenHandles: true, // Help detect open handles
};
